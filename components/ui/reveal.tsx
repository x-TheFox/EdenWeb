"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Section reveal: y 16px + opacity, 700ms expo-out. Reduced motion: opacity only. No blur (costly over WebGL). */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y = 16,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "h2" | "h3";
  y?: number;
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        reduce
          ? { opacity: { duration: 0.3, delay }, y: { duration: 0 } }
          : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </M>
  );
}
