import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

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

export default async function StudentWorkoutsPage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const t = await getTranslations("treinos");
  const trainerFirst = tenant.name.split(" ")[0] ?? tenant.name;

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
          {list.map((w) => (
            <li key={w.id}>
              <Link
                href={`/treinos/${w.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate font-display text-2xl leading-tight">
                      {w.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {w.items?.[0]?.count ?? 0} {t("exercise_other")}{" "}
                      {w.last_log?.[0]?.completed_at
                        ? `· ${t("last_completed_prefix")} ${timeAgo(w.last_log[0].completed_at)}`
                        : `· ${t("never")}`}
                    </span>
                  </div>
                  <ArrowRightIcon
                    className="mt-1 size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </div>
                <DaysRow days={w.scheduled_days ?? []} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DaysRow({ days }: { days: number[] }) {
  const set = new Set(days);
  return (
    <div className="flex gap-1">
      {DAY_LETTERS.map((label, idx) => (
        <span
          key={idx}
          className={`grid size-6 place-items-center rounded text-[10px] ${
            set.has(idx)
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-card text-muted-foreground"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
