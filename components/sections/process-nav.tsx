"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

const steps = [
  { id: "step-qualify", verb: "Qualify" },
  { id: "step-survey", verb: "Survey" },
  { id: "storefront", verb: "Choose" },
  { id: "step-build", verb: "Build" },
  { id: "step-own", verb: "Own" },
];

/**
 * Wraps the five process beats (B4 to B8). Desktop: a sticky step rail on the right edge.
 * Below 1280px: a 5-segment progress bar under the nav while the process is in view.
 */
export function ProcessNav({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const r = ref.current?.getBoundingClientRect();
    const on = !!r && r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5 && v > 0 && v < 1;
    setInView((p) => (p === on ? p : on));
  });
  useMotionValueEvent(scrollY, "change", () => {
    const mid = window.innerHeight * 0.5;
    let idx = 0;
    steps.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top < mid) idx = i;
    });
    setActive((p) => (p === idx ? p : idx));
  });

  return (
    <div ref={ref} className="relative">
      {children}

      <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
        <div className="sticky top-0 flex h-[100svh] items-center justify-end">
          <div className="shell flex justify-end">
            <ol className="flex flex-col gap-4">
              {steps.map((s, i) => (
                <li key={s.id} className="flex items-center justify-end gap-4">
                  <span className={`annot transition-colors duration-500 ${i === active ? "text-bone" : "text-moss/70"}`}>{s.verb}</span>
                  <span className="relative block h-px w-10 bg-line">
                    {i === active && (
                      <motion.span
                        layoutId="rail"
                        className="absolute inset-0 bg-survey"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32 }}
                      />
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {inView && (
          <motion.div
            aria-hidden
            className="fixed inset-x-0 top-16 z-40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="shell flex gap-1 pt-1">
              {steps.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-[2px] flex-1 rounded-full transition-colors duration-300 ${
                    i === active ? "bg-survey" : i < active ? "bg-bone" : "bg-line-strong"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
