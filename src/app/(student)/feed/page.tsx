import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { FeedPostCard, type FeedPost } from "./post-card";

export const metadata = { title: "Comunidade" };

type PostRow = {
  id: string;
  content: string;
  media_url: string | null;
  pinned: boolean | null;
  published_at: string | null;
  author: { full_name: string } | null;
  likes: { count: number }[];
};

type ReactionRow = {
  post_id: string | null;
};

export default async function StudentFeedPage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const supabase = await createClient();

  const { data: postsData } = await supabase
    .from("community_posts")
    .select(
      `id, content, media_url, pinned, published_at,
       author:profiles!community_posts_author_id_fkey(full_name),
       likes:community_reactions(count)`,
    )
    .eq("tenant_id", tenant.id)
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .returns<PostRow[]>();

  const posts = postsData ?? [];

  const myReactions = new Set<string>();
  if (posts.length > 0) {
    const { data: reactions } = await supabase
      .from("community_reactions")
      .select("post_id")
      .eq("user_id", profile.id)
      .in(
        "post_id",
        posts.map((p) => p.id),
      )
      .returns<ReactionRow[]>();
    for (const r of reactions ?? []) {
      if (r.post_id) myReactions.add(r.post_id);
    }
  }

  const cards: FeedPost[] = posts.map((p) => ({
    id: p.id,
    content: p.content,
    media_url: p.media_url,
    pinned: !!p.pinned,
    published_at: p.published_at,
    author: p.author,
    likes: p.likes?.[0]?.count ?? 0,
    i_liked: myReactions.has(p.id),
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
