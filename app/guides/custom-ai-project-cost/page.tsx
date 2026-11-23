import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Custom AI project cost: what shapes the price",
  description: "Learn what shapes a custom AI project proposal, from discovery and build scope to model usage and ongoing support.",
  alternates: { canonical: "/guides/custom-ai-project-cost" },
};

const factors = [
  { number: "01", title: "The work to understand", body: "The audit maps the task, people, systems, data, and exceptions. Its deposit depends on scope and is credited toward the build you choose." },
  { number: "02", title: "The system to build", body: "A focused copilot and a system that acts across several tools need different design, integration, testing, and review work." },
  { number: "03", title: "The cost to run it", body: "Model and provider usage depends on what the system does and how often people use it. Discuss provider keys or a capped usage balance during scoping." },
];

export default function CustomAiProjectCost() {
  return (
    <>
      <SiteNav />
      <main id="main" className="overflow-hidden">
        <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-[45rem]">
            <p className="annot mb-7 text-survey">Custom AI project cost</p>
            <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">Price follows the work.</h1>
            <p className="lede mt-8 max-w-[34rem]">A useful proposal separates the cost to understand, build, and run your AI system.</p>
            <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
            <Image src="/scene/poster-own.webp" alt="Edencorp's abstract field of connected forms" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
        </section>

        <section className="border-y border-line bg-ink-2/70">
          <div className="shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <div>
              <p className="annot mb-5 text-survey">What shapes a proposal</p>
              <h2 className="h2 max-w-[12ch] text-bone">Three costs to discuss.</h2>
            </div>
            <ol className="max-w-[42rem] divide-y divide-line border-t border-line">
              {factors.map((factor) => (
                <li key={factor.number} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6">
                  <span className="annot pt-1 text-survey">{factor.number}</span>
                  <div><h3 className="h3 text-bone">{factor.title}</h3><p className="mt-3 max-w-[37rem] text-bone-dim">{factor.body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
          <h2 className="h2 max-w-[12ch] text-bone">What you get before choosing a build.</h2>
          <div className="max-w-[40rem]">
            <p className="lede">After the audit, proposed features have their own scope, estimate, and price. You choose what to build.</p>
            <p className="mt-6 text-bone-dim">There is no fixed minimum budget or standard timeline. A fit call starts the discussion; the project proposal follows the work.</p>
            <p className="mt-6 text-[0.95rem] text-bone-dim">Planning the work first? <Link href="/guides/ai-project-planning" className="text-bone underline decoration-survey underline-offset-4 hover:text-survey">Read the AI project planning guide</Link>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
