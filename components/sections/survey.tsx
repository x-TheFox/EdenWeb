"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { sceneStore } from "@/components/scene/scene-store";
import { useStage } from "@/components/scene/use-stage";
import { FINDINGS } from "@/lib/findings";
import { StepHead } from "./step-head";

const clockCount = (p: number) => {
  const d = Math.min(1, Math.max(0, (p - 0.15) / 0.75));
  let n = 0;
  for (let i = 0; i < 8; i++) if (d > 0.06 + i * 0.11) n++;
  return n;
};

/** B5: the audit is a search, and it produces a concrete, countable list. */
export function Survey() {
  const ref = useRef<HTMLElement>(null);
  const progress = useStage("survey", ref, "pinned");
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && !!prefersReduced;

  const [count, setCount] = useState(0);
  const target = useRef(0);
  const lastUpdate = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Counter: the scene reports lens finds; the scroll clock is the floor (and the whole story without WebGL).
  const push = (n: number) => {
    target.current = n;
    const now = performance.now();
    const wait = Math.max(0, 600 - (now - lastUpdate.current));
    if (timer.current) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      lastUpdate.current = performance.now();
      setCount(target.current);
    }, wait);
  };
  useMotionValueEvent(progress, "change", (p) => push(Math.max(clockCount(p), sceneStore.ready ? sceneStore.foundCount : 0)));
  useEffect(() => {
    const on = (e: Event) => push(Math.max((e as CustomEvent<number>).detail, clockCount(progress.get())));
    window.addEventListener("eden:found", on);
    return () => {
      window.removeEventListener("eden:found", on);
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = reduce ? 8 : count;

  return (
    <section ref={ref} id="step-survey" aria-labelledby="survey-title" className="relative h-[180vh] md:h-[200vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="scrim-t pointer-events-none absolute inset-x-0 top-0 h-[60%] md:hidden" />
        <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] md:block" />
        <div className="shell relative pt-[88px] md:pt-[20vh]">
          <div data-copy className="max-w-[34rem]">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="annot text-moss">2 of 5. Survey</p>
              <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.72rem] text-moss">
                Example audit. Fictional company.
              </span>
            </div>
            <h3 id="survey-title" className="h2 mt-4 text-[clamp(1.9rem,3.4vw,3rem)] text-bone">
              We study the ground before we build on it.
            </h3>
            <p className="lede mt-5 hidden sm:block">
              Under NDA we interview your staff, study your industry and competitors, map where the work gets stuck,
              and work out what would most move speed and revenue.
            </p>
            <p className="lede mt-4 sm:hidden">Under NDA we interview your staff and map where the work gets stuck.</p>

            <div className="mt-6 flex items-center gap-4">
              <p aria-live="polite" className="font-mono text-[0.875rem] leading-[1.3em] tabular text-bone">
                Found{" "}
                <span className="relative inline-block h-[1.3em] w-[1ch] overflow-hidden align-top">
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                      key={shown}
                      className="absolute left-0 top-0 leading-[1.3em]"
                      initial={reduce ? false : { y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { y: -8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {shown}
                    </motion.span>
                  </AnimatePresence>
                </span>{" "}
                of 8
              </p>
              <span aria-hidden className="flex gap-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <span
                    key={i}
                    className={`block h-[3px] w-3 rounded-full transition-colors duration-300 ${i < shown ? "bg-survey" : "bg-line-strong"}`}
                  />
                ))}
              </span>
            </div>
            <p className="annot mt-3 hidden text-moss md:block">Move the lens to find them faster.</p>
            <p className="mt-6 border-l border-survey/70 pl-4 text-[0.95rem] text-bone">
              The audit carries a deposit, credited in full to whatever you build.
            </p>
            <ol className="poster-only mt-6 hidden gap-1.5 font-mono text-[0.78rem] text-bone-dim">
              {FINDINGS.map((f, i) => (
                <li key={f}>
                  MF-0{i + 1}  {f}
                </li>
              ))}
            </ol>
            <ol className="sr-only" aria-label="What the example audit found">
              {FINDINGS.map((f, i) => (
                <li key={f}>
                  MF-0{i + 1}: {f}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
