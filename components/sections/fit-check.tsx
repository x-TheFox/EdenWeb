import { Reveal } from "@/components/ui/reveal";
import { FitForm } from "./fit-form";

export function FitCheck() {
  return (
    <section id="fit" aria-labelledby="fit-title" className="relative bg-gradient-to-b from-ink/85 to-ink py-[clamp(6rem,16vh,10rem)]">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <h2 id="fit-title" className="display text-[clamp(3rem,6vw,5.5rem)] text-bone">Check fit.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="lede mt-6 max-w-[24rem]">Two minutes. If there&rsquo;s a fit, you&rsquo;ll book a call with us next.</p>
          </Reveal>
          <Reveal delay={0.14}>
            <ul className="mt-10 grid gap-4 text-[0.95rem] text-bone-dim">
              <li className="flex gap-3"><span aria-hidden className="mt-[0.75em] h-px w-5 shrink-0 bg-survey" />No minimum budget. Pick whichever range is honest.</li>
              <li className="flex gap-3"><span aria-hidden className="mt-[0.75em] h-px w-5 shrink-0 bg-survey" />Your answers go to us and nobody else.</li>
            </ul>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <Reveal delay={0.1}>
            <FitForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
