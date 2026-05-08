import { describe, expect, it, vi } from "vitest";

import { evaluateBadges } from "@/lib/badges";

const MS_PER_DAY = 86_400_000;

type LogRow = { completed_at: string };
type EarnedRow = { badge_key: string };

function daysAgoIso(n: number): string {
  return new Date(Date.now() - n * MS_PER_DAY).toISOString();
}

function buildSupabaseMock({
  logs,
  earned,
  insertResult,
}: {
  logs: LogRow[];
  earned: EarnedRow[];
  insertResult?: { data?: EarnedRow[]; error?: unknown };
}) {
  // PostgREST chain — each call returns `this` so awaits resolve to the
  // payload regardless of which terminal method is hit (.returns or upsert).
  const upsertCalls: unknown[] = [];

  const logsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    returns: vi.fn().mockResolvedValue({ data: logs, error: null }),
  };

  const earnedChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    returns: vi.fn().mockResolvedValue({ data: earned, error: null }),
  };

  const insertChain = {
    upsert: vi.fn(function upsert(rows: unknown, opts: unknown) {
      upsertCalls.push({ rows, opts });
      return insertChain;
    }),
    select: vi.fn().mockReturnThis(),
    returns: vi.fn().mockResolvedValue(
      insertResult ?? { data: [], error: null },
    ),
  };

  const supabase = {
    from: vi.fn((table: string) => {
      if (table === "workout_logs") return logsChain;
      if (table === "badges_earned") {
        // Disambiguate: first call is the SELECT (earned), subsequent is UPSERT.
        // We track via call count.
        const count = supabase.from.mock.calls.filter(
          (c) => c[0] === "badges_earned",
        ).length;
        return count === 1 ? earnedChain : insertChain;
      }
      throw new Error(`Unexpected table ${table}`);
    }),
  };

  return { supabase, upsertCalls, insertChain };
}

describe("evaluateBadges", () => {
  const baseArgs = {
    userId: "user-1",
    tenantId: "tenant-1",
    joinedAt: null as Date | null,
  };

  it("returns [] when there are zero workouts", async () => {
    const { supabase, upsertCalls } = buildSupabaseMock({
      logs: [],
      earned: [],
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result).toEqual([]);
    expect(upsertCalls).toHaveLength(0);
  });

  it("unlocks first-workout after the first completion", async () => {
    const { supabase, upsertCalls } = buildSupabaseMock({
      logs: [{ completed_at: daysAgoIso(0) }],
      earned: [],
      insertResult: { data: [{ badge_key: "first-workout" }], error: null },
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result.map((b) => b.key)).toEqual(["first-workout"]);
    expect(upsertCalls).toHaveLength(1);
  });

  it("unlocks streak-3 with three consecutive days", async () => {
    const logs = [0, 1, 2].map((n) => ({ completed_at: daysAgoIso(n) }));
    const { supabase } = buildSupabaseMock({
      logs,
      earned: [{ badge_key: "first-workout" }],
      insertResult: { data: [{ badge_key: "streak-3" }], error: null },
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result.map((b) => b.key)).toEqual(["streak-3"]);
  });

  it("unlocks streak-7 with seven consecutive days", async () => {
    const logs = Array.from({ length: 7 }, (_, i) => ({
      completed_at: daysAgoIso(i),
    }));
    const { supabase } = buildSupabaseMock({
      logs,
      earned: [
        { badge_key: "first-workout" },
        { badge_key: "streak-3" },
      ],
      insertResult: { data: [{ badge_key: "streak-7" }], error: null },
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result.map((b) => b.key)).toContain("streak-7");
  });

  it("unlocks streak-30 with thirty consecutive days", async () => {
    const logs = Array.from({ length: 30 }, (_, i) => ({
      completed_at: daysAgoIso(i),
    }));
    const { supabase } = buildSupabaseMock({
      logs,
      earned: [
        { badge_key: "first-workout" },
        { badge_key: "streak-3" },
        { badge_key: "streak-7" },
        { badge_key: "10-workouts" },
      ],
      insertResult: { data: [{ badge_key: "streak-30" }], error: null },
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result.map((b) => b.key)).toContain("streak-30");
  });

  it("unlocks 10-workouts at 10 completions", async () => {
    const logs = Array.from({ length: 10 }, (_, i) => ({
      completed_at: daysAgoIso(i + 5),
    }));
    const { supabase } = buildSupabaseMock({
      logs,
      earned: [{ badge_key: "first-workout" }],
      insertResult: { data: [{ badge_key: "10-workouts" }], error: null },
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result.map((b) => b.key)).toContain("10-workouts");
  });

  it("unlocks 50-workouts at 50 completions", async () => {
    const logs = Array.from({ length: 50 }, (_, i) => ({
      completed_at: daysAgoIso(i + 10),
    }));
    const { supabase } = buildSupabaseMock({
      logs,
      earned: [
        { badge_key: "first-workout" },
        { badge_key: "10-workouts" },
      ],
      insertResult: { data: [{ badge_key: "50-workouts" }], error: null },
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result.map((b) => b.key)).toContain("50-workouts");
  });

  it("unlocks 100-workouts at 100 completions", async () => {
    const logs = Array.from({ length: 100 }, (_, i) => ({
      completed_at: daysAgoIso(i + 10),
    }));
    const { supabase } = buildSupabaseMock({
      logs,
      earned: [
        { badge_key: "first-workout" },
        { badge_key: "10-workouts" },
        { badge_key: "50-workouts" },
      ],
      insertResult: { data: [{ badge_key: "100-workouts" }], error: null },
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result.map((b) => b.key)).toContain("100-workouts");
  });

  it("does not re-emit already-earned badges", async () => {
    const logs = Array.from({ length: 10 }, (_, i) => ({
      completed_at: daysAgoIso(i),
    }));
    const { supabase, upsertCalls } = buildSupabaseMock({
      logs,
      earned: [
        { badge_key: "first-workout" },
        { badge_key: "streak-3" },
        { badge_key: "streak-7" },
        { badge_key: "10-workouts" },
      ],
    });
    const result = await evaluateBadges({
      ...baseArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(result).toEqual([]);
    expect(upsertCalls).toHaveLength(0);
  });
});
