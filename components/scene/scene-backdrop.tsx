"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { detectQuality, type Quality } from "./quality";
import { sceneStore, storyStage } from "./scene-store";
import { WorldLabels } from "./world-labels";
import { sample } from "./keys";

const FieldCanvas = dynamic(() => import("./field-canvas"), { ssr: false });

/** Per-beat stills, rendered from the real scene, for no-WebGL / Save-Data / reduced motion on weak devices. */
const POSTERS = ["wild", "combed", "split", "combed", "combed", "survey", "lots", "lots", "own", "own"];
const posterFor = (stage: number) => `/scene/poster-${POSTERS[Math.max(0, Math.min(9, Math.round(stage)))]}.webp`;

export function SceneBackdrop() {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const reduced = mounted && !!prefersReduced;
  const [quality, setQuality] = useState<Quality | null>(null);
  const [mode, setMode] = useState<"pending" | "live" | "poster">("pending");
  const [ready, setReady] = useState(false);
  const [posters, setPosters] = useState<{ a: string; b: string; showB: boolean }>({
    a: posterFor(0),
    b: posterFor(0),
    showB: false,
  });
  const cutRef = useRef<HTMLDivElement>(null);
  const lastPoster = useRef(posterFor(0));
  const lastStage = useRef(0);

  useEffect(() => {
    setMounted(true);
    // Test hook for pacing checks (?debug=1 only).
    if (new URLSearchParams(window.location.search).has("debug"))
      (window as unknown as { __eden: unknown }).__eden = {
        store: sceneStore,
        stage: () => storyStage(sceneStore.progress),
        sample: (st: number, m: boolean, l: boolean) => sample(st, m, l, window.innerWidth, window.innerHeight),
      };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const q = detectQuality();
    const usePoster = q.tier === "none" || (reduced && q.tier === "low");
    if (usePoster) {
      setMode("poster");
      return;
    }
    setMode("live");
    const start = () => setQuality(q);
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (ric) ric(start, { timeout: 1200 });
    else setTimeout(start, 300);
  }, [mounted, reduced]);

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

  // Mobile flag for the scene and the labels layer.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => (sceneStore.mobile = mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Stage changes: crossfade posters, or dip the canvas on reduced-motion camera cuts.
  useEffect(() => {
    const onChange = () => {
      const st = Math.round(storyStage(sceneStore.progress));
      if (mode === "poster") {
        const next = posterFor(st);
        if (next !== lastPoster.current) {
          lastPoster.current = next;
          setPosters((p) => (p.showB ? { a: next, b: p.b, showB: false } : { a: p.a, b: next, showB: true }));
        }
      } else if (reduced && st !== lastStage.current && cutRef.current) {
        const el = cutRef.current;
        el.style.transition = "none";
        el.style.opacity = "0.5";
        requestAnimationFrame(() => {
          el.style.transition = "opacity 300ms cubic-bezier(0.16,1,0.3,1)";
          el.style.opacity = "1";
        });
      }
      lastStage.current = st;
    };
    sceneStore.listeners.add(onChange);
    return () => {
      sceneStore.listeners.delete(onChange);
    };
  }, [mode, reduced]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
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
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink" data-scene={mode}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b0e0c_0%,#0f1310_48%,#151815_62%,#0c0f0d_100%)]" />
        {mode === "poster" && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posters.a}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[400ms]"
              style={{ opacity: posters.showB ? 0 : 1 }}
              decoding="async"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posters.b}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[400ms]"
              style={{ opacity: posters.showB ? 1 : 0 }}
              decoding="async"
            />
          </>
        )}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/scene/poster-combed.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        </noscript>
        {quality && mode === "live" && (
          <div
            ref={cutRef}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-out-expo)]"
            style={{ opacity: ready ? 1 : 0 }}
          >
            <FieldCanvas quality={quality} reduced={reduced} />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,rgb(12_15_13/0.55)_100%)]" />
      </div>
      {mode === "live" && <WorldLabels />}
    </>
  );
}
