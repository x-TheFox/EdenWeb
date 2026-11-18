"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { notify, sceneStore } from "@/components/scene/scene-store";
import { useStage } from "@/components/scene/use-stage";

const options = {
  handover: {
    label: "Full handover",
    body: "Deployed to your infrastructure, with the complete source code and no further obligation to us.",
  },
  retainer: { label: "Managed retainer", body: "We keep running, maintaining and improving the systems." },
} as const;

/** B8: handover is literal. Your built features leave our ground and settle on yours, or we keep tending them. */
export function Own() {
  const ref = useRef<HTMLElement>(null);
  useStage("own", ref, "pinned");
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && !!prefersReduced;
  const [mode, setMode] = useState<keyof typeof options>("handover");

  const pick = (m: keyof typeof options) => {
    setMode(m);
    sceneStore.retainer = m === "retainer" ? 1 : 0;
    notify();
  };

  return (
    <section ref={ref} id="step-own" aria-labelledby="own-title" className="relative h-[380vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="scrim-t pointer-events-none absolute inset-x-0 top-0 h-[60%] md:hidden" />
        <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] md:block" />
        <div className="shell relative pt-[88px] md:pt-[20vh]">
          <div data-copy className="max-w-[34rem]">
            <p className="annot text-moss">5 of 5. Own</p>
            <h3 id="own-title" className="h2 mt-4 text-[clamp(1.9rem,3.4vw,3rem)] text-bone">
              Take it with you, or let us tend it.
            </h3>
            <div
              role="radiogroup"
              aria-label="After delivery"
              className="relative mt-8 grid w-full grid-cols-2 rounded-full border border-line bg-ink/70 p-1 sm:inline-grid sm:w-auto"
            >
              {(Object.keys(options) as (keyof typeof options)[]).map((m) => (
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
                      layoutId="own-mode"
                      className="absolute inset-0 -z-10 rounded-full bg-survey"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  {options[m].label}
                </button>
              ))}
            </div>
            <p aria-live="polite" className="lede mt-5 min-h-[3.4em]">
              {options[mode].body}
            </p>
            <p className="sr-only">
              {mode === "handover"
                ? "In the field, the features you built lift out and settle in a separate plot labelled Your infrastructure."
                : "In the field, the built features stay on our ground, labelled Tended by Edencorp, and a tending pass sweeps across them."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
