import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { REACTION_KINDS, type ReactionKind } from "./actions";
import { FeedPostCard, type FeedComment, type FeedPost } from "./post-card";

export const metadata = { title: "Comunidade" };

type PostRow = {
  id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  pinned: boolean | null;
  published_at: string | null;
  author: { full_name: string } | null;
};

type ReactionRow = {
  post_id: string | null;
  user_id: string | null;
  reaction: string | null;
};

type CommentRow = {
  id: string;
  content: string;
  created_at: string | null;
  user_id: string | null;
  post_id: string | null;
  author: { full_name: string } | null;
};

function emptyCounts(): Record<ReactionKind, number> {
  return REACTION_KINDS.reduce(
    (acc, k) => {
      acc[k] = 0;
      return acc;
    },
    {} as Record<ReactionKind, number>,
  );
}

export default async function StudentFeedPage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const supabase = await createClient();

  const { data: postsData } = await supabase
    .from("community_posts")
    .select(
      `id, content, media_url, media_type, pinned, published_at,
       author:profiles!community_posts_author_id_fkey(full_name)`,
    )
    .eq("tenant_id", tenant.id)
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .returns<PostRow[]>();

  const posts = postsData ?? [];

  const myReaction = new Map<string, ReactionKind>();
  const reactionCounts = new Map<string, Record<ReactionKind, number>>();
  const commentsByPost = new Map<string, FeedComment[]>();

  if (posts.length > 0) {
    const postIds = posts.map((p) => p.id);

    // Pull every reaction on visible posts and aggregate in memory. Cheap for
    // MVP — feed page is small (1 tenant, ~dozens of posts) and avoids the
    // round-trip-per-post pattern. Revisit with a materialized view if a
    // tenant ever sees >10k reactions/page.
    const [reactionsRes, commentsRes] = await Promise.all([
      supabase
        .from("community_reactions")
        .select("post_id, user_id, reaction")
        .in("post_id", postIds)
        .returns<ReactionRow[]>(),
      supabase
        .from("community_comments")
        .select(
          `id, content, created_at, user_id, post_id,
           author:profiles!community_comments_user_id_fkey(full_name)`,
        )
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
        .returns<CommentRow[]>(),
    ]);

    for (const r of reactionsRes.data ?? []) {
      if (!r.post_id || !r.reaction) continue;
      if (!REACTION_KINDS.includes(r.reaction as ReactionKind)) continue;
      const kind = r.reaction as ReactionKind;
      const counts = reactionCounts.get(r.post_id) ?? emptyCounts();
      counts[kind] += 1;
      reactionCounts.set(r.post_id, counts);
      if (r.user_id === profile.id) {
        myReaction.set(r.post_id, kind);
      }
    }

    for (const c of commentsRes.data ?? []) {
      if (!c.post_id) continue;
      const arr = commentsByPost.get(c.post_id) ?? [];
      arr.push({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        user_id: c.user_id,
        author: c.author,
        is_mine: c.user_id === profile.id,
      });
      commentsByPost.set(c.post_id, arr);
    }
  }

  const cards: FeedPost[] = posts.map((p) => ({
    id: p.id,
    content: p.content,
    media_url: p.media_url,
    media_type: p.media_type,
    pinned: !!p.pinned,
    published_at: p.published_at,
    author: p.author,
    reactions: reactionCounts.get(p.id) ?? emptyCounts(),
    my_reaction: myReaction.get(p.id) ?? null,
    comments: commentsByPost.get(p.id) ?? [],
  }));

  return (
    <section className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-10">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Comunidade
        </span>
        <h1 className="font-display text-4xl leading-[0.9]">
          {tenant.name.split(" ")[0]} & equipe
        </h1>
        {tenant.tagline ? (
          <p className="text-sm text-muted-foreground">{tenant.tagline}</p>
        ) : null}
      </header>

      {cards.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex flex-col gap-3">
          {cards.map((p) => (
            <li key={p.id}>
              <FeedPostCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/20 px-6 py-12 text-center">
      <h2 className="font-display text-2xl">Nada por aqui ainda</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        O personal vai postar recados, motivação e bastidores quando começar a
        trabalhar com a equipe.
      </p>
    </div>
  );
}
