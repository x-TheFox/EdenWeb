import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "AI integration services for your existing tools",
  description: "Connect AI to the tools and data your team already uses. Edencorp designs custom integrations with clear checks and human approval.",
  alternates: { canonical: "/services/ai-integration" },
};

const steps = [
  { number: "01", title: "Map the systems", body: "We identify the tools, data, and people involved. We agree what the AI needs to read and what it may change." },
  { number: "02", title: "Design the handoff", body: "We define where a person reviews the output, how errors appear, and what happens when data is missing." },
  { number: "03", title: "Build and test", body: "We connect the agreed systems and test the full path with your team before wider use." },
];

export default function AiIntegration() {
  return (
    <>
      <SiteNav />
      <main id="main" className="overflow-hidden">
        <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-[45rem]">
            <p className="annot mb-7 text-survey">AI integration services</p>
            <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">Make AI work with what you have.</h1>
            <p className="lede mt-8 max-w-[34rem]">Edencorp connects custom AI work to your existing software, data, and team decisions.</p>
            <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
            <Image src="/scene/poster-split.webp" alt="Abstract Edencorp field with connected forms" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
        </section>

        <section className="border-y border-line bg-ink-2/70">
          <div className="shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <div><p className="annot mb-5 text-survey">The work</p><h2 className="h2 max-w-[12ch] text-bone">A useful connection.</h2></div>
            <div className="max-w-[42rem]">
              <p className="lede">A copilot may need product records. A decision system may need data from several tools. An automated pipeline may need a review step.</p>
              <p className="mt-6 text-bone-dim">We design around the job and its limits. Your project can be a small connection or a wider software build. Scope and price follow the work.</p>
            </div>
          </div>
        </section>

        <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
          <div><p className="annot mb-5 text-survey">How it starts</p><h2 className="h2 max-w-[12ch] text-bone">Know the path before the build.</h2></div>
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
            <h2 className="h2 max-w-[12ch] text-bone">Tell us what should connect.</h2>
            <div className="max-w-[40rem]">
              <p className="lede">Name the tools you use and the result you need. We will discuss fit before setting a project scope.</p>
              <Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Start the fit check ↗</Link>
              <p className="mt-6 text-[0.95rem] text-bone-dim">Need a wider AI build? <Link href="/services/ai-development" className="text-bone underline decoration-survey underline-offset-4 hover:text-survey">Explore AI development</Link>.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
