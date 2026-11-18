import { StageSection } from "@/components/scene/stage-section";
import { Reveal } from "@/components/ui/reveal";

const data = [
  { t: "NDA before we see anything", d: "Signed before the first conversation about your operations." },
  { t: "Zero data retention", d: "Your data is used for your build and nothing else, and it is not kept afterwards." },
  { t: "An isolated environment per client", d: "No shared workspaces, no shared credentials, no cross-client access." },
  { t: "Run it inside your own infrastructure", d: "Deploy on your servers or cloud account, with the full source code." },
];

export function Security() {
  return (
    <StageSection stage="security" id="security" labelledBy="security-title" className="relative py-[clamp(5rem,12vh,8rem)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/70 to-ink/85" />
      <div className="shell relative grid gap-16 lg:grid-cols-12">
        <div data-copy className="lg:col-span-5">
          <Reveal>
            <h2 id="security-title" className="h2 max-w-[11ch] text-bone">Your ground. Your walls.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="lede mt-6 max-w-[30rem]">
              The practices we follow on every engagement, from the first call to the last line of code.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-12 lg:col-span-7">
          <div>
            <h3 className="annot text-moss">Your data</h3>
            <ul className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {data.map((x, i) => (
                <Reveal as="li" key={x.t} delay={i * 0.06}>
                  <span aria-hidden className="block h-px w-8 bg-bone-dim" />
                  <p className="mt-4 text-[1.08rem] text-bone">{x.t}</p>
                  <p className="mt-2 text-[0.95rem] text-bone-dim">{x.d}</p>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-surface)] border border-line bg-ink-2/80 p-7 md:p-9">
            <h3 className="annot text-moss">AI usage costs</h3>
            <p className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight tracking-[-0.02em] text-bone">
              Never an invoice you didn&rsquo;t see coming.
            </p>
            <div className="mt-7 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-bone">Bring your own keys</p>
                <p className="mt-2 text-[0.95rem] text-bone-dim">Usage is billed to you directly by the provider. We never sit in the middle.</p>
              </div>
              <div>
                <p className="text-bone">Or prepay through us</p>
                <p className="mt-2 text-[0.95rem] text-bone-dim">
                  You fund a balance. Hard limits stop usage when it runs out, until you top up.
                </p>
              </div>
            </div>
            <p className="mt-7 border-t border-line pt-5 text-[0.95rem] text-bone-dim">Either way, there is no lock-in.</p>
          </div>
        </div>
      </div>
    </StageSection>
  );
}
