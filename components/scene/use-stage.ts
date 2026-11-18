"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import type { RefObject } from "react";
import { progressChanged, sceneStore, type StoryKey } from "./scene-store";

/**
 * Reports a section's scroll progress to the scene.
 * "pinned" sections measure while their top is at the viewport top; others measure entry to exit.
 */
export function useStage(key: StoryKey, ref: RefObject<HTMLElement | null>, mode: "pinned" | "flow" = "flow") {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: mode === "pinned" ? ["start start", "end end"] : ["start end", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    sceneStore.progress[key] = v;
    progressChanged();
  });
  return scrollYProgress;
}
