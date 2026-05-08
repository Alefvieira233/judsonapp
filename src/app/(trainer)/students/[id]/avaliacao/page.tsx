import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, RulerIcon, TrashIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
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
  const [studentRes, assessmentsRes] = await Promise.all([
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
  ]);

  const student = studentRes.data;
  if (!student) notFound();
  const list = assessmentsRes.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href={`/students/${id}`}
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> {student.full_name}
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Avaliação física
        </span>
        <h1 className="font-display text-3xl leading-tight">
          {student.full_name}
        </h1>
        <p className="text-xs text-muted-foreground">
          Registra peso, percentuais e perímetros. Cada medida fica no histórico
          comparado com a anterior.
        </p>
      </header>

      <NewAssessmentForm studentId={id} />

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl">
          <RulerIcon className="size-5 text-[var(--brand-primary)]" /> Histórico
        </h2>
        {list.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/20 px-4 py-8 text-center text-sm text-muted-foreground">
            Sem avaliações ainda.
          </p>
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
