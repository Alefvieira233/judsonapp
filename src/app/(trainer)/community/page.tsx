import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { CreatePostSheet } from "./create-post-sheet";
import { PostCard } from "./post-card";

export const metadata = { title: "Comunidade" };

type PostRow = {
  id: string;
  content: string;
  media_url: string | null;
  pinned: boolean | null;
  published_at: string | null;
  author: { full_name: string } | null;
};

export default async function CommunityPage() {
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("community_posts")
    .select(
      `id, content, media_url, pinned, published_at,
       author:profiles!community_posts_author_id_fkey(full_name)`,
    )
    .eq("tenant_id", session.tenant.id)
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .returns<PostRow[]>();

  const list = posts ?? [];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Painel
          </span>
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            Comunidade
          </h1>
          <p className="text-sm text-muted-foreground">
            {list.length === 0
              ? "Nada publicado ainda. Faça o primeiro post."
              : `${list.length} post${list.length === 1 ? "" : "s"} publicado${list.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <CreatePostSheet />
      </header>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
      <h2 className="font-display text-2xl">A comunidade começa aqui</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Posts aparecem no app das alunas. Solte uma atualização, dica do dia ou
        bastidor — e fixe os mais importantes pra ficarem no topo.
      </p>
    </div>
  );
}
