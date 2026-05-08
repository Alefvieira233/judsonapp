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

import { CopyButton } from "@/components/copy-button";
import { PushOptIn } from "@/components/push-opt-in";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";
import { BADGES } from "@/lib/badges";
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
  const days = new Set(completedDates.map((d) => startOfDay(d).getTime()));
  let cursor = today;
  if (!days.has(cursor.getTime())) {
    cursor = new Date(cursor.getTime() - 86_400_000);
    if (!days.has(cursor.getTime())) return 0;
  }
  let streak = 0;
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

  const [logsRes, planRes, referralsRes, anamneseRes, photosCountRes, badgesRes, threadRes] = await Promise.all([
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

  const initial = (Array.from(profile.full_name)[0] ?? "?").toUpperCase();
  const code = profile.referral_code ?? "—";
  const tenantFirst = tenant.name.split(" ")[0] ?? "personal";
  const shareMessage = `Oi! Vem treinar com o ${tenant.name} comigo. Quando entrar, fala que foi indicação minha (código ${code}) — eu ganho bônus e tu também 💪`;
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
            Seu plano
          </span>
          <span className="truncate font-display text-xl leading-tight">
            {plan?.name ?? "Sem plano ativo"}
          </span>
          <span className="text-xs text-muted-foreground">
            {plan?.price_label ?? "Conheça os planos disponíveis"}
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
              Indique uma amiga
            </span>
            <h2 className="font-display text-xl leading-tight">Ganhe bônus</h2>
          </div>
        </header>

        <p className="text-sm text-muted-foreground">
          Cada amiga que vira aluna do {tenantFirst} pelo teu código vira
          benefício pra ti — desconto na mensalidade ou bônus em consultoria.
          Combine direto pelo WhatsApp.
        </p>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Código
          </span>
          <span className="font-mono text-sm font-bold tracking-wider text-foreground">
            {code}
          </span>
          <CopyButton value={code} label="Copiar" className="ml-auto" />
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
          Compartilhar no WhatsApp
        </a>

        {referrals.length > 0 ? (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-base">Suas indicações</span>
              <span className="text-xs text-muted-foreground">
                {referrals.length} total · {rewardedReferrals} bonificada
                {rewardedReferrals === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {referrals.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 rounded-md bg-background/50 px-3 py-2 text-xs"
                >
                  <span className="truncate text-foreground">
                    {r.referred?.full_name ?? "Aluna"}
                  </span>
                  <span
                    className={
                      r.status === "rewarded"
                        ? "text-[var(--brand-primary)]"
                        : "text-muted-foreground"
                    }
                  >
                    {r.status === "rewarded"
                      ? r.reward_label ?? "Bonificada"
                      : r.status === "active"
                      ? "Ativa"
                      : "Pendente"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

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
              aria-label={`${unreadChat} mensagens não lidas`}
              className="absolute -right-1 -top-1 grid min-w-[20px] place-items-center rounded-full bg-[var(--brand-primary)] px-1 text-[10px] font-bold leading-[20px] text-white shadow"
            >
              {unreadChat > 9 ? "9+" : unreadChat}
            </span>
          ) : null}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Chat com {tenantFirst.toLowerCase()}
          </span>
          <span className="truncate font-display text-xl leading-tight">
            {unreadChat > 0
              ? `${unreadChat} nova${unreadChat === 1 ? "" : "s"} mensagem${unreadChat === 1 ? "" : "s"}`
              : "Conversa direta"}
          </span>
          <span className="text-xs text-muted-foreground">
            {unreadChat > 0
              ? "Toca pra ler agora"
              : "Pergunta, dúvida, feedback do treino"}
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
            Anamnese
          </span>
          <span className="truncate font-display text-xl leading-tight">
            {anamnese?.signed_at ? "Já preenchida" : "Pendente"}
          </span>
          <span className="text-xs text-muted-foreground">
            {anamnese?.signed_at
              ? "Toca pra revisar e atualizar quando precisar"
              : "Preencha antes de começar os treinos"}
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
            Fotos de progresso
          </span>
          <span className="truncate font-display text-xl leading-tight">
            {photoCount > 0 ? "Acompanhe sua evolução" : "Subir primeira"}
          </span>
          <span className="text-xs text-muted-foreground">
            {photoCount > 0
              ? `${photoCount} foto${photoCount === 1 ? "" : "s"} salva${photoCount === 1 ? "" : "s"}`
              : "Tira a primeira pra começar a comparar"}
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
            Conquistas
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {earnedCount}/{BADGES.length}
          </span>
        </header>
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
          Falar com o {tenantFirst.toLowerCase()} no WhatsApp
        </a>

        <LogoutButton />
      </section>

      <section className="flex flex-col gap-2 pt-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Notificações
        </span>
        <PushOptIn />
      </section>

      <section className="flex flex-col gap-2 pt-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Privacidade · LGPD
        </span>
        <a
          href="/perfil/dados"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/20 p-4 text-sm transition-colors hover:bg-card/40"
        >
          <span className="flex items-center gap-3">
            <DownloadIcon className="size-4 text-muted-foreground" aria-hidden />
            <span className="text-foreground">Exportar meus dados</span>
          </span>
          <ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden />
        </a>
        <Link
          href="/perfil/excluir-conta"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/20 p-4 text-sm transition-colors hover:bg-card/40"
        >
          <span className="flex items-center gap-3">
            <Trash2Icon className="size-4 text-muted-foreground" aria-hidden />
            <span className="text-foreground">Excluir minha conta</span>
          </span>
          <ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden />
        </Link>
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
