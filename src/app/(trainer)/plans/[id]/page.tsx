import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { deletePlanAction } from "../actions";
import { PlanForm } from "../plan-form";

export const metadata = { title: "Editar plano" };

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", session.tenant.id)
    .maybeSingle();
  if (!plan) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href="/plans"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Planos
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Editar
        </span>
        <h1 className="font-display text-4xl leading-none">{plan.name}</h1>
      </header>

      <PlanForm
        planId={plan.id}
        initial={{
          name: plan.name,
          tagline: plan.tagline ?? "",
          description: plan.description ?? "",
          price_label: plan.price_label ?? "",
          features: plan.features ?? [],
          cta_label: plan.cta_label ?? "Quero esse plano",
          highlight: plan.highlight ?? false,
          display_order: plan.display_order ?? 0,
          active: plan.active ?? true,
        }}
      />

      <form action={deletePlanAction} className="flex justify-start pt-4">
        <input type="hidden" name="id" value={plan.id} />
        <Button type="submit" variant="ghost" size="sm">
          <TrashIcon className="size-4" /> Apagar plano
        </Button>
      </form>
    </div>
  );
}
