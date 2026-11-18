import { StageSection } from "@/components/scene/stage-section";
import { Reveal } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/button";
import { StepHead } from "./step-head";

/** B4: process heading and step 1 share one viewport. The camera travels toward the survey view. */
export function Qualify() {
  return (
    <StageSection stage="qualify" id="process" labelledBy="process-title" className="relative py-[clamp(5rem,12vh,8rem)]">
      <div className="shell relative">
        <div data-copy id="step-qualify" className="max-w-[40rem]">
          <Reveal>
            <h2 id="process-title" className="h2 max-w-[18ch] text-bone">
              How an engagement actually runs.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-14 max-w-[34rem]">
            <StepHead n={1} verb="Qualify" title="A short fit check." />
            <p className="lede mt-6">
              A call with whoever owns the decision. We confirm three things before anything else happens.
            </p>
            <ul className="mt-7 grid gap-3">
              {["A real bottleneck, or a clear vision", "A budget that fits the scope", "Readiness to move on a timeline"].map((l) => (
                <li key={l} className="flex gap-3 text-bone">
                  <span aria-hidden className="mt-[0.7em] h-px w-5 shrink-0 bg-survey" />
                  {l}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <TextLink href="#fit">Check fit</TextLink>
            </div>
          </Reveal>
        </div>
      </div>
    </StageSection>
  );
}
