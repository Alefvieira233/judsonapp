import { notFound } from "next/navigation";
import { RulerIcon, TrashIcon, ZapIcon } from "lucide-react";
import { z } from "zod";

import { Sparkline } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentProfile } from "@/lib/auth";
import {
  type MuscleGroup,
  MUSCLE_LABELS,
  MUSCLE_ORDER,
} from "@/lib/strength-score";
import { createClient } from "@/lib/supabase/server";

import { deleteAssessmentAction } from "./actions";
import { NewAssessmentForm } from "./new-assessment-form";

export const metadata = { title: "Avaliação física" };

const idSchema = z.string().uuid();

type AssessmentRow = {
  id: string;
  measured_at: string;
  weight_kg: number | null;
  height_cm: number | null;
  body_fat_pct: number | null;
  muscle_pct: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  chest_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  calf_cm: number | null;
  notes: string | null;
};

function fmt(n: number | null | undefined, suffix: string): string {
  if (n === null || n === undefined) return "—";
  return `${n}${suffix}`;
}

function delta(prev: number | null, curr: number | null): string | null {
  if (prev === null || curr === null || prev === undefined || curr === undefined) return null;
  const d = Number((curr - prev).toFixed(1));
  if (d === 0) return null;
  return d > 0 ? `+${d}` : `${d}`;
}

const STRENGTH_WINDOW_DAYS = 90;
const MS_PER_DAY = 86_400_000;

type StrengthSnapshotRow = {
  snapshot_date: string;
  score_chest: number;
  score_back: number;
  score_legs: number;
  score_shoulders: number;
  score_arms: number;
  score_core: number;
};

const SNAPSHOT_FIELD: Record<MuscleGroup, keyof StrengthSnapshotRow> = {
  peito: "score_chest",
  costas: "score_back",
  perna: "score_legs",
  ombro: "score_shoulders",
  braço: "score_arms",
  core: "score_core",
};

function isoDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function buildStrengthSeries(
  snapshots: StrengthSnapshotRow[],
  windowDays: number,
): Record<MuscleGroup, number[]> {
  const byDate = new Map<string, StrengthSnapshotRow>();
  for (const s of snapshots) byDate.set(s.snapshot_date, s);

  const today = new Date();
  const dates: string[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    dates.push(isoDate(new Date(today.getTime() - i * MS_PER_DAY)));
  }

  const out: Record<MuscleGroup, number[]> = {
    peito: [],
    costas: [],
    perna: [],
    ombro: [],
    braço: [],
    core: [],
  };
  const last: Record<MuscleGroup, number> = {
    peito: 0,
    costas: 0,
    perna: 0,
    ombro: 0,
    braço: 0,
    core: 0,
  };
  for (const date of dates) {
    const row = byDate.get(date);
    for (const m of MUSCLE_ORDER) {
      if (row) last[m] = row[SNAPSHOT_FIELD[m]] as number;
      out[m].push(last[m]);
    }
  }
  return out;
}

export default async function StudentAssessmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const idParse = idSchema.safeParse(rawId);
  if (!idParse.success) notFound();
  const id = idParse.data;

  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const strengthSinceIso = isoDate(
    new Date(new Date().getTime() - STRENGTH_WINDOW_DAYS * MS_PER_DAY),
  );
  const [studentRes, assessmentsRes, snapshotsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", id)
      .eq("tenant_id", session.tenant.id)
      .eq("role", "student")
      .maybeSingle(),
    supabase
      .from("assessments")
      .select(
        "id, measured_at, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm, notes",
      )
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .order("measured_at", { ascending: false })
      .limit(50)
      .returns<AssessmentRow[]>(),
    supabase
      .from("strength_snapshots")
      .select(
        "snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core",
      )
      .eq("user_id", id)
      .gte("snapshot_date", strengthSinceIso)
      .order("snapshot_date", { ascending: true })
      .returns<StrengthSnapshotRow[]>(),
  ]);

  const student = studentRes.data;
  if (!student) notFound();
  const list = assessmentsRes.data ?? [];
  const strengthSeries = buildStrengthSeries(
    snapshotsRes.data ?? [],
    STRENGTH_WINDOW_DAYS,
  );
  const hasStrengthData = (snapshotsRes.data ?? []).length > 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <PageHeader
        eyebrow="Avaliação física"
        title={student.full_name}
        description="Registra peso, percentuais e perímetros. Cada medida fica no histórico comparado com a anterior."
        back={{ href: `/students/${id}`, label: student.full_name }}
      />

      <NewAssessmentForm studentId={id} />

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card/30 p-5">
        <header className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <ZapIcon className="size-5 text-[var(--brand-primary)]" /> Evolução de força
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            últimos {STRENGTH_WINDOW_DAYS} dias
          </span>
        </header>
        {hasStrengthData ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {MUSCLE_ORDER.map((m) => {
              const values = strengthSeries[m];
              const current = values[values.length - 1] ?? 0;
              const start = values[0] ?? 0;
              const trend = current - start;
              const trendLabel =
                trend === 0
                  ? "estável"
                  : trend > 0
                    ? `+${trend} pts`
                    : `${trend} pts`;
              const points = values.map((value) => ({ value }));
              return (
                <li
                  key={m}
                  className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {MUSCLE_LABELS[m]}
                    </span>
                    <span className="font-display text-2xl tabular-nums text-foreground">
                      {current}
                    </span>
                  </div>
                  <Sparkline
                    points={points}
                    width={200}
                    height={60}
                    strokeWidth={2}
                    className="w-full text-[var(--brand-primary)]"
                    ariaLabel={`Evolução ${MUSCLE_LABELS[m]} últimos ${STRENGTH_WINDOW_DAYS} dias`}
                  />
                  <span
                    className={`text-[11px] tabular-nums ${
                      trend > 0
                        ? "text-[var(--brand-primary)]"
                        : "text-muted-foreground"
                    }`}
                  >
                    {trendLabel} no período
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            title="Ainda sem snapshots"
            description="O cron diário começa a registrar a partir de hoje — a evolução aparece aqui em alguns dias."
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl">
          <RulerIcon className="size-5 text-[var(--brand-primary)]" /> Histórico
        </h2>
        {list.length === 0 ? (
          <EmptyState title="Sem avaliações ainda" />
        ) : (
          <ul className="flex flex-col gap-3">
            {list.map((row, idx) => {
              const prev = list[idx + 1] ?? null;
              const date = new Date(row.measured_at).toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "short", year: "numeric" },
              );
              const measurements: Array<[string, number | null, string]> = [
                ["Peso", row.weight_kg, "kg"],
                ["Altura", row.height_cm, "cm"],
                ["% gordura", row.body_fat_pct, "%"],
                ["% músculo", row.muscle_pct, "%"],
                ["Cintura", row.waist_cm, "cm"],
                ["Quadril", row.hip_cm, "cm"],
                ["Peito", row.chest_cm, "cm"],
                ["Braço", row.arm_cm, "cm"],
                ["Coxa", row.thigh_cm, "cm"],
                ["Panturrilha", row.calf_cm, "cm"],
              ];
              return (
                <li
                  key={row.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card/30 p-4"
                >
                  <header className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {date}
                    </span>
                    <form action={deleteAssessmentAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="student_id" value={id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Apagar avaliação"
                      >
                        <TrashIcon className="size-3.5" />
                      </Button>
                    </form>
                  </header>
                  <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {measurements
                      .filter(([, v]) => v !== null && v !== undefined)
                      .map(([label, v, suf]) => {
                        const prevVal = (() => {
                          if (!prev) return null;
                          const map: Record<string, number | null> = {
                            "Peso": prev.weight_kg,
                            "Altura": prev.height_cm,
                            "% gordura": prev.body_fat_pct,
                            "% músculo": prev.muscle_pct,
                            "Cintura": prev.waist_cm,
                            "Quadril": prev.hip_cm,
                            "Peito": prev.chest_cm,
                            "Braço": prev.arm_cm,
                            "Coxa": prev.thigh_cm,
                            "Panturrilha": prev.calf_cm,
                          };
                          return map[label] ?? null;
                        })();
                        const d = delta(prevVal, v);
                        const isFat = label === "% gordura" || label === "Cintura";
                        const positiveTrend = d
                          ? isFat
                            ? d.startsWith("-")
                            : d.startsWith("+")
                          : null;
                        return (
                          <div key={label} className="flex flex-col gap-0.5">
                            <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                              {label}
                            </dt>
                            <dd className="flex items-baseline gap-1.5">
                              <span className="font-display text-lg tabular-nums text-foreground">
                                {fmt(v, suf)}
                              </span>
                              {d ? (
                                <span
                                  className={`text-[10px] tabular-nums ${
                                    positiveTrend
                                      ? "text-[var(--brand-primary)]"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {d}{suf}
                                </span>
                              ) : null}
                            </dd>
                          </div>
                        );
                      })}
                  </dl>
                  {row.notes ? (
                    <p className="whitespace-pre-wrap rounded-md bg-background/40 p-2 text-xs text-muted-foreground">
                      {row.notes}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
