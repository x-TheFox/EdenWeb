"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useStage } from "@/components/scene/use-stage";
import { BuildPortal } from "./build-portal";

/** B7: watch it grow. Only what was bought is built, in parallel, at the pace of the longest feature. */
export function Build() {
  const ref = useRef<HTMLElement>(null);
  const progress = useStage("build", ref, "pinned");
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && !!prefersReduced;

  return (
    <section ref={ref} id="step-build" aria-labelledby="build-title" className="relative h-[170vh] md:h-[180vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="scrim-t pointer-events-none absolute inset-x-0 top-0 h-[70%] md:hidden" />
        <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 hidden w-[56%] md:block" />
        <div className="shell relative pt-[84px] md:pt-[10vh]">
          <div data-copy className="max-w-[40rem]">
            <p className="annot text-moss">4 of 5. Build</p>
            <h3 id="build-title" className="h2 mt-3 text-[clamp(1.9rem,3.4vw,3rem)] text-bone">
              Watch it grow.
            </h3>
            <p className="lede mt-4 hidden max-w-[36rem] md:block">
              A live portal to follow and test the work. Updates where you already talk: Slack, WhatsApp, Discord or
              email. A set number of revision rounds before sign-off, and direct contact throughout.
            </p>
            <p className="lede mt-3 md:hidden">Every feature builds in parallel. The longest sets the pace.</p>
            <div className="mt-6">
              <BuildPortal progress={progress} reduce={reduce} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
