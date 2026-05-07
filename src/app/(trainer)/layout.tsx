import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth";
import { brandStyleVars } from "@/lib/tenant";

import { BottomNav } from "./_nav/bottom-nav";
import { Sidebar } from "./_nav/sidebar";
import { TrainerHeader } from "./trainer-header";

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentProfile();
  if (!session) redirect("/login");
  if (session.profile.role !== "owner") redirect("/welcome");

  const { profile, tenant } = session;
  const userInitial = Array.from(profile.full_name)[0] ?? "?";

  return (
    <div
      className="min-h-[100dvh] bg-background"
      style={brandStyleVars(tenant)}
    >
      <Sidebar
        tenantName={tenant.name}
        userName={profile.full_name}
        userInitial={userInitial}
        className="hidden md:flex"
      />
      <div className="flex min-h-[100dvh] flex-col md:pl-60">
        <TrainerHeader
          tenantName={tenant.name}
          userInitial={userInitial}
          className="md:hidden"
        />
        <main className="flex-1 pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav className="md:hidden" />
    </div>
  );
}
