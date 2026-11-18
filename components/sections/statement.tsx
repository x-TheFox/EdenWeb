import { StageSection } from "@/components/scene/stage-section";
import { Reveal } from "@/components/ui/reveal";

/** B2: same work, two builds. Scroll is time passing; only the cheap half decays (see the scene). */
export function Statement() {
  return (
    <StageSection stage="statement" mode="pinned" labelledBy="statement-title" className="relative h-[140vh] md:h-[160vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[88px] md:justify-center md:pt-0">
        <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 hidden w-[60%] md:block" />
        <div className="scrim-t pointer-events-none absolute inset-x-0 top-0 h-[75%] md:hidden" />
        <div className="shell relative">
          <div data-copy className="max-w-[46rem] md:max-w-[min(46rem,52vw)]">
            <Reveal>
              <h2 id="statement-title" className="display text-[clamp(2.3rem,5.2vw,5rem)] text-bone">
                Cheap systems are the most expensive thing you can buy.
              </h2>
            </Reveal>
            <div className="mt-8 grid max-w-[40rem] gap-5 md:mt-10 md:gap-6">
              <Reveal delay={0.06}>
                <p className="lede">
                  You pay once for the build, then again for everything it breaks. We charge for work that holds.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="lede">
                  Our incentive is openly selfish: we only do well when you earn more and run faster. So every feature
                  we propose has to earn its place.
                </p>
              </Reveal>
              <p className="sr-only">
                In the field beside this text, the half labelled Built to hold keeps working as you scroll, and the
                half labelled Built cheap falls apart over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StageSection>
  );
}
