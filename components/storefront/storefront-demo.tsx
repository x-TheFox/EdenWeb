"use client";

import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Check, Plus, ShoppingBagOpen, X, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { DEMO_COMPANY, DEMO_DEPOSIT, catalog, usd, weeksLabel } from "./catalog";

const initial = ["MF-01", "MF-03", "MF-04"];

function AnimatedTotal({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 22 });
  const text = useTransform(spring, (v) => usd(Math.round(v)));
  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [value, spring, reduce]);
  return <motion.span className="tabular">{text}</motion.span>;
}

export function StorefrontDemo() {
  const [cart, setCart] = useState<string[]>(initial);
  const [stage, setStage] = useState<"browse" | "sending" | "sent">("browse");
  const [sheet, setSheet] = useState(false);
  const reduce = useReducedMotion();

  const items = useMemo(() => catalog.filter((f) => cart.includes(f.id)), [cart]);
  const subtotal = items.reduce((s, f) => s + f.price, 0);
  const total = Math.max(0, subtotal - (items.length ? DEMO_DEPOSIT : 0));
  const longest = items.reduce((m, f) => Math.max(m, f.weeks[1]), 0);

  const toggle = (id: string) => {
    if (stage !== "browse") return;
    setCart((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  };

  const checkout = () => {
    if (!items.length) return;
    setStage("sending");
    setTimeout(() => setStage("sent"), reduce ? 50 : 1400);
  };
  const reset = () => {
    setCart(initial);
    setStage("browse");
    setSheet(false);
  };

  const cartPanel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <p className="flex items-center gap-2 text-bone">
          <ShoppingBagOpen weight="light" className="size-5" aria-hidden />
          Build request
        </p>
        <span className="annot text-moss">{items.length} {items.length === 1 ? "feature" : "features"}</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {stage === "sent" ? (
          <motion.div
            key="sent"
            className="flex flex-1 flex-col justify-center px-5 py-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="grid size-11 place-items-center rounded-full bg-survey text-survey-ink">
              <Check weight="bold" className="size-5" aria-hidden />
            </span>
            <p className="mt-5 font-display text-[1.6rem] leading-tight tracking-[-0.02em] text-bone">Build request sent.</p>
            <p className="mt-3 text-[0.95rem] text-bone-dim">
              {items.length} features, {usd(total)} after the audit deposit. In a real storefront this goes straight to
              Edencorp, and the build starts from here.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.9rem] text-bone transition-colors hover:border-bone-dim"
            >
              <ArrowCounterClockwise weight="light" className="size-4" aria-hidden />
              Start over
            </button>
          </motion.div>
        ) : (
          <motion.div key="list" className="flex flex-1 flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ul className="flex-1 space-y-1 overflow-y-auto px-3 py-3" aria-label="Selected features">
              <AnimatePresence initial={false}>
                {items.length === 0 && (
                  <motion.li key="empty" className="px-2 py-6 text-[0.95rem] text-moss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Nothing selected. Add features from the list to build your request.
                  </motion.li>
                )}
                {items.map((f) => (
                  <motion.li
                    key={f.id}
                    layout={!reduce}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-start justify-between gap-3 rounded-[4px] px-2 py-2.5 hover:bg-ink-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[0.92rem] text-bone">{f.name}</p>
                      <p className="annot mt-1 text-moss">{f.id} / {weeksLabel(f.weeks)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="tabular font-mono text-[0.85rem] text-bone">{usd(f.price)}</span>
                      <button
                        type="button"
                        onClick={() => toggle(f.id)}
                        disabled={stage !== "browse"}
                        className="grid size-7 place-items-center rounded-full text-moss transition-colors hover:bg-ink-2 hover:text-bone"
                        aria-label={`Remove ${f.name}`}
                      >
                        <X weight="light" className="size-3.5" aria-hidden />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <dl className="space-y-2 border-t border-line px-5 py-4 text-[0.9rem]">
              <div className="flex justify-between text-bone-dim">
                <dt>Subtotal</dt>
                <dd className="tabular font-mono">{usd(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-bone-dim">
                <dt>Audit deposit credited</dt>
                <dd className="tabular font-mono">{items.length ? `-${usd(DEMO_DEPOSIT)}` : usd(0)}</dd>
              </div>
              <div className="flex justify-between text-bone-dim">
                <dt>Estimated build</dt>
                <dd className="tabular font-mono">{longest ? `${longest} weeks` : "None"}</dd>
              </div>
              <div className="flex items-baseline justify-between pt-2 text-bone">
                <dt>Total</dt>
                <dd aria-live="polite" className="font-mono text-[1.35rem] text-survey">
                  <AnimatedTotal value={total} />
                </dd>
              </div>
              <p className="pt-1 text-[0.78rem] leading-snug text-moss">Features build in parallel, so the longest one sets the pace.</p>
            </dl>

            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={checkout}
                disabled={!items.length || stage !== "browse"}
                className="relative w-full overflow-hidden rounded-full bg-survey py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color,opacity] duration-300 hover:bg-survey-soft active:scale-[0.98] disabled:opacity-50"
              >
                {stage === "sending" ? "Sending build request..." : "Checkout"}
                {stage === "sending" && !reduce && (
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-survey-ink/15"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-[10px] border border-line-strong bg-ink-2 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)]">
      {/* Frame bar: makes the example status unmissable. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3 md:px-5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </span>
          <span className="font-mono text-[0.78rem] text-moss">Private storefront / {DEMO_COMPANY}</span>
        </div>
        <span className="rounded-full border border-survey/50 px-3 py-1 text-[0.75rem] text-survey">
          Example storefront. Fictional company, illustrative prices.
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_22rem]">
        <div className="p-4 md:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-[1.35rem] tracking-[-0.02em] text-bone">Features from your audit</p>
              <p className="mt-1 text-[0.9rem] text-moss">8 found. Pick what fits your goals and budget.</p>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {catalog.map((f) => {
              const on = cart.includes(f.id);
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => toggle(f.id)}
                    aria-pressed={on}
                    disabled={stage !== "browse"}
                    className={`group flex h-full w-full flex-col rounded-[var(--radius-surface)] border p-4 text-left transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.985] ${
                      on ? "border-survey/70 bg-survey/[0.06]" : "border-line bg-ink/60 hover:border-line-strong hover:bg-ink-3"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="annot text-moss">{f.id} / {f.kind}</span>
                      <span
                        className={`grid size-7 place-items-center rounded-full border transition-colors duration-300 ${
                          on ? "border-survey bg-survey text-survey-ink" : "border-line text-bone-dim group-hover:border-bone-dim"
                        }`}
                        aria-hidden
                      >
                        {on ? <Check weight="bold" className="size-3.5" /> : <Plus weight="light" className="size-3.5" />}
                      </span>
                    </div>
                    <p className="mt-3 text-[1.02rem] leading-snug text-bone">{f.name}</p>
                    <p className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-bone-dim">{f.summary}</p>
                    <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
                      <span className="font-mono text-[0.8rem] text-moss">{weeksLabel(f.weeks)}</span>
                      <span className={`tabular font-mono text-[0.95rem] ${on ? "text-survey" : "text-bone"}`}>{usd(f.price)}</span>
                    </div>
                    <span className="sr-only">{on ? "In build request. Activate to remove." : "Activate to add to build request."}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="hidden border-l border-line bg-ink/40 lg:block" aria-label="Build request">
          <div className="sticky top-20">{cartPanel}</div>
        </aside>
      </div>

      {/* Mobile and tablet: cart as a bottom sheet. */}
      <div className="sticky bottom-0 border-t border-line bg-ink/95 px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSheet(true)}
          className="flex w-full items-center justify-between rounded-full bg-survey px-5 py-3 text-survey-ink"
          aria-haspopup="dialog"
        >
          <span className="text-[0.95rem] font-medium">Review request ({items.length})</span>
          <span className="font-mono text-[0.95rem]"><AnimatedTotal value={total} /></span>
        </button>
      </div>
      <AnimatePresence>
        {sheet && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end bg-ink/70 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSheet(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Build request"
              className="max-h-[85dvh] w-full overflow-hidden rounded-t-[14px] border-t border-line-strong bg-ink-2"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end px-3 pt-3">
                <button type="button" onClick={() => setSheet(false)} className="grid size-9 place-items-center rounded-full border border-line text-bone" aria-label="Close build request">
                  <X weight="light" className="size-4" aria-hidden />
                </button>
              </div>
              <div className="max-h-[75dvh] overflow-y-auto">{cartPanel}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
