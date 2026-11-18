"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { sceneStore } from "@/components/scene/scene-store";
import { useStage } from "@/components/scene/use-stage";

const rows = ["Support tickets", "Data entry", "Outbound follow-ups", "Invoice matching", "QA test cases", "Order updates"];

const modes = {
  auto: {
    label: "Autonomous",
    body: "The work runs without anyone touching it. Your people move to the work only people can do.",
  },
  human: {
    label: "Alongside your team",
    body: "Your team stays. Every task arrives drafted, checked and ready, with a person signing off where it matters.",
  },
} as const;

export function Comb() {
  const ref = useRef<HTMLElement>(null);
  const progress = useStage("comb", ref, "pinned");
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<keyof typeof modes>("auto");

  // Before the comb: the problem. After: the answer.
  const beforeO = useTransform(progress, [0, 0.08, 0.3, 0.42], [0.25, 1, 1, 0]);
  const beforeY = useTransform(progress, [0.3, 0.42], [0, -24]);
  const afterO = useTransform(progress, [0.56, 0.68], [0, 1]);
  const afterY = useTransform(progress, [0.56, 0.68], [28, 0]);
  const labelsO = useTransform(progress, [0.7, 0.82], [0, 1]);

  const pick = (m: keyof typeof modes) => {
    setMode(m);
    sceneStore.human = m === "human" ? 1 : 0;
  };

  return (
    <section ref={ref} aria-labelledby="comb-title" className="relative h-[340vh]">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 w-full md:w-[62%]" />
        <div className="shell relative">
          <div className="relative min-h-[14rem] max-w-[44rem]">
            <motion.p
              aria-hidden
              style={reduce ? undefined : { opacity: beforeO, y: beforeY }}
              className={`h2 absolute inset-x-0 top-0 text-bone ${reduce ? "hidden" : ""}`}
            >
              Most of the week is the same task, done again.
            </motion.p>
            <motion.div style={reduce ? undefined : { opacity: afterO, y: afterY }}>
              <h2 id="comb-title" className="h2 text-bone">
                <span className="sr-only">Most of the week is the same task, done again. </span>
                We take it over. <span className="text-survey">Row by row.</span>
              </h2>
              <p className="lede mt-6 max-w-[34rem]">
                AI workforces that run customer support, data entry, outbound sales, back-office operations and QA
                generation end to end.
              </p>

              <div className="mt-9 max-w-[30rem]">
                <div
                  role="radiogroup"
                  aria-label="How the work runs"
                  className="relative inline-grid grid-cols-2 rounded-full border border-line bg-ink/70 p-1"
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
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                      {modes[m].label}
                    </button>
                  ))}
                </div>
                <p aria-live="polite" className="mt-4 min-h-[3.2em] text-[0.98rem] leading-relaxed text-bone-dim">
                  {modes[mode].body}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.ul
          aria-label="Examples of repetitive work"
          style={reduce ? undefined : { opacity: labelsO }}
          className="shell pointer-events-none absolute inset-x-0 bottom-[7vh] hidden grid-cols-6 gap-4 md:grid"
        >
          {rows.map((r) => (
            <li key={r} className="flex flex-col items-start gap-3">
              <span className="annot text-bone-dim">{r}</span>
              <span className="h-10 w-px bg-gradient-to-b from-survey/80 to-transparent" />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
