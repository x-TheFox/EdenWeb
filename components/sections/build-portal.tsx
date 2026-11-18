"use client";

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { notify, sceneStore } from "@/components/scene/scene-store";
import { DEMO_COMPANY, type Feature } from "@/components/storefront/catalog";
import { hoverLot, useCart } from "@/components/storefront/cart-store";
import { buildEvents, cartFeatures, featureProgress, statusFor, totalWeeks, type Status } from "@/lib/build-plan";

const hot = (s: Status) => s === "Ready to test" || s === "Revision 1 of 3";

function Bar({ f, week }: { f: Feature; week: MotionValue<number> }) {
  const scale = useTransform(week, (w) => featureProgress(f, w));
  const [now, setNow] = useState(0);
  useMotionValueEvent(scale, "change", (v) => {
    const r = Math.round(v * 100);
    setNow((p) => (p === r ? p : r));
  });
  return (
    <div
      role="progressbar"
      aria-label={`${f.name} progress`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={now}
      className="relative mt-2.5 h-[2px] overflow-hidden bg-line"
    >
      <motion.span className="absolute inset-0 origin-left bg-bone" style={{ scaleX: scale }} />
    </div>
  );
}

/**
 * B7. Replaces the video: a live client portal for the visitor's own cart, scrubbed by scroll.
 * Features build in parallel; the longest sets the pace.
 */
export function BuildPortal({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const { ids } = useCart();
  const { features, fallback } = useMemo(() => cartFeatures(ids), [ids]);
  const N = totalWeeks(features);
  const events = useMemo(() => buildEvents(features), [features]);

  const driver = useTransform(progress, [0.1, 0.85], [0, 1], { clamp: true });
  const [step, setStep] = useState(N);
  const week = useMotionValue(0);
  const live = useRef({ reduce, step, N });
  live.current = { reduce, step, N };
  const sync = () => {
    const c = live.current;
    week.set(c.reduce ? Math.min(c.step, c.N) : driver.get() * c.N);
  };
  useMotionValueEvent(driver, "change", sync);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(sync, [reduce, step, N]);

  // Reduced motion: a stepper drives the build (and the scene) instead of scroll.
  useEffect(() => {
    sceneStore.buildWeek = reduce ? Math.min(step, N) : null;
    notify();
    return () => {
      sceneStore.buildWeek = null;
    };
  }, [reduce, step, N]);
  useEffect(() => setStep(N), [N]);

  // Discrete state (chips, messages, week readout) only re-renders when a milestone changes.
  const [w, setW] = useState(0);
  useMotionValueEvent(week, "change", (v) => {
    const q = Math.round(v * 20) / 20;
    setW((p) => (p === q ? p : q));
  });
  useEffect(() => setW(week.get()), [week, reduce, step, N]);

  const shownEvents = events.filter((e) => e.week <= w + 1e-6).slice(-3);
  const revisionUsed = events.some((e) => e.text.includes("revision round") && e.week <= w + 1e-6);
  const allDone = features.every((f) => featureProgress(f, w) >= 1);
  const weekLabel = Math.max(1, Math.min(N, Math.ceil(w)));

  return (
    <div>
      <div className="overflow-hidden rounded-[10px] border border-line-strong bg-ink-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-baseline gap-3">
            <span className="annot text-moss">Client portal</span>
            <span className="font-mono text-[0.78rem] text-moss">{DEMO_COMPANY}</span>
          </div>
          <span className="tabular font-mono text-[0.875rem] text-bone">
            Week {weekLabel} of {N}
          </span>
        </div>

        <div className="grid md:grid-cols-[1.15fr_1fr]">
          <ul className="space-y-4 px-5 py-4" aria-label="Features in this build">
            {features.map((f, i) => {
              const p = featureProgress(f, w);
              const s = statusFor(p);
              return (
                <li
                  key={f.id}
                  className={i >= 3 ? "hidden md:block" : ""}
                  onMouseEnter={() => hoverLot(f.id)}
                  onMouseLeave={() => hoverLot(null)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[0.95rem] text-bone">{f.name}</p>
                      <p className="annot mt-1 text-moss">{f.id}</p>
                    </div>
                    <motion.span
                      key={s}
                      initial={reduce ? false : { scale: 0.92, opacity: 0.4 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 160, damping: 18 }}
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.76rem] ${
                        hot(s)
                          ? "border-survey text-survey"
                          : s === "Signed off"
                            ? "border-bone-dim text-bone"
                            : "border-line text-bone-dim"
                      }`}
                    >
                      {s}
                    </motion.span>
                  </div>
                  <Bar f={f} week={week} />
                </li>
              );
            })}
            {features.length > 3 && <li className="text-[0.85rem] text-moss md:hidden">+{features.length - 3} more</li>}
          </ul>

          <div className="flex flex-col border-t border-line md:border-l md:border-t-0">
            <p className="border-b border-line px-5 py-3 text-[0.9rem] text-bone">Updates</p>
            <ol className="flex flex-1 flex-col justify-end gap-2 px-4 py-3 md:min-h-[11rem]" aria-live="off">
              <AnimatePresence initial={false}>
                {shownEvents.map((e, i) => (
                  <motion.li
                    key={e.key}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`rounded-[6px] border border-line bg-ink px-3 py-2 ${i < shownEvents.length - 1 ? "hidden md:block" : ""}`}
                  >
                    <p className="flex items-baseline gap-2">
                      <span className="text-[0.8rem] text-bone">Edencorp</span>
                      <span className="annot text-moss">via {e.channel}</span>
                    </p>
                    <p className="mt-1 text-[0.88rem] leading-snug text-bone-dim">{e.text}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
              {shownEvents.length === 0 && <li className="text-[0.85rem] text-moss">Nothing yet. Updates arrive as the build moves.</li>}
            </ol>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5 text-[0.9rem]">
          <span className={allDone ? "text-bone" : "text-bone-dim"}>
            {allDone ? "Everything signed off. Ready for handover." : "Revision rounds remaining"}
          </span>
          {!allDone && <span className="tabular font-mono text-bone">{revisionUsed ? "2 of 3" : "3 of 3"}</span>}
        </div>
      </div>

      {reduce && (
        <div role="group" aria-label="Build week" className="mt-4 flex flex-wrap items-center gap-2">
          <span className="annot mr-1 text-moss">Week</span>
          {Array.from({ length: N }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={step === n}
              onClick={() => setStep(n)}
              className={`min-w-9 rounded-full border px-3 py-1.5 font-mono text-[0.85rem] ${
                step === n ? "border-survey bg-survey text-survey-ink" : "border-line text-bone-dim hover:text-bone"
              }`}
            >
              {n}
            </button>
          ))}
          <p className="sr-only" aria-live="polite">
            Week {Math.min(step, N)} of {N}.{" "}
            {features.map((f) => `${f.name}: ${statusFor(featureProgress(f, Math.min(step, N)))}`).join(". ")}
          </p>
        </div>
      )}

      <p className="mt-3 text-[0.82rem] text-moss">
        {fallback
          ? "You didn't pick anything, so this shows the example's default request."
          : "Example build. It uses the features you picked above. Fictional company."}
      </p>
    </div>
  );
}
