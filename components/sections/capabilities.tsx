import Link from "next/link";
import { StageSection } from "@/components/scene/stage-section";
import { Reveal } from "@/components/ui/reveal";

const items = [
  {
    name: "AI workforces",
    body: "Repetitive operations, handled end to end. Fully autonomous, or human-in-the-loop so your team gets faster.",
    tags: ["Customer support", "Data entry", "Outbound sales", "Back office", "QA generation"],
  },
  {
    name: "Bespoke copilots",
    body: "Built around one team's tools, data and habits, so the people you already have move faster.",
    tags: ["Your tools", "Your data", "Your workflow"],
  },
  {
    name: "Predictive and strategic intelligence",
    body: "Forecasts and decision support built from your operational and market data. Fewer guesses at the top.",
    tags: ["Forecasting", "Decision support", "Market signals"],
  },
  {
    name: "Custom software and autonomous pipelines",
    body: "Platforms and pipelines built from nothing. Bring the vision and the budget, and we will build it.",
    tags: ["Platforms", "Internal tools", "End-to-end pipelines"],
  },
];

/** B3: a rest beat. The copy is the content; the field stays dim and still behind it. */
export function Capabilities() {
  return (
    <StageSection stage="capabilities" id="work" labelledBy="work-title" className="relative py-[clamp(5rem,12vh,8rem)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/60 to-transparent" />
      <div className="shell relative">
        <div data-copy>
          <Reveal>
            <h2 id="work-title" className="h2 max-w-[16ch] text-bone">
              Four kinds of work. One standard.
            </h2>
          </Reveal>
          <ul className="mt-14 border-t border-line">
            {items.map((it, i) => (
              <Reveal
                as="li"
                key={it.name}
                delay={i * 0.06}
                className="group grid gap-4 border-b border-line py-8 transition-colors duration-300 hover:border-bone-dim/60 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 md:py-10"
              >
                <h3 className="h3 max-w-[20ch] text-bone">{it.name}</h3>
                <div>
                  <p className="max-w-[52ch] text-bone-dim">{it.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${it.name} examples`}>
                    {it.tags.map((t) => (
                      <li key={t} className="rounded-full border border-line px-3 py-1 text-[0.8rem] text-bone-dim">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10">
            <p className="max-w-[40rem] text-bone-dim">
              Buy one piece or all four. <span className="text-bone">Scope sets the price, never a package.</span>
            </p>
          </Reveal>
          <Reveal className="mt-6">
            <nav aria-label="Explore Eden's work" className="flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem]">
              <Link href="/services" className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone">
                See all AI and software services
              </Link>
              <Link href="/services/custom-software-development" className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone">
                Explore custom software development
              </Link>
              <Link href="/services/ai-development" className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone">
                Explore AI development
              </Link>
              <Link href="/services/ai-integration" className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone">
                Explore AI integration
              </Link>
              <Link href="/services/ai-consulting" className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone">
                Explore AI consulting
              </Link>
              <Link href="/services/ai-automation" className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone">
                Explore AI automation
              </Link>
              <Link href="/services/ai-agent-development" className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone">
                Explore AI agent development
              </Link>
              <Link href="/guides/ai-project-planning" className="text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone">
                Read the AI project planning guide
              </Link>
            </nav>
          </Reveal>
        </div>
      </div>
    </StageSection>
  );
}
