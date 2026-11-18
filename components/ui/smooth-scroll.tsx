"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useEffect } from "react";

export function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    // Lower lerp = more inertia; a slightly reduced wheel step keeps each flick from skipping a beat.
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85, anchors: { offset: -72 }, autoRaf: true });
    return () => lenis.destroy();
  }, [reduce]);
  return null;
}
