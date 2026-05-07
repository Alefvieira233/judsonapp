import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Treinos" };

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
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Meus treinos
        </span>
        <h1 className="font-display text-4xl leading-[0.9]">
          {list.length} {list.length === 1 ? "treino" : "treinos"}
        </h1>
      </header>

      {list.length === 0 ? (
        <EmptyState />
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
                      {w.items?.[0]?.count ?? 0} exercícios{" "}
                      {w.last_log?.[0]?.completed_at
                        ? `· último treino ${formatRelative(w.last_log[0].completed_at)}`
                        : "· nunca executado"}
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/20 px-6 py-12 text-center">
      <h2 className="font-display text-2xl">Nenhum treino ainda</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Assim que o Judson montar teu primeiro treino, ele aparece aqui.
      </p>
    </div>
  );
}

function formatRelative(iso: string | null): string {
  if (!iso) return "nunca";
  const d = new Date(iso);
  const now = new Date();
  const ms = now.getTime() - d.getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  if (days < 30) return `há ${Math.floor(days / 7)} sem`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
