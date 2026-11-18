"use client";

import { useRef, type ReactNode } from "react";
import type { StoryKey } from "./scene-store";
import { useStage } from "./use-stage";

export function StageSection({
  stage,
  mode = "flow",
  id,
  className,
  children,
  labelledBy,
}: {
  stage: StoryKey;
  mode?: "flow" | "pinned";
  id?: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useStage(stage, ref, mode);
  return (
    <section ref={ref} id={id} className={className} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
