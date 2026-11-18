import { Reveal } from "@/components/ui/reveal";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export const faqs = [
  { q: "Do you build on templates?", a: "No. Every engagement starts from an audit of your operations, and every system is built for them. We use proven models and libraries the way any engineer does, but nothing we deliver is a resold template." },
  { q: "Will I see prices before I commit?", a: "Yes. Every feature from the audit sits in your storefront with its scope, estimate and price. You pick, then check out." },
  { q: "Who owns the code?", a: "You can. Choose full handover and you get the complete source, deployed to your infrastructure, with no obligation to us. Or keep us on a retainer to run it." },
  { q: "What happens to our data?", a: "NDA from the start, zero data retention, an isolated environment for every client, and the option to run everything inside your own infrastructure." },
  { q: "Could AI usage costs surprise us?", a: "No. Use your own API keys, or prepay a balance through us with hard limits. We never bill usage after the fact." },
  { q: "Is there a minimum budget?", a: "No. A single workflow for a solo founder and a multi-department system are both real projects. Price follows scope." },
  { q: "How long does a build take?", a: "It depends on scope and industry, so we don't publish a standard timeline. Each feature in your storefront carries its own estimate." },
  { q: "What does the audit cost?", a: "It carries a deposit sized to the scope, credited in full toward whatever you build." },
  { q: "Which industries do you work in?", a: "All of them. The method is the same everywhere: study the operation deeply, then build exactly what it needs." },
  { q: "Why pay a premium?", a: "Because the cheap version usually gets built twice. A system that breaks costs more than it saves, and the second build costs more than doing it right once." },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-ink/85 pb-[clamp(4rem,10vh,6rem)] pt-[clamp(3rem,8vh,5rem)]">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <h2 id="faq-title" className="h2 text-bone lg:sticky lg:top-28">Straight answers.</h2>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <div className="border-t border-line">
            {faqs.map((f) => (
              <details key={f.q} className="faq group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.08rem] text-bone transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line transition-[transform,border-color] duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:border-survey">
                    <Plus weight="light" className="size-3.5" aria-hidden />
                  </span>
                </summary>
                <div className="faq-body">
                  <p className="max-w-[60ch] pb-7 pr-12 text-bone-dim">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </section>
  );
}
