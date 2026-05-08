"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type LinePoint = { label: string; value: number };

export type LineChartProps = {
  points: LinePoint[];
  height?: number;
  color?: string;
  area?: boolean;
  className?: string;
  ariaLabel?: string;
  showAxis?: boolean;
};

const VIEWBOX_W = 320;
const VIEWBOX_H = 160;
const PAD_L = 8;
const PAD_R = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 22;

export function LineChart({
  points,
  height = VIEWBOX_H,
  color = "var(--brand-primary)",
  area = false,
  className,
  ariaLabel,
  showAxis = true,
}: LineChartProps) {
  const uid = useId();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const max = Math.max(1, ...points.map((p) => p.value));
  const innerW = VIEWBOX_W - PAD_L - PAD_R;
  const innerH = VIEWBOX_H - PAD_TOP - PAD_BOTTOM;

  const coords = useMemo(() => {
    if (points.length === 0) return [] as Array<{ x: number; y: number }>;
    if (points.length === 1) {
      return [
        {
          x: PAD_L + innerW / 2,
          y: PAD_TOP + innerH - (points[0]!.value / max) * innerH,
        },
      ];
    }
    return points.map((p, i) => ({
      x: PAD_L + (i / (points.length - 1)) * innerW,
      y: PAD_TOP + innerH - (p.value / max) * innerH,
    }));
  }, [points, max, innerW, innerH]);

  const linePath =
    coords.length === 0
      ? ""
      : "M " + coords.map((c) => `${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(" L ");

  const areaPath =
    coords.length === 0
      ? ""
      : `${linePath} L ${coords[coords.length - 1]!.x.toFixed(2)} ${
          PAD_TOP + innerH
        } L ${coords[0]!.x.toFixed(2)} ${PAD_TOP + innerH} Z`;

  const gradId = `line-grad-${uid}`;
  const empty = points.length === 0 || max === 0;
  const active = hoverIdx != null ? coords[hoverIdx] : null;
  const activePoint = hoverIdx != null ? points[hoverIdx] : null;

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        height={height}
        role="img"
        aria-label={
          ariaLabel ??
          `Gráfico de linha: ${points
            .map((p) => `${p.label} ${p.value}`)
            .join(", ")}`
        }
        preserveAspectRatio="none"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {showAxis && !empty ? (
          <text
            x={PAD_L}
            y={PAD_TOP - 4}
            className="fill-muted-foreground"
            style={{ fontSize: 10, fontVariantNumeric: "tabular-nums" }}
          >
            {max}
          </text>
        ) : null}

        {area && !empty ? (
          <motion.path
            d={areaPath}
            fill={`url(#${gradId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ) : null}

        {!empty ? (
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}

        {!empty &&
          coords.map((c, i) => (
            <g key={`pt-${i}`}>
              <rect
                x={c.x - 12}
                y={PAD_TOP}
                width={24}
                height={innerH + 6}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
              />
              <motion.circle
                cx={c.x}
                cy={c.y}
                r={hoverIdx === i ? 4 : 2.5}
                fill={color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.2 }}
              />
            </g>
          ))}

        {active ? (
          <line
            x1={active.x}
            x2={active.x}
            y1={PAD_TOP}
            y2={PAD_TOP + innerH}
            stroke={color}
            strokeOpacity={0.3}
            strokeDasharray="3 3"
          />
        ) : null}

        {showAxis &&
          !empty &&
          points.map((p, i) => {
            if (points.length > 6 && i % Math.ceil(points.length / 6) !== 0)
              return null;
            const c = coords[i]!;
            return (
              <text
                key={`label-${i}`}
                x={c.x}
                y={VIEWBOX_H - 6}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 10 }}
              >
                {p.label}
              </text>
            );
          })}
      </svg>

      {active && activePoint ? (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md border border-border bg-card/95 px-2 py-1 text-[10px] shadow-md"
          style={{
            left: `${(active.x / VIEWBOX_W) * 100}%`,
            top: `${(active.y / VIEWBOX_H) * 100}%`,
          }}
        >
          <span className="font-medium tabular-nums text-foreground">
            {activePoint.value}
          </span>
          <span className="ml-1 text-muted-foreground">{activePoint.label}</span>
        </div>
      ) : null}
    </div>
  );
}
