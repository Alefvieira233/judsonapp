"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

import { markThreadReadAction, sendMessageAction } from "./actions";

export type ChatMessageView = {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

type Props = {
  initialMessages: ChatMessageView[];
  threadId: string | null;
  meId: string;
  // What the *peer* looks like — i.e. the trainer when student-side, or
  // the student when trainer-side.
  peer: { name: string; avatarUrl: string | null; initial: string };
  backHref: string;
  emptyHint: string;
  // For student-side first message we may not have a thread yet — server
  // action figures it out. Trainer-side always has a thread.
  allowCreateThread?: boolean;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function sameDay(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86_400_000);
  if (d.toDateString() === today.toDateString()) return "Hoje";
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function ChatClient({
  initialMessages,
  threadId: initialThreadId,
  meId,
  peer,
  backHref,
  emptyHint,
  allowCreateThread = false,
}: Props) {
  const [messages, setMessages] = useState<ChatMessageView[]>(initialMessages);
  const [threadId, setThreadId] = useState<string | null>(initialThreadId);
  const [draft, setDraft] = useState("");
  const [pending, startSend] = useTransition();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Initial scroll on mount + whenever the thread switches.
  useEffect(() => {
    scrollToBottom(false);
  }, [threadId, scrollToBottom]);

  // Mark as read on mount and whenever a new peer message arrives while we're
  // in the page. Uses the server action so RLS + revalidation run together.
  useEffect(() => {
    if (!threadId) return;
    const hasUnread = messages.some(
      (m) => m.sender_id !== meId && m.read_at === null,
    );
    if (!hasUnread) return;
    void markThreadReadAction({ thread_id: threadId });
  }, [threadId, messages, meId]);

  // Realtime subscribe. Auth is propagated via cookies — Supabase Realtime
  // negotiates over wss://<project>.supabase.co under the user's session
  // and RLS gates which rows reach the channel.
  useEffect(() => {
    if (!threadId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`chat:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const row = payload.new as ChatMessageView;
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            // Replace any optimistic placeholder authored by me with the same
            // content (within ~5s) — keeps the timestamp jitter-free.
            const idx = prev.findIndex(
              (m) =>
                m.id.startsWith("tmp-") &&
                m.sender_id === row.sender_id &&
                m.content === row.content,
            );
            if (idx >= 0) {
              const next = prev.slice();
              next[idx] = row;
              return next;
            }
            return [...prev, row];
          });
          requestAnimationFrame(() => scrollToBottom(true));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [threadId, scrollToBottom]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (!threadId && !allowCreateThread) {
      toast.error("Conversa indisponível.");
      return;
    }
    const tmpId = `tmp-${Date.now()}`;
    const optimistic: ChatMessageView = {
      id: tmpId,
      thread_id: threadId ?? "pending",
      sender_id: meId,
      content: text,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    requestAnimationFrame(() => scrollToBottom(true));

    startSend(async () => {
      const res = await sendMessageAction({
        thread_id: threadId ?? undefined,
        content: text,
      });
      if (!res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== tmpId));
        toast.error(res.error);
        return;
      }
      if (!threadId) {
        setThreadId(res.thread_id);
      }
    });
  };

  const grouped = useMemo(() => {
    const out: Array<{ kind: "day"; iso: string } | { kind: "msg"; m: ChatMessageView }> = [];
    let prevIso: string | null = null;
    for (const m of messages) {
      if (!prevIso || !sameDay(prevIso, m.created_at)) {
        out.push({ kind: "day", iso: m.created_at });
      }
      out.push({ kind: "msg", m });
      prevIso = m.created_at;
    }
    return out;
  }, [messages]);

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Link
          href={backHref}
          aria-label="Voltar"
          className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <ArrowLeftIcon className="size-5" />
        </Link>
        <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--brand-primary)] font-display text-base text-white">
          {peer.avatarUrl ? (
            <Image src={peer.avatarUrl} alt={peer.name} fill className="object-cover" unoptimized />
          ) : (
            peer.initial
          )}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Conversa
          </span>
          <span className="truncate font-display text-lg leading-none">{peer.name}</span>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p className="max-w-xs">{emptyHint}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {grouped.map((entry, i) => {
              if (entry.kind === "day") {
                return (
                  <li
                    key={`d-${entry.iso}-${i}`}
                    className="my-2 flex items-center justify-center"
                  >
                    <span className="rounded-full bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {dayLabel(entry.iso)}
                    </span>
                  </li>
                );
              }
              const m = entry.m;
              const mine = m.sender_id === meId;
              return (
                <li
                  key={m.id}
                  className={cn("flex w-full", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "flex max-w-[78%] flex-col gap-1 rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                      mine
                        ? "rounded-br-sm bg-[var(--brand-primary)] text-white"
                        : "rounded-bl-sm border border-border bg-card text-foreground",
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words leading-snug">{m.content}</p>
                    <span
                      className={cn(
                        "self-end text-[10px] tabular-nums",
                        mine ? "text-white/70" : "text-muted-foreground",
                      )}
                    >
                      {formatTime(m.created_at)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="sticky bottom-0 z-20 flex items-end gap-2 border-t border-border bg-background/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <Textarea
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Mensagem"
          maxLength={2000}
          className="min-h-[44px] flex-1 resize-none text-base"
          aria-label="Escrever mensagem"
        />
        <Button
          type="submit"
          size="icon"
          disabled={pending || draft.trim().length === 0}
          aria-label="Enviar"
          className="size-11 shrink-0"
        >
          <SendIcon className="size-5" />
        </Button>
      </form>
    </div>
  );
}
