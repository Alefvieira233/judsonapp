"use client";

import { motion } from "framer-motion";

export type HeroStreakProps = {
  greeting: string;
  firstName: string;
  streak: number;
};

export function HeroStreak({ greeting, firstName, streak }: HeroStreakProps) {
  const hot = streak >= 3;
  const label = streak === 1 ? "DIA" : "DIAS";

  return (
    <div className="relative flex flex-col items-center gap-2 py-2 text-center">
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="text-base text-muted-foreground md:text-lg"
      >
        {greeting}, <span className="text-foreground">{firstName}</span>
      </motion.span>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.08 }}
        className="flex flex-col items-center"
      >
        <span
          className={[
            "font-display text-7xl leading-none tabular-nums md:text-8xl",
            hot ? "text-[var(--brand-primary)]" : "text-foreground",
          ].join(" ")}
        >
          {streak}
        </span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
          {streak === 0 ? "COMECE HOJE" : label + " SEGUIDOS"}
        </span>
      </motion.div>
    </div>
  );
}
