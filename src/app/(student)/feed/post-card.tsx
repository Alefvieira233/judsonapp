"use client";

import { useOptimistic, useState, useTransition } from "react";
import { HeartIcon, MessageCircleIcon, PinIcon, SendIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  addCommentAction,
  deleteCommentAction,
  toggleReactionAction,
} from "./actions";

export type FeedComment = {
  id: string;
  content: string;
  created_at: string | null;
  user_id: string | null;
  author: { full_name: string } | null;
  is_mine: boolean;
};

export type FeedPost = {
  id: string;
  content: string;
  media_url: string | null;
  pinned: boolean;
  published_at: string | null;
  author: { full_name: string } | null;
  likes: number;
  i_liked: boolean;
  comments: FeedComment[];
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FeedPostCard({ post }: { post: FeedPost }) {
  const [showComments, setShowComments] = useState(post.comments.length > 0);
  const [draft, setDraft] = useState("");
  const [comments, setComments] = useState<FeedComment[]>(post.comments);
  const [pendingReact, startReact] = useTransition();
  const [pendingComment, startComment] = useTransition();
  const [pendingDelete, startDelete] = useTransition();

  const [optimistic, applyOptimistic] = useOptimistic<
    { liked: boolean; count: number },
    { liked: boolean }
  >(
    { liked: post.i_liked, count: post.likes },
    (state, action) => ({
      liked: action.liked,
      count: state.count + (action.liked ? 1 : -1),
    }),
  );

  const onToggleLike = () => {
    startReact(async () => {
      const next = !optimistic.liked;
      applyOptimistic({ liked: next });
      const res = await toggleReactionAction({
        post_id: post.id,
        reaction: "like",
      });
      if (!res.ok) toast.error(res.error ?? "Não consegui reagir.");
    });
  };

  const onSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    startComment(async () => {
      const res = await addCommentAction({ post_id: post.id, content: text });
      if (!res.ok) {
        toast.error(res.error ?? "Não consegui publicar.");
        return;
      }
      // Optimistic append (server revalidate will overwrite with server state on next render).
      setComments((c) => [
        ...c,
        {
          id: `tmp-${Date.now()}`,
          content: text,
          created_at: new Date().toISOString(),
          user_id: null,
          author: { full_name: "Você" },
          is_mine: true,
        },
      ]);
      setDraft("");
    });
  };

  const onDeleteComment = (id: string) => {
    startDelete(async () => {
      const res = await deleteCommentAction({ comment_id: id });
      if (!res.ok) {
        toast.error(res.error ?? "Não consegui apagar.");
        return;
      }
      setComments((c) => c.filter((it) => it.id !== id));
    });
  };

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {post.author?.full_name ?? "—"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatDate(post.published_at)}
          </span>
        </div>
        {post.pinned ? (
          <Badge variant="default" className="gap-1">
            <PinIcon className="size-3" /> Fixado
          </Badge>
        ) : null}
      </header>

      <p className="whitespace-pre-wrap text-sm text-foreground">
        {post.content}
      </p>

      {post.media_url ? (
        <a
          href={post.media_url}
          target="_blank"
          rel="noreferrer"
          className="truncate text-xs text-[var(--brand-primary)] hover:underline"
        >
          {post.media_url}
        </a>
      ) : null}

      <footer className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={onToggleLike}
          disabled={pendingReact}
          aria-pressed={optimistic.liked}
          aria-label={optimistic.liked ? "Remover curtida" : "Curtir"}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors",
            optimistic.liked
              ? "text-[var(--brand-primary)]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <HeartIcon
            className={cn("size-4", optimistic.liked && "fill-current")}
            aria-hidden
          />
          <span className="text-xs tabular-nums">{optimistic.count}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-expanded={showComments}
        >
          <MessageCircleIcon className="size-4" aria-hidden />
          <span className="text-xs tabular-nums">{comments.length}</span>
        </button>
      </footer>

      {showComments ? (
        <div className="flex flex-col gap-3 border-t border-border pt-3">
          {comments.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start gap-2 rounded-lg bg-background/50 px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {c.author?.full_name ?? "—"}
                      <span className="ml-2 text-[10px] normal-case tracking-normal text-muted-foreground/70">
                        {formatDate(c.created_at)}
                      </span>
                    </span>
                    <p className="whitespace-pre-wrap text-foreground">{c.content}</p>
                  </div>
                  {c.is_mine ? (
                    <button
                      type="button"
                      onClick={() => onDeleteComment(c.id)}
                      disabled={pendingDelete || c.id.startsWith("tmp-")}
                      aria-label="Apagar comentário"
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <TrashIcon className="size-3.5" />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          <form onSubmit={onSubmitComment} className="flex items-end gap-2">
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
              placeholder="Comentar…"
              maxLength={500}
              className="min-h-[44px] resize-none text-sm"
            />
            <Button
              type="submit"
              size="icon"
              disabled={pendingComment || draft.trim().length === 0}
              aria-label="Publicar comentário"
            >
              <SendIcon className="size-4" />
            </Button>
          </form>
        </div>
      ) : null}
    </article>
  );
}
