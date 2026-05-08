import Image from "next/image";
import Link from "next/link";
import {
  CameraIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  ClockIcon,
  DownloadIcon,
  FlameIcon,
  GiftIcon,
  ListChecksIcon,
  LockIcon,
  MessageCircleIcon,
  SparklesIcon,
  Trash2Icon,
  TrophyIcon,
} from "lucide-react";

import { getTranslations } from "next-intl/server";

import { CopyButton } from "@/components/copy-button";
import { Heatmap90Days, buildLast90DaysCounts } from "@/components/heatmap-90-days";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { PushOptIn } from "@/components/push-opt-in";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { getCurrentStudent } from "@/lib/auth";
import { BADGES } from "@/lib/badges";
import { computeStreak, timeAgo } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

import { LogoutButton } from "./logout-button";

export async function generateMetadata() {
  const t = await getTranslations("perfil");
  return { title: t("metadata_title") };
}

type LogRow = {
  id: string;
  completed_at: string | null;
  duration_minutes: number | null;
  rpe: number | null;
  workout: { id: string; title: string } | null;
};

type PlanRow = {
  name: string;
  price_label: string | null;
  tagline: string | null;
};

type ReferralRow = {
  id: string;
  status: string;
  reward_label: string | null;
  rewarded_at: string | null;
  created_at: string | null;
  referred: { full_name: string } | null;
};

export default async function StudentProfilePage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const t = await getTranslations("perfil");
  const tc = await getTranslations("common");

  const supabase = await createClient();
  const nowMs = new Date().getTime();
  const ninetyDaysAgo = new Date(nowMs - 90 * 86_400_000).toISOString();

  const [logsRes, planRes, referralsRes, anamneseRes, photosCountRes, badgesRes, threadRes, last90Res] = await Promise.all([
    supabase
      .from("workout_logs")
      .select(
        `id, completed_at, duration_minutes, rpe,
         workout:workouts(id, title)`,
      )
      .eq("student_id", profile.id)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(50)
      .returns<LogRow[]>(),
    profile.current_plan_id
      ? supabase
          .from("plans")
          .select("name, price_label, tagline")
          .eq("id", profile.current_plan_id)
          .maybeSingle<PlanRow>()
      : Promise.resolve({ data: null }),
    supabase
      .from("referrals")
      .select(
        `id, status, reward_label, rewarded_at, created_at,
         referred:profiles!referrals_referred_id_fkey(full_name)`,
      )
      .eq("referrer_id", profile.id)
      .order("created_at", { ascending: false })
      .returns<ReferralRow[]>(),
    supabase
      .from("anamneses")
      .select("signed_at, reviewed_at")
      .eq("student_id", profile.id)
      .maybeSingle<{ signed_at: string | null; reviewed_at: string | null }>(),
    supabase
      .from("progress_photos")
      .select("id", { count: "exact", head: true })
      .eq("student_id", profile.id),
    supabase
      .from("badges_earned")
      .select("badge_key, earned_at")
      .eq("user_id", profile.id)
      .order("earned_at", { ascending: false })
      .returns<{ badge_key: string; earned_at: string }[]>(),
    supabase
      .from("chat_threads")
      .select("id")
      .eq("tenant_id", tenant.id)
      .eq("student_id", profile.id)
      .maybeSingle(),
    supabase
      .from("workout_logs")
      .select("completed_at")
      .eq("student_id", profile.id)
      .not("completed_at", "is", null)
      .gte("completed_at", ninetyDaysAgo)
      .returns<{ completed_at: string }[]>(),
  ]);
  const anamnese = anamneseRes.data;
  const photoCount = photosCountRes.count ?? 0;
  const earnedBadgeKeys = new Set((badgesRes.data ?? []).map((b) => b.badge_key));
  const earnedCount = earnedBadgeKeys.size;

  let unreadChat = 0;
  if (threadRes.data?.id) {
    const { count } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("thread_id", threadRes.data.id)
      .neq("sender_id", profile.id)
      .is("read_at", null);
    unreadChat = count ?? 0;
  }

  const completed = logsRes.data ?? [];
  const total = completed.length;
  const totalMinutes = completed.reduce(
    (acc, l) => acc + (l.duration_minutes ?? 0),
    0,
  );
  const streak = computeStreak(
    completed
      .map((l) => l.completed_at)
      .filter((v): v is string => !!v)
      .map((s) => new Date(s)),
  );
  const recent = completed.slice(0, 5);
  const plan = planRes.data;
  const referrals = referralsRes.data ?? [];
  const rewardedReferrals = referrals.filter((r) => r.status === "rewarded").length;

  const last90Iso = (last90Res.data ?? [])
    .map((l) => l.completed_at)
    .filter((v): v is string => !!v);
  const heatmap90 = buildLast90DaysCounts(last90Iso);

  const initial = (Array.from(profile.full_name)[0] ?? "?").toUpperCase();
  const code = profile.referral_code ?? "—";
  const tenantFirst = tenant.name.split(" ")[0] ?? "personal";
  const shareMessage = t("referral_share_message", {
    trainer: tenant.name,
    code,
  });
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  return (
    <section className="flex flex-1 flex-col gap-8 px-5 pb-8 pt-8">
      <header className="flex items-center gap-4">
        <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[var(--brand-primary)] font-display text-3xl text-white">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            initial
          )}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("role_eyebrow")} · {tenant.name}
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
        <li>
          <StatCard
            icon={<ListChecksIcon className="size-3.5" />}
            label={t("stat_workouts")}
            value={total.toString()}
          />
        </li>
        <li>
          <StatCard
            icon={<FlameIcon className="size-3.5" />}
            label={t("stat_streak")}
            value={`${streak} ${streak === 1 ? t("stat_streak_one") : t("stat_streak_other")}`}
          />
        </li>
        <li>
          <StatCard
            icon={<ClockIcon className="size-3.5" />}
            label={t("stat_total_time")}
            value={
              totalMinutes < 60
                ? `${totalMinutes}min`
                : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
            }
          />
        </li>
      </ul>

      <Link
        href="/planos"
        className={`flex items-center gap-4 rounded-2xl border p-5 transition-colors ${
          plan
            ? "border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/10 via-card/40 to-card/30 hover:border-[var(--brand-primary)]/50"
            : "border-dashed border-border bg-card/20 hover:bg-card/40"
        }`}
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
          <SparklesIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("plan_eyebrow")}
          </span>
          <span className="truncate font-display text-xl leading-tight">
            {plan?.name ?? t("plan_none")}
          </span>
          <span className="text-xs text-muted-foreground">
            {plan?.price_label ?? t("plan_explore")}
          </span>
        </div>
        <ChevronRightIcon
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-card/60 to-card/30 p-5">
        <header className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
            <GiftIcon className="size-5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {t("referral_eyebrow")}
            </span>
            <h2 className="font-display text-xl leading-tight">
              {t("referral_title")}
            </h2>
          </div>
        </header>

        <p className="text-sm text-muted-foreground">
          {t("referral_body", { trainer: tenantFirst })}
        </p>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("referral_code_label")}
          </span>
          <span className="font-mono text-sm font-bold tracking-wider text-foreground">
            {code}
          </span>
          <CopyButton value={code} label={t("referral_copy")} className="ml-auto" />
        </div>

        <a
          href={whatsappShare}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            size: "lg",
            className: "w-full gap-2",
          })}
        >
          <MessageCircleIcon className="size-4" />
          {t("referral_share")}
        </a>

        {referrals.length > 0 ? (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-base">
                {t("referrals_title")}
              </span>
              <span className="text-xs text-muted-foreground">
                {rewardedReferrals === 1
                  ? t("referrals_summary", {
                      total: referrals.length,
                      rewarded: rewardedReferrals,
                    })
                  : t("referrals_summary_other", {
                      total: referrals.length,
                      rewarded: rewardedReferrals,
                    })}
              </span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {referrals.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 rounded-md bg-background/50 px-3 py-2 text-xs"
                >
                  <span className="truncate text-foreground">
                    {r.referred?.full_name ?? t("role_eyebrow")}
                  </span>
                  <span
                    className={
                      r.status === "rewarded"
                        ? "text-[var(--brand-primary)]"
                        : "text-muted-foreground"
                    }
                  >
                    {r.status === "rewarded"
                      ? r.reward_label ?? t("referral_status_rewarded")
                      : r.status === "active"
                      ? t("referral_status_active")
                      : t("referral_status_pending")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section
        aria-label="Últimos 90 dias"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card/30 p-4"
      >
        <header className="flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Últimos 90 dias
          </span>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {heatmap90.counts.filter((n) => n > 0).length}/91
          </span>
        </header>
        <Heatmap90Days counts={heatmap90.counts} todayIso={heatmap90.todayIso} />
      </section>

      <section className="flex flex-col gap-3">
        <header className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl">{t("history_title")}</h2>
          <span className="text-xs text-muted-foreground">
            {total === 0 ? "" : t("history_recent", { count: recent.length })}
          </span>
        </header>

        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/20 px-4 py-6 text-center text-sm text-muted-foreground">
            {t("history_empty")}
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
                    {log.workout?.title ?? t("workout_removed")}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {log.completed_at ? timeAgo(log.completed_at) : ""}
                    {log.duration_minutes ? ` · ${log.duration_minutes}min` : ""}
                    {log.rpe ? ` · RPE ${log.rpe}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        href="/perfil/chat"
        className={`flex items-center gap-4 rounded-2xl border p-5 transition-colors ${
          unreadChat > 0
            ? "border-[var(--brand-primary)]/40 bg-gradient-to-br from-[var(--brand-primary)]/15 via-card/40 to-card/30 hover:border-[var(--brand-primary)]/60"
            : "border-border bg-card/30 hover:bg-card/60"
        }`}
      >
        <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
          <MessageCircleIcon className="size-5" />
          {unreadChat > 0 ? (
            <span
              aria-label={
                unreadChat === 1
                  ? t("chat_unread_title_one", { count: unreadChat })
                  : t("chat_unread_title_other", { count: unreadChat })
              }
              className="absolute -right-1 -top-1 grid min-w-[20px] place-items-center rounded-full bg-[var(--brand-primary)] px-1 text-[10px] font-bold leading-[20px] text-white shadow"
            >
              {unreadChat > 9 ? "9+" : unreadChat}
            </span>
          ) : null}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("chat_eyebrow", { trainer: tenantFirst.toLowerCase() })}
          </span>
          <span className="truncate font-display text-xl leading-tight">
            {unreadChat > 0
              ? unreadChat === 1
                ? t("chat_unread_title_one", { count: unreadChat })
                : t("chat_unread_title_other", { count: unreadChat })
              : t("chat_default_title")}
          </span>
          <span className="text-xs text-muted-foreground">
            {unreadChat > 0 ? t("chat_unread_body") : t("chat_default_body")}
          </span>
        </div>
        <ChevronRightIcon
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>

      <Link
        href="/perfil/anamnese"
        className={`flex items-center gap-4 rounded-2xl border p-5 transition-colors ${
          anamnese?.signed_at
            ? "border-border bg-card/30 hover:bg-card/60"
            : "border-[var(--brand-primary)]/40 bg-gradient-to-br from-[var(--brand-primary)]/15 via-card/40 to-card/30 hover:border-[var(--brand-primary)]/60"
        }`}
      >
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-xl ${
            anamnese?.signed_at
              ? "bg-card text-muted-foreground"
              : "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]"
          }`}
        >
          <ClipboardCheckIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("anamnese_eyebrow")}
          </span>
          <span className="truncate font-display text-xl leading-tight">
            {anamnese?.signed_at ? t("anamnese_done") : t("anamnese_pending")}
          </span>
          <span className="text-xs text-muted-foreground">
            {anamnese?.signed_at
              ? t("anamnese_done_body")
              : t("anamnese_pending_body")}
          </span>
        </div>
        <ChevronRightIcon
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>

      <Link
        href="/perfil/fotos"
        className="flex items-center gap-4 rounded-2xl border border-border bg-card/30 p-5 transition-colors hover:bg-card/60"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-card text-muted-foreground">
          <CameraIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("photos_eyebrow")}
          </span>
          <span className="truncate font-display text-xl leading-tight">
            {photoCount > 0 ? t("photos_evolve") : t("photos_first")}
          </span>
          <span className="text-xs text-muted-foreground">
            {photoCount > 0
              ? photoCount === 1
                ? t("photos_count_one", { count: photoCount })
                : t("photos_count_other", { count: photoCount })
              : t("photos_helper")}
          </span>
        </div>
        <ChevronRightIcon
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>

      <section className="flex flex-col gap-3">
        <header className="flex items-end justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <TrophyIcon className="size-5 text-[var(--brand-primary)]" />
            {t("achievements_title")}
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {earnedCount}/{BADGES.length}
          </span>
        </header>
        <Link
          href="/equipe"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 px-4 py-3 transition-colors hover:bg-card/60"
        >
          <span className="flex items-center gap-2">
            <TrophyIcon className="size-4 text-[var(--brand-primary)]" />
            <span className="text-sm font-medium">Ver top da equipe</span>
          </span>
          <ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden />
        </Link>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {BADGES.map((b) => {
            const earned = earnedBadgeKeys.has(b.key);
            return (
              <li
                key={b.key}
                title={earned ? b.description : `Como destravar: ${b.condition}`}
                className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors ${
                  earned
                    ? "border-[var(--brand-primary)]/40 bg-gradient-to-br from-[var(--brand-primary)]/10 to-card/40"
                    : "border-dashed border-border bg-card/20"
                }`}
              >
                <span
                  className={`grid size-12 place-items-center rounded-full text-2xl ${
                    earned
                      ? "bg-[var(--brand-primary)]/20"
                      : "bg-card text-muted-foreground"
                  }`}
                  aria-hidden
                >
                  {earned ? b.icon : <LockIcon className="size-4" />}
                </span>
                <span
                  className={`text-[11px] font-medium leading-tight ${
                    earned ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {b.title}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Link
          href="/perfil/editar"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/60"
        >
          <span className="font-display text-base">{t("edit_profile")}</span>
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
          {t("whatsapp_cta", { trainer: tenantFirst.toLowerCase() })}
        </a>

        <LogoutButton />
      </section>

      <section className="flex flex-col gap-2 pt-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {tc("language_app")}
        </span>
        <LocaleSwitcher />
      </section>

      <section className="flex flex-col gap-2 pt-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("notifications_eyebrow")}
        </span>
        <PushOptIn />
      </section>

      <section className="flex flex-col gap-2 pt-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("privacy_eyebrow")}
        </span>
        <a
          href="/perfil/dados"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/20 p-4 text-sm transition-colors hover:bg-card/40"
        >
          <span className="flex items-center gap-3">
            <DownloadIcon className="size-4 text-muted-foreground" aria-hidden />
            <span className="text-foreground">{t("export_data")}</span>
          </span>
          <ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden />
        </a>
        <Link
          href="/perfil/excluir-conta"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/20 p-4 text-sm transition-colors hover:bg-card/40"
        >
          <span className="flex items-center gap-3">
            <Trash2Icon className="size-4 text-muted-foreground" aria-hidden />
            <span className="text-foreground">{t("delete_account")}</span>
          </span>
          <ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden />
        </Link>
      </section>
    </section>
  );
}

