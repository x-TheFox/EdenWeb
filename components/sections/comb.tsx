"use client";

import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { notify, sceneStore } from "@/components/scene/scene-store";
import { useStage } from "@/components/scene/use-stage";

const rows = ["Support tickets", "Data entry", "Outbound follow-ups", "Invoice matching", "QA test cases", "Order updates"];

const modes = {
  auto: {
    label: "Autonomous",
    short: "Autonomous",
    body: "The work runs without anyone touching it. Your people move to the work only people can do.",
  },
  human: {
    label: "Alongside your team",
    short: "Alongside",
    body: "Your team stays. Every task arrives drafted and checked, and a person signs off at the orange line before it goes out.",
  },
} as const;

export function Comb() {
  const ref = useRef<HTMLElement>(null);
  const progress = useStage("comb", ref, "pinned");
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Read the preference only after hydration so server and client markup match.
  const reduce = mounted && !!prefersReduced;
  const [mode, setMode] = useState<keyof typeof modes>("auto");
  const [hint, setHint] = useState(false);
  const [hintDone, setHintDone] = useState(false);

  // Before line stays until the comb front passes x = -6, then the answer arrives.
  const beforeO = useTransform(progress, [0, 0.06, 0.4, 0.47], [0.35, 1, 1, 0]);
  const beforeY = useTransform(progress, [0.4, 0.47], [0, -16]);
  const afterO = useTransform(progress, [0.45, 0.55], [0, 1]);
  const afterY = useTransform(progress, [0.45, 0.55], [20, 0]);
  // The underline under "Row by row." IS the comb line: it tracks the front exactly.
  const line = useTransform(progress, [0.15, 0.7], [0, 1]);

  useMotionValueEvent(progress, "change", (p) => {
    const want = p > 0.75 && !hintDone && !(prefersReduced ?? false);
    setHint((h) => (h === want ? h : want));
  });

  useEffect(() => {
    if (!hint) return;
    let dist = 0;
    let lx = -1;
    let ly = -1;
    const onMove = (e: PointerEvent) => {
      if (lx >= 0) dist += Math.hypot(e.clientX - lx, e.clientY - ly);
      lx = e.clientX;
      ly = e.clientY;
      if (dist > 220) {
        setHintDone(true);
        setHint(false);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [hint]);

  const pick = (m: keyof typeof modes) => {
    setMode(m);
    sceneStore.human = m === "human" ? 1 : 0;
    notify();
  };

  return (
    <section ref={ref} aria-labelledby="comb-title" className="relative h-[200vh] md:h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[88px] md:justify-center md:pt-0">
        <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] md:block" />
        <div className="scrim-t pointer-events-none absolute inset-x-0 top-0 h-[70%] md:hidden" />
        <div className="shell relative">
          <div data-copy className="relative min-h-[16rem] max-w-[44rem]">
            <motion.p
              aria-hidden
              style={reduce ? { opacity: 0, y: 0 } : { opacity: beforeO, y: beforeY }}
              className={`h2 absolute inset-x-0 top-0 text-bone ${reduce ? "hidden" : ""}`}
            >
              Most of the week is the same task, done again.
            </motion.p>
            <motion.div style={reduce ? { opacity: 1, y: 0 } : { opacity: afterO, y: afterY }}>
              <h2 id="comb-title" className="h2 text-bone">
                <span className="sr-only">Most of the week is the same task, done again. </span>
                We take it over.{" "}
                <span className="relative inline-block whitespace-nowrap pb-[0.12em]">
                  Row by row.
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 block h-[2px] origin-left bg-survey"
                    style={{ scaleX: reduce ? 1 : line }}
                  />
                </span>
              </h2>
              <p className="lede mt-6 max-w-[34rem]">
                AI workforces that run customer support, data entry, outbound sales, back-office operations and QA
                generation end to end.
              </p>

              <div className="mt-8 max-w-[30rem]">
                <div
                  role="radiogroup"
                  aria-label="How the work runs"
                  className="relative grid w-full grid-cols-2 rounded-full border border-line bg-ink/70 p-1 sm:inline-grid sm:w-auto"
                >
                  {(Object.keys(modes) as (keyof typeof modes)[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={mode === m}
                      onClick={() => pick(m)}
                      className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-[0.86rem] transition-colors duration-300 ${
                        mode === m ? "text-survey-ink" : "text-bone-dim hover:text-bone"
                      }`}
                    >
                      {mode === m && (
                        <motion.span
                          layoutId="comb-mode"
                          className="absolute inset-0 -z-10 rounded-full bg-survey"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                      <span className="sm:hidden">{modes[m].short}</span>
                      <span className="hidden sm:inline">{modes[m].label}</span>
                    </button>
                  ))}
                </div>
                <p aria-live="polite" className="mt-4 min-h-[4.8em] text-[0.98rem] leading-relaxed text-bone-dim">
                  {modes[mode].body}
                </p>
                <p
                  aria-hidden
                  className={`annot mt-1 hidden text-moss transition-opacity duration-500 md:block ${hint ? "opacity-100" : "opacity-0"}`}
                >
                  Move across the rows
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <ul className="sr-only" aria-label="Examples of repetitive work">
          {rows.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
