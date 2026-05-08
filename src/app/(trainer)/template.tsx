"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function TrainerTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}
