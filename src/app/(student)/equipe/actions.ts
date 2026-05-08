"use server";

import { revalidatePath } from "next/cache";

import { getCurrentStudent } from "@/lib/auth";
import { log } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

export type ToggleLeaderboardState =
  | { ok: true; share: boolean }
  | { ok: false; error: string }
  | undefined;

export async function toggleLeaderboardOptInAction(
  _prev: ToggleLeaderboardState,
  formData: FormData,
): Promise<ToggleLeaderboardState> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const raw = formData.get("share");
  const share = raw === "on" || raw === "true";

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ share_in_leaderboard: share })
    .eq("id", session.profile.id);

  if (error) {
    log.error("equipe.toggleOptIn", error, { scope: "equipe" });
    return { ok: false, error: "Não consegui salvar. Tenta de novo." };
  }

  revalidatePath("/equipe");
  revalidatePath("/home");
  revalidatePath("/perfil");
  return { ok: true, share };
}
