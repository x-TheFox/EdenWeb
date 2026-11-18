"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";

const verbs = ["Qualify", "Survey", "Choose", "Build", "Own"];
const ids = ["qualify", "survey", "choose", "build", "own"];

/** Sticky step rail on the right edge. Follows the process section's own scroll. */
export function ProcessRail() {
  const [active, setActive] = useState(0);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", () => {
    const mid = window.innerHeight * 0.5;
    let idx = 0;
    ids.forEach((id, i) => {
      const el = document.getElementById(`step-${id}`);
      if (el && el.getBoundingClientRect().top < mid) idx = i;
    });
    setActive((p) => (p === idx ? p : idx));
  });

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      <div className="sticky top-0 flex h-[100dvh] items-center justify-end">
        <div className="shell flex justify-end">
          <ol className="pointer-events-auto flex flex-col gap-4">
            {verbs.map((v, i) => (
              <li key={v} className="flex items-center justify-end gap-4">
                <span
                  className={`annot transition-colors duration-500 ${i === active ? "text-bone" : "text-moss/70"}`}
                >
                  {v}
                </span>
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
  );
}
