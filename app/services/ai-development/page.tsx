import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "AI development agency",
  description: "Edencorp builds custom AI systems and software around your work. Explore the approach and tell us what you need built.",
  alternates: { canonical: "/services/ai-development" },
};

const work = [
  { number: "01", title: "AI inside your software", body: "Add a useful AI feature to an existing product or build a new tool around one clear job." },
  { number: "02", title: "Systems that help decisions", body: "Bring the right facts together, show the reasoning, and keep the final call with your team." },
  { number: "03", title: "Work that moves across tools", body: "Connect steps, checks, and approvals so a process can move without losing human control." },
];

export default function AiDevelopment() {
  return (
    <>
      <SiteNav />
      <main id="main" className="overflow-hidden">
        <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-[45rem]">
            <p className="annot mb-7 text-survey">AI development agency</p>
            <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">Build what your work needs.</h1>
            <p className="lede mt-8 max-w-[34rem]">Edencorp designs and builds custom AI systems and software for the way your business works.</p>
            <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
            <Image src="/scene/poster-wild.webp" alt="Edencorp abstract field of varied forms" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
        </section>

        <section className="border-y border-line bg-ink-2/70">
          <div className="shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <div>
              <p className="annot mb-5 text-survey">The scope</p>
              <h2 className="h2 max-w-[12ch] text-bone">One need. Many possible builds.</h2>
            </div>
            <div className="max-w-[42rem]">
              <p className="lede">Your project might need a copilot, a decision system, an autonomous pipeline, or custom software.</p>
              <p className="mt-6 text-bone-dim">We study the work before choosing the shape. Eden works across industries and does not sell a fixed platform.</p>
            </div>
          </div>
        </section>

        <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
          <div>
            <p className="annot mb-5 text-survey">What we build</p>
            <h2 className="h2 max-w-[12ch] text-bone">Designed around the job.</h2>
          </div>
          <ol className="max-w-[42rem] divide-y divide-line border-t border-line">
            {work.map((item) => (
              <li key={item.number} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6">
                <span className="annot pt-1 text-survey">{item.number}</span>
                <div><h3 className="h3 text-bone">{item.title}</h3><p className="mt-3 max-w-[37rem] text-bone-dim">{item.body}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-line bg-ink-2/70">
          <div className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <h2 className="h2 max-w-[12ch] text-bone">Tell us what you need.</h2>
            <div className="max-w-[40rem]">
              <p className="lede">Describe the work and the result you want. We will discuss fit before setting a project scope and price.</p>
              <Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Start the fit check ↗</Link>
              <p className="mt-6 text-[0.95rem] text-bone-dim">Need a system that can act across tools? <Link href="/services/ai-agent-development" className="text-bone underline decoration-survey underline-offset-4 hover:text-survey">Explore AI agent development</Link>.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
