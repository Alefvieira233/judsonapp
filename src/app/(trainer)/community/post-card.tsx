import { PinIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { PostMenu } from "./post-menu";

type Post = {
  id: string;
  content: string;
  media_url: string | null;
  pinned: boolean | null;
  published_at: string | null;
  author: { full_name: string } | null;
};

export function PostCard({ post }: { post: Post }) {
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
          <PostMenu id={post.id} pinned={!!post.pinned} />
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
    </article>
  );
}

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
