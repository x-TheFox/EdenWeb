import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Need an AI agent development agency?",
  description: "Need an agent for a real business task? Edencorp builds custom AI agents around your tools, with clear limits and human review.",
  alternates: { canonical: "/services/ai-agent-development" },
};

const stages = [
  { number: "01", title: "Find the right task", body: "We map the request, the systems it touches, and the person who owns the result. Some tasks need ordinary software, not an agent." },
  { number: "02", title: "Set the boundaries", body: "We define what the agent may read, draft, or change. We mark actions that need a person's approval and what happens when it is unsure." },
  { number: "03", title: "Build and check", body: "We connect the agreed tools, test common and unusual cases, and let your team review the result before wider use." },
];

export default function AiAgentDevelopment() {
  return (
    <>
      <SiteNav />
      <main id="main" className="overflow-hidden">
        <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-[45rem]">
            <p className="annot mb-7 text-survey">AI agent development agency</p>
            <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">An agent built for your work.</h1>
            <p className="lede mt-8 max-w-[34rem]">Edencorp builds custom AI agents that work with your tools, follow your rules, and know when a person must decide.</p>
            <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
            <Image src="/scene/poster-split.webp" alt="An abstract field divided into two working paths" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
        </section>

        <section className="border-y border-line bg-ink-2/70">
          <div className="shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <div>
              <p className="annot mb-5 text-survey">The work</p>
              <h2 className="h2 max-w-[12ch] text-bone">More than a chat window.</h2>
            </div>
            <div className="max-w-[42rem]">
              <p className="lede">An agent can read a request, find the facts it needs, prepare a response, and take an approved action in another system.</p>
              <p className="mt-6 text-bone-dim">That might mean routing a support case, checking an order, or preparing a decision for your team. The job depends on your process. We do not sell a fixed agent or promise that every task should run without review.</p>
            </div>
          </div>
        </section>

        <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
          <div>
            <p className="annot mb-5 text-survey">The build</p>
            <h2 className="h2 max-w-[12ch] text-bone">Make the limits clear first.</h2>
          </div>
          <ol className="max-w-[42rem] divide-y divide-line border-t border-line">
            {stages.map((stage) => (
              <li key={stage.number} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6">
                <span className="annot pt-1 text-survey">{stage.number}</span>
                <div><h3 className="h3 text-bone">{stage.title}</h3><p className="mt-3 max-w-[37rem] text-bone-dim">{stage.body}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-line bg-ink-2/70">
          <div className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <h2 className="h2 max-w-[12ch] text-bone">Start with one real job.</h2>
            <div className="max-w-[40rem]">
              <p className="lede">Tell us what your team repeats, which tools are involved, and what a correct result looks like. We will discuss fit before setting a project scope and price.</p>
              <Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Tell us what you want to build ↗</Link>
              <p className="mt-6 text-[0.95rem] text-bone-dim">Still choosing the first task? <Link href="/guides/ai-project-planning" className="text-bone underline decoration-survey underline-offset-4 hover:text-survey">Read the AI project planning guide</Link>.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
