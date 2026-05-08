"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type BarChartProps = {
  data: Array<{ label: string; value: number }>;
  maxValue?: number;
  height?: number;
  color?: string;
  className?: string;
  ariaLabel?: string;
};

const VIEWBOX_W = 320;
const VIEWBOX_H = 160;
const PAD_X = 8;
const PAD_TOP = 18;
const PAD_BOTTOM = 22;

export function BarChart({
  data,
  maxValue,
  height = VIEWBOX_H,
  color = "var(--brand-primary)",
  className,
  ariaLabel,
}: BarChartProps) {
  const max = Math.max(maxValue ?? 0, ...data.map((d) => d.value), 1);
  const innerW = VIEWBOX_W - PAD_X * 2;
  const innerH = VIEWBOX_H - PAD_TOP - PAD_BOTTOM;
  const slot = data.length === 0 ? innerW : innerW / data.length;
  const barW = Math.min(slot * 0.6, 36);

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        height={height}
        role="img"
        aria-label={
          ariaLabel ??
          `Gráfico de barras: ${data
            .map((d) => `${d.label} ${d.value}`)
            .join(", ")}`
        }
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const ratio = d.value / max;
          const h = Math.max(ratio * innerH, d.value > 0 ? 2 : 0);
          const x = PAD_X + slot * i + (slot - barW) / 2;
          const y = PAD_TOP + (innerH - h);
          return (
            <g key={`${d.label}-${i}`}>
              {d.value > 0 ? (
                <motion.text
                  x={x + barW / 2}
                  y={y - 4}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 10, fontVariantNumeric: "tabular-nums" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i + 0.25, duration: 0.2 }}
                >
                  {d.value}
                </motion.text>
              ) : null}
              <motion.rect
                x={x}
                width={barW}
                rx={3}
                ry={3}
                fill={color}
                initial={{ height: 0, y: PAD_TOP + innerH }}
                animate={{ height: h, y }}
                transition={{
                  delay: 0.05 * i,
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <text
                x={x + barW / 2}
                y={VIEWBOX_H - 6}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 10 }}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
