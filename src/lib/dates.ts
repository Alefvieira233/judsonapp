// Date helpers used across student/trainer pages. Previously inlined in 5+
// page components — see /home, /perfil, /treinos, /students/[id], /dashboard.

const MS_PER_DAY = 86_400_000;

export function startOfDay(d: Date | string): Date {
  const x = typeof d === "string" ? new Date(d) : new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function dayDiff(a: Date | string, b: Date | string): number {
  return Math.round(
    (startOfDay(a).getTime() - startOfDay(b).getTime()) / MS_PER_DAY,
  );
}

/**
 * Computes a streak in days. Today counts; if the last completed day is
 * yesterday and today has none yet, we still count yesterday's streak.
 * Returns 0 if the most recent completion is older than yesterday.
 */
export function computeStreak(completed: Array<Date | string>): number {
  if (completed.length === 0) return 0;
  const today = startOfDay(new Date());
  const days = new Set(
    completed.map((d) => startOfDay(d).getTime()),
  );

  let cursor = today;
  if (!days.has(cursor.getTime())) {
    cursor = new Date(cursor.getTime() - MS_PER_DAY);
    if (!days.has(cursor.getTime())) return 0;
  }

  let streak = 0;
  while (days.has(cursor.getTime())) {
    streak += 1;
    cursor = new Date(cursor.getTime() - MS_PER_DAY);
  }
  return streak;
}

/** "hoje" / "ontem" / "há 4 dias" / "12 mai" — relative pretty Portuguese. */
export function timeAgo(iso: string): string {
  const d = new Date(iso);
  const days = dayDiff(new Date(), d);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export type GreetingKey =
  | "greeting_morning"
  | "greeting_afternoon"
  | "greeting_evening";

/**
 * Returns the i18n key for the time-of-day greeting. Consumers pass it to
 * `t()` so the localized string ("Bom dia"/"Buenos días"/etc) lives in the
 * messages JSON, not here.
 */
export function greetingKey(now: Date = new Date()): GreetingKey {
  const hour = now.getHours();
  if (hour < 12) return "greeting_morning";
  if (hour < 18) return "greeting_afternoon";
  return "greeting_evening";
}
