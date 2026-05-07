import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { EditStudentForm } from "./edit-form";

export const metadata = { title: "Aluna" };

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data: student } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, goal, observations, active, joined_at")
    .eq("id", id)
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .maybeSingle();

  if (!student) notFound();

  const initial = (Array.from(student.full_name)[0] ?? "?").toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href="/students"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Alunas
      </Link>

      <header className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-card font-display text-2xl text-foreground">
          {initial}
        </span>
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate font-display text-3xl leading-none md:text-4xl">
            {student.full_name}
          </h1>
          <span className="mt-1 text-xs text-muted-foreground">
            {student.email ?? student.phone ?? "Sem contato"}
          </span>
        </div>
      </header>

      <EditStudentForm
        student={{
          id: student.id,
          full_name: student.full_name,
          goal: student.goal,
          observations: student.observations,
          active: student.active ?? true,
        }}
      />
    </div>
  );
}
