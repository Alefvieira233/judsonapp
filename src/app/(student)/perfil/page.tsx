import Link from "next/link";
import { ChevronRightIcon, FlameIcon, ListChecksIcon, ClockIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { LogoutButton } from "./logout-button";

export const metadata = { title: "Perfil" };

type LogRow = {
  id: string;
  completed_at: string | null;
  duration_minutes: number | null;
  rpe: number | null;
  workout: { id: string; title: string } | null;
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);
}

function computeStreak(completedDates: Date[]): number {
  if (completedDates.length === 0) return 0;
  const today = startOfDay(new Date());
  // Reduce to a set of distinct day timestamps.
  const days = new Set(completedDates.map((d) => startOfDay(d).getTime()));
  let streak = 0;
  let cursor = today;
  // Allow either today or yesterday as the streak head — missing one day is ok.
  if (!days.has(cursor.getTime())) {
    cursor = new Date(cursor.getTime() - 86_400_000);
    if (!days.has(cursor.getTime())) return 0;
  }
  while (days.has(cursor.getTime())) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  return streak;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const days = dayDiff(new Date(), d);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default async function StudentProfilePage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("workout_logs")
    .select(
      `id, completed_at, duration_minutes, rpe,
       workout:workouts(id, title)`,
    )
    .eq("student_id", profile.id)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(50)
    .returns<LogRow[]>();

  const completed = logs ?? [];
  const total = completed.length;
  const totalMinutes = completed.reduce(
    (acc, l) => acc + (l.duration_minutes ?? 0),
    0,
  );
  const completedDates = completed
    .map((l) => l.completed_at)
    .filter((v): v is string => !!v)
    .map((s) => new Date(s));
  const streak = computeStreak(completedDates);

  const recent = completed.slice(0, 5);
  const initial = (Array.from(profile.full_name)[0] ?? "?").toUpperCase();

  return (
    <section className="flex flex-1 flex-col gap-8 px-6 pb-8 pt-10">
      <header className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[var(--brand-primary)] font-display text-3xl text-white">
          {initial}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Aluna · {tenant.name}
          </span>
          <h1 className="truncate font-display text-3xl leading-tight">
            {profile.full_name}
          </h1>
          {profile.goal ? (
            <p className="text-xs text-muted-foreground">{profile.goal}</p>
          ) : null}
        </div>
      </header>

      <ul className="grid grid-cols-3 gap-2">
        <Stat
          icon={<ListChecksIcon className="size-4" />}
          label="Treinos"
          value={total.toString()}
        />
        <Stat
          icon={<FlameIcon className="size-4" />}
          label="Streak"
          value={`${streak} ${streak === 1 ? "dia" : "dias"}`}
        />
        <Stat
          icon={<ClockIcon className="size-4" />}
          label="Tempo total"
          value={
            totalMinutes < 60
              ? `${totalMinutes}min`
              : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
          }
        />
      </ul>

      <section className="flex flex-col gap-3">
        <header className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl">Histórico</h2>
          <span className="text-xs text-muted-foreground">
            {total === 0 ? "" : `últimos ${recent.length}`}
          </span>
        </header>

        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/20 px-4 py-6 text-center text-sm text-muted-foreground">
            Nenhum treino concluído ainda. Bora começar?
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((log) => (
              <li
                key={log.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card/30 p-3"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-display text-base leading-tight">
                    {log.workout?.title ?? "Treino removido"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {log.completed_at ? formatDate(log.completed_at) : ""}
                    {log.duration_minutes ? ` · ${log.duration_minutes}min` : ""}
                    {log.rpe ? ` · RPE ${log.rpe}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <Link
          href="/perfil/editar"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/60"
        >
          <span className="font-display text-base">Editar perfil</span>
          <ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden />
        </Link>

        <a
          href={tenant.whatsapp_number ? `https://wa.me/${tenant.whatsapp_number.replace(/\D/g, "")}` : "#"}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "w-full",
          })}
        >
          Falar com o {(tenant.name.split(" ")[0] ?? "personal").toLowerCase()} no WhatsApp
        </a>

        <LogoutButton />
      </section>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex flex-col gap-1 rounded-xl border border-border bg-card/40 p-3">
      <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon} {label}
      </span>
      <span className="font-display text-2xl leading-none">{value}</span>
    </li>
  );
}
