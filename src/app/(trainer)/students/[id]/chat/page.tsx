import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { ChatClient, type ChatMessageView } from "@/app/(shared)/_chat/chat-client";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Chat com aluna" };

const idSchema = z.string().uuid();

export default async function TrainerStudentChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const idParse = idSchema.safeParse(rawId);
  if (!idParse.success) notFound();
  const studentId = idParse.data;

  const session = await getCurrentProfile();
  if (!session) redirect("/login");
  if (session.profile.role !== "owner") redirect("/welcome");

  const supabase = await createClient();
  const { data: student } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", studentId)
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .maybeSingle();
  if (!student) notFound();

  const { data: existing } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("tenant_id", session.tenant.id)
    .eq("student_id", student.id)
    .maybeSingle();

  let threadId = existing?.id ?? null;
  if (!threadId) {
    const { data: created, error } = await supabase
      .from("chat_threads")
      .insert({ tenant_id: session.tenant.id, student_id: student.id })
      .select("id")
      .single();
    if (!error && created) threadId = created.id;
  }

  let messages: ChatMessageView[] = [];
  if (threadId) {
    const { data } = await supabase
      .from("chat_messages")
      .select("id, thread_id, sender_id, content, created_at, read_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .returns<ChatMessageView[]>();
    messages = data ?? [];
  }

  const peerInitial = (Array.from(student.full_name)[0] ?? "?").toUpperCase();

  return (
    <ChatClient
      initialMessages={messages}
      threadId={threadId}
      meId={session.profile.id}
      peer={{
        name: student.full_name,
        avatarUrl: student.avatar_url ?? null,
        initial: peerInitial,
      }}
      backHref={`/students/${student.id}`}
      emptyHint={`Diz oi pra ${student.full_name.split(" ")[0]}.`}
    />
  );
}
