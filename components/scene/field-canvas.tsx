"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Field } from "./field";
import type { Quality } from "./quality";
import { sceneStore } from "./scene-store";

/**
 * Drives rendering on demand:
 * - normal: every animation frame, or every 250ms when the scene is at rest; paused when the tab is hidden.
 * - reduced motion: only when something changes (stage, cart, toggles, stepper, resize).
 */
function Ticker({ reduced }: { reduced: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (reduced) {
      // A few frames per change so damped values settle on their targets.
      const burst = () => {
        let n = 0;
        const step = () => {
          invalidate();
          if (++n < 4) requestAnimationFrame(step);
        };
        step();
      };
      burst();
      sceneStore.listeners.add(burst);
      window.addEventListener("resize", burst);
      return () => {
        sceneStore.listeners.delete(burst);
        window.removeEventListener("resize", burst);
      };
    }
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (sceneStore.throttle && t - last < 250) return;
      last = t;
      invalidate();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, reduced]);
  return null;
}

export default function FieldCanvas({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  return (
    <Canvas
      flat
      linear
      frameloop="demand"
      dpr={quality.dpr}
      gl={{ antialias: quality.tier !== "low", powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 42, near: 0.1, far: 900, position: [-5.5, 1.7, 14.5] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
      tabIndex={-1}
    >
      <Ticker reduced={reduced} />
      <Field blades={quality.blades} reduced={reduced} tier={quality.tier} />
    </Canvas>
  );
}
