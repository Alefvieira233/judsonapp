"use client";

import { useState, useTransition } from "react";
import { HeartIcon, MessageCircleIcon, PinIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";

import { deleteCommentAction } from "./actions";
import { PostMenu } from "./post-menu";

export type TrainerComment = {
  id: string;
  content: string;
  created_at: string | null;
  author: { full_name: string } | null;
};

export type TrainerPost = {
  id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  pinned: boolean | null;
  published_at: string | null;
  author: { full_name: string } | null;
  reactions_total: number;
  comments: TrainerComment[];
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

export function PostCard({ post }: { post: TrainerPost }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<TrainerComment[]>(post.comments);
  const [pendingDelete, startDelete] = useTransition();

  const onDelete = (id: string) => {
    startDelete(async () => {
      const fd = new FormData();
      fd.set("comment_id", id);
      try {
        await deleteCommentAction(fd);
        setComments((c) => c.filter((it) => it.id !== id));
      } catch {
        toast.error("Não consegui apagar o comentário.");
      }
    });
  };

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {post.author?.full_name ?? "—"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatDate(post.published_at)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {post.pinned ? (
            <Badge variant="default" className="gap-1">
              <PinIcon className="size-3" /> Fixado
            </Badge>
          ) : null}
          <PostMenu
            id={post.id}
            pinned={!!post.pinned}
            content={post.content}
            media_url={post.media_url}
            media_type={post.media_type}
          />
        </div>
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

      <footer className="flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <HeartIcon className="size-3.5" aria-hidden />
          <span className="tabular-nums">{post.reactions_total}</span>
        </span>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex h-11 items-center gap-1.5 rounded-md px-2 transition-colors hover:text-foreground"
          aria-expanded={showComments}
        >
          <MessageCircleIcon className="size-3.5" aria-hidden />
          <span className="tabular-nums">{comments.length}</span>
          <span>{showComments ? "Esconder" : "Ver comentários"}</span>
        </button>
      </footer>

      {showComments && comments.length > 0 ? (
        <ul className="flex flex-col gap-2 border-t border-border pt-3">
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
              <button
                type="button"
                onClick={() => onDelete(c.id)}
                disabled={pendingDelete}
                aria-label="Apagar comentário"
                className="grid size-11 shrink-0 place-items-center text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
              >
                <TrashIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {showComments && comments.length === 0 ? (
        <p className="border-t border-border pt-3 text-xs italic text-muted-foreground">
          Sem comentários ainda.
        </p>
      ) : null}
    </article>
  );
}
