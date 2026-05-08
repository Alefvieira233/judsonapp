"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const uuid = z.string().uuid();

const sendSchema = z.object({
  thread_id: z.string().uuid().optional(),
  content: z
    .string()
    .trim()
    .min(1, "Escreva alguma coisa.")
    .max(2000, "Mensagem longa demais."),
});

const markReadSchema = z.object({
  thread_id: z.string().uuid(),
});

const getOrCreateSchema = z.object({
  student_id: z.string().uuid(),
});

type Err = { ok: false; error: string };
type SendResult = { ok: true; thread_id: string } | Err;
type SimpleResult = { ok: true } | Err;

async function ensureThreadForStudent(
  tenantId: string,
  studentId: string,
): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("student_id", studentId)
    .maybeSingle();
  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("chat_threads")
    .insert({ tenant_id: tenantId, student_id: studentId })
    .select("id")
    .single();
  if (error || !created) {
    console.error("[chat.thread.create]", error);
    return null;
  }
  return created;
}

export async function sendMessageAction(
  input: z.infer<typeof sendSchema>,
): Promise<SendResult> {
  const session = await getCurrentProfile();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const parsed = sendSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { profile, tenant } = session;

  let threadId = parsed.data.thread_id;

  if (!threadId) {
    if (profile.role === "student") {
      const t = await ensureThreadForStudent(tenant.id, profile.id);
      if (!t) return { ok: false, error: "Não consegui abrir a conversa." };
      threadId = t.id;
    } else {
      return { ok: false, error: "Selecione com quem você quer conversar." };
    }
  } else {
    // Defense in depth: ensure the resolved thread is in the caller's tenant
    // and matches their membership before writing.
    const { data: thread } = await supabase
      .from("chat_threads")
      .select("id, tenant_id, student_id")
      .eq("id", threadId)
      .maybeSingle();
    if (!thread || thread.tenant_id !== tenant.id) {
      return { ok: false, error: "Conversa não encontrada." };
    }
    if (profile.role === "student" && thread.student_id !== profile.id) {
      return { ok: false, error: "Conversa não encontrada." };
    }
  }

  const { error: insertError } = await supabase.from("chat_messages").insert({
    thread_id: threadId,
    sender_id: profile.id,
    content: parsed.data.content,
  });
  if (insertError) {
    console.error("[chat.message.insert]", insertError);
    return { ok: false, error: "Não consegui enviar." };
  }

  const { error: updateError } = await supabase
    .from("chat_threads")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", threadId);
  if (updateError) {
    console.error("[chat.thread.touch]", updateError);
  }

  revalidatePath("/perfil/chat");
  revalidatePath("/students");
  revalidatePath("/perfil");
  if (profile.role === "owner") {
    const { data: t } = await supabase
      .from("chat_threads")
      .select("student_id")
      .eq("id", threadId)
      .maybeSingle();
    if (t?.student_id) revalidatePath(`/students/${t.student_id}/chat`);
  }

  return { ok: true, thread_id: threadId };
}

export async function markThreadReadAction(
  input: z.infer<typeof markReadSchema>,
): Promise<SimpleResult> {
  const session = await getCurrentProfile();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const parsed = markReadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("chat_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("thread_id", parsed.data.thread_id)
    .neq("sender_id", session.profile.id)
    .is("read_at", null);
  if (error) {
    console.error("[chat.mark_read]", error);
    return { ok: false, error: "Não consegui marcar como lido." };
  }

  revalidatePath("/perfil/chat");
  revalidatePath("/perfil");
  revalidatePath("/students");
  return { ok: true };
}

export async function getOrCreateThreadForStudentAction(
  input: z.infer<typeof getOrCreateSchema>,
): Promise<SendResult> {
  const session = await getCurrentProfile();
  if (!session) return { ok: false, error: "Sessão expirada." };
  if (session.profile.role !== "owner") {
    return { ok: false, error: "Apenas o personal pode iniciar conversas." };
  }

  const parsed = getOrCreateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos." };

  const studentIdParse = uuid.safeParse(parsed.data.student_id);
  if (!studentIdParse.success) return { ok: false, error: "Aluna inválida." };

  const supabase = await createClient();
  const { data: student } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", studentIdParse.data)
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .maybeSingle();
  if (!student) return { ok: false, error: "Aluna não encontrada." };

  const t = await ensureThreadForStudent(session.tenant.id, student.id);
  if (!t) return { ok: false, error: "Não consegui abrir a conversa." };

  return { ok: true, thread_id: t.id };
}
