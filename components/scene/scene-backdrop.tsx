"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { detectQuality, type Quality } from "./quality";
import { sceneStore } from "./scene-store";

const FieldCanvas = dynamic(() => import("./field-canvas"), { ssr: false });

/**
 * Fixed backdrop behind the whole story.
 * First paint is a still rendered from the real scene; the live canvas fades in over it once it draws.
 */
export function SceneBackdrop() {
  const reduced = useReducedMotion() ?? false;
  const [quality, setQuality] = useState<Quality | null>(null);
  const [poster, setPoster] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = detectQuality();
    if (q.tier === "none" || reduced) {
      setPoster(true);
      return;
    }
    // Let the page become interactive before pulling in three.js.
    const start = () => setQuality(q);
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (ric) ric(start, { timeout: 1200 });
    else setTimeout(start, 300);
  }, [reduced]);

  useEffect(() => {
    if (sceneStore.ready) {
      setReady(true);
      return;
    }
    const fn = () => setReady(true);
    sceneStore.readyListeners.add(fn);
    return () => {
      sceneStore.readyListeners.delete(fn);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      sceneStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneStore.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneStore.pointer.active = true;
      sceneStore.pointer.lastMove = performance.now();
    };
    const onLeave = () => {
      sceneStore.pointer.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b0e0c_0%,#0f1310_48%,#151815_62%,#0c0f0d_100%)]" />
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={reduced ? "/scene/poster-cultivated.webp" : "/scene/poster-wild.webp"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
        />
      )}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/scene/poster-wild.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </noscript>
      {quality && !reduced && (
        <div
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-out-expo)]"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <FieldCanvas quality={quality} reduced={reduced} />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,rgb(12_15_13/0.55)_100%)]" />
    </div>
  );
}
