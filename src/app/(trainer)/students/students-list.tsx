"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

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
};

const FILTERS = [
  { id: "active", label: "Ativas" },
  { id: "inactive", label: "Inativas" },
  { id: "all", label: "Todas" },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

export function StudentsList({ students }: { students: StudentItem[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("active");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const isActive = s.active !== false;
      if (filter === "active" && !isActive) return false;
      if (filter === "inactive" && isActive) return false;
      if (!q) return true;
      const haystack = `${s.full_name} ${s.email ?? ""} ${s.goal ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [students, search, filter]);

  const counts = useMemo(() => {
    const active = students.filter((s) => s.active !== false).length;
    return { active, inactive: students.length - active, all: students.length };
  }, [students]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email ou objetivo"
            className="h-11 pl-9 text-base"
          />
        </div>

        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const count = counts[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                      : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                  <span className="ml-1.5 text-xs opacity-70">{count}</span>
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
          {filtered.map((s) => {
            const initial = (Array.from(s.full_name)[0] ?? "?").toUpperCase();
            const unread = s.unread_count;
            return (
              <li key={s.id}>
                <Link
                  href={`/students/${s.id}`}
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
                        {s.full_name}
                      </span>
                      {s.active === false ? (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inativa
                        </Badge>
                      ) : null}
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {s.goal ?? s.email ?? s.phone ?? "Sem dados"}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
