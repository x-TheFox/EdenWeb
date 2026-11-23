import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "AI project planning: start with the work",
  description: "A practical AI project planning guide: define the problem, map the work, choose a first build, and set clear checks before development.",
  alternates: { canonical: "/guides/ai-project-planning" },
};

const steps = [
  { number: "01", title: "Name the work", body: "Describe one task or decision in plain language. Who does it now? What starts it? What result should come out?" },
  { number: "02", title: "Trace the real path", body: "List the tools, data, handoffs and exceptions. Include the cases that need a person to review or approve them." },
  { number: "03", title: "Pick a first build", body: "Choose a bounded part of the work that you can test. Decide whether it needs AI, ordinary software, or both." },
  { number: "04", title: "Set the checks", body: "Write down what a correct result looks like, who will test it, and what must happen when the system is unsure." },
];

export default function AiProjectPlanning() {
  return (
    <>
      <SiteNav />
      <main id="main" className="overflow-hidden">
        <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-[45rem]">
            <p className="annot mb-7 text-survey">AI project planning</p>
            <h1 className="display max-w-[12ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">Start with the work. Then choose the build.</h1>
            <p className="lede mt-8 max-w-[34rem]">A useful AI project starts with a clear task, the people it affects, and a result you can check.</p>
            <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
            <Image src="/scene/poster-combed.webp" alt="Edencorp's abstract field of arranged forms" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
        </section>

        <section className="border-y border-line bg-ink-2/70">
          <div className="shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <div>
              <p className="annot mb-5 text-survey">Before you commission</p>
              <h2 className="h2 max-w-[12ch] text-bone">Four things to bring into focus.</h2>
            </div>
            <ol className="max-w-[42rem] divide-y divide-line border-t border-line">
              {steps.map((step) => (
                <li key={step.number} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6">
                  <span className="annot pt-1 text-survey">{step.number}</span>
                  <div><h3 className="h3 text-bone">{step.title}</h3><p className="mt-3 max-w-[37rem] text-bone-dim">{step.body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
          <h2 className="h2 max-w-[12ch] text-bone">What to ask a build partner.</h2>
          <div className="max-w-[40rem]">
            <p className="lede">Ask how they will learn the work, test the first version, handle exceptions, and set the scope. Agree on ownership and running costs before development starts.</p>
            <p className="mt-6 text-bone-dim">At Eden, the fit check starts that conversation. We study the work before proposing a project scope and price.</p>
            <Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Tell us what you want to build ↗</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
