import { describe, expect, it, vi } from "vitest";

import {
  computeStrengthScoreByMuscle,
  type MuscleGroup,
} from "@/lib/strength-score";

type LogRow = {
  load_kg: number | null;
  reps_done: number | null;
  workout_log: { completed_at: string | null; student_id: string | null } | null;
  workout_item: { exercise: { muscle_group: string | null } | null } | null;
};

function buildSupabaseMock(rows: LogRow[]) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    returns: vi.fn().mockResolvedValue({ data: rows, error: null }),
  };
  return {
    supabase: {
      from: vi.fn().mockReturnValue(chain),
    },
  };
}

function rowFor(group: string, load: number, reps: number, day: string): LogRow {
  return {
    load_kg: load,
    reps_done: reps,
    workout_log: { completed_at: `${day}T08:00:00.000Z`, student_id: "u1" },
    workout_item: { exercise: { muscle_group: group } },
  };
}

describe("computeStrengthScoreByMuscle", () => {
  it("returns all-zeros when there are no exercise logs", async () => {
    const { supabase } = buildSupabaseMock([]);
    const out = await computeStrengthScoreByMuscle({
      userId: "u1",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    const expected: Record<MuscleGroup, number> = {
      peito: 0,
      costas: 0,
      perna: 0,
      ombro: 0,
      braço: 0,
      core: 0,
    };
    expect(out).toEqual(expected);
  });

  it("computes a score within 0-100 for moderate volume", async () => {
    // peito target = 8000. Two sessions, volume = 100kg * 10 reps * 2 = 2000.
    // raw = 2000 * (1 + 0.05*2) = 2200 → score = round(100 * 2200 / 8000) = 28.
    const rows = [
      rowFor("peito", 100, 10, "2026-05-07"),
      rowFor("peito", 100, 10, "2026-05-06"),
    ];
    const { supabase } = buildSupabaseMock(rows);
    const out = await computeStrengthScoreByMuscle({
      userId: "u1",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(out.peito).toBe(28);
    expect(out.costas).toBe(0);
  });

  it("clamps saturation to 100", async () => {
    // Massive volume in 'perna' (target 14000) — 10 sessions, 2000kg each.
    const rows = Array.from({ length: 10 }, (_, i) =>
      rowFor("perna", 200, 10, `2026-04-${String(20 + i).padStart(2, "0")}`),
    );
    const { supabase } = buildSupabaseMock(rows);
    const out = await computeStrengthScoreByMuscle({
      userId: "u1",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(out.perna).toBe(100);
  });

  it("groups synonyms (e.g. 'Peito Superior') into the same muscle bucket", async () => {
    const rows = [
      rowFor("Peito Superior", 50, 8, "2026-05-07"),
      rowFor("chest", 50, 8, "2026-05-06"),
    ];
    const { supabase } = buildSupabaseMock(rows);
    const out = await computeStrengthScoreByMuscle({
      userId: "u1",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(out.peito).toBeGreaterThan(0);
  });

  it("ignores rows with unknown muscle group", async () => {
    const rows = [rowFor("desconhecido", 100, 10, "2026-05-07")];
    const { supabase } = buildSupabaseMock(rows);
    const out = await computeStrengthScoreByMuscle({
      userId: "u1",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(out.peito).toBe(0);
    expect(out.perna).toBe(0);
  });

  it("returns zeros when supabase yields an error", async () => {
    const errorChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      returns: vi
        .fn()
        .mockResolvedValue({ data: null, error: new Error("boom") }),
    };
    const supabase = {
      from: vi.fn().mockReturnValue(errorChain),
    };
    const out = await computeStrengthScoreByMuscle({
      userId: "u1",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
    });
    expect(out.peito).toBe(0);
  });
});
