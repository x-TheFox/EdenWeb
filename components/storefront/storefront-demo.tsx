"use client";

import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowCounterClockwise, CaretDown, Check, Plus, ShoppingBagOpen, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { DEMO_COMPANY, DEMO_DEPOSIT, catalog, usd, weeksLabel } from "./catalog";
import { cart, hoverLot, useCart } from "./cart-store";

function AnimatedTotal({ value, reduce }: { value: number; reduce: boolean }) {
  const spring = useSpring(value, { stiffness: 140, damping: 22 });
  const text = useTransform(spring, (v) => usd(Math.round(v)));
  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [value, spring, reduce]);
  return <motion.span className="tabular">{text}</motion.span>;
}

/** 4 x 2 map of the lots, so "cart = your ground" survives on screens too narrow for the field window. */
function LotMap({ ids }: { ids: string[] }) {
  return (
    <span aria-hidden className="grid grid-cols-4 gap-[3px]">
      {catalog.map((f) => (
        <span
          key={f.id}
          className={`block size-2.5 rounded-[2px] border transition-colors duration-150 ${
            ids.includes(f.id) ? "border-survey-ink/60 bg-survey-ink/80" : "border-survey-ink/40"
          }`}
        />
      ))}
    </span>
  );
}

export function StorefrontDemo() {
  const { ids, stage } = useCart();
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && !!prefersReduced;

  const items = catalog.filter((f) => ids.includes(f.id));
  const subtotal = items.reduce((s, f) => s + f.price, 0);
  const total = Math.max(0, subtotal - (items.length ? DEMO_DEPOSIT : 0));
  const longest = items.reduce((m, f) => Math.max(m, f.weeks[1]), 0);

  const checkout = () => {
    if (!items.length || stage !== "browse") return;
    cart.setStage("sending");
    setTimeout(() => cart.setStage("sent"), reduce ? 50 : 1400);
  };

  const summary = (
    <div className="flex flex-col">
      <AnimatePresence mode="wait" initial={false}>
        {stage === "sent" ? (
          <motion.div
            key="sent"
            className="px-5 py-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            role="status"
          >
            <span className="grid size-10 place-items-center rounded-full bg-survey text-survey-ink">
              <Check weight="bold" className="size-4" aria-hidden />
            </span>
            <p className="mt-4 font-display text-[1.45rem] leading-tight tracking-[-0.02em] text-bone">Build request sent.</p>
            <p className="mt-2 text-[0.92rem] text-bone-dim">
              {items.length} {items.length === 1 ? "feature" : "features"}, {usd(total)} after the audit deposit. In a
              real storefront this goes straight to Edencorp, and the build starts from here. Keep scrolling to watch it
              grow.
            </p>
            <button
              type="button"
              onClick={() => cart.reset()}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.9rem] text-bone transition-colors hover:border-bone-dim"
            >
              <ArrowCounterClockwise weight="light" className="size-4" aria-hidden />
              Start over
            </button>
          </motion.div>
        ) : (
          <motion.div key="sum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 px-5 pt-4 text-[0.88rem] sm:grid-cols-4">
              <div>
                <dt className="text-moss">Subtotal</dt>
                <dd className="tabular font-mono text-bone">{usd(subtotal)}</dd>
              </div>
              <div>
                <dt className="text-moss">Deposit credited</dt>
                <dd className="tabular font-mono text-bone">{items.length ? `-${usd(DEMO_DEPOSIT)}` : usd(0)}</dd>
              </div>
              <div>
                <dt className="text-moss">Estimated build</dt>
                <dd className="tabular font-mono text-bone">{longest ? `${longest} weeks` : "None"}</dd>
              </div>
              <div>
                <dt className="text-moss">Total</dt>
                <dd aria-live="polite" className="font-mono text-[1.15rem] leading-tight text-survey">
                  <AnimatedTotal value={total} reduce={reduce} />
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 pt-3">
              <p className="text-[0.78rem] text-moss">Features build in parallel, so the longest one sets the pace.</p>
              <button
                type="button"
                onClick={checkout}
                disabled={!items.length || stage !== "browse"}
                className="relative overflow-hidden rounded-full bg-survey px-6 py-2.5 text-[0.92rem] font-medium text-survey-ink transition-[transform,background-color,opacity] duration-300 hover:bg-survey-soft active:scale-[0.98] disabled:opacity-50"
              >
                {stage === "sending" ? "Sending..." : "Checkout"}
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
    <div className="grid gap-6 lg:grid-cols-12">
      <div data-copy className="overflow-hidden rounded-[10px] border border-line-strong bg-ink-2 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3 md:px-5">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
            </span>
            <span className="font-mono text-[0.78rem] text-moss">Private storefront / {DEMO_COMPANY}</span>
          </div>
          <span className="rounded-full border border-survey/50 px-3 py-1 text-[0.72rem] text-survey">
            Example storefront. Fictional company, illustrative prices.
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-5 md:px-5">
          <div>
            <p className="font-display text-[1.3rem] tracking-[-0.02em] text-bone">Found in your audit: 8</p>
            <p className="mt-0.5 text-[0.88rem] text-moss">Pick what fits your goals and budget.</p>
          </div>
          <p className="hidden items-center gap-2 text-[0.85rem] text-bone-dim sm:flex">
            <ShoppingBagOpen weight="light" className="size-4" aria-hidden />
            {items.length} selected
          </p>
        </div>

        <ul className="border-t border-line" aria-label="Features from the audit">
          {catalog.map((f) => {
            const on = ids.includes(f.id);
            const expanded = open === f.id;
            return (
              <li
                key={f.id}
                className="border-b border-line last:border-b-0"
                onMouseEnter={() => hoverLot(f.id)}
                onMouseLeave={() => hoverLot(null)}
              >
                <div className={`grid min-h-16 grid-cols-[28px_1fr_auto] items-center gap-3 px-4 transition-colors duration-200 md:grid-cols-[28px_1fr_auto_auto_32px] md:px-5 ${on ? "bg-survey/[0.05]" : "hover:bg-ink-3/70"}`}>
                  <button
                    type="button"
                    onClick={() => cart.toggle(f.id)}
                    onFocus={() => hoverLot(f.id)}
                    onBlur={() => hoverLot(null)}
                    disabled={stage !== "browse"}
                    aria-pressed={on}
                    aria-label={`${on ? "Remove" : "Add"} ${f.name}, ${usd(f.price)}`}
                    className={`grid size-7 place-items-center rounded-full border transition-[background-color,border-color,transform] duration-150 active:scale-90 ${
                      on ? "border-survey bg-survey text-survey-ink" : "border-line-strong text-bone-dim hover:border-bone-dim"
                    }`}
                  >
                    {on ? <Check weight="bold" className="size-3.5" aria-hidden /> : <Plus weight="light" className="size-3.5" aria-hidden />}
                  </button>
                  <button type="button" onClick={() => cart.toggle(f.id)} disabled={stage !== "browse"} tabIndex={-1} className="min-w-0 py-3 text-left">
                    <span className="annot block text-moss">
                      {f.id} / {f.kind}
                    </span>
                    <span className="mt-1 block truncate text-[0.98rem] text-bone">{f.name}</span>
                  </button>
                  <span className="hidden font-mono text-[0.8rem] text-moss md:block">{weeksLabel(f.weeks)}</span>
                  <span className={`tabular font-mono text-[0.92rem] ${on ? "text-survey" : "text-bone"}`}>{usd(f.price)}</span>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : f.id)}
                    aria-expanded={expanded}
                    aria-controls={`sum-${f.id}`}
                    aria-label={`${expanded ? "Hide" : "Show"} scope for ${f.name}`}
                    className="hidden size-8 place-items-center rounded-full text-moss transition-colors hover:text-bone md:grid"
                  >
                    <CaretDown weight="light" className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                </div>
                <div id={`sum-${f.id}`} hidden={!expanded} className="px-5 pb-4 pl-[60px] text-[0.9rem] text-bone-dim">
                  {f.summary}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="sticky bottom-0 hidden border-t border-line-strong bg-ink-2/95 backdrop-blur-sm lg:block">{summary}</div>
      </div>

      {/* Desktop: the right columns stay open so the lots in the field show through. */}
      <div className="hidden lg:col-span-5 lg:block" aria-hidden />

      {/* Tablet and mobile: request bar with a mini lot map, opening a bottom sheet. */}
      <div className="sticky bottom-3 z-20 lg:hidden">
        <button
          type="button"
          onClick={() => setSheet(true)}
          className="flex w-full items-center justify-between gap-4 rounded-full bg-survey px-5 py-3 text-survey-ink shadow-[0_20px_60px_-20px_rgb(0_0_0/0.9)]"
          aria-haspopup="dialog"
        >
          <span className="flex items-center gap-3">
            <LotMap ids={ids} />
            <span className="text-[0.95rem] font-medium">Review request ({items.length})</span>
          </span>
          <span className="font-mono text-[0.95rem]">
            <AnimatedTotal value={total} reduce={reduce} />
          </span>
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
              className="max-h-[85dvh] w-full overflow-y-auto rounded-t-[14px] border-t border-line-strong bg-ink-2"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 pt-4">
                <p className="flex items-center gap-2 text-bone">
                  <ShoppingBagOpen weight="light" className="size-5" aria-hidden />
                  Build request
                </p>
                <button type="button" onClick={() => setSheet(false)} className="grid size-9 place-items-center rounded-full border border-line text-bone" aria-label="Close build request">
                  <X weight="light" className="size-4" aria-hidden />
                </button>
              </div>
              <ul className="px-5 pt-3" aria-label="Selected features">
                {items.length === 0 && <li className="py-4 text-[0.92rem] text-moss">Nothing selected yet.</li>}
                {items.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 border-b border-line py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.95rem] text-bone">{f.name}</span>
                      <span className="annot mt-0.5 block text-moss">
                        {f.id} / {weeksLabel(f.weeks)}
                      </span>
                    </span>
                    <span className="tabular font-mono text-[0.9rem] text-bone">{usd(f.price)}</span>
                  </li>
                ))}
              </ul>
              {summary}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
