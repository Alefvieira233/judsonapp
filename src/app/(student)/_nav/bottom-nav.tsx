import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

import { StudentNavLink } from "./nav-link";
import { STUDENT_NAV_ITEMS } from "./nav-routes";

async function getUnreadChatCount(): Promise<number> {
  const session = await getCurrentStudent();
  if (!session) return 0;
  const supabase = await createClient();
  const { data: thread } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("tenant_id", session.tenant.id)
    .eq("student_id", session.profile.id)
    .maybeSingle();
  if (!thread) return 0;
  const { count } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("thread_id", thread.id)
    .neq("sender_id", session.profile.id)
    .is("read_at", null);
  return count ?? 0;
}

export async function StudentBottomNav({ className }: { className?: string }) {
  const unreadChat = await getUnreadChatCount();

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-card/80",
        className,
      )}
    >
      <ul className="grid grid-cols-5">
        {STUDENT_NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <StudentNavLink
              item={item}
              badge={item.segment === "chat" ? unreadChat : 0}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
