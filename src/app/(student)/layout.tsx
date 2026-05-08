import { redirect } from "next/navigation";

import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { getCurrentProfile } from "@/lib/auth";
import { brandStyleVars } from "@/lib/tenant";

import { StudentBottomNav } from "./_nav/bottom-nav";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentProfile();
  if (!session) redirect("/login");
  // Owners shouldn't see the student app — bounce them to the panel.
  if (session.profile.role !== "student") redirect("/dashboard");

  const { tenant } = session;

  return (
    <div
      className="min-h-[100dvh] bg-background"
      style={brandStyleVars(tenant)}
    >
      <main
        id="main-content"
        className="flex min-h-[100dvh] flex-col pb-[calc(76px+env(safe-area-inset-bottom))]"
      >
        {children}
      </main>
      <PwaInstallPrompt />
      <StudentBottomNav />
    </div>
  );
}
