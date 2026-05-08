import "server-only";

import { startOfDay } from "@/lib/dates";

export type MilestoneKey =
  | "30-days-app"
  | "first-month-trained"
  | "first-quarter-trained";

export type Milestone = {
  key: MilestoneKey;
  /** Stable identifier for "milestone X seen on date Y" client storage. */
  dedupeId: string;
  title: string;
  body: string;
  emoji: string;
};

export type EvaluateMilestonesInput = {
  userId: string;
  joinedAt: Date | string | null;
  workoutsTotal: number;
  /** Override "now" for tests. */
  now?: Date;
};

const MS_PER_DAY = 86_400_000;

function daysSince(from: Date, to: Date): number {
  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY,
  );
}

/**
 * Evaluates which milestones became reachable in the last 24h-ish window so
 * the home page can render a celebratory banner. Returns at most one item
 * (the most relevant), so we never stack three banners on one load.
 *
 *  - `30-days-app`            joinedAt = today − 30 (±1 day buffer for tz drift)
 *  - `first-month-trained`    workoutsTotal >= 12 AND >= 30 days since joining
 *  - `first-quarter-trained`  workoutsTotal >= 36 AND >= 90 days since joining
 *
 * The dedupeId encodes the user + day-of-month so a banner shown today is not
 * shown again on the next page load (until the cookie/localStorage clears).
 */
export function evaluateMilestones({
  userId,
  joinedAt,
  workoutsTotal,
  now = new Date(),
}: EvaluateMilestonesInput): Milestone[] {
  if (!joinedAt) return [];

  const joined = typeof joinedAt === "string" ? new Date(joinedAt) : joinedAt;
  if (Number.isNaN(joined.getTime())) return [];

  const days = daysSince(joined, now);
  const dayKey = startOfDay(now).toISOString().slice(0, 10);

  if (days >= 90 && workoutsTotal >= 36) {
    return [
      {
        key: "first-quarter-trained",
        dedupeId: `first-quarter-trained:${userId}:${dayKey}`,
        title: "Trimestre fechado!",
        body: "Três meses de constância. Tu virou outra pessoa — segura o ritmo.",
        emoji: "🏆",
      },
    ];
  }

  if (days >= 30 && workoutsTotal >= 12) {
    return [
      {
        key: "first-month-trained",
        dedupeId: `first-month-trained:${userId}:${dayKey}`,
        title: "Primeiro mês completo!",
        body: "12+ treinos no mês. Hábito formado. Bora pro próximo nível.",
        emoji: "🎉",
      },
    ];
  }

  if (days >= 29 && days <= 31) {
    return [
      {
        key: "30-days-app",
        dedupeId: `30-days-app:${userId}:${dayKey}`,
        title: "1 mês no app!",
        body: "Faz 30 dias que tu entrou. Bora seguir construindo.",
        emoji: "✨",
      },
    ];
  }

  return [];
}
