import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Need a custom software development agency?",
  description: "Need a product or internal tool built for your business? Edencorp scopes and builds custom software, then agrees the handover or support.",
  alternates: { canonical: "/services/custom-software-development" },
};

const steps = [
  { number: "01", title: "Define the job", body: "We learn who will use the software, what it must do, and where current tools fall short." },
  { number: "02", title: "Shape the build", body: "We set the scope around your project. The work may be a new platform, an internal tool, or a connection between systems." },
  { number: "03", title: "Build and hand over", body: "We build in stages, share progress, and agree on the handover or ongoing support your team needs." },
];

export default function CustomSoftwareDevelopment() {
  return (
    <>
      <SiteNav />
      <main id="main" className="overflow-hidden">
        <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-[45rem]">
            <p className="annot mb-7 text-survey">Custom software development agency</p>
            <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">Software shaped around your work.</h1>
            <p className="lede mt-8 max-w-[34rem]">Edencorp builds bespoke software for businesses across industries. Start with the problem, not a fixed product.</p>
            <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
            <Image src="/scene/poster-own.webp" alt="Edencorp abstract field showing connected forms" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
        </section>

        <section className="border-y border-line bg-ink-2/70">
          <div className="shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <div><p className="annot mb-5 text-survey">The work</p><h2 className="h2 max-w-[12ch] text-bone">A build for a real need.</h2></div>
            <div className="max-w-[42rem]">
              <p className="lede">Your project could be a customer platform, a tool for your team, or software that connects existing systems.</p>
              <p className="mt-6 text-bone-dim">We study the work first, then propose the scope and price. There is no standard package or fixed delivery time.</p>
            </div>
          </div>
        </section>

        <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
          <div><p className="annot mb-5 text-survey">How it starts</p><h2 className="h2 max-w-[12ch] text-bone">From brief to build.</h2></div>
          <ol className="max-w-[42rem] divide-y divide-line border-t border-line">
            {steps.map((step) => (
              <li key={step.number} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6">
                <span className="annot pt-1 text-survey">{step.number}</span>
                <div><h3 className="h3 text-bone">{step.title}</h3><p className="mt-3 max-w-[37rem] text-bone-dim">{step.body}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-line bg-ink-2/70">
          <div className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <h2 className="h2 max-w-[12ch] text-bone">Tell us what you need built.</h2>
            <div className="max-w-[40rem]">
              <p className="lede">Tell us what the software must help people do. We will discuss fit before defining the project.</p>
              <Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Start the fit check ↗</Link>
              <p className="mt-6 text-[0.95rem] text-bone-dim">Need AI inside the build? <Link href="/services/ai-development" className="text-bone underline decoration-survey underline-offset-4 hover:text-survey">Explore AI development</Link>.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
export const dynamic = "force-static";
