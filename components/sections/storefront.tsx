"use client";

import { useRef } from "react";
import { useStage } from "@/components/scene/use-stage";
import { ProposalSplit } from "@/components/storefront/proposal-split";
import { StorefrontDemo } from "@/components/storefront/storefront-demo";

/** B6a (pinned split) then B6b (the live storefront, wired to the lots in the field). */
export function Storefront() {
  const ref = useRef<HTMLElement>(null);
  const progress = useStage("storefront", ref, "pinned");
  return (
    <div id="storefront" className="relative">
      <section ref={ref} aria-labelledby="storefront-title" className="relative h-[320vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="scrim-t pointer-events-none absolute inset-x-0 top-0 h-[65%] md:hidden" />
          <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] md:block" />
          <div className="shell relative pt-[88px] md:pt-[16vh]">
            <ProposalSplit progress={progress} />
          </div>
        </div>
      </section>
      <section aria-label="Example storefront" className="relative pb-[clamp(4rem,10vh,6rem)] pt-[clamp(2rem,6vh,4rem)]">
        <div className="shell relative">
          <StorefrontDemo />
        </div>
      </section>
    </div>
  );
}
