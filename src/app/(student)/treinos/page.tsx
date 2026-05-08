import Link from "next/link";
import { ArrowRightIcon, CalendarDaysIcon, FlameIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ExerciseIcon, muscleToneClass } from "@/components/exercise/exercise-icon";
import { MuscleGroupTag } from "@/components/exercise/muscle-group-tag";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentStudent } from "@/lib/auth";
import { timeAgo } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata() {
  const t = await getTranslations("treinos");
  return { title: t("metadata_title") };
}

const DAY_LETTERS = ["D", "S", "T", "Q", "Q", "S", "S"];

type WorkoutRow = {
  id: string;
  title: string;
  description: string | null;
  scheduled_days: number[] | null;
  items: { count: number }[];
  last_log: { completed_at: string | null }[];
};

type ItemMuscleRow = {
  workout_id: string;
  exercise: { muscle_group: string | null } | null;
};

export default async function StudentWorkoutsPage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const t = await getTranslations("treinos");
  const trainerFirst = tenant.name.split(" ")[0] ?? tenant.name;
  const todayDow = new Date().getDay();

  const supabase = await createClient();
  const { data } = await supabase
    .from("workouts")
    .select(
      `id, title, description, scheduled_days,
       items:workout_items(count),
       last_log:workout_logs(completed_at)`,
    )
    .eq("tenant_id", tenant.id)
    .eq("student_id", profile.id)
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .returns<WorkoutRow[]>();

  const list = data ?? [];

  // Aggregate dominant muscle groups per workout for hero icons + chips.
  const muscleByWorkout = new Map<
    string,
    { primary: string | null; tags: string[] }
  >();
  if (list.length > 0) {
    const { data: itemsData } = await supabase
      .from("workout_items")
      .select(`workout_id, exercise:exercises(muscle_group)`)
      .in(
        "workout_id",
        list.map((w) => w.id),
      )
      .returns<ItemMuscleRow[]>();
    const counts = new Map<string, Map<string, number>>();
    for (const row of itemsData ?? []) {
      const mg = row.exercise?.muscle_group;
      if (!mg) continue;
      const inner = counts.get(row.workout_id) ?? new Map();
      inner.set(mg, (inner.get(mg) ?? 0) + 1);
      counts.set(row.workout_id, inner);
    }
    for (const [workoutId, inner] of counts) {
      const sorted = [...inner.entries()].sort((a, b) => b[1] - a[1]);
      muscleByWorkout.set(workoutId, {
        primary: sorted[0]?.[0] ?? null,
        tags: sorted.slice(0, 3).map((s) => s[0]),
      });
    }
  }

  return (
    <section className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={`${list.length} ${list.length === 1 ? t("count_one") : t("count_other")}`}
      />

      {list.length === 0 ? (
        <EmptyState
          title={t("empty_title")}
          description={t("empty_body", { trainer: trainerFirst })}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((w) => {
            const mg = muscleByWorkout.get(w.id);
            const isToday = w.scheduled_days?.includes(todayDow) ?? false;
            const totalItems = w.items?.[0]?.count ?? 0;
            const lastDone = w.last_log?.[0]?.completed_at;
            return (
              <li key={w.id}>
                <Link
                  href={`/treinos/${w.id}`}
                  className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98] ${
                    isToday
                      ? "border-[var(--brand-primary)]/40 from-[var(--brand-primary)]/15 via-card/40 to-card/20"
                      : `border-border ${muscleToneClass(mg?.primary, null)}`
                  }`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[var(--brand-primary)]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative flex items-start gap-3">
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-xl border ${
                        isToday
                          ? "border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/15"
                          : "border-border bg-background/60"
                      }`}
                    >
                      <ExerciseIcon
                        muscleGroup={mg?.primary}
                        size={6}
                      />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      {isToday ? (
                        <span className="inline-flex w-fit items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-[var(--brand-primary)]">
                          <FlameIcon className="size-3" /> {t("today_pill")}
                        </span>
                      ) : null}
                      <span className="truncate font-display text-2xl leading-tight">
                        {w.title}
                      </span>
                      <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="tabular-nums">
                          {totalItems} {t("exercise_other")}
                        </span>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDaysIcon className="size-3" aria-hidden />
                          {lastDone
                            ? `${t("last_completed_prefix")} ${timeAgo(lastDone)}`
                            : t("never")}
                        </span>
                      </span>
                    </div>
                    <ArrowRightIcon
                      className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden
                    />
                  </div>

                  {mg && mg.tags.length > 0 ? (
                    <div className="relative flex flex-wrap gap-1.5">
                      {mg.tags.map((tag) => (
                        <MuscleGroupTag
                          key={tag}
                          muscleGroup={tag}
                          variant={tag === mg.primary ? "active" : "default"}
                        />
                      ))}
                    </div>
                  ) : null}

                  <DaysRow
                    days={w.scheduled_days ?? []}
                    todayDow={todayDow}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function DaysRow({ days, todayDow }: { days: number[]; todayDow: number }) {
  const set = new Set(days);
  return (
    <div className="relative flex gap-1">
      {DAY_LETTERS.map((label, idx) => {
        const on = set.has(idx);
        const today = idx === todayDow;
        return (
          <span
            key={idx}
            className={`grid size-6 place-items-center rounded text-[10px] font-medium ${
              on
                ? today
                  ? "bg-[var(--brand-primary)] text-white shadow-sm shadow-[var(--brand-primary)]/40"
                  : "bg-[var(--brand-primary)]/80 text-white"
                : today
                  ? "bg-card text-foreground ring-1 ring-[var(--brand-primary)]/40"
                  : "bg-card text-muted-foreground"
            }`}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
