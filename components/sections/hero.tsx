import { PrimaryLink, TextLink } from "@/components/ui/button";
import { HeroTitle } from "./hero-title";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[100dvh] flex-col justify-end">
      <div className="scrim-b pointer-events-none absolute inset-x-0 bottom-0 h-[70%]" />
      <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 w-full md:w-[70%]" />
      <div className="shell relative pb-[clamp(2.5rem,9vh,6.5rem)]">
        <HeroTitle />
        <div className="hero-in mt-7 max-w-[36rem]" style={{ animationDelay: "650ms" }}>
          <p className="lede">
            Edencorp studies how your business actually runs, then engineers the AI and software that make it faster
            and more profitable.
          </p>
        </div>
        <div className="hero-in mt-9 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "800ms" }}>
          <PrimaryLink href="#fit">Check fit</PrimaryLink>
          <TextLink href="#process">See how it works</TextLink>
        </div>
      </div>
    </section>
  );
}
