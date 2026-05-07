"use client";

import { useOptimistic, useTransition } from "react";
import { HeartIcon, PinIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { toggleReactionAction } from "./actions";

export type FeedPost = {
  id: string;
  content: string;
  media_url: string | null;
  pinned: boolean;
  published_at: string | null;
  author: { full_name: string } | null;
  likes: number;
  i_liked: boolean;
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
  const [pending, startTransition] = useTransition();
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

  const onToggle = () => {
    startTransition(async () => {
      const next = !optimistic.liked;
      applyOptimistic({ liked: next });
      const res = await toggleReactionAction({
        post_id: post.id,
        reaction: "like",
      });
      if (!res.ok) {
        toast.error(res.error ?? "Não consegui reagir.");
      }
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

      <footer className="flex items-center justify-between border-t border-border pt-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={pending}
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
      </footer>
    </article>
  );
}
