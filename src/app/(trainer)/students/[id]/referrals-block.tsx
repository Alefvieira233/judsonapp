"use client";

import { useState, useTransition } from "react";
import { CheckIcon, GiftIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createReferralAction,
  deleteReferralAction,
  rewardReferralAction,
} from "../actions";

type StudentOption = { id: string; full_name: string };

type ReferralItem = {
  id: string;
  status: string;
  reward_label: string | null;
  rewarded_at: string | null;
  created_at: string | null;
  who: { id: string; full_name: string } | null;
};

export function ReferralsBlock({
  studentId,
  referrerOf, // pessoas que ESTA aluna indicou
  referredBy, // referral em que ELA é a referred (quem indicou ela)
  candidates, // outras alunas pra escolher como "indicada por"
}: {
  studentId: string;
  referrerOf: ReferralItem[];
  referredBy: ReferralItem | null;
  candidates: StudentOption[];
}) {
  const [adding, setAdding] = useState(false);
  const [referrerId, setReferrerId] = useState("");
  const [pending, startTransition] = useTransition();

  const [rewardingId, setRewardingId] = useState<string | null>(null);
  const [rewardLabel, setRewardLabel] = useState("");

  const onLinkReferrer = () => {
    if (!referrerId) return;
    startTransition(async () => {
      const res = await createReferralAction({
        referrer_id: referrerId,
        referred_id: studentId,
      });
      if (!res.ok) toast.error(res.error ?? "Falhou.");
      else {
        toast.success("Indicação registrada");
        setAdding(false);
        setReferrerId("");
      }
    });
  };

  const onReward = (referralId: string) => {
    if (!rewardLabel.trim()) {
      toast.error("Descreva o bônus.");
      return;
    }
    startTransition(async () => {
      const res = await rewardReferralAction({
        referral_id: referralId,
        reward_label: rewardLabel.trim(),
      });
      if (!res.ok) toast.error(res.error ?? "Falhou.");
      else {
        toast.success("Bonificada");
        setRewardingId(null);
        setRewardLabel("");
      }
    });
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5">
      <header className="flex items-center gap-2">
        <GiftIcon className="size-5 text-[var(--brand-primary)]" />
        <h2 className="font-display text-2xl">Indicações</h2>
      </header>

      {/* Indicada por */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Indicada por
        </Label>
        {referredBy ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3 text-sm">
            <span>
              <span className="text-foreground">
                {referredBy.who?.full_name ?? "Aluna"}
              </span>
              {referredBy.status === "rewarded" ? (
                <span className="ml-2 text-xs text-[var(--brand-primary)]">
                  · {referredBy.reward_label ?? "bonificada"}
                </span>
              ) : null}
            </span>
            <form action={deleteReferralAction}>
              <input type="hidden" name="id" value={referredBy.id} />
              <button
                type="submit"
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remover indicação"
              >
                <TrashIcon className="size-4" />
              </button>
            </form>
          </div>
        ) : adding ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3">
            <select
              value={referrerId}
              onChange={(e) => setReferrerId(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="">— Selecionar aluna —</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={onLinkReferrer}
                disabled={!referrerId || pending}
              >
                <CheckIcon className="size-3.5" /> Vincular
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAdding(false);
                  setReferrerId("");
                }}
              >
                <XIcon className="size-3.5" /> Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
          >
            <PlusIcon className="size-3.5" /> Vincular indicadora
          </button>
        )}
      </div>

      {/* Indicações que ela fez */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Indicou {referrerOf.length > 0 ? `(${referrerOf.length})` : ""}
        </Label>
        {referrerOf.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-background/30 p-3 text-xs text-muted-foreground">
            Ela ainda não indicou ninguém.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {referrerOf.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="truncate">
                    <span className="text-foreground">
                      {r.who?.full_name ?? "Aluna"}
                    </span>
                    {r.status === "rewarded" ? (
                      <span className="ml-2 text-xs text-[var(--brand-primary)]">
                        · {r.reward_label}
                      </span>
                    ) : (
                      <span className="ml-2 text-xs text-muted-foreground">
                        · {r.status === "active" ? "Ativa" : "Pendente"}
                      </span>
                    )}
                  </span>
                  <form action={deleteReferralAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remover"
                    >
                      <TrashIcon className="size-3.5" />
                    </button>
                  </form>
                </div>

                {r.status !== "rewarded" ? (
                  rewardingId === r.id ? (
                    <div className="flex gap-2">
                      <Input
                        autoFocus
                        value={rewardLabel}
                        onChange={(e) => setRewardLabel(e.target.value)}
                        placeholder="ex: 30 dias grátis"
                        className="h-9"
                      />
                      <Button size="sm" onClick={() => onReward(r.id)} disabled={pending}>
                        <CheckIcon className="size-3.5" /> Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setRewardingId(null);
                          setRewardLabel("");
                        }}
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setRewardingId(r.id);
                        setRewardLabel("");
                      }}
                      className="self-start text-xs text-[var(--brand-primary)] hover:underline"
                    >
                      Marcar como bonificada →
                    </button>
                  )
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
