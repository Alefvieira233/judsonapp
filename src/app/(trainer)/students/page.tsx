import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { CreateStudentButton } from "./create-student-button";
import { InviteButton } from "./invite-button";
import { StudentsList, type StudentItem } from "./students-list";

export const metadata = { title: "Alunas" };

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
    .returns<StudentItem[]>();

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
              ? "Nenhuma aluna ainda. Cadastre direto ou gera um convite."
              : `${list.length} aluna${list.length === 1 ? "" : "s"} cadastrada${list.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <CreateStudentButton />
          <InviteButton />
        </div>
      </header>

      {list.length === 0 ? <EmptyState /> : <StudentsList students={list} />}
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
        Toca em <span className="text-foreground">Cadastrar</span> pra criar
        ela direto, ou em <span className="text-foreground">Convidar</span> pra
        mandar um link de auto-cadastro pelo WhatsApp.
      </p>
    </div>
  );
}
