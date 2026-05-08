import { describe, expect, it, beforeAll, afterAll, vi } from "vitest";

import {
  computeStreak,
  dayDiff,
  startOfDay,
  timeAgo,
} from "@/lib/dates";

const MS_PER_DAY = 86_400_000;

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * MS_PER_DAY);
}

function daysFromNow(n: number): Date {
  return new Date(Date.now() + n * MS_PER_DAY);
}

describe("startOfDay", () => {
  it("zeroes out hours/minutes/seconds/ms", () => {
    const d = new Date(2026, 4, 7, 13, 47, 23, 500);
    const start = startOfDay(d);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getSeconds()).toBe(0);
    expect(start.getMilliseconds()).toBe(0);
    expect(start.getDate()).toBe(7);
  });

  it("accepts ISO string input", () => {
    const start = startOfDay("2026-05-07T18:00:00Z");
    expect(start.getHours()).toBe(0);
  });
});

describe("dayDiff", () => {
  it("returns 0 for same day", () => {
    const a = new Date(2026, 4, 7, 1);
    const b = new Date(2026, 4, 7, 23);
    expect(dayDiff(a, b)).toBe(0);
  });

  it("returns positive when a is after b", () => {
    const a = new Date(2026, 4, 10);
    const b = new Date(2026, 4, 7);
    expect(dayDiff(a, b)).toBe(3);
  });

  it("returns negative when a is before b", () => {
    const a = new Date(2026, 4, 5);
    const b = new Date(2026, 4, 7);
    expect(dayDiff(a, b)).toBe(-2);
  });
});

describe("computeStreak", () => {
  it("returns 0 for empty input", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("counts a single completion today as 1", () => {
    expect(computeStreak([new Date()])).toBe(1);
  });

  it("counts consecutive days back from today", () => {
    expect(computeStreak([daysAgo(0), daysAgo(1), daysAgo(2)])).toBe(3);
  });

  it("breaks the streak on a gap", () => {
    expect(
      computeStreak([daysAgo(0), daysAgo(1), daysAgo(3), daysAgo(4)]),
    ).toBe(2);
  });

  it("counts yesterday-only when today missing", () => {
    expect(computeStreak([daysAgo(1), daysAgo(2)])).toBe(2);
  });

  it("returns 0 when latest completion is older than yesterday", () => {
    expect(computeStreak([daysAgo(2), daysAgo(3)])).toBe(0);
  });

  it("ignores future-dated entries (still computes from today)", () => {
    expect(computeStreak([daysFromNow(1), daysAgo(0)])).toBe(1);
  });

  it("handles duplicate same-day entries", () => {
    expect(
      computeStreak([daysAgo(0), daysAgo(0), daysAgo(1), daysAgo(1)]),
    ).toBe(2);
  });
});

describe("timeAgo", () => {
  beforeAll(() => {
    // Pin to a wall-clock value so "12 mai" formatting is deterministic.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 7, 12, 0, 0));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns 'hoje' for today", () => {
    expect(timeAgo(new Date(2026, 4, 7, 8, 0, 0).toISOString())).toBe("hoje");
  });

  it("returns 'ontem' for yesterday", () => {
    expect(timeAgo(new Date(2026, 4, 6, 8, 0, 0).toISOString())).toBe("ontem");
  });

  it("returns 'há N dias' for less than a week", () => {
    expect(timeAgo(new Date(2026, 4, 3, 8, 0, 0).toISOString())).toBe(
      "há 4 dias",
    );
  });

  it("returns localized day-month for older than a week", () => {
    const out = timeAgo(new Date(2026, 3, 28, 8, 0, 0).toISOString());
    // "28 abr." or "28 abr" depending on Node ICU version — match the day.
    expect(out).toMatch(/28\s/);
  });
});
