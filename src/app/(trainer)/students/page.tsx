import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { CreateStudentButton } from "./create-student-button";
import { InviteButton } from "./invite-button";
import { StudentsList, type StudentItem } from "./students-list";

export const metadata = { title: "Alunas" };

type ThreadRow = { id: string; student_id: string };
type UnreadRow = { thread_id: string };

export default async function StudentsPage() {
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const [studentsRes, threadsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, goal, active, joined_at")
      .eq("tenant_id", session.tenant.id)
      .eq("role", "student")
      .order("joined_at", { ascending: false })
      .returns<Omit<StudentItem, "unread_count">[]>(),
    supabase
      .from("chat_threads")
      .select("id, student_id")
      .eq("tenant_id", session.tenant.id)
      .returns<ThreadRow[]>(),
  ]);

  const threads = threadsRes.data ?? [];
  const threadByStudent = new Map(threads.map((t) => [t.student_id, t.id]));

  // One round-trip for all unread message rows in this tenant: filter messages
  // where the sender is the student (i.e. the trainer hasn't read them yet).
  // Group in JS — avoids per-student N+1 and keeps the page server-rendered.
  const unreadCountByThread = new Map<string, number>();
  if (threads.length > 0) {
    const threadIds = threads.map((t) => t.id);
    const { data: unread } = await supabase
      .from("chat_messages")
      .select("thread_id")
      .in("thread_id", threadIds)
      .is("read_at", null)
      .neq("sender_id", session.profile.id)
      .returns<UnreadRow[]>();
    for (const row of unread ?? []) {
      unreadCountByThread.set(
        row.thread_id,
        (unreadCountByThread.get(row.thread_id) ?? 0) + 1,
      );
    }
  }

  const list: StudentItem[] = (studentsRes.data ?? []).map((s) => ({
    ...s,
    unread_count: unreadCountByThread.get(threadByStudent.get(s.id) ?? "") ?? 0,
  }));

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
