"use client";

import { useActionState, useTransition } from "react";

import { toggleLeaderboardOptInAction, type ToggleLeaderboardState } from "./actions";

type Props = {
  initialShare: boolean;
};

export function LeaderboardOptToggle({ initialShare }: Props) {
  const [state, formAction] = useActionState<ToggleLeaderboardState, FormData>(
    toggleLeaderboardOptInAction,
    undefined,
  );
  const [pending, startTransition] = useTransition();

  const checked = state?.ok ? state.share : initialShare;

  return (
    <form
      action={formAction}
      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 px-4 py-3"
    >
      <div className="flex flex-col">
        <span className="font-display text-base">Aparecer no ranking</span>
        <span className="text-xs text-muted-foreground">
          {checked
            ? "Tu apareces na lista pública da equipe."
            : "Tu fica fora do ranking. Pode reativar quando quiser."}
        </span>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          name="share"
          defaultChecked={initialShare}
          disabled={pending}
          onChange={(e) => {
            const fd = new FormData();
            fd.set("share", e.currentTarget.checked ? "on" : "off");
            startTransition(() => formAction(fd));
          }}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="block h-6 w-11 rounded-full border border-border bg-card transition-colors peer-checked:bg-[var(--brand-primary)] peer-checked:border-[var(--brand-primary)] peer-disabled:opacity-50"
        />
        <span
          aria-hidden
          className="absolute left-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-background shadow transition-transform peer-checked:translate-x-5"
        />
      </label>
    </form>
  );
}
