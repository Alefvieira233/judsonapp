import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getCurrentStudent } from "@/lib/auth";

import { AvatarUploader } from "./avatar-uploader";
import { EditProfileForm } from "./edit-form";

export async function generateMetadata() {
  const t = await getTranslations("editProfile");
  return { title: t("metadata_title") };
}

export default async function EditProfilePage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const t = await getTranslations("editProfile");
  const initial = (Array.from(session.profile.full_name)[0] ?? "?").toUpperCase();

  return (
    <section className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-6">
      <Link
        href="/perfil"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> {t("back_to_profile")}
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("eyebrow")}
        </span>
        <h1 className="font-display text-4xl leading-[0.9]">{t("title")}</h1>
      </header>

      <AvatarUploader
        initialAvatarUrl={session.profile.avatar_url}
        initial={initial}
      />

      <EditProfileForm profile={session.profile} />
    </section>
  );
}
