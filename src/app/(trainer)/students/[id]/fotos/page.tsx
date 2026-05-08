import Image from "next/image";
import { notFound } from "next/navigation";
import { ImageIcon, ScaleIcon } from "lucide-react";
import { z } from "zod";

import { PhotoLightbox, type LightboxPhoto } from "@/components/photo-lightbox";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export const metadata = { title: "Fotos da aluna" };

const idSchema = z.string().uuid();

const POSE_LABEL: Record<string, string> = {
  front: "Frente",
  side: "Lado",
  back: "Costas",
  other: "Outra",
};

type PhotoRow = {
  id: string;
  storage_path: string;
  taken_at: string;
  pose: string | null;
  weight_kg: number | null;
  notes: string | null;
};

type Photo = PhotoRow & { url: string | null };

function monthKey(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function formatShort(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function groupByMonth(photos: Photo[]): Array<[string, Photo[]]> {
  // Maintain DB order (taken_at desc) — Map preserves insertion order, so
  // grouping keeps months sorted newest→oldest without an extra sort.
  const groups = new Map<string, Photo[]>();
  for (const p of photos) {
    const key = monthKey(p.taken_at);
    const arr = groups.get(key) ?? [];
    arr.push(p);
    groups.set(key, arr);
  }
  return Array.from(groups.entries());
}

function buildComparisons(photos: Photo[]): Array<{
  pose: string;
  earliest: Photo;
  latest: Photo;
}> {
  const byPose = new Map<string, Photo[]>();
  for (const p of photos) {
    if (!p.pose) continue;
    const arr = byPose.get(p.pose) ?? [];
    arr.push(p);
    byPose.set(p.pose, arr);
  }
  const out: Array<{ pose: string; earliest: Photo; latest: Photo }> = [];
  for (const [pose, list] of byPose.entries()) {
    if (list.length < 2) continue;
    // Photos arrive newest-first; latest = list[0], earliest = list[last].
    const latest = list[0]!;
    const earliest = list[list.length - 1]!;
    out.push({ pose, earliest, latest });
  }
  // Stable order matching POSE_LABEL keys when possible.
  const order = ["front", "side", "back", "other"];
  out.sort((a, b) => order.indexOf(a.pose) - order.indexOf(b.pose));
  return out;
}

export default async function StudentPhotosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const idParse = idSchema.safeParse(rawId);
  if (!idParse.success) notFound();
  const id = idParse.data;

  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const [studentRes, photosRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", id)
      .eq("tenant_id", session.tenant.id)
      .eq("role", "student")
      .maybeSingle(),
    supabase
      .from("progress_photos")
      .select("id, storage_path, taken_at, pose, weight_kg, notes")
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .order("taken_at", { ascending: false })
      .limit(60)
      .returns<PhotoRow[]>(),
  ]);

  const student = studentRes.data;
  if (!student) notFound();
  const rows = photosRes.data ?? [];

  const admin = createAdminClient();
  const photos: Photo[] = await Promise.all(
    rows.map(async (row) => {
      const { data: signed } = await admin.storage
        .from("progress-photos")
        .createSignedUrl(row.storage_path, 3600);
      return { ...row, url: signed?.signedUrl ?? null };
    }),
  );

  const groups = groupByMonth(photos);
  const comparisons = buildComparisons(photos);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <PageHeader
        eyebrow="Fotos de progresso"
        title={student.full_name}
        description="Apenas a aluna pode apagar — você consegue visualizar e comparar."
        back={{ href: `/students/${id}`, label: student.full_name }}
      />

      {photos.length === 0 ? <EmptyState title="Sem fotos ainda" /> : null}

      {comparisons.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <ScaleIcon className="size-5 text-[var(--brand-primary)]" />
            Comparativo
          </h2>
          <ul className="flex flex-col gap-4">
            {comparisons.map(({ pose, earliest, latest }) => {
              const weightDelta =
                earliest.weight_kg !== null && latest.weight_kg !== null
                  ? Number(
                      (latest.weight_kg - earliest.weight_kg).toFixed(1),
                    )
                  : null;
              return (
                <li
                  key={pose}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card/30 p-3"
                >
                  <header className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {POSE_LABEL[pose] ?? pose}
                    </span>
                    {weightDelta !== null && weightDelta !== 0 ? (
                      <span
                        className={`text-xs tabular-nums ${
                          weightDelta < 0
                            ? "text-[var(--brand-primary)]"
                            : "text-muted-foreground"
                        }`}
                      >
                        {weightDelta > 0 ? "+" : ""}
                        {weightDelta}kg
                      </span>
                    ) : null}
                  </header>
                  <div className="grid grid-cols-2 gap-2">
                    <ComparePhoto photo={earliest} hint="Antes" />
                    <ComparePhoto photo={latest} hint="Mais recente" />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {groups.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <ImageIcon className="size-5" />
            Linha do tempo
          </h2>
          <ul className="flex flex-col gap-5">
            {groups.map(([month, list]) => (
              <li key={month} className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  {month}
                </span>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {list.map((photo) => {
                    const poseLabel = photo.pose
                      ? POSE_LABEL[photo.pose] ?? photo.pose
                      : null;
                    const lightbox: LightboxPhoto = {
                      id: photo.id,
                      url: photo.url ?? "",
                      taken_at: photo.taken_at,
                      pose: photo.pose,
                      weight_kg: photo.weight_kg,
                      notes: photo.notes,
                    };
                    return (
                      <li
                        key={photo.id}
                        className="flex flex-col gap-1.5 rounded-lg border border-border bg-card/20 p-1.5"
                      >
                        {photo.url ? (
                          <PhotoLightbox photo={lightbox}>
                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-black">
                              <Image
                                src={photo.url}
                                alt={`Foto de ${formatShort(photo.taken_at)}`}
                                fill
                                className="object-cover"
                                unoptimized
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                              />
                            </div>
                          </PhotoLightbox>
                        ) : (
                          <div className="grid aspect-[3/4] place-items-center rounded-md bg-card text-[10px] text-muted-foreground">
                            Indisponível
                          </div>
                        )}
                        <div className="flex flex-col gap-0 px-1 pb-1">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            {formatShort(photo.taken_at)}
                          </span>
                          <span className="text-xs text-foreground">
                            {poseLabel ?? "—"}
                            {photo.weight_kg ? ` · ${photo.weight_kg}kg` : ""}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ComparePhoto({ photo, hint }: { photo: Photo; hint: string }) {
  const lightbox: LightboxPhoto = {
    id: photo.id,
    url: photo.url ?? "",
    taken_at: photo.taken_at,
    pose: photo.pose,
    weight_kg: photo.weight_kg,
    notes: photo.notes,
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {hint} · {formatShort(photo.taken_at)}
      </span>
      {photo.url ? (
        <PhotoLightbox photo={lightbox}>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-black">
            <Image
              src={photo.url}
              alt={`Foto ${hint}`}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 640px) 45vw, 22rem"
            />
          </div>
        </PhotoLightbox>
      ) : (
        <div className="grid aspect-[3/4] place-items-center rounded-md bg-card text-[10px] text-muted-foreground">
          Indisponível
        </div>
      )}
    </div>
  );
}
