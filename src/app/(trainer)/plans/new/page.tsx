import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { PlanForm } from "../plan-form";

export const metadata = { title: "Novo plano" };

export default function NewPlanPage() {
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
          Novo
        </span>
        <h1 className="font-display text-4xl leading-none">Plano</h1>
      </header>

      <PlanForm />
    </div>
  );
}
