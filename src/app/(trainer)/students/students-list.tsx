"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangleIcon,
  ClipboardListIcon,
  DumbbellIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type StudentItem = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  goal: string | null;
  active: boolean | null;
  joined_at: string | null;
  unread_count: number;
  anamnese_pending: boolean;
  has_workout: boolean;
  has_paid_plan: boolean;
  last_trained: number | null;
  at_risk: boolean;
};

type Filter =
  | "active"
  | "at-risk"
  | "no-anamnese"
  | "no-workout"
  | "paid"
  | "inactive"
  | "all";

const FILTERS: {
  id: Filter;
  label: string;
  tone: "primary" | "warn" | "neutral" | "success" | "muted";
}[] = [
  { id: "active", label: "Ativas", tone: "neutral" },
  { id: "at-risk", label: "Em risco", tone: "primary" },
  { id: "no-anamnese", label: "Sem anamnese", tone: "warn" },
  { id: "no-workout", label: "Sem treino", tone: "muted" },
  { id: "paid", label: "Em planos pagos", tone: "success" },
  { id: "inactive", label: "Inativas", tone: "muted" },
  { id: "all", label: "Todas", tone: "neutral" },
];

const TONE_CLASSES: Record<string, string> = {
  primary: "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white",
  warn: "border-amber-500 bg-amber-500 text-white",
  success: "border-emerald-500 bg-emerald-500 text-white",
  muted: "border-foreground/20 bg-foreground/15 text-foreground",
  neutral: "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white",
};

function passesFilter(s: StudentItem, f: Filter): boolean {
  const isActive = s.active !== false;
  switch (f) {
    case "active":
      return isActive;
    case "inactive":
      return !isActive;
    case "at-risk":
      return s.at_risk;
    case "no-anamnese":
      return isActive && s.anamnese_pending;
    case "no-workout":
      return isActive && !s.has_workout;
    case "paid":
      return isActive && s.has_paid_plan;
    case "all":
      return true;
  }
}

export function StudentsList({
  students,
  initialView,
}: {
  students: StudentItem[];
  initialView?: string;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>(() => {
    if (initialView === "at-risk") return "at-risk";
    if (initialView === "no-anamnese") return "no-anamnese";
    if (initialView === "no-workout") return "no-workout";
    if (initialView === "paid") return "paid";
    if (initialView === "inactive") return "inactive";
    if (initialView === "all") return "all";
    return "active";
  });

  // Sync filter into URL so links from the dashboard ("?view=at-risk") deep-link
  // and stay shareable after the user changes the filter manually.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (filter === "active") {
      url.searchParams.delete("view");
    } else {
      url.searchParams.set("view", filter);
    }
    window.history.replaceState(null, "", url.toString());
  }, [filter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (!passesFilter(s, filter)) return false;
      if (!q) return true;
      const haystack = [
        s.full_name,
        s.email ?? "",
        s.phone ?? "",
        s.goal ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [students, search, filter]);

  const counts = useMemo(() => {
    const out: Record<Filter, number> = {
      active: 0,
      "at-risk": 0,
      "no-anamnese": 0,
      "no-workout": 0,
      paid: 0,
      inactive: 0,
      all: students.length,
    };
    for (const s of students) {
      const isActive = s.active !== false;
      if (isActive) out.active += 1;
      else out.inactive += 1;
      if (s.at_risk) out["at-risk"] += 1;
      if (isActive && s.anamnese_pending) out["no-anamnese"] += 1;
      if (isActive && !s.has_workout) out["no-workout"] += 1;
      if (isActive && s.has_paid_plan) out.paid += 1;
    }
    return out;
  }, [students]);

  const summary = useMemo(() => {
    const parts: string[] = [];
    parts.push(
      counts.active === 1 ? "1 ativa" : `${counts.active} ativas`,
    );
    if (counts["at-risk"] > 0) parts.push(`${counts["at-risk"]} em risco`);
    if (counts["no-workout"] > 0)
      parts.push(`${counts["no-workout"]} sem plano`);
    return parts.join(" · ");
  }, [counts]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground tabular-nums">{summary}</p>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nome, email, telefone ou objetivo"
            className="h-11 pl-9 text-base"
          />
        </div>

        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const count = counts[f.id];
              if (
                !active &&
                f.id !== "active" &&
                f.id !== "inactive" &&
                f.id !== "all" &&
                count === 0
              ) {
                // Hide derived filters when there's nothing to show — keeps the
                // pill row tidy when no one is at risk / missing workouts / etc.
                return null;
              }
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? TONE_CLASSES[f.tone]
                      : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                  <span className="ml-1.5 text-xs opacity-70 tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-card/30 px-6 py-10 text-center text-sm text-muted-foreground">
          Nenhuma aluna {search ? "bate" : "nessa lista"}.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((s) => (
            <li key={s.id}>
              <StudentRow student={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StudentRow({ student }: { student: StudentItem }) {
  const initial = (Array.from(student.full_name)[0] ?? "?").toUpperCase();
  const unread = student.unread_count;
  const flags: { icon: React.ReactNode; label: string; tone: string }[] = [];
  if (student.at_risk) {
    flags.push({
      icon: <AlertTriangleIcon className="size-3" />,
      label: "Em risco",
      tone: "border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]",
    });
  }
  if (student.anamnese_pending && student.active !== false) {
    flags.push({
      icon: <ClipboardListIcon className="size-3" />,
      label: "Anamnese",
      tone: "border-amber-500/40 bg-amber-500/10 text-amber-500",
    });
  }
  if (!student.has_workout && student.active !== false) {
    flags.push({
      icon: <DumbbellIcon className="size-3" />,
      label: "Sem treino",
      tone: "border-border bg-card/60 text-muted-foreground",
    });
  }
  if (student.has_paid_plan && student.active !== false) {
    flags.push({
      icon: <SparklesIcon className="size-3" />,
      label: "Plano pago",
      tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
    });
  }

  return (
    <Link
      href={`/students/${student.id}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-card"
    >
      <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-card font-display text-lg text-foreground">
        {initial}
        {unread > 0 ? (
          <span
            aria-label={`${unread} mensagens não lidas`}
            className="absolute -right-1 -top-1 grid min-w-[20px] place-items-center rounded-full bg-[var(--brand-primary)] px-1 text-[10px] font-bold leading-[20px] text-white shadow"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium text-foreground">
            {student.full_name}
          </span>
          {student.active === false ? (
            <Badge variant="outline" className="text-muted-foreground">
              Inativa
            </Badge>
          ) : null}
        </div>
        <span className="truncate text-xs text-muted-foreground">
          {student.goal ?? student.email ?? student.phone ?? "Sem dados"}
        </span>
        {flags.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1">
            {flags.map((f) => (
              <span
                key={f.label}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em]",
                  f.tone,
                )}
              >
                {f.icon}
                {f.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
