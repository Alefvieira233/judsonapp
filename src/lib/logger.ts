import "server-only";

/**
 * Structured logger for server code.
 *
 * Production: emits one JSON line per call via console.{log,warn,error}.
 *   Vercel parses JSON automatically so each field becomes a queryable column
 *   in the Logs UI. Schema (stable, contract-style):
 *     { ts, level, msg, scope?, ...ctx }
 *
 * Dev: pretty-prints with ANSI color codes per level so you can scan the
 *   terminal. No external deps (chalk/picocolors) — keeps the install light.
 *
 * Sentry: when SENTRY_DSN is set, warn+error levels lazy-import @sentry/nextjs
 *   and forward to captureException/captureMessage. Lazy-import avoids paying
 *   the bundle cost when Sentry isn't configured (cliente-zero / dev).
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = {
  scope?: string;
  userId?: string;
  tenantId?: string;
  requestId?: string;
  durationMs?: number;
  [key: string]: unknown;
};

type SerializedError = {
  name: string;
  message: string;
  stack?: string;
  code?: string | number;
  cause?: SerializedError | string;
};

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const ANSI = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  gray: "\x1b[90m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
} as const;

function colorFor(level: LogLevel): string {
  switch (level) {
    case "debug":
      return ANSI.gray;
    case "info":
      return ANSI.cyan;
    case "warn":
      return ANSI.yellow;
    case "error":
      return ANSI.red;
  }
}

function serializeErr(err: unknown): SerializedError | undefined {
  if (err === undefined || err === null) return undefined;
  if (err instanceof Error) {
    const out: SerializedError = {
      name: err.name,
      message: err.message,
    };
    // Limit stack to 5 lines — enough for a useful trace, doesn't blow up
    // log ingestion budgets on a noisy error.
    if (err.stack) {
      out.stack = err.stack.split("\n").slice(0, 5).join("\n");
    }
    const maybeCode = (err as { code?: unknown }).code;
    if (typeof maybeCode === "string" || typeof maybeCode === "number") {
      out.code = maybeCode;
    }
    const maybeCause = (err as { cause?: unknown }).cause;
    if (maybeCause instanceof Error) {
      out.cause = {
        name: maybeCause.name,
        message: maybeCause.message,
      };
    } else if (typeof maybeCause === "string") {
      out.cause = maybeCause;
    }
    return out;
  }
  // Supabase / fetch errors are plain objects with a `message` field.
  if (typeof err === "object") {
    const obj = err as Record<string, unknown>;
    const out: SerializedError = {
      name: typeof obj.name === "string" ? obj.name : "NonError",
      message:
        typeof obj.message === "string" ? obj.message : JSON.stringify(obj),
    };
    if (typeof obj.code === "string" || typeof obj.code === "number") {
      out.code = obj.code as string | number;
    }
    return out;
  }
  return { name: "NonError", message: String(err) };
}

function emit(level: LogLevel, msg: string, ctx?: LogContext): void {
  const ts = new Date().toISOString();
  const payload: Record<string, unknown> = { ts, level, msg, ...ctx };

  if (process.env.NODE_ENV === "production") {
    const line = JSON.stringify(payload);
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
  } else {
    const color = colorFor(level);
    const scope = ctx?.scope ? `${ANSI.magenta}[${ctx.scope}]${ANSI.reset} ` : "";
    const head = `${ANSI.dim}${ts}${ANSI.reset} ${color}${level.toUpperCase()}${ANSI.reset} ${scope}${msg}`;
    // Strip already-rendered fields so the trailing object isn't redundant.
    const { scope: _scope, ...rest } = ctx ?? {};
    void _scope;
    const hasRest = Object.keys(rest).length > 0;
    if (level === "error") {
      if (hasRest) console.error(head, rest);
      else console.error(head);
    } else if (level === "warn") {
      if (hasRest) console.warn(head, rest);
      else console.warn(head);
    } else {
      if (hasRest) console.log(head, rest);
      else console.log(head);
    }
  }

  // Sentry forwarding — fire-and-forget, lazy. Never await: logging must not
  // become a latency tax on hot paths.
  if (
    LEVEL_RANK[level] >= LEVEL_RANK.warn &&
    (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN)
  ) {
    void forwardToSentry(level, msg, ctx);
  }
}

async function forwardToSentry(
  level: LogLevel,
  msg: string,
  ctx?: LogContext,
): Promise<void> {
  try {
    const Sentry = await import("@sentry/nextjs");
    const tags: Record<string, string> = {};
    if (ctx?.scope) tags.scope = ctx.scope;
    if (ctx?.tenantId) tags.tenantId = ctx.tenantId;
    const extras = ctx ? { ...ctx } : undefined;

    if (level === "error") {
      const err = (ctx?.error as { message?: string } | undefined) ?? null;
      if (err) {
        // Reconstruct a Sentry-friendly error: original prototype was lost
        // through serializeErr.
        const synthetic = new Error(err.message ?? msg);
        synthetic.name = (err as { name?: string }).name ?? "Error";
        Sentry.captureException(synthetic, {
          tags,
          extra: extras,
        });
      } else {
        Sentry.captureMessage(msg, { level: "error", tags, extra: extras });
      }
    } else {
      Sentry.captureMessage(msg, { level: "warning", tags, extra: extras });
    }
  } catch {
    // Sentry import / send failed — swallow. We don't want telemetry plumbing
    // to crash the request.
  }
}

export const log = {
  debug: (msg: string, ctx?: LogContext) => emit("debug", msg, ctx),
  info: (msg: string, ctx?: LogContext) => emit("info", msg, ctx),
  warn: (msg: string, ctx?: LogContext) => emit("warn", msg, ctx),
  error: (msg: string, err?: unknown, ctx?: LogContext) =>
    emit("error", msg, { ...ctx, error: serializeErr(err) }),
};

export { serializeErr };
