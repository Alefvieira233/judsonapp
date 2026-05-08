import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { CreatePostSheet } from "./create-post-sheet";
import { PostCard, type TrainerComment, type TrainerPost } from "./post-card";

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

type ReactionRow = { post_id: string | null };

type CommentRow = {
  id: string;
  content: string;
  created_at: string | null;
  post_id: string | null;
  author: { full_name: string } | null;
};

export default async function CommunityPage() {
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("community_posts")
    .select(
      `id, content, media_url, media_type, pinned, published_at,
       author:profiles!community_posts_author_id_fkey(full_name)`,
    )
    .eq("tenant_id", session.tenant.id)
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .returns<PostRow[]>();

  const list = posts ?? [];

  const reactionCounts = new Map<string, number>();
  const commentsByPost = new Map<string, TrainerComment[]>();

  if (list.length > 0) {
    const ids = list.map((p) => p.id);

    const [reactionsRes, commentsRes] = await Promise.all([
      supabase
        .from("community_reactions")
        .select("post_id")
        .in("post_id", ids)
        .returns<ReactionRow[]>(),
      supabase
        .from("community_comments")
        .select(
          `id, content, created_at, post_id,
           author:profiles!community_comments_user_id_fkey(full_name)`,
        )
        .in("post_id", ids)
        .order("created_at", { ascending: true })
        .returns<CommentRow[]>(),
    ]);

    for (const r of reactionsRes.data ?? []) {
      if (!r.post_id) continue;
      reactionCounts.set(r.post_id, (reactionCounts.get(r.post_id) ?? 0) + 1);
    }
    for (const c of commentsRes.data ?? []) {
      if (!c.post_id) continue;
      const arr = commentsByPost.get(c.post_id) ?? [];
      arr.push({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        author: c.author,
      });
      commentsByPost.set(c.post_id, arr);
    }
  }

  const cards: TrainerPost[] = list.map((p) => ({
    id: p.id,
    content: p.content,
    media_url: p.media_url,
    media_type: p.media_type,
    pinned: p.pinned,
    published_at: p.published_at,
    author: p.author,
    reactions_total: reactionCounts.get(p.id) ?? 0,
    comments: commentsByPost.get(p.id) ?? [],
  }));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <PageHeader
        eyebrow="Painel"
        title="Comunidade"
        description={
          cards.length === 0
            ? "Nada publicado ainda. Faça o primeiro post."
            : `${cards.length} post${cards.length === 1 ? "" : "s"} publicado${cards.length === 1 ? "" : "s"}.`
        }
        trailing={<CreatePostSheet />}
      />

      {cards.length === 0 ? (
        <EmptyState
          title="A comunidade começa aqui"
          description="Posts aparecem no app das alunas. Solte uma atualização, dica do dia ou bastidor — e fixe os mais importantes pra ficarem no topo."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {cards.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
