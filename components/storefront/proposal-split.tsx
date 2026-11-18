"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { catalog, usd } from "./catalog";

const TOTAL = catalog.reduce((s, f) => s + f.price, 0);

function Row({ i, split, reduce }: { i: number; split: MotionValue<number>; reduce: boolean }) {
  const f = catalog[i];
  const a = i * 0.09;
  const b = a + 0.3;
  const y = useTransform(split, [a, b], [-24 * (i + 1), 0], { clamp: true });
  const o = useTransform(split, [a, a + 0.12], [0, 1], { clamp: true });
  const price = useTransform(split, [a, b], [0, f.price], { clamp: true });
  const text = useTransform(price, (v) => usd(Math.round(v)));
  return (
    <motion.li
      style={reduce ? undefined : { y, opacity: o }}
      className="grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-3 border-b border-line py-2.5 text-[0.92rem]"
    >
      <span className="font-mono text-[0.78rem] text-moss">{f.id}</span>
      <span className="hidden truncate text-bone sm:block">{f.name}</span>
      <span className="sm:hidden" />
      <motion.span className="tabular font-mono text-bone">{reduce ? usd(f.price) : text}</motion.span>
    </motion.li>
  );
}

/** B6a: one lump sum becomes eight separate decisions. Scrubbed by scroll, no interaction. */
export function ProposalSplit({ progress }: { progress: MotionValue<number> }) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && !!prefersReduced;

  const split = useTransform(progress, [0.15, 0.7], [0, 1], { clamp: true });
  const strike = useTransform(split, [0, 0.35], [0, 1], { clamp: true });
  const totalO = useTransform(split, [0, 0.4], [1, 0.35], { clamp: true });
  const beforeO = useTransform(split, [0.25, 0.45], [1, 0], { clamp: true });
  const afterO = useTransform(split, [0.45, 0.65], [0, 1], { clamp: true });
  const afterY = useTransform(split, [0.45, 0.65], [16, 0], { clamp: true });

  return (
    <div data-copy className="max-w-[34rem]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="annot text-moss">3 of 5. Choose</p>
        <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.72rem] text-moss">
          Example. Fictional company, illustrative prices.
        </span>
      </div>
      <div className="relative mt-4 min-h-[clamp(5.5rem,14vw,8rem)]">
        <motion.p
          aria-hidden
          style={reduce ? { opacity: 0 } : { opacity: beforeO }}
          className="h2 absolute inset-x-0 top-0 text-[clamp(1.9rem,3.4vw,3rem)] text-bone"
        >
          A proposal gives you one number.
        </motion.p>
        <motion.h2
          id="storefront-title"
          style={reduce ? undefined : { opacity: afterO, y: afterY }}
          className="h2 max-w-[16ch] text-[clamp(1.9rem,3.4vw,3rem)] text-bone"
        >
          A private storefront, not a proposal.
        </motion.h2>
      </div>
      <motion.p style={reduce ? undefined : { opacity: afterO }} className="lede mt-3">
        Every finding from the audit, listed with its scope, estimate and price. Add what you want, remove what you
        don&rsquo;t, then check out.
      </motion.p>

      <div className="mt-7">
        <motion.div style={reduce ? { opacity: 0.35 } : { opacity: totalO }} className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
          <span className="relative font-mono text-[0.78rem] text-moss">
            Proposal, 38 pages
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-1/2 block h-px origin-left bg-bone"
              style={{ scaleX: reduce ? 1 : strike }}
            />
          </span>
          <span className="tabular font-mono text-[clamp(1.5rem,2.6vw,2.1rem)] text-bone">{usd(TOTAL)}</span>
        </motion.div>
        <ol aria-label="The same total, split into the eight audited features">
          {catalog.map((f, i) => (
            <Row key={f.id} i={i} split={split} reduce={reduce} />
          ))}
        </ol>
      </div>
    </div>
  );
}
