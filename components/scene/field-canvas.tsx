"use client";

import { Canvas } from "@react-three/fiber";
import { Field } from "./field";
import type { Quality } from "./quality";

export default function FieldCanvas({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  return (
    <Canvas
      flat
      linear
      dpr={quality.dpr}
      gl={{ antialias: quality.tier !== "low", powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 42, near: 0.1, far: 900, position: [-5.5, 1.45, 15.5] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
      tabIndex={-1}
    >
      <Field blades={quality.blades} reduced={reduced} />
    </Canvas>
  );
}
