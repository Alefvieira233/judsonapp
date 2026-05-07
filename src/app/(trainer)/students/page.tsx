import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { InviteButton } from "./invite-button";

export const metadata = { title: "Alunas" };

type StudentRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  goal: string | null;
  active: boolean | null;
  joined_at: string | null;
};

export default async function StudentsPage() {
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, goal, active, joined_at")
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .order("joined_at", { ascending: false })
    .returns<StudentRow[]>();

  const list = students ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Painel
          </span>
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            Alunas
          </h1>
          <p className="text-sm text-muted-foreground">
            {list.length === 0
              ? "Nenhuma aluna ainda. Gera um convite pra começar."
              : `${list.length} aluna${list.length === 1 ? "" : "s"} cadastrada${list.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <InviteButton />
      </header>

      {list.length === 0 ? <EmptyState /> : <StudentList students={list} />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-card font-display text-xl text-foreground">
        +
      </span>
      <h2 className="font-display text-2xl">Tua primeira aluna</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Toca em <span className="text-foreground">Convidar aluna</span> e manda o
        link pelo WhatsApp. Ela cadastra o email, recebe um link e entra no app.
      </p>
    </div>
  );
}

function StudentList({ students }: { students: StudentRow[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {students.map((s) => {
        const initial = (Array.from(s.full_name)[0] ?? "?").toUpperCase();
        return (
          <li key={s.id}>
            <Link
              href={`/students/${s.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-card"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card font-display text-lg text-foreground">
                {initial}
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
  );
}
