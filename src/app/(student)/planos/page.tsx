import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, SparklesIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Planos" };

type PlanRow = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_label: string | null;
  features: string[] | null;
  cta_label: string | null;
  highlight: boolean | null;
  display_order: number | null;
};

function whatsappLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default async function StudentPlansPage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const supabase = await createClient();
  const { data } = await supabase
    .from("plans")
    .select(
      "id, name, tagline, description, price_label, features, cta_label, highlight, display_order",
    )
    .eq("tenant_id", tenant.id)
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<PlanRow[]>();

  const plans = data ?? [];

  return (
    <section className="flex flex-1 flex-col gap-6 px-5 pb-8 pt-6">
      <Link
        href="/perfil"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Perfil
      </Link>

      <header className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
          Acompanhamento
        </span>
        <h1 className="font-display text-4xl leading-[0.9]">Planos</h1>
        <p className="text-sm text-muted-foreground">
          Escolhe o nível de acompanhamento que combina com o teu momento. Tu
          fala com o {tenant.name.split(" ")[0]} pelo WhatsApp pra acertar.
        </p>
      </header>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/20 px-6 py-12 text-center text-sm text-muted-foreground">
          Os planos ainda não foram cadastrados. Fala direto pelo WhatsApp.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {plans.map((plan) => {
            const isCurrent = profile.current_plan_id === plan.id;
            const message = `Oi ${tenant.name.split(" ")[0]}! Quero saber mais sobre o plano "${plan.name}".`;
            return (
              <li
                key={plan.id}
                className={`relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 ${
                  plan.highlight
                    ? "border-[var(--brand-primary)]/50 bg-gradient-to-br from-[var(--brand-primary)]/15 via-card/50 to-card/40"
                    : "border-border bg-card/40"
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary)] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                    <SparklesIcon className="size-3" /> Mais popular
                  </span>
                ) : null}

                <header className="flex flex-col gap-1">
                  <span className="font-display text-2xl leading-tight">
                    {plan.name}
                  </span>
                  {plan.tagline ? (
                    <span className="text-sm text-muted-foreground">
                      {plan.tagline}
                    </span>
                  ) : null}
                </header>

                {plan.price_label ? (
                  <p className="font-display text-4xl leading-none text-[var(--brand-primary)]">
                    {plan.price_label}
                  </p>
                ) : null}

                {plan.description ? (
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                ) : null}

                {plan.features && plan.features.length > 0 ? (
                  <ul className="flex flex-col gap-1.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-[var(--brand-primary)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {isCurrent ? (
                  <div className="rounded-md border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 px-3 py-2 text-xs text-foreground">
                    Esse é o teu plano atual.
                  </div>
                ) : (
                  <a
                    href={whatsappLink(tenant.whatsapp_number, message)}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({
                      size: "lg",
                      variant: plan.highlight ? "default" : "outline",
                      className: "w-full",
                    })}
                  >
                    {plan.cta_label ?? "Quero esse plano"}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Pagamento via PIX direto pro {tenant.name.split(" ")[0]}. Sem
        burocracia.
      </p>
    </section>
  );
}
