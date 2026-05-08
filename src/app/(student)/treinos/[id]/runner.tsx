"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckIcon,
  CircleIcon,
  ClockIcon,
  MessageCircleIcon,
  PauseIcon,
  PlayIcon,
  Share2Icon,
  TimerIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ShareStoryDialog } from "@/components/share-story-dialog";
import { VideoEmbed } from "@/components/video-embed";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  cancelWorkoutAction,
  completeWorkoutAction,
  logSetAction,
  startWorkoutAction,
} from "./actions";

type RunnerBadge = {
  key: string;
  title: string;
  description: string;
  icon: string;
};

export type RunnerWorkout = {
  id: string;
  title: string;
  description: string | null;
};

export type RunnerItem = {
  id: string;
  position: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  load_suggestion: string | null;
  notes: string | null;
  mode: "reps" | "seconds";
  exercise_name: string;
  muscle_group: string | null;
  last_load: number | null;
  last_reps: number | null;
  video_url: string | null;
  video_thumbnail: string | null;
};

type SetState = {
  done: boolean;
  // For mode='reps' = reps; for mode='seconds' = segundos guardados.
  reps: string;
  load: string;
};

function makeKey(itemId: string, setNumber: number): string {
  return `${itemId}:${setNumber}`;
}

function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 },
    colors: ["#DC2626", "#FAFAFA", "#991B1B"],
    disableForReducedMotion: true,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { x: 0.2, y: 0.7 },
      colors: ["#DC2626", "#FAFAFA"],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { x: 0.8, y: 0.7 },
      colors: ["#DC2626", "#FAFAFA"],
      disableForReducedMotion: true,
    });
  }, 250);
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function WorkoutRunner({
  workout,
  items,
}: {
  workout: RunnerWorkout;
  items: RunnerItem[];
}) {
  const router = useRouter();
  const [logId, setLogId] = useState<string | null>(null);
  const [starting, startTransition] = useTransition();
  const [completing, completeTransition] = useTransition();
  const [completed, setCompleted] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [abortOpen, setAbortOpen] = useState(false);
  const [pendingBadges, setPendingBadges] = useState<RunnerBadge[]>([]);
  const [sets, setSets] = useState<Record<string, SetState>>(() => {
    const init: Record<string, SetState> = {};
    for (const item of items) {
      for (let n = 1; n <= item.sets; n++) {
        init[makeKey(item.id, n)] = {
          done: false,
          reps: item.last_reps?.toString() ?? "",
          load: item.last_load?.toString() ?? item.load_suggestion ?? "",
        };
      }
    }
    return init;
  });
  const [rest, setRest] = useState<{ secs: number; itemId: string } | null>(null);
  const [restPaused, setRestPaused] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Tick the elapsed timer every second while running.
  useEffect(() => {
    if (!logId || completed) return;
    const interval = window.setInterval(() => {
      if (startedAtRef.current === null) return;
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [logId, completed]);

  // Tick the rest timer every second.
  useEffect(() => {
    if (!rest || restPaused) return;
    const id = window.setInterval(() => {
      setRest((cur) => {
        if (!cur) return null;
        if (cur.secs <= 1) return null;
        return { ...cur, secs: cur.secs - 1 };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [rest, restPaused]);

  const totalSets = useMemo(
    () => items.reduce((acc, item) => acc + item.sets, 0),
    [items],
  );
  const doneSets = useMemo(
    () => Object.values(sets).filter((s) => s.done).length,
    [sets],
  );
  const allDone = totalSets > 0 && doneSets === totalSets;

  const handleStart = () => {
    startTransition(async () => {
      const res = await startWorkoutAction({ workout_id: workout.id });
      if (!res?.ok) {
        toast.error(res?.error ?? "Não consegui iniciar.");
        return;
      }
      setLogId(res.logId);
      startedAtRef.current = Date.now();
    });
  };

  const confirmAbort = () => {
    const id = logId;
    setAbortOpen(false);
    setLogId(null);
    startedAtRef.current = null;
    setElapsed(0);
    setRest(null);
    if (id) {
      // Fire-and-forget: the user is already navigating away. If the delete
      // fails, the log will sit as an orphan but a future `cancelWorkoutAction`
      // call will catch it.
      cancelWorkoutAction({ workout_log_id: id }).catch(() => {});
    }
    router.push("/home");
  };

  const updateSet = (key: string, patch: Partial<SetState>) => {
    setSets((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const toggleDone = async (item: RunnerItem, setNumber: number) => {
    if (!logId) return;
    const key = makeKey(item.id, setNumber);
    const current = sets[key];
    if (!current) return;

    const wasDone = current.done;
    const repsParsed = current.reps ? Number.parseInt(current.reps, 10) : null;
    const loadParsed = current.load ? Number.parseFloat(current.load) : null;

    // Optimistic flip.
    updateSet(key, { done: !wasDone });

    if (!wasDone) {
      const res = await logSetAction({
        workout_log_id: logId,
        workout_item_id: item.id,
        set_number: setNumber,
        reps_done: Number.isFinite(repsParsed) ? repsParsed : null,
        load_kg: Number.isFinite(loadParsed) ? loadParsed : null,
      });
      if (!res.ok) {
        updateSet(key, { done: false });
        toast.error(res.error ?? "Não consegui salvar.");
        return;
      }
      // Start rest timer for this exercise.
      setRest({ secs: item.rest_seconds, itemId: item.id });
      setRestPaused(false);
    }
  };

  const handleComplete = (data: {
    rpe: number | null;
    notes: string;
  }) => {
    if (!logId) return;
    completeTransition(async () => {
      const res = await completeWorkoutAction({
        workout_log_id: logId,
        duration_minutes:
          startedAtRef.current !== null
            ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 60000))
            : null,
        rpe: data.rpe,
        notes: data.notes.trim() ? data.notes.trim() : null,
      });
      if (!res.ok) {
        toast.error(res.error ?? "Não consegui concluir.");
        return;
      }
      setCompleteOpen(false);
      setCompleted(true);
      fireConfetti();
      if (res.newBadges.length > 0) {
        setPendingBadges(
          res.newBadges.map((b) => ({
            key: b.key,
            title: b.title,
            description: b.description,
            icon: b.icon,
          })),
        );
      }
    });
  };

  const dismissBadge = () => {
    setPendingBadges((prev) => prev.slice(1));
  };

  if (completed) {
    if (pendingBadges.length > 0) {
      const badge = pendingBadges[0];
      return <BadgeCelebration badge={badge} onContinue={dismissBadge} />;
    }
    return (
      <CompletedScreen
        title={workout.title}
        elapsedSecs={elapsed}
        doneSets={doneSets}
        logId={logId}
        onContinue={() => router.push("/home")}
      />
    );
  }

  const running = logId !== null;

  return (
    <>
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {running ? "Em execução" : "Treino"}
        </span>
        <div className="flex items-end justify-between gap-3">
          <h1 className="font-display text-3xl leading-tight">{workout.title}</h1>
          {running ? (
            <span className="flex items-center gap-1 rounded-md bg-card px-2 py-1 text-xs font-medium text-foreground">
              <ClockIcon className="size-3.5" /> {formatTime(elapsed)}
            </span>
          ) : null}
        </div>
        {workout.description ? (
          <p className="text-sm text-muted-foreground">{workout.description}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {doneSets}/{totalSets} séries · {items.length} exercícios
        </p>
        {running && totalSets > 0 ? (
          <div
            className="h-1.5 overflow-hidden rounded-full bg-card"
            role="progressbar"
            aria-valuenow={doneSets}
            aria-valuemax={totalSets}
            aria-valuemin={0}
            aria-label="Progresso do treino"
          >
            <div
              className="h-full bg-[var(--brand-primary)] transition-[width] duration-300 ease-out"
              style={{
                width: `${Math.round((doneSets / totalSets) * 100)}%`,
              }}
            />
          </div>
        ) : null}
      </header>

      {!running ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5">
          <p className="font-display text-xl">Pronta?</p>
          <p className="text-sm text-muted-foreground">
            Toca em iniciar pra começar a marcar as séries. Cada série salva
            automaticamente.
          </p>
          <Button size="lg" className="w-full" onClick={handleStart} disabled={starting}>
            {starting ? "Iniciando…" : "Iniciar treino"}
          </Button>
        </div>
      ) : null}

      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.muscle_group ?? "Exercício"}
                </span>
                <span className="font-display text-2xl leading-tight">
                  {item.exercise_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.sets}x {item.reps}
                  {item.load_suggestion ? ` · ${item.load_suggestion}` : ""}
                  {item.last_load
                    ? ` · última ${item.last_load}kg`
                    : ""}
                </span>
                {item.notes ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.notes}
                  </p>
                ) : null}
              </div>
            </div>

            {item.video_url ? (
              <div className="overflow-hidden rounded-xl border border-border bg-black">
                <div className="aspect-video w-full">
                  <VideoEmbed
                    url={item.video_url}
                    poster={item.video_thumbnail}
                  />
                </div>
              </div>
            ) : null}

            <ol className="flex flex-col gap-2">
              {Array.from({ length: item.sets }, (_, i) => i + 1).map((n) => {
                const key = makeKey(item.id, n);
                const state = sets[key];
                if (!state) return null;
                const targetSeconds = item.mode === "seconds"
                  ? parseTargetSeconds(item.reps)
                  : null;
                return (
                  <li key={key}>
                    {item.mode === "seconds" ? (
                      <TimedSetRow
                        setNumber={n}
                        state={state}
                        disabled={!running}
                        targetSeconds={targetSeconds}
                        onChangeSeconds={(v) => updateSet(key, { reps: v })}
                        onChangeLoad={(v) => updateSet(key, { load: v })}
                        onToggle={() => toggleDone(item, n)}
                      />
                    ) : (
                      <SetRow
                        setNumber={n}
                        state={state}
                        disabled={!running}
                        onChangeReps={(v) => updateSet(key, { reps: v })}
                        onChangeLoad={(v) => updateSet(key, { load: v })}
                        onToggle={() => toggleDone(item, n)}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ul>

      {running ? (
        <div className="sticky bottom-[calc(76px+env(safe-area-inset-bottom)+12px)] z-30 flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full"
            disabled={!allDone && doneSets === 0}
            onClick={() => setCompleteOpen(true)}
          >
            {allDone ? "Concluir treino" : `Concluir mesmo assim (${doneSets}/${totalSets})`}
          </Button>
          <button
            type="button"
            onClick={() => setAbortOpen(true)}
            className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Cancelar treino
          </button>
        </div>
      ) : null}

      <Dialog open={abortOpen} onOpenChange={setAbortOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar treino?</DialogTitle>
            <DialogDescription>
              Os registros que tu já marcou ficam salvos no histórico. Volta
              quando quiser.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setAbortOpen(false)}
            >
              Continuar treinando
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="w-full sm:w-auto"
              onClick={confirmAbort}
            >
              Sim, cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {rest ? (
        <RestOverlay
          secs={rest.secs}
          paused={restPaused}
          onSkip={() => setRest(null)}
          onTogglePause={() => setRestPaused((p) => !p)}
        />
      ) : null}

      <CompleteSheet
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        onSubmit={handleComplete}
        submitting={completing}
      />
    </>
  );
}

function SetRow({
  setNumber,
  state,
  disabled,
  onChangeReps,
  onChangeLoad,
  onToggle,
}: {
  setNumber: number;
  state: SetState;
  disabled: boolean;
  onChangeReps: (v: string) => void;
  onChangeLoad: (v: string) => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2 transition-colors",
        state.done && "border-[var(--brand-primary)]/60 bg-[var(--brand-primary)]/5",
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-md bg-card font-display text-base text-muted-foreground">
        {setNumber}
      </span>
      <Input
        inputMode="numeric"
        type="text"
        aria-label={`Reps série ${setNumber}`}
        placeholder="reps"
        value={state.reps}
        onChange={(e) => onChangeReps(e.target.value.replace(/[^0-9]/g, ""))}
        disabled={disabled || state.done}
        className="h-12 w-full max-w-[80px] text-center text-lg font-semibold tabular-nums"
      />
      <Input
        inputMode="decimal"
        type="text"
        aria-label={`Carga série ${setNumber}`}
        placeholder="kg"
        value={state.load}
        onChange={(e) => onChangeLoad(e.target.value.replace(/[^0-9.,]/g, "").replace(",", "."))}
        disabled={disabled || state.done}
        className="h-12 w-full max-w-[104px] text-center text-lg font-semibold tabular-nums"
      />
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={state.done ? "Desfazer série" : "Marcar série"}
        className={cn(
          "ml-auto grid size-12 shrink-0 place-items-center rounded-full transition-all active:scale-95",
          state.done
            ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/30"
            : "border border-border bg-card text-muted-foreground hover:border-[var(--brand-primary)] hover:text-foreground",
          disabled && "opacity-40",
        )}
      >
        {state.done ? <CheckIcon className="size-6" /> : <CircleIcon className="size-6" />}
      </button>
    </div>
  );
}

function RestOverlay({
  secs,
  paused,
  onSkip,
  onTogglePause,
}: {
  secs: number;
  paused: boolean;
  onSkip: () => void;
  onTogglePause: () => void;
}) {
  return (
    <div className="fixed inset-x-3 bottom-[calc(140px+env(safe-area-inset-bottom))] z-40 flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-primary)] text-white">
        <TimerIcon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Descanso
        </span>
        <span className="font-display text-2xl leading-none">
          {formatTime(secs)}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={onTogglePause}
          aria-label={paused ? "Retomar" : "Pausar"}
          className="grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
        </button>
        <button
          type="button"
          onClick={onSkip}
          aria-label="Pular descanso"
          className="grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

function CompleteSheet({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: { rpe: number | null; notes: string }) => void;
  submitting: boolean;
}) {
  const [rpe, setRpe] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Concluir treino</SheetTitle>
          <SheetDescription>
            Última pergunta antes do confete: como tu te sentiu?
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-4">
          <div className="flex flex-col gap-2">
            <Label>Esforço (RPE 1-10, opcional)</Label>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRpe(rpe === n ? null : n)}
                  className={cn(
                    "grid h-10 place-items-center rounded-md border border-border text-sm font-medium transition-colors",
                    rpe === n
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                      : "bg-background text-muted-foreground hover:bg-card",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              1 = leve · 5 = pesado · 10 = beirando o limite
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="O que tu queira lembrar pra próxima."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => onSubmit({ rpe, notes })}
            disabled={submitting}
          >
            {submitting ? "Salvando…" : "Concluir"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CompletedScreen({
  title,
  elapsedSecs,
  doneSets,
  logId,
  onContinue,
}: {
  title: string;
  elapsedSecs: number;
  doneSets: number;
  logId: string | null;
  onContinue: () => void;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const shareUrl = logId ? `/api/og/story/workout?logId=${logId}` : null;
  const shareText = `Mais um treino fechado 💪 — ${title}`;

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Concluído
      </span>
      <h1 className="font-display text-5xl leading-[0.9]">Bom trabalho</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {title} fechado em {formatTime(elapsedSecs)}, {doneSets} série
        {doneSets === 1 ? "" : "s"} marcada{doneSets === 1 ? "" : "s"}.
      </p>
      <div className="flex w-full max-w-sm flex-col gap-2">
        {shareUrl ? (
          <Button
            size="lg"
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShareOpen(true)}
          >
            <Share2Icon className="size-4" /> Compartilhar conquista
          </Button>
        ) : null}
        <Button size="lg" className="w-full" onClick={onContinue}>
          Voltar para o início
        </Button>
      </div>
      {shareUrl ? (
        <ShareStoryDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          imageUrl={shareUrl}
          title={title}
          text={shareText}
          filename={`treino-${logId}.png`}
        />
      ) : null}
    </section>
  );
}

// "30s", "30-45 segundos", "1min" → segundos. Defaulta pra 30 se não der parse.
function parseTargetSeconds(reps: string): number {
  const t = reps.trim().toLowerCase();
  const minMatch = t.match(/(\d+)\s*(?:min|m)\b/);
  if (minMatch) return Math.max(1, parseInt(minMatch[1]!, 10) * 60);
  const secMatch = t.match(/(\d+)/);
  if (secMatch) return Math.max(1, parseInt(secMatch[1]!, 10));
  return 30;
}

function TimedSetRow({
  setNumber,
  state,
  disabled,
  targetSeconds,
  onChangeSeconds,
  onChangeLoad,
  onToggle,
}: {
  setNumber: number;
  state: SetState;
  disabled: boolean;
  targetSeconds: number | null;
  onChangeSeconds: (v: string) => void;
  onChangeLoad: (v: string) => void;
  onToggle: () => void;
}) {
  const target = targetSeconds ?? 30;
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(target);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((cur) => {
        if (cur <= 1) {
          window.clearInterval(id);
          // Beep-ish: vibration on supported devices.
          if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate?.(200);
          }
          setRunning(false);
          startedAtRef.current = null;
          onChangeSeconds(target.toString());
          return 0;
        }
        return cur - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, target, onChangeSeconds]);

  const start = () => {
    if (disabled || state.done) return;
    setRunning(true);
    setRemaining(target);
    startedAtRef.current = Date.now();
  };

  const stop = () => {
    if (!running) return;
    const elapsed = startedAtRef.current
      ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
      : target - remaining;
    setRunning(false);
    startedAtRef.current = null;
    onChangeSeconds(elapsed.toString());
    setRemaining(target);
  };

  const display = running ? remaining : state.reps ? Number(state.reps) : target;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2 transition-colors",
        state.done && "border-[var(--brand-primary)]/60 bg-[var(--brand-primary)]/5",
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-md bg-card font-display text-base text-muted-foreground">
        {setNumber}
      </span>
      <button
        type="button"
        onClick={running ? stop : start}
        disabled={disabled || state.done}
        className={cn(
          "flex h-12 flex-1 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors",
          running
            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-foreground"
            : "border-border bg-card text-muted-foreground hover:text-foreground",
          (disabled || state.done) && "opacity-60",
        )}
      >
        <TimerIcon className="size-4" />
        <span className="font-display text-xl tabular-nums">
          {formatTime(display)}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em]">
          {running ? "parar" : state.done ? "feito" : "iniciar"}
        </span>
      </button>
      <Input
        inputMode="decimal"
        type="text"
        aria-label={`Carga série ${setNumber}`}
        placeholder="kg"
        value={state.load}
        onChange={(e) =>
          onChangeLoad(
            e.target.value.replace(/[^0-9.,]/g, "").replace(",", "."),
          )
        }
        disabled={disabled || state.done}
        className="h-12 w-full max-w-[88px] text-center text-lg font-semibold tabular-nums"
      />
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={state.done ? "Desfazer série" : "Marcar série"}
        className={cn(
          "ml-auto grid size-12 shrink-0 place-items-center rounded-full transition-all active:scale-95",
          state.done
            ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary)]/30"
            : "border border-border bg-card text-muted-foreground hover:border-[var(--brand-primary)] hover:text-foreground",
          disabled && "opacity-40",
        )}
      >
        {state.done ? <CheckIcon className="size-6" /> : <CircleIcon className="size-6" />}
      </button>
    </div>
  );
}

function BadgeCelebration({
  badge,
  onContinue,
}: {
  badge: RunnerBadge;
  onContinue: () => void;
}) {
  const shareText = `Acabei de desbloquear "${badge.title}" no app do Judson Lobato 🔥`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={badge.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-[var(--brand-primary)]">
          Conquista desbloqueada
        </span>
        <motion.div
          initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="grid size-40 place-items-center rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-strong,#991B1B)] text-7xl shadow-xl shadow-[var(--brand-primary)]/40"
          aria-hidden
        >
          {badge.icon}
        </motion.div>
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="font-display text-4xl leading-[0.95]">{badge.title}</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            {badge.description}
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex w-full max-w-sm flex-col gap-2"
        >
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-medium transition-colors hover:bg-card/70",
            )}
          >
            <MessageCircleIcon className="size-4" /> Compartilhar no WhatsApp
          </a>
          <Button size="lg" className="w-full" onClick={onContinue}>
            Continuar
          </Button>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}
