"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type DonutSegment = {
  label: string;
  value: number;
  color?: string;
};

export type DonutChartProps = {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
  ariaLabel?: string;
};

const FALLBACK_COLORS = [
  "var(--brand-primary)",
  "rgba(220, 38, 38, 0.7)",
  "rgba(148, 163, 184, 0.9)",
  "rgba(148, 163, 184, 0.6)",
  "rgba(148, 163, 184, 0.4)",
  "rgba(148, 163, 184, 0.25)",
];

function pickColor(seg: DonutSegment, idx: number): string {
  return seg.color ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length] ?? FALLBACK_COLORS[0]!;
}

export function DonutChart({
  segments,
  size = 160,
  thickness = 18,
  centerLabel,
  centerValue,
  className,
  ariaLabel,
}: DonutChartProps) {
  const uid = useId();
  const [hover, setHover] = useState<number | null>(null);

  const total = segments.reduce((acc, s) => acc + Math.max(s.value, 0), 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const arcs = segments.reduce<
    Array<{
      seg: DonutSegment;
      idx: number;
      length: number;
      offset: number;
      color: string;
      pct: number;
    }>
  >((acc, seg, i) => {
    const value = Math.max(seg.value, 0);
    const ratio = total > 0 ? value / total : 0;
    const length = ratio * circumference;
    const offset = acc.length === 0 ? 0 : acc[acc.length - 1]!.offset + acc[acc.length - 1]!.length;
    acc.push({
      seg,
      idx: i,
      length,
      offset,
      color: pickColor(seg, i),
      pct: ratio,
    });
    return acc;
  }, []);

  const empty = total === 0;

  return (
    <div
      className={cn("flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5", className)}
      role="img"
      aria-label={
        ariaLabel ??
        (empty
          ? "Sem dados"
          : `Distribuição: ${segments
              .map((s) => `${s.label} ${s.value}`)
              .join(", ")}`)
      }
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth={thickness}
          />
          {!empty &&
            arcs.map((a) => (
              <motion.circle
                key={`${uid}-${a.idx}`}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={a.color}
                strokeWidth={thickness}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeDasharray={`${a.length} ${circumference - a.length}`}
                initial={{ strokeDashoffset: -circumference, opacity: 0.6 }}
                animate={{ strokeDashoffset: -a.offset, opacity: 1 }}
                transition={{
                  delay: 0.05 * a.idx,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  filter: hover === a.idx ? "brightness(1.15)" : undefined,
                  cursor: "default",
                }}
                onMouseEnter={() => setHover(a.idx)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-2xl leading-none tabular-nums">
            {centerValue ?? (empty ? "—" : total.toString())}
          </span>
          {centerLabel ? (
            <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {centerLabel}
            </span>
          ) : null}
        </div>
      </div>

      <ul className="flex w-full flex-col gap-1.5 text-xs sm:max-w-[180px]">
        {segments.map((seg, i) => {
          const arc = arcs[i]!;
          const isActive = hover === i;
          return (
            <li
              key={`${uid}-legend-${i}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md px-1.5 py-1 transition-colors",
                isActive ? "bg-card/60" : "bg-transparent",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: arc.color }}
                />
                <span className="truncate text-foreground">{seg.label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {seg.value}
                {total > 0 ? (
                  <span className="ml-1 text-[10px]">
                    {Math.round(arc.pct * 100)}%
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
