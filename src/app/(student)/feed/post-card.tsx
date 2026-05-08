"use client";

import { useOptimistic, useState, useTransition } from "react";
import { CheckIcon, MessageCircleIcon, PencilIcon, PinIcon, SendIcon, TrashIcon, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VideoEmbed } from "@/components/video-embed";
import { cn } from "@/lib/utils";

import {
  addCommentAction,
  deleteCommentAction,
  editCommentAction,
  toggleReactionAction,
} from "./actions";
import { REACTION_KINDS, type ReactionKind } from "./reactions";

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
  media_type: string | null;
  pinned: boolean;
  published_at: string | null;
  author: { full_name: string } | null;
  reactions: Record<ReactionKind, number>;
  my_reaction: ReactionKind | null;
  comments: FeedComment[];
};

const REACTION_EMOJI: Record<ReactionKind, string> = {
  like: "👍",
  fire: "🔥",
  heart: "❤️",
  muscle: "💪",
  clap: "👏",
};

const REACTION_LABEL_KEY: Record<ReactionKind, string> = {
  like: "react_like",
  fire: "react_fire",
  heart: "react_heart",
  muscle: "react_muscle",
  clap: "react_clap",
};

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(url);
}

function isVideoEmbedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    return (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be" ||
      host === "instagram.com" ||
      host === "vimeo.com" ||
      /\.(mp4|webm|mov)(\?|$)/i.test(u.pathname)
    );
  } catch {
    return false;
  }
}

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

type ReactionState = {
  mine: ReactionKind | null;
  counts: Record<ReactionKind, number>;
};

export function FeedPostCard({ post }: { post: FeedPost }) {
  const t = useTranslations("feed");
  const locale = useLocale();
  const [showComments, setShowComments] = useState(post.comments.length > 0);
  const [draft, setDraft] = useState("");
  const [comments, setComments] = useState<FeedComment[]>(post.comments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [pendingReact, startReact] = useTransition();
  const [pendingComment, startComment] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [pendingEdit, startEdit] = useTransition();

  const [optimistic, applyOptimistic] = useOptimistic<
    ReactionState,
    { next: ReactionKind | null }
  >(
    { mine: post.my_reaction, counts: post.reactions },
    (state, action) => {
      const counts = { ...state.counts };
      if (state.mine) counts[state.mine] = Math.max(0, counts[state.mine] - 1);
      if (action.next) counts[action.next] = (counts[action.next] ?? 0) + 1;
      return { mine: action.next, counts };
    },
  );

  const onReact = (kind: ReactionKind) => {
    startReact(async () => {
      const next = optimistic.mine === kind ? null : kind;
      applyOptimistic({ next });
      const res = await toggleReactionAction({
        post_id: post.id,
        reaction: kind,
      });
      if (!res.ok) toast.error(res.error ?? t("react_error"));
    });
  };

  const onSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    startComment(async () => {
      const res = await addCommentAction({ post_id: post.id, content: text });
      if (!res.ok) {
        toast.error(res.error ?? t("comment_post_error"));
        return;
      }
      setComments((c) => [
        ...c,
        {
          id: `tmp-${Date.now()}`,
          content: text,
          created_at: new Date().toISOString(),
          user_id: null,
          author: { full_name: t("you") },
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
        toast.error(res.error ?? t("comment_delete_error"));
        return;
      }
      setComments((c) => c.filter((it) => it.id !== id));
    });
  };

  const onStartEdit = (c: FeedComment) => {
    setEditingId(c.id);
    setEditDraft(c.content);
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const onSaveEdit = (id: string) => {
    const text = editDraft.trim();
    if (!text) return;
    startEdit(async () => {
      const res = await editCommentAction({ comment_id: id, content: text });
      if (!res.ok) {
        toast.error(res.error ?? t("comment_edit_error"));
        return;
      }
      setComments((list) =>
        list.map((it) => (it.id === id ? { ...it, content: text } : it)),
      );
      setEditingId(null);
      setEditDraft("");
    });
  };

  const totalReactions = REACTION_KINDS.reduce(
    (sum, k) => sum + (optimistic.counts[k] ?? 0),
    0,
  );

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {post.author?.full_name ?? "—"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatDate(post.published_at, locale)}
          </span>
        </div>
        {post.pinned ? (
          <Badge variant="default" className="gap-1">
            <PinIcon className="size-3" /> {t("pinned")}
          </Badge>
        ) : null}
      </header>

      <p className="whitespace-pre-wrap text-sm text-foreground">
        {post.content}
      </p>

      {post.media_url ? (
        post.media_type === "image" || isImageUrl(post.media_url) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.media_url}
            alt=""
            className="max-h-[480px] w-full rounded-xl border border-border object-cover"
            loading="lazy"
          />
        ) : post.media_type === "video" || isVideoEmbedUrl(post.media_url) ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
            <VideoEmbed url={post.media_url} />
          </div>
        ) : (
          <a
            href={post.media_url}
            target="_blank"
            rel="noreferrer noopener"
            className="truncate text-xs text-[var(--brand-primary)] hover:underline"
          >
            {post.media_url}
          </a>
        )
      ) : null}

      <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
        {REACTION_KINDS.map((kind) => {
          const isMine = optimistic.mine === kind;
          const count = optimistic.counts[kind] ?? 0;
          const dimmed = optimistic.mine !== null && !isMine;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => onReact(kind)}
              disabled={pendingReact}
              aria-pressed={isMine}
              aria-label={t(REACTION_LABEL_KEY[kind])}
              className={cn(
                "inline-flex h-11 min-w-[44px] items-center gap-1.5 rounded-full border px-3 text-sm transition-all active:scale-95",
                isMine
                  ? "border-[var(--brand-primary)]/60 bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]"
                  : dimmed
                    ? "border-border/40 bg-background/30 text-muted-foreground/60 hover:bg-background/60 hover:text-foreground"
                    : "border-border bg-background/50 text-muted-foreground hover:text-foreground",
              )}
            >
              <span aria-hidden className="text-base leading-none">
                {REACTION_EMOJI[kind]}
              </span>
              {count > 0 ? (
                <span className="text-xs tabular-nums">{count}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {totalReactions > 0
            ? totalReactions === 1
              ? t("reactions_one", { count: totalReactions })
              : t("reactions_other", { count: totalReactions })
            : t("be_first")}
        </span>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm transition-colors hover:text-foreground"
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
              {comments.map((c) => {
                const isEditing = editingId === c.id;
                return (
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
                      {isEditing ? (
                        <div className="flex flex-col gap-2 pt-1">
                          <Textarea
                            rows={2}
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            maxLength={500}
                            className="min-h-[44px] resize-none text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => onSaveEdit(c.id)}
                              disabled={pendingEdit || editDraft.trim().length === 0}
                            >
                              <CheckIcon className="size-3.5" /> {t("comment_save")}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={onCancelEdit}
                              disabled={pendingEdit}
                            >
                              <XIcon className="size-3.5" /> {t("comment_cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-foreground">{c.content}</p>
                      )}
                    </div>
                    {c.is_mine && !isEditing ? (
                      <div className="flex shrink-0 items-start gap-1">
                        <button
                          type="button"
                          onClick={() => onStartEdit(c)}
                          disabled={c.id.startsWith("tmp-")}
                          aria-label={t("edit_comment")}
                          className="grid size-11 place-items-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                        >
                          <PencilIcon className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteComment(c.id)}
                          disabled={pendingDelete || c.id.startsWith("tmp-")}
                          aria-label={t("delete_comment")}
                          className="grid size-11 place-items-center text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
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
              placeholder={t("comment_placeholder")}
              maxLength={500}
              className="min-h-[44px] resize-none text-sm"
            />
            <Button
              type="submit"
              size="icon"
              disabled={pendingComment || draft.trim().length === 0}
              aria-label={t("publish_comment")}
            >
              <SendIcon className="size-4" />
            </Button>
          </form>
        </div>
      ) : null}
    </article>
  );
}
