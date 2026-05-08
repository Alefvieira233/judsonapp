import {
  ActivityIcon,
  AnchorIcon,
  DumbbellIcon,
  HeartPulseIcon,
  MountainIcon,
  TargetIcon,
  WindIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type MuscleGroupKey =
  | "peito"
  | "costas"
  | "perna"
  | "ombro"
  | "braco"
  | "core"
  | "cardio"
  | "flexibilidade"
  | "funcional"
  | "default";

const MUSCLE_ICON: Record<MuscleGroupKey, LucideIcon> = {
  peito: DumbbellIcon,
  costas: MountainIcon,
  perna: ZapIcon,
  ombro: AnchorIcon,
  braco: DumbbellIcon,
  core: TargetIcon,
  cardio: HeartPulseIcon,
  flexibilidade: WindIcon,
  funcional: ActivityIcon,
  default: DumbbellIcon,
};

/**
 * Normalizes Portuguese/Spanish/English muscle group strings to a canonical
 * key. Keep this map mirrored with `MUSCLE_ICON` and `MUSCLE_TONE`.
 */
const COMBINING_MARKS = /[̀-ͯ]/g;

export function resolveMuscleKey(
  muscleGroup?: string | null,
  equipment?: string | null,
): MuscleGroupKey {
  const raw = `${muscleGroup ?? ""} ${equipment ?? ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "");
  if (!raw.trim()) return "default";

  if (/(peito|chest|peitoral|pecho)/.test(raw)) return "peito";
  if (/(costas|dorsal|back|espalda|trapez|lats|latissimo)/.test(raw)) return "costas";
  if (
    /(perna|quadricep|posterior|gluteo|panturrilha|leg|quad|hamstring|calf|pierna)/.test(
      raw,
    )
  )
    return "perna";
  if (/(ombro|deltoide|shoulder|hombro)/.test(raw)) return "ombro";
  if (/(biceps|triceps|antebra|braco|arm|brazo|forearm)/.test(raw)) return "braco";
  if (/(core|abdom|oblicu|abs|abdominal|plank)/.test(raw)) return "core";
  if (/(cardio|hiit|corrida|running|aerobic|aeroba|run|bike|esteira)/.test(raw))
    return "cardio";
  if (/(mobil|alongament|flex|stretch|yoga|movilidad)/.test(raw))
    return "flexibilidade";
  if (/(funcional|functional|crossfit|metcon)/.test(raw)) return "funcional";

  return "default";
}

/**
 * Color tone hint per muscle key. Components can call this to pick subtle
 * gradient backgrounds while keeping the foreground brand-red.
 */
export const MUSCLE_TONE: Record<MuscleGroupKey, string> = {
  peito: "from-rose-500/15 via-card/40 to-card/20",
  costas: "from-amber-500/12 via-card/40 to-card/20",
  perna: "from-emerald-500/12 via-card/40 to-card/20",
  ombro: "from-sky-500/12 via-card/40 to-card/20",
  braco: "from-orange-500/15 via-card/40 to-card/20",
  core: "from-violet-500/12 via-card/40 to-card/20",
  cardio: "from-[var(--brand-primary)]/18 via-card/40 to-card/20",
  flexibilidade: "from-teal-400/12 via-card/40 to-card/20",
  funcional: "from-yellow-400/12 via-card/40 to-card/20",
  default: "from-card/60 via-card/40 to-card/20",
};

export type ExerciseIconProps = {
  muscleGroup?: string | null;
  equipment?: string | null;
  size?: number;
  className?: string;
};

export function ExerciseIcon({
  muscleGroup,
  equipment,
  size = 5,
  className,
}: ExerciseIconProps) {
  const key = resolveMuscleKey(muscleGroup, equipment);
  const Icon = MUSCLE_ICON[key];
  return (
    <Icon
      aria-hidden
      className={cn(
        "text-[var(--brand-primary)]",
        sizeClass(size),
        className,
      )}
    />
  );
}

export function muscleToneClass(
  muscleGroup?: string | null,
  equipment?: string | null,
): string {
  return MUSCLE_TONE[resolveMuscleKey(muscleGroup, equipment)];
}

// Tailwind needs literal class names — map common sizes here.
function sizeClass(size: number): string {
  switch (size) {
    case 3:
      return "size-3";
    case 4:
      return "size-4";
    case 5:
      return "size-5";
    case 6:
      return "size-6";
    case 7:
      return "size-7";
    case 8:
      return "size-8";
    case 9:
      return "size-9";
    case 10:
      return "size-10";
    case 12:
      return "size-12";
    default:
      return "size-5";
  }
}
