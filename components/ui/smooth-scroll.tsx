"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useEffect } from "react";

export function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -72 }, autoRaf: true });
    return () => lenis.destroy();
  }, [reduce]);
  return null;
}
