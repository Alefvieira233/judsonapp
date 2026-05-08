# Testing

Two-layer test setup:

| Layer | Tool | Scope |
| --- | --- | --- |
| Units | Vitest + Testing Library + jsdom | `src/lib/**` and React components — runs offline, no DB, no network. |
| E2E | Playwright (Chromium only) | Spawns the dev server and walks 5 critical flows. |

## Running locally

```bash
# Units (fast — under 5s on a warm machine)
npm run test
npm run test:watch
npm run test:cov         # with v8 coverage report

# End-to-end — spawns `npm run dev -- --webpack` automatically on Windows.
npm run e2e
npm run e2e:ui           # interactive UI runner
```

If you already have a dev server running, point Playwright at it:

```bash
E2E_BASE_URL=http://localhost:3000 npm run e2e
```

## Adding a unit test

Put it next to the module under `src/lib/<name>/__tests__/<name>.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { foo } from "@/lib/foo";

describe("foo", () => {
  it("does the thing", () => {
    expect(foo(1)).toBe(2);
  });
});
```

For `server-only` modules, the alias in `vitest.config.ts` already stubs the
guard. Mock Supabase / Next-headers via `vi.mock` (use `vi.hoisted` if the
mock factory needs to reference test-local variables).

## Adding an E2E test

Drop it in `e2e/<flow>.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("foo flow", async ({ page }) => {
  await page.goto("/foo");
  await expect(page.getByRole("heading", { name: /foo/i })).toBeVisible();
});
```

Skip per-environment with `test.skip(condition, "reason")` — see
`e2e/landing-public-multi-tenant.spec.ts`.

## Coverage

| Flow | Layer | File |
| --- | --- | --- |
| Date helpers (`startOfDay`, `dayDiff`, `computeStreak`, `timeAgo`) | unit | `src/lib/__tests__/dates.test.ts` |
| Badge evaluation (streaks, milestones, idempotence) | unit | `src/lib/__tests__/badges.test.ts` |
| Strength score formula (zero, normalized, saturation, synonyms) | unit | `src/lib/__tests__/strength-score.test.ts` |
| Asaas webhook signature + env gating | unit | `src/lib/__tests__/asaas.test.ts` |
| LGPD consent recording | unit | `src/lib/__tests__/consent.test.ts` |
| Cliente-zero landing + legal pages | E2E | `e2e/landing.spec.ts` |
| Student magic-link form (validation + submit) | E2E | `e2e/student-login.spec.ts` |
| Invite token landing (404 path) | E2E | `e2e/invite-flow.spec.ts` |
| SaaS landing + create-tenant page (gated) | E2E | `e2e/landing-public-multi-tenant.spec.ts` |
| Static routes smoke (status + title + hydration) | E2E | `e2e/static-routes.spec.ts` |

## Not covered (yet)

These need a seeded test DB and Supabase auth — out of scope for the first
testing pass, captured here so we don't forget:

- Trainer login + dashboard render (requires `auth.users` seeded).
- Full invite signup with OTP click-through (requires inbound email capture
  or a mock of `supabase.auth.signInWithOtp`).
- Workout runner, strength score chart, and badge unlock celebration
  (require `workout_logs` / `exercise_logs` rows for a real student).
- Asaas checkout creation against the sandbox (covered manually for now;
  needs a recorded fixture or `nock`-style HTTP recorder to land in CI).

## CI

`/.github/workflows/test.yml` has two jobs:

- **unit** — `npm ci` → `npm run lint` → `npm run test` on every push and PR.
- **e2e** — runs after `unit` passes. Installs Chromium with deps, then
  `npm run e2e` against the dev server. Uses dummy Supabase env vars
  (`NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co`, dummy keys) — the
  current 5 E2E flows render the public surface (landing, legal, login form,
  invite 404, static routes smoke) and don't require a live Supabase. On
  failure, the Playwright HTML report is uploaded as an artifact for 7 days.

If you add a flow that needs a real Supabase, gate it with
`test.skip(!process.env.E2E_LIVE, "needs live supabase")` and document it
under "Not covered (yet)" — keep the default CI run dummy-env-safe.

## Windows quirks

- `npm run dev` defaults to Turbopack which currently breaks Sentry's
  bootstrap on Windows; the dev script is launched with `--webpack` from
  `playwright.config.ts`.
- If Playwright complains about missing browsers, re-run
  `npx playwright install chromium`.
