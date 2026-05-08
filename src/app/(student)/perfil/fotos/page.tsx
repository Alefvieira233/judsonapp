import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, LockIcon, TrashIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { PhotoLightbox, type LightboxPhoto } from "@/components/photo-lightbox";
import { getCurrentStudent } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";

import { deleteProgressPhotoAction } from "./actions";
import { UploadForm } from "./upload-form";

export async function generateMetadata() {
  const t = await getTranslations("photos");
  return { title: t("metadata_title") };
}

type PhotoRow = {
  id: string;
  storage_path: string;
  taken_at: string;
  pose: string | null;
  weight_kg: number | null;
  notes: string | null;
};

function formatShort(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
  });
}

export default async function StudentPhotosPage() {
  const session = await getCurrentStudent();
  if (!session) return null;

  const t = await getTranslations("photos");
  const locale = await getLocale();
  const trainerFirst = session.tenant.name.split(" ")[0] ?? session.tenant.name;
  const POSE_LABEL: Record<string, string> = {
    front: t("pose_front"),
    side: t("pose_side"),
    back: t("pose_back"),
    other: t("pose_other"),
  };

  const supabase = await createClient();
  const { data } = await supabase
    .from("progress_photos")
    .select("id, storage_path, taken_at, pose, weight_kg, notes")
    .eq("student_id", session.profile.id)
    .order("taken_at", { ascending: false })
    .limit(30)
    .returns<PhotoRow[]>();

  const rows = data ?? [];

  // Bucket is private — sign each path so the <img> tag can fetch it. 1h is
  // long enough for a normal page session and short enough that links shared
  // out-of-band expire quickly.
  const admin = createAdminClient();
  const photos: Array<PhotoRow & { url: string | null }> = await Promise.all(
    rows.map(async (row) => {
      const { data: signed } = await admin.storage
        .from("progress-photos")
        .createSignedUrl(row.storage_path, 3600);
      return { ...row, url: signed?.signedUrl ?? null };
    }),
  );

  return (
    <section className="flex flex-1 flex-col gap-6 px-5 pb-10 pt-6">
      <Link
        href="/perfil"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> {t("back_to_profile")}
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("eyebrow")}
        </span>
        <h1 className="font-display text-3xl leading-tight">{t("title")}</h1>
        <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <LockIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>{t("privacy_hint", { trainer: trainerFirst })}</span>
        </p>
      </header>

      <UploadForm />

      <section className="flex flex-col gap-3">
        <header className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl">{t("your_photos")}</h2>
          <span className="text-xs text-muted-foreground">
            {photos.length === 0
              ? ""
              : photos.length === 1
                ? t("saved_one", { count: photos.length })
                : t("saved_other", { count: photos.length })}
          </span>
        </header>

        {photos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/20 px-4 py-8 text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => {
              const poseLabel = photo.pose ? POSE_LABEL[photo.pose] ?? photo.pose : null;
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
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card/30 p-2"
                >
                  {photo.url ? (
                    <PhotoLightbox photo={lightbox}>
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-black">
                        <Image
                          src={photo.url}
                          alt={`${formatShort(photo.taken_at, locale)}`}
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                    </PhotoLightbox>
                  ) : (
                    <div className="grid aspect-[3/4] place-items-center rounded-lg bg-card text-xs text-muted-foreground">
                      {/* falls back to common.unavailable */}
                    </div>
                  )}

                  <div className="flex flex-col gap-0.5 px-1">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {formatShort(photo.taken_at, locale)}
                    </span>
                    <span className="text-sm text-foreground">
                      {poseLabel ?? "—"}
                      {photo.weight_kg ? ` · ${photo.weight_kg}kg` : ""}
                    </span>
                  </div>

                  <form action={deleteProgressPhotoAction} className="px-1 pb-1">
                    <input type="hidden" name="id" value={photo.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                    >
                      <TrashIcon className="size-3.5" /> {t("delete")}
                    </Button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}
