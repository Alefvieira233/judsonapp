import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, TrophyIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { MonthlyLeaderboardRow } from "@/types/database";

import { LeaderboardOptToggle } from "./leaderboard-opt-toggle";

export async function generateMetadata() {
  const t = await getTranslations("team");
  return { title: t("metadata_title") };
}

const MONTH_KEYS = [
  "month_january",
  "month_february",
  "month_march",
  "month_april",
  "month_may",
  "month_june",
  "month_july",
  "month_august",
  "month_september",
  "month_october",
  "month_november",
  "month_december",
] as const;

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default async function EquipePage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile } = session;
  const t = await getTranslations("team");

  const supabase = await createClient();
  const now = new Date();
  const monthLabel = t(MONTH_KEYS[now.getMonth()] ?? "month_default");

  const { data: rows } = await supabase
    .from("monthly_leaderboard")
    .select("*")
    .order("position", { ascending: true })
    .order("full_name", { ascending: true })
    .limit(10)
    .returns<MonthlyLeaderboardRow[]>();

  const list = (rows ?? []).filter((r) => r.workouts_this_month > 0);

  return (
    <section className="flex flex-1 flex-col gap-6 px-5 pb-8 pt-6">
      <header className="flex items-center gap-3">
        <Link
          href="/perfil"
          aria-label={t("back")}
          className="grid size-10 place-items-center rounded-full border border-border bg-card/30 text-muted-foreground hover:bg-card/60"
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("eyebrow")}
          </span>
          <h1 className="flex items-center gap-2 truncate font-display text-3xl leading-tight">
            <TrophyIcon className="size-6 text-[var(--brand-primary)]" />
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("subtitle", { month: monthLabel })}
          </p>
        </div>
      </header>

      {list.length === 0 ? (
        <EmptyState
          title={t("empty_title")}
          description={t("empty_body")}
        />
      ) : (
        <ol className="flex flex-col gap-2">
          {list.map((row) => {
            const isMe = row.student_id === profile.id;
            const initial = (Array.from(row.full_name)[0] ?? "?").toUpperCase();
            const positionLabel = MEDALS[row.position] ?? `#${row.position}`;
            return (
              <li
                key={row.student_id}
                className={[
                  "flex items-center gap-3 rounded-2xl border p-3 transition-colors",
                  isMe
                    ? "border-[var(--brand-primary)] bg-gradient-to-br from-[var(--brand-primary)]/10 to-card/40"
                    : "border-border bg-card/30",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid size-10 shrink-0 place-items-center rounded-full font-display text-base",
                    row.position <= 3
                      ? "bg-[var(--brand-primary)]/15 text-foreground"
                      : "bg-card text-muted-foreground",
                  ].join(" ")}
                  aria-label={t("position_aria", { n: row.position })}
                >
                  {positionLabel}
                </span>

                <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--brand-primary)]/80 font-display text-lg text-white">
                  {row.avatar_url ? (
                    <Image
                      src={row.avatar_url}
                      alt={row.full_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    initial
                  )}
                </span>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-display text-base leading-tight">
                    {row.full_name}
                    {isMe ? (
                      <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                        {t("you")}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {row.workouts_this_month === 1
                      ? t("workouts_one", { count: row.workouts_this_month })
                      : t("workouts_other", { count: row.workouts_this_month })}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-2 flex flex-col gap-3 border-t border-border pt-5">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("privacy_eyebrow")}
        </span>
        <LeaderboardOptToggle initialShare={profile.share_in_leaderboard ?? true} />
      </div>
    </section>
  );
}
