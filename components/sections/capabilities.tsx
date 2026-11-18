import { StageSection } from "@/components/scene/stage-section";
import { Reveal } from "@/components/ui/reveal";
import { CapabilityList } from "./capability-list";

export function Capabilities() {
  return (
    <StageSection stage="capabilities" id="work" labelledBy="work-title" className="relative py-[clamp(7rem,18vh,12rem)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/70 to-transparent" />
      <div className="shell relative">
        <Reveal>
          <h2 id="work-title" className="h2 max-w-[14ch] text-bone">
            Four kinds of work. One standard.
          </h2>
        </Reveal>
        <CapabilityList />
        <Reveal className="mt-14">
          <p className="max-w-[40rem] text-bone-dim">
            Buy one piece or all four. <span className="text-bone">Scope sets the price, never a package.</span>
          </p>
        </Reveal>
      </div>
    </StageSection>
  );
}
