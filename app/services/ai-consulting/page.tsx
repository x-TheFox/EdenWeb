import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "AI consulting services for a clear project plan",
  description: "Need to decide where AI fits? Edencorp studies your work, maps the risks, and scopes a custom AI or software project before the build.",
  alternates: { canonical: "/services/ai-consulting" },
};

const steps = [
  { number: "01", title: "Understand the work", body: "We speak with the people who own the process and map its goals, tools, and limits." },
  { number: "02", title: "Test the options", body: "We compare possible AI and software approaches, including where a person must stay in control." },
  { number: "03", title: "Define the build", body: "We set a practical scope and proposal. Price and timing follow the work, not a fixed package." },
];

export default function AiConsulting() {
  return <>
    <SiteNav />
    <main id="main" className="overflow-hidden">
      <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="max-w-[45rem]">
          <p className="annot mb-7 text-survey">AI consulting services</p>
          <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">Know what to build first.</h1>
          <p className="lede mt-8 max-w-[34rem]">Edencorp helps you find where AI can serve your business, then defines a project your team can judge.</p>
          <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
        </div>
        <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
          <Image src="/scene/poster-survey.webp" alt="Abstract Edencorp field showing varied paths" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
        </div>
      </section>
      <section className="border-y border-line bg-ink-2/70"><div className="shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
        <div><p className="annot mb-5 text-survey">The question</p><h2 className="h2 max-w-[12ch] text-bone">Where would AI help?</h2></div>
        <div className="max-w-[42rem]"><p className="lede">A good project starts with a real job, not a tool choice.</p><p className="mt-6 text-bone-dim">We study the work, the available data, and the people affected. We can then recommend a custom AI system, software build, or a simpler path.</p></div>
      </div></section>
      <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
        <div><p className="annot mb-5 text-survey">How it works</p><h2 className="h2 max-w-[12ch] text-bone">A plan tied to your work.</h2></div>
        <ol className="max-w-[42rem] divide-y divide-line border-t border-line">{steps.map((step) => <li key={step.number} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6"><span className="annot pt-1 text-survey">{step.number}</span><div><h3 className="h3 text-bone">{step.title}</h3><p className="mt-3 max-w-[37rem] text-bone-dim">{step.body}</p></div></li>)}</ol>
      </section>
      <section className="border-t border-line bg-ink-2/70"><div className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
        <h2 className="h2 max-w-[12ch] text-bone">Bring us the problem.</h2><div className="max-w-[40rem]"><p className="lede">Tell us what needs to change. We will discuss fit before agreeing any scope or price.</p><Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Start the fit check ↗</Link></div>
      </div></section>
    </main>
    <Footer />
  </>;
}
