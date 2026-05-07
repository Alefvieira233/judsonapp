import Link from "next/link";
import { CalendarDaysIcon, DumbbellIcon, MessageCircleIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Hoje" };

const WEEKDAY_LABELS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

type WorkoutRow = {
  id: string;
  title: string;
  description: string | null;
  scheduled_days: number[] | null;
  items: { count: number }[];
};

function firstName(full: string): string {
  return full.split(" ")[0] ?? full;
}

function greeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function pickTodayWorkout(
  workouts: WorkoutRow[],
  todayDow: number,
): WorkoutRow | null {
  const scheduled = workouts.find((w) => w.scheduled_days?.includes(todayDow));
  if (scheduled) return scheduled;
  // No day-specific match: fall back to the first active workout if any.
  return workouts[0] ?? null;
}

export default async function StudentHomePage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const supabase = await createClient();
  const now = new Date();
  const todayDow = now.getDay();

  const { data } = await supabase
    .from("workouts")
    .select(
      `id, title, description, scheduled_days,
       items:workout_items(count)`,
    )
    .eq("tenant_id", tenant.id)
    .eq("student_id", profile.id)
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .returns<WorkoutRow[]>();

  const workouts = data ?? [];
  const today = pickTodayWorkout(workouts, todayDow);
  const upcoming = workouts.filter((w) => w.id !== today?.id).slice(0, 3);
  const todayItemCount = today?.items?.[0]?.count ?? 0;

  return (
    <section className="flex flex-1 flex-col gap-8 px-6 pb-8 pt-10">
      <header className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {greeting(now)}
        </span>
        <h1 className="font-display text-5xl leading-[0.9]">
          {firstName(profile.full_name)}
        </h1>
        {tenant.tagline ? (
          <p className="text-sm text-muted-foreground">{tenant.tagline}</p>
        ) : null}
      </header>

      {today ? (
        <Link
          href={`/treinos/${today.id}`}
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:bg-card"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--brand-primary)]">
            {today.scheduled_days?.includes(todayDow)
              ? "Treino de hoje"
              : "Próximo treino"}
          </span>
          <p className="font-display text-3xl leading-tight">{today.title}</p>
          {today.description ? (
            <p className="text-sm text-muted-foreground">
              {today.description}
            </p>
          ) : null}
          <span className="text-xs text-muted-foreground">
            {todayItemCount} {todayItemCount === 1 ? "exercício" : "exercícios"}
          </span>
          <span className="mt-2 inline-flex items-center gap-2 text-sm text-foreground transition-colors group-hover:text-[var(--brand-primary)]">
            <DumbbellIcon className="size-4" /> Iniciar treino →
          </span>
        </Link>
      ) : (
        <EmptyToday tenantFirstName={firstName(tenant.name)} />
      )}

      {upcoming.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl">Outros treinos</h2>
          <ul className="flex flex-col gap-2">
            {upcoming.map((w) => (
              <li key={w.id}>
                <Link
                  href={`/treinos/${w.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/60"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-display text-lg leading-tight">
                      {w.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {w.items?.[0]?.count ?? 0} exercícios{" "}
                      {w.scheduled_days && w.scheduled_days.length > 0
                        ? `· ${formatDays(w.scheduled_days)}`
                        : ""}
                    </span>
                  </div>
                  <CalendarDaysIcon
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link
        href="/feed"
        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 text-sm transition-colors hover:bg-card/60"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-lg">Comunidade</span>
          <span className="text-xs text-muted-foreground">
            Recados e bastidores da equipe Judson.
          </span>
        </div>
        <MessageCircleIcon
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>
    </section>
  );
}

function EmptyToday({ tenantFirstName }: { tenantFirstName: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-card/20 p-5 text-center">
      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Hoje
      </span>
      <p className="font-display text-3xl leading-tight">Sem treino agendado</p>
      <p className="text-sm text-muted-foreground">
        {tenantFirstName} ainda não montou treino pra hoje. Aproveita pra dar
        uma olhada no que tá rolando na comunidade.
      </p>
      <Link
        href="/feed"
        className={buttonVariants({
          variant: "outline",
          size: "lg",
          className: "mt-2 w-full",
        })}
      >
        Abrir comunidade
      </Link>
    </div>
  );
}

function formatDays(days: number[]): string {
  if (days.length === 7) return "todos os dias";
  return days
    .map((d) => WEEKDAY_LABELS[d]?.slice(0, 3))
    .filter(Boolean)
    .join(", ");
}
