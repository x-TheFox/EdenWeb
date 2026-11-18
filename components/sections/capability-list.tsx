"use client";

import { motion, useReducedMotion } from "motion/react";
import { sceneStore } from "@/components/scene/scene-store";

const items = [
  {
    name: "AI workforces",
    body: "Repetitive operations, handled end to end. Fully autonomous, or human-in-the-loop so your team gets faster.",
    tags: ["Customer support", "Data entry", "Outbound sales", "Back office", "QA generation"],
  },
  {
    name: "Bespoke copilots",
    body: "Built around one team's tools, data and habits, so the people you already have move faster.",
    tags: ["Your tools", "Your data", "Your workflow"],
  },
  {
    name: "Predictive and strategic intelligence",
    body: "Forecasts and decision support built from your operational and market data. Fewer guesses at the top.",
    tags: ["Forecasting", "Decision support", "Market signals"],
  },
  {
    name: "Custom software and autonomous pipelines",
    body: "Platforms and pipelines built from nothing. Bring the vision and the budget, and we will build it.",
    tags: ["Platforms", "Internal tools", "End-to-end pipelines"],
  },
];

export function CapabilityList() {
  const reduce = useReducedMotion();
  const set = (n: number) => () => {
    sceneStore.capHighlight = n;
  };
  return (
    <ul className="mt-16 grid gap-x-12 gap-y-4 md:grid-cols-12" onMouseLeave={set(0)}>
      {items.map((it, i) => (
        <motion.li
          key={it.name}
          className={`md:col-span-6 ${i % 2 === 1 ? "md:translate-y-16" : ""}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: (i % 2) * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            tabIndex={0}
            onMouseEnter={set(i + 1)}
            onFocus={set(i + 1)}
            onBlur={set(0)}
            className="group relative block rounded-[var(--radius-surface)] border border-line/80 bg-ink/75 p-7 outline-none transition-[border-color,background-color] duration-500 ease-[var(--ease-out-expo)] hover:border-survey/50 hover:bg-ink-2/90 focus-visible:border-survey md:p-9"
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="h3 max-w-[18ch] text-bone">{it.name}</h3>
              <span className="annot mt-1 shrink-0 text-moss transition-colors duration-500 group-hover:text-survey">
                Plot {String.fromCharCode(65 + i)}
              </span>
            </div>
            <p className="mt-4 max-w-[44ch] text-bone-dim">{it.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${it.name} examples`}>
              {it.tags.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 text-[0.8rem] text-bone-dim">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
