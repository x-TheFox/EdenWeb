import { StageSection } from "@/components/scene/stage-section";
import { Reveal } from "@/components/ui/reveal";
import { VideoLoop } from "@/components/ui/video-loop";
import { TextLink } from "@/components/ui/button";
import { ProcessRail } from "./process-rail";

export const steps = [
  {
    id: "qualify",
    verb: "Qualify",
    title: "A short fit check.",
    body: "A call with whoever owns the decision. We confirm three things before anything else happens.",
    list: ["A real bottleneck, or a clear vision", "A budget that fits the scope", "Readiness to move on a timeline"],
  },
  {
    id: "survey",
    verb: "Survey",
    title: "We study the ground before we build on it.",
    body: "Under NDA we interview your staff, study your industry and competitors, map where the work gets stuck, and think hard about what would most move speed and revenue.",
    note: "The audit carries a deposit, credited in full to whatever you build. Serious buyers pay nothing extra.",
    hint: "Move your cursor over the field to see what the survey sees.",
  },
  {
    id: "choose",
    verb: "Choose",
    title: "A private storefront, not a proposal.",
    body: "Every feature from the audit is listed with its scope, estimate and price. Add what you want, remove what you don't, then check out. Checkout sends the build request to us.",
    link: true,
  },
  {
    id: "build",
    verb: "Build",
    title: "Watch it grow.",
    body: "A live portal to follow and test the work. Updates where you already talk: Slack, WhatsApp, Discord or email. A set number of revision rounds before sign-off, and direct contact throughout.",
    note: "Every feature carries its own estimate, because timelines depend on scope.",
    video: true,
  },
  {
    id: "own",
    verb: "Own",
    title: "Take it with you, or let us tend it.",
    split: [
      {
        name: "Full handover",
        body: "Deployed to your infrastructure, with the complete source code and no further obligation to us.",
      },
      { name: "Managed retainer", body: "We keep running, maintaining and improving the systems." },
    ],
  },
] as const;

export function Process() {
  return (
    <div id="process" className="relative">
      <div className="shell relative pt-[clamp(6rem,16vh,10rem)]">
        <Reveal>
          <h2 id="process-title" className="h2 max-w-[13ch] text-bone">
            How an engagement actually runs.
          </h2>
        </Reveal>
      </div>
      <StageSection stage="process" mode="pinned" labelledBy="process-title" className="relative">
        <ProcessRail />
        <ol className="relative">
          {steps.map((s) => (
            <li
              key={s.id}
              id={`step-${s.id}`}
              className="relative flex min-h-[100dvh] items-center py-24"
            >
              <div className="scrim-l pointer-events-none absolute inset-y-0 left-0 w-full md:w-[58%]" />
              <div className="shell relative">
                <Reveal className="max-w-[34rem]">
                  <p className="annot text-survey">{s.verb}</p>
                  <h3 className="h2 mt-4 text-[clamp(1.9rem,3.6vw,3.2rem)] text-bone">{s.title}</h3>
                  {"body" in s && <p className="lede mt-6">{s.body}</p>}
                  {"list" in s && (
                    <ul className="mt-7 grid gap-3">
                      {s.list.map((l) => (
                        <li key={l} className="flex gap-3 text-bone">
                          <span aria-hidden className="mt-[0.7em] h-px w-5 shrink-0 bg-survey" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                  {"split" in s && (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      {s.split.map((o) => (
                        <div key={o.name} className="rounded-[var(--radius-surface)] border border-line bg-ink/80 p-5">
                          <p className="font-display text-[1.25rem] tracking-[-0.02em] text-bone">{o.name}</p>
                          <p className="mt-2 text-[0.95rem] text-bone-dim">{o.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {"note" in s && <p className="mt-6 border-l border-survey/70 pl-4 text-[0.95rem] text-bone">{s.note}</p>}
                  {"hint" in s && <p className="annot mt-6 hidden text-moss md:block">{s.hint}</p>}
                  {"link" in s && (
                    <div className="mt-6">
                      <TextLink href="#storefront">Try an example storefront</TextLink>
                    </div>
                  )}
                </Reveal>
                {"video" in s && (
                  <Reveal delay={0.15} className="mt-10 max-w-[40rem]">
                    <figure className="overflow-hidden rounded-[var(--radius-surface)] border border-line bg-ink-2">
                      <VideoLoop
                        name="build-updates"
                        label="Example: build updates arriving in a team channel next to a client portal"
                        width={1280}
                        height={800}
                        className="block aspect-[16/10] h-auto w-full"
                      />
                      <figcaption className="annot border-t border-line px-4 py-3 text-moss">
                        Example build updates. Fictional client.
                      </figcaption>
                    </figure>
                  </Reveal>
                )}
              </div>
            </li>
          ))}
        </ol>
      </StageSection>
    </div>
  );
}
