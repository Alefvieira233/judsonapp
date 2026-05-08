import { describe, expect, it } from "vitest";

import { evaluateMilestones } from "@/lib/milestones";

const MS_PER_DAY = 86_400_000;

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * MS_PER_DAY);
}

describe("evaluateMilestones", () => {
  it("returns empty when joinedAt is null", () => {
    expect(
      evaluateMilestones({
        userId: "u1",
        joinedAt: null,
        workoutsTotal: 100,
      }),
    ).toEqual([]);
  });

  it("returns 30-days-app at 30 days, no workouts threshold", () => {
    const out = evaluateMilestones({
      userId: "u1",
      joinedAt: daysAgo(30),
      workoutsTotal: 0,
    });
    expect(out).toHaveLength(1);
    expect(out[0]?.key).toBe("30-days-app");
  });

  it("returns first-month-trained when 30 days + 12 workouts", () => {
    const out = evaluateMilestones({
      userId: "u1",
      joinedAt: daysAgo(31),
      workoutsTotal: 12,
    });
    expect(out[0]?.key).toBe("first-month-trained");
  });

  it("returns first-quarter-trained at 90 days + 36 workouts", () => {
    const out = evaluateMilestones({
      userId: "u1",
      joinedAt: daysAgo(90),
      workoutsTotal: 36,
    });
    expect(out[0]?.key).toBe("first-quarter-trained");
  });

  it("prefers quarter over month when both qualify", () => {
    const out = evaluateMilestones({
      userId: "u1",
      joinedAt: daysAgo(90),
      workoutsTotal: 50,
    });
    expect(out[0]?.key).toBe("first-quarter-trained");
  });

  it("returns empty before 29 days", () => {
    expect(
      evaluateMilestones({
        userId: "u1",
        joinedAt: daysAgo(10),
        workoutsTotal: 5,
      }),
    ).toEqual([]);
  });

  it("dedupeId is stable for same user+day", () => {
    const a = evaluateMilestones({
      userId: "u1",
      joinedAt: daysAgo(30),
      workoutsTotal: 0,
    });
    const b = evaluateMilestones({
      userId: "u1",
      joinedAt: daysAgo(30),
      workoutsTotal: 0,
    });
    expect(a[0]?.dedupeId).toBe(b[0]?.dedupeId);
  });
});

describe("buildLast90DaysCounts", () => {
  it("buckets dates correctly with today at the end", async () => {
    const { buildLast90DaysCounts } = await import("@/components/heatmap-90-days");
    const now = new Date(2026, 4, 7, 12, 0, 0);
    const todayIso = new Date(2026, 4, 7, 8).toISOString();
    const yesterdayIso = new Date(2026, 4, 6, 8).toISOString();
    const wayBackIso = new Date(2026, 0, 1, 8).toISOString();

    const { counts } = buildLast90DaysCounts(
      [todayIso, todayIso, yesterdayIso, wayBackIso],
      now,
    );
    expect(counts).toHaveLength(91);
    expect(counts[counts.length - 1]).toBe(2);
    expect(counts[counts.length - 2]).toBe(1);
    // wayBack is older than 90 days from May 7 — should be ignored.
    expect(counts.reduce((a, b) => a + b, 0)).toBe(3);
  });
});
