import { PrimaryLink, TextLink } from "@/components/ui/button";
import { HeroTitle } from "./hero-title";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col justify-end">
      <div className="scrim-b pointer-events-none absolute inset-x-0 bottom-0 h-[70%]" />
      <div className="shell relative pb-[clamp(2.5rem,9vh,6.5rem)]">
        <div data-copy className="max-w-[46rem]">
          <HeroTitle />
          <div className="hero-in mt-7 max-w-[36rem]" style={{ animationDelay: "650ms" }}>
            <p className="lede">
              Edencorp studies how your business actually runs, then builds the AI and software it needs. Nothing off
              the shelf.
            </p>
          </div>
          <p className="hero-in annot mt-7 flex items-center gap-3 text-moss md:hidden" style={{ animationDelay: "1600ms" }}>
            <span aria-hidden className="block h-6 w-px bg-bone" />
            Each stalk is one task your business repeats.
          </p>
          <div className="hero-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-9" style={{ animationDelay: "800ms" }}>
            <PrimaryLink href="#fit">Check fit</PrimaryLink>
            <TextLink href="#process">See how it works</TextLink>
          </div>
        </div>
      </div>

      <p
        className="hero-in annot absolute bottom-[clamp(2.5rem,9vh,6.5rem)] right-[clamp(1rem,4vw,3.5rem)] hidden max-w-[18rem] items-center gap-3 text-right text-moss md:flex"
        style={{ animationDelay: "1600ms" }}
      >
        <span aria-hidden className="block h-6 w-px shrink-0 bg-bone" />
        Each stalk is one task your business repeats.
      </p>
      <div
        aria-hidden
        className="hero-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        style={{ animationDelay: "2000ms" }}
      >
        <span className="annot text-moss">Scroll to put it in order</span>
        <span className="scroll-line block h-7 w-px origin-top bg-bone" />
      </div>
    </section>
  );
}
