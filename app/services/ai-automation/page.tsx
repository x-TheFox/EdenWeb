import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "AI automation agency for custom workflows",
  description: "Edencorp builds custom AI automation around your team's real work. Connect steps, checks, and tools while keeping people in control.",
  alternates: { canonical: "/services/ai-automation" },
};

const steps = [
  { number: "01", title: "Map the workflow", body: "We follow the work from request to result and find the steps that slow people down." },
  { number: "02", title: "Set the safeguards", body: "We define what the system may do, what needs approval, and how people handle exceptions." },
  { number: "03", title: "Build around your tools", body: "We connect the agreed steps, test real cases with your team, and hand over the finished system." },
];

export default function AiAutomation() {
  return <>
    <SiteNav />
    <main id="main" className="overflow-hidden">
      <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="max-w-[45rem]">
          <p className="annot mb-7 text-survey">AI automation agency</p>
          <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">Move the work. Keep the judgment.</h1>
          <p className="lede mt-8 max-w-[34rem]">Edencorp builds AI workflows that move work across your tools while your team owns important decisions.</p>
          <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
        </div>
        <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
          <Image src="/scene/poster-combed.webp" alt="Abstract Edencorp field with connected paths" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
        </div>
      </section>
      <section className="border-y border-line bg-ink-2/70"><div className="shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
        <div><p className="annot mb-5 text-survey">The work</p><h2 className="h2 max-w-[12ch] text-bone">A workflow made for you.</h2></div>
        <div className="max-w-[42rem]"><p className="lede">A request may need facts from several systems, a useful AI response, and a person to approve the result.</p><p className="mt-6 text-bone-dim">We build that path for your operations. Eden works across industries and does not sell a fixed automation platform.</p></div>
      </div></section>
      <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
        <div><p className="annot mb-5 text-survey">How it works</p><h2 className="h2 max-w-[12ch] text-bone">From handoff to result.</h2></div>
        <ol className="max-w-[42rem] divide-y divide-line border-t border-line">{steps.map((step) => <li key={step.number} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6"><span className="annot pt-1 text-survey">{step.number}</span><div><h3 className="h3 text-bone">{step.title}</h3><p className="mt-3 max-w-[37rem] text-bone-dim">{step.body}</p></div></li>)}</ol>
      </section>
      <section className="border-t border-line bg-ink-2/70"><div className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
        <h2 className="h2 max-w-[12ch] text-bone">Show us the stuck step.</h2><div className="max-w-[40rem]"><p className="lede">Describe the work you want to move. We will discuss fit before setting a project scope.</p><Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Start the fit check ↗</Link></div>
      </div></section>
    </main>
    <Footer />
  </>;
}
