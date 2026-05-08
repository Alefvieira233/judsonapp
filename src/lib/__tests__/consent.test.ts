import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { insertMock, fromMock, logErrorMock } = vi.hoisted(() => {
  const insertMock = vi.fn();
  const fromMock = vi.fn(() => ({ insert: insertMock }));
  const logErrorMock = vi.fn();
  return { insertMock, fromMock, logErrorMock };
});

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({ from: fromMock }),
}));

vi.mock("@/lib/rate-limit", () => ({
  clientIp: vi.fn(async () => "203.0.113.7"),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => {
      if (name === "user-agent") return "JudsonTestAgent/1.0";
      return null;
    },
  })),
}));

vi.mock("@/lib/logger", () => ({
  log: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: logErrorMock,
  },
}));

import { LGPD_POLICY_VERSION, LGPD_TERMS_VERSION, recordConsent } from "@/lib/consent";

describe("recordConsent", () => {
  beforeEach(() => {
    insertMock.mockReset();
    fromMock.mockClear();
    logErrorMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("inserts a row with the captured request context", async () => {
    insertMock.mockResolvedValue({ error: null });

    await recordConsent({
      userId: "user-1",
      tenantId: "tenant-1",
      context: "invite",
    });

    expect(fromMock).toHaveBeenCalledWith("consents");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith({
      user_id: "user-1",
      tenant_id: "tenant-1",
      policy_version: LGPD_POLICY_VERSION,
      terms_version: LGPD_TERMS_VERSION,
      ip: "203.0.113.7",
      user_agent: "JudsonTestAgent/1.0",
      context: "invite",
    });
    expect(logErrorMock).not.toHaveBeenCalled();
  });

  it("does not throw when supabase returns an error (logs instead)", async () => {
    insertMock.mockResolvedValue({ error: { message: "row level security" } });

    await expect(
      recordConsent({
        userId: "user-2",
        tenantId: null,
        context: "student_login",
      }),
    ).resolves.toBeUndefined();

    expect(logErrorMock).toHaveBeenCalledTimes(1);
    expect(logErrorMock.mock.calls[0]?.[0]).toBe("consent.record");
  });

  it("accepts null tenantId for self-service contexts", async () => {
    insertMock.mockResolvedValue({ error: null });

    await recordConsent({
      userId: "user-3",
      tenantId: null,
      context: "self_service",
    });

    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ tenant_id: null, context: "self_service" }),
    );
  });
});
