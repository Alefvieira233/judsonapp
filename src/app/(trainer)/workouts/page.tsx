import Link from "next/link";
import { FilesIcon, PlusIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { AssignTemplateButton } from "./assign-template";

export async function generateMetadata() {
  const t = await getTranslations("workouts");
  return { title: t("metadata_title") };
}

const DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

type View = "all" | "templates" | "assigned";

type WorkoutRow = {
  id: string;
  title: string;
  description: string | null;
  scheduled_days: number[] | null;
  active: boolean | null;
  updated_at: string | null;
  student_id: string | null;
  student: { id: string; full_name: string } | null;
  items: { count: number }[];
};

function parseView(raw: string | string[] | undefined): View {
  if (raw === "templates" || raw === "assigned") return raw;
  return "all";
}

function summarize(
  count: number,
  view: View,
  t: (key: string, params?: Record<string, number>) => string,
): string {
  if (count === 0) {
    if (view === "templates") return t("summary_empty_templates");
    if (view === "assigned") return t("summary_empty_assigned");
    return t("summary_empty_all");
  }
  if (view === "templates") {
    return count === 1
      ? t("summary_template_one_view", { count })
      : t("summary_template_other_view", { count });
  }
  if (view === "assigned") {
    return count === 1
      ? t("summary_count_one_view", { count })
      : t("summary_count_other_view", { count });
  }
  return count === 1
    ? t("summary_count_one_total", { count })
    : t("summary_count_other_total", { count });
}

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const session = await getCurrentProfile();
  if (!session) return null;

  const sp = await searchParams;
  const view = parseView(sp.view);

  const t = await getTranslations("workouts");

  const supabase = await createClient();
  let query = supabase
    .from("workouts")
    .select(
      `id, title, description, scheduled_days, active, updated_at, student_id,
       student:profiles!workouts_student_id_fkey(id, full_name),
       items:workout_items(count)`,
    )
    .eq("tenant_id", session.tenant.id);

  if (view === "templates") query = query.is("student_id", null);
  if (view === "assigned") query = query.not("student_id", "is", null);

  const { data } = await query
    .order("updated_at", { ascending: false })
    .returns<WorkoutRow[]>();

  const workouts = data ?? [];

  const { data: studentsData } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .eq("active", true)
    .order("full_name");
  const students = studentsData ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t("eyebrow")}
          </span>
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {summarize(workouts.length, view, t)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:flex-nowrap">
          <Link
            href="/workouts/new?template=1"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "w-full md:w-auto",
            })}
          >
            <FilesIcon className="size-4" aria-hidden /> {t("new_template")}
          </Link>
          <Link
            href="/workouts/new"
            className={buttonVariants({ size: "lg", className: "w-full md:w-auto" })}
          >
            <PlusIcon className="size-4" aria-hidden /> {t("new_workout")}
          </Link>
        </div>
      </header>

      <ViewTabs current={view} />

      {workouts.length === 0 ? (
        <EmptyState view={view} />
      ) : (
        <ul className="flex flex-col gap-3">
          {workouts.map((w) => {
            const isTemplate = w.student_id == null;
            return (
              <li key={w.id}>
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-card">
                  <Link
                    href={`/workouts/${w.id}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate font-display text-2xl leading-tight">
                        {w.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isTemplate ? (
                          <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            {t("is_template")}
                          </Badge>
                        ) : (
                          <>{w.student?.full_name ?? t("student_removed")}</>
                        )}
                        <span className="ml-2">
                          {(() => {
                            const count = w.items?.[0]?.count ?? 0;
                            return count === 1
                              ? t("exercise_one", { count })
                              : t("exercise_other", { count });
                          })()}
                        </span>
                      </span>
                    </div>
                    {w.active === false ? (
                      <Badge variant="outline" className="text-muted-foreground">
                        {t("inactive")}
                      </Badge>
                    ) : null}
                  </Link>
                  <div className="flex items-center justify-between gap-3">
                    <DaysRow days={w.scheduled_days ?? []} />
                    {isTemplate ? (
                      <AssignTemplateButton
                        workoutId={w.id}
                        workoutTitle={w.title}
                        students={students}
                      />
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

async function ViewTabs({ current }: { current: View }) {
  const t = await getTranslations("workouts");
  const items: { id: View; label: string }[] = [
    { id: "all", label: t("tab_all") },
    { id: "templates", label: t("tab_templates") },
    { id: "assigned", label: t("tab_assigned") },
  ];
  return (
    <nav className="flex gap-1 rounded-xl border border-border bg-card/30 p-1">
      {items.map((it) => {
        const active = it.id === current;
        const href = it.id === "all" ? "/workouts" : `/workouts?view=${it.id}`;
        return (
          <Link
            key={it.id}
            href={href}
            className={`flex-1 rounded-lg px-3 py-2 text-center text-sm transition-colors ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

function DaysRow({ days }: { days: number[] }) {
  const set = new Set(days);
  return (
    <div className="flex gap-1">
      {DAYS.map((label, idx) => (
        <span
          key={idx}
          className={`grid size-7 place-items-center rounded-md text-xs ${
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

async function EmptyState({ view }: { view: View }) {
  const t = await getTranslations("workouts");
  const copy =
    view === "templates"
      ? { title: t("empty_templates_title"), body: t("empty_templates_body") }
      : view === "assigned"
        ? { title: t("empty_assigned_title"), body: t("empty_assigned_body") }
        : { title: t("empty_all_title"), body: t("empty_all_body") };
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-card font-display text-xl text-foreground">
        +
      </span>
      <h2 className="font-display text-2xl">{copy.title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{copy.body}</p>
    </div>
  );
}

