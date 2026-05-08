import { redirect } from "next/navigation";

import { ChatClient, type ChatMessageView } from "@/app/(shared)/_chat/chat-client";
import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Chat" };

export default async function StudentChatPage() {
  const session = await getCurrentStudent();
  if (!session) redirect("/login");
  const { profile, tenant } = session;

  const supabase = await createClient();

  const { data: thread } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("tenant_id", tenant.id)
    .eq("student_id", profile.id)
    .maybeSingle();

  let messages: ChatMessageView[] = [];
  if (thread?.id) {
    const { data } = await supabase
      .from("chat_messages")
      .select("id, thread_id, sender_id, content, created_at, read_at")
      .eq("thread_id", thread.id)
      .order("created_at", { ascending: true })
      .returns<ChatMessageView[]>();
    messages = data ?? [];
  }

  const tenantFirst = tenant.name.split(" ")[0] ?? tenant.name;
  const peerInitial = (Array.from(tenantFirst)[0] ?? "?").toUpperCase();

  return (
    <ChatClient
      initialMessages={messages}
      threadId={thread?.id ?? null}
      meId={profile.id}
      peer={{
        name: tenantFirst,
        avatarUrl: tenant.logo_url ?? null,
        initial: peerInitial,
      }}
      backHref="/perfil"
      emptyHint={`Manda a primeira mensagem pro ${tenantFirst}.`}
      allowCreateThread
    />
  );
}
