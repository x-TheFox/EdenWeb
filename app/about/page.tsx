import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "About",
  description: "Edencorp builds bespoke AI systems and software around the way each business works, across industries.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <SiteNav />
      <main id="main" className="overflow-hidden">
        <section className="shell grid min-h-[80svh] items-center gap-12 pb-20 pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-[43rem]">
            <p className="annot mb-7 text-survey">About Edencorp</p>
            <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7.5rem)] text-bone">
              Built for your business. From the ground up.
            </h1>
            <p className="lede mt-8 max-w-[34rem]">
              We study how your business works, then build the AI or software it needs. Every project starts with your problem, not a fixed package.
            </p>
            <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">
              Check fit <span aria-hidden className="ml-3">↗</span>
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
            <Image src="/scene/poster-combed.webp" alt="An abstract field of arranged forms, used in Eden's site imagery" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
        </section>

        <section className="border-y border-line bg-ink-2/70">
          <div className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <h2 className="h2 max-w-[12ch] text-bone">The work follows the need.</h2>
            <div className="grid max-w-[39rem] gap-7 text-bone-dim">
              <p>We build AI workforces, copilots, decision systems, custom software and autonomous pipelines. The right shape depends on the work you need done.</p>
              <p>We work across industries. We learn your tools, team and constraints before we propose a scope. A project can cover one task or a larger system.</p>
              <p>You can own the source code at handover or ask us to manage the system. Scope sets the price, which we agree before a build begins.</p>
            </div>
          </div>
        </section>

        <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
          <h2 className="h2 max-w-[12ch] text-bone">A clear way to start.</h2>
          <div className="max-w-[39rem]">
            <p className="lede">Tell us what is slowing you down. We use the fit check to decide whether a call makes sense. If it does, we discuss the work before setting a paid audit or build scope.</p>
            <p className="mt-8 border-t border-line pt-6 text-[0.9rem] text-bone-dim">Edencorp is not a registered legal entity.</p>
            <Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Start with the fit check ↗</Link>
            <p className="mt-6 text-[0.95rem] text-bone-dim">Explore <Link href="/services/ai-agent-development" className="text-bone underline decoration-survey underline-offset-4 hover:text-survey">AI agent development</Link> or <Link href="/guides/ai-project-planning" className="text-bone underline decoration-survey underline-offset-4 hover:text-survey">read the AI project planning guide</Link>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
