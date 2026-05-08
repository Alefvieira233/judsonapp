"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Profile } from "@/types/database";

import {
  updateStudentProfileAction,
  type UpdateProfileState,
} from "../actions";

function SaveButton() {
  const { pending } = useFormStatus();
  const tc = useTranslations("common");
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? tc("saving") : tc("save")}
    </Button>
  );
}

export function EditProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations("editProfile");
  const router = useRouter();
  const [state, formAction] = useActionState<UpdateProfileState, FormData>(
    updateStudentProfileAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success(t("saved_toast"));
      router.push("/perfil");
    } else if (state?.ok === false) {
      toast.error(state.error);
    }
  }, [state, router, t]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">{t("f_name")}</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name}
          required
          autoComplete="name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">{t("f_phone")}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone ?? ""}
          autoComplete="tel"
          placeholder={t("f_phone_placeholder")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="goal">{t("f_goal")}</Label>
        <Input
          id="goal"
          name="goal"
          defaultValue={profile.goal ?? ""}
          placeholder={t("f_goal_placeholder")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="observations">{t("f_observations")}</Label>
        <Textarea
          id="observations"
          name="observations"
          rows={4}
          defaultValue={profile.observations ?? ""}
          placeholder={t("f_observations_placeholder")}
        />
      </div>

      <SaveButton />
    </form>
  );
}
