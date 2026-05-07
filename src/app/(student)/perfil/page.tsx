import { getCurrentStudent } from "@/lib/auth";

import { ComingSoon } from "../_components/coming-soon";

export const metadata = { title: "Perfil" };

export default async function StudentProfilePage() {
  const session = await getCurrentStudent();
  const profile = session?.profile;

  return (
    <ComingSoon
      eyebrow={profile?.full_name ?? "Perfil"}
      title="Em breve"
      description="Dados pessoais, foto, objetivo, sair do app — tudo aqui na próxima entrega."
    />
  );
}
