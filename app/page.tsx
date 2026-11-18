import { SiteNav } from "@/components/nav/site-nav";
import { SceneBackdrop } from "@/components/scene/scene-backdrop";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Build } from "@/components/sections/build";
import { Capabilities } from "@/components/sections/capabilities";
import { Comb } from "@/components/sections/comb";
import { Faq } from "@/components/sections/faq";
import { FitCheck } from "@/components/sections/fit-check";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Own } from "@/components/sections/own";
import { ProcessNav } from "@/components/sections/process-nav";
import { Proof } from "@/components/sections/proof";
import { Qualify } from "@/components/sections/qualify";
import { Security } from "@/components/sections/security";
import { Statement } from "@/components/sections/statement";
import { Storefront } from "@/components/sections/storefront";
import { Survey } from "@/components/sections/survey";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SceneBackdrop />
      <div className="grain" aria-hidden />
      <SiteNav />
      <main id="main" className="relative z-10">
        <Hero />
        <Comb />
        <Statement />
        <Capabilities />
        <ProcessNav>
          <Qualify />
          <Survey />
          <Storefront />
          <Build />
          <Own />
        </ProcessNav>
        <Security />
        <Proof />
        <Faq />
        <FitCheck />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
