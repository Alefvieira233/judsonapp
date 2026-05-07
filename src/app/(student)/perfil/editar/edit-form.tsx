"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
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
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Salvando…" : "Salvar"}
    </Button>
  );
}

export function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [state, formAction] = useActionState<UpdateProfileState, FormData>(
    updateStudentProfileAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success("Perfil atualizado");
      router.push("/perfil");
    } else if (state?.ok === false) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Nome</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name}
          required
          autoComplete="name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone ?? ""}
          autoComplete="tel"
          placeholder="(96) 9 9999-9999"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="goal">Objetivo</Label>
        <Input
          id="goal"
          name="goal"
          defaultValue={profile.goal ?? ""}
          placeholder="Hipertrofia · Voltar a correr · Definir abdômen"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          name="observations"
          rows={4}
          defaultValue={profile.observations ?? ""}
          placeholder="Lesões, restrições, preferências…"
        />
      </div>

      <SaveButton />
    </form>
  );
}
