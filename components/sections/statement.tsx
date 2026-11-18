import { StageSection } from "@/components/scene/stage-section";
import { Reveal } from "@/components/ui/reveal";

export function Statement() {
  return (
    <StageSection stage="statement" labelledBy="statement-title" className="relative flex min-h-[130vh] items-center py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_50%,rgb(12_15_13/0.8),transparent)]" />
      <div className="shell relative">
        <Reveal>
          <h2 id="statement-title" className="display max-w-[15ch] text-[clamp(2.6rem,6.2vw,5.8rem)] text-bone">
            Cheap systems are the most expensive thing you can buy.
          </h2>
        </Reveal>
        <div className="mt-12 grid max-w-[54rem] gap-8 md:grid-cols-2 md:gap-12">
          <Reveal delay={0.1}>
            <p className="lede">
              You pay once for the build, then again for everything it breaks. We charge for work that holds.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lede">
              Our incentive is openly selfish: we only do well when you earn more and run faster. So every feature we
              propose has to earn its place.
            </p>
          </Reveal>
        </div>
      </div>
    </StageSection>
  );
}
