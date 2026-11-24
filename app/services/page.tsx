import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Custom AI and software engineering services",
  description: "Edencorp builds custom AI systems and software for businesses across industries. See what we build and start a fit check.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    number: "01",
    title: "AI systems",
    body: "Copilots, decision support, AI workforces, and agents built around your team and tools.",
    href: "/services/ai-development",
    label: "Explore AI development",
  },
  {
    number: "02",
    title: "Software engineering",
    body: "New products, internal tools, and connected systems built for the work you need done.",
    href: "/services/custom-software-development",
    label: "Explore custom software",
  },
];

export default function Services() {
  return (
    <>
      <SiteNav />
      <main id="main" className="overflow-hidden">
        <section className="shell grid items-center gap-12 pb-20 pt-36 lg:min-h-[82svh] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-[45rem]">
            <p className="annot mb-7 text-survey">What Edencorp does</p>
            <h1 className="display max-w-[13ch] text-[clamp(3.2rem,7vw,7rem)] text-bone">Custom AI and software. Built for your work.</h1>
            <p className="lede mt-8 max-w-[34rem]">Edencorp studies your business, then designs and builds the AI or software it needs. We work across industries.</p>
            <Link href="/#fit" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-survey px-6 py-3 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-200 hover:bg-survey-soft active:scale-[0.97]">Check fit <span aria-hidden className="ml-3">↗</span></Link>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
            <Image src="/scene/poster-own.webp" alt="Abstract Edencorp field with distinct forms" width={1000} height={1100} className="aspect-[4/4.5] w-full object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
        </section>

        <section className="border-y border-line bg-ink-2/70">
          <div className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <div>
              <p className="annot mb-5 text-survey">The offer</p>
              <h2 className="h2 max-w-[12ch] text-bone">The build follows the need.</h2>
            </div>
            <div className="max-w-[42rem]">
              <p className="lede">Bring us an AI task, a software idea, or a process that needs a new system.</p>
              <p className="mt-6 text-bone-dim">We learn the work and agree the scope before choosing the build. Eden does not sell a fixed platform or standard package.</p>
            </div>
          </div>
        </section>

        <section className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
          <div>
            <p className="annot mb-5 text-survey">Where we can help</p>
            <h2 className="h2 max-w-[12ch] text-bone">Two broad ways to build.</h2>
          </div>
          <div className="max-w-[42rem] divide-y divide-line border-t border-line">
            {services.map((service) => (
              <div key={service.number} className="grid gap-4 py-8 sm:grid-cols-[3rem_1fr] sm:gap-6">
                <span className="annot pt-1 text-survey">{service.number}</span>
                <div>
                  <h3 className="h3 text-bone">{service.title}</h3>
                  <p className="mt-3 text-bone-dim">{service.body}</p>
                  <Link href={service.href} className="mt-5 inline-block text-bone underline decoration-survey underline-offset-4 transition-colors hover:text-survey">{service.label} ↗</Link>
                  {service.number === "01" && <Link href="/services/ai-integration" className="ml-6 inline-block text-bone underline decoration-survey underline-offset-4 transition-colors hover:text-survey">Explore AI integration ↗</Link>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line bg-ink-2/70">
          <div className="shell grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:py-28">
            <h2 className="h2 max-w-[12ch] text-bone">Start with the work.</h2>
            <div className="max-w-[40rem]">
              <p className="lede">Tell us what you want to build. The fit check leads to a call if the project matches our work.</p>
              <Link href="/#fit" className="mt-8 inline-block text-bone underline decoration-survey underline-offset-8 transition-colors hover:text-survey">Start the fit check ↗</Link>
              <p className="mt-8 border-t border-line pt-6 text-[0.9rem] text-bone-dim">Edencorp is not a registered legal entity.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
