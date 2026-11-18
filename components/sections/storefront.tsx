import { StageSection } from "@/components/scene/stage-section";
import { Reveal } from "@/components/ui/reveal";
import { StorefrontDemo } from "@/components/storefront/storefront-demo";

export function Storefront() {
  return (
    <StageSection stage="storefront" id="storefront" labelledBy="storefront-title" className="relative py-[clamp(6rem,16vh,10rem)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/85 to-ink/85" />
      <div className="shell relative">
        <Reveal>
          <h2 id="storefront-title" className="h2 max-w-[14ch] text-bone">This is how you&rsquo;ll buy it.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="lede mt-5 max-w-[34rem]">
            After the audit you get a private storefront like this one, with every feature priced. Try it.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="mt-12">
          <StorefrontDemo />
        </Reveal>
      </div>
    </StageSection>
  );
}
