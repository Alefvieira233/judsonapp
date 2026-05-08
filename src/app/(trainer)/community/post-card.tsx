"use client";

import { useState, useTransition } from "react";
import { HeartIcon, MessageCircleIcon, PencilIcon, PinIcon, TrashIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { deleteCommentAction, editCommentAsOwnerAction } from "./actions";
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

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PostCard({ post }: { post: TrainerPost }) {
  const t = useTranslations("community");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<TrainerComment[]>(post.comments);
  const [pendingDelete, startDelete] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pendingEdit, startEdit] = useTransition();

  const onDelete = (id: string) => {
    startDelete(async () => {
      const fd = new FormData();
      fd.set("comment_id", id);
      try {
        await deleteCommentAction(fd);
        setComments((c) => c.filter((it) => it.id !== id));
      } catch {
        toast.error(t("delete_comment_error"));
      }
    });
  };

  const onEditStart = (c: TrainerComment) => {
    setEditingId(c.id);
    setDraft(c.content);
  };

  const onEditCancel = () => {
    setEditingId(null);
    setDraft("");
  };

  const onEditSave = (id: string) => {
    const text = draft.trim();
    if (!text) return;
    startEdit(async () => {
      const res = await editCommentAsOwnerAction({ comment_id: id, content: text });
      if (!res.ok) {
        toast.error(res.error ?? t("post_save_error"));
        return;
      }
      setComments((c) => c.map((it) => (it.id === id ? { ...it, content: text } : it)));
      setEditingId(null);
      setDraft("");
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
            {formatDate(post.published_at, locale)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {post.pinned ? (
            <Badge variant="default" className="gap-1">
              <PinIcon className="size-3" /> {t("pinned")}
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
          <span>{showComments ? t("hide_comments") : t("show_comments")}</span>
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
                    {formatDate(c.created_at, locale)}
                  </span>
                </span>
                {editingId === c.id ? (
                  <div className="flex flex-col gap-2 pt-1">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={2}
                      maxLength={500}
                      autoFocus
                      aria-label={t("delete_comment")}
                      className="text-sm"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEditCancel}
                        disabled={pendingEdit}
                      >
                        {tc("cancel")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onEditSave(c.id)}
                        disabled={pendingEdit || draft.trim().length === 0}
                      >
                        {pendingEdit ? tc("saving") : tc("save")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-foreground">{c.content}</p>
                )}
              </div>
              {editingId === c.id ? null : (
                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => onEditStart(c)}
                    aria-label={tc("edit")}
                    className="grid size-11 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <PencilIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(c.id)}
                    disabled={pendingDelete}
                    aria-label={t("delete_comment")}
                    className="grid size-11 place-items-center text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    <TrashIcon className="size-3.5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {showComments && comments.length === 0 ? (
        <p className="border-t border-border pt-3 text-xs italic text-muted-foreground">
          {t("no_comments")}
        </p>
      ) : null}
    </article>
  );
}
