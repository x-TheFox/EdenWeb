/**
 * Proof slot.
 *
 * Edencorp has no published engagements yet, so this renders nothing.
 * When a client agrees to be named, add real case studies here (client, problem, what was built,
 * measured outcome with its source) and flip SHOW_PROOF to true. Never add invented results.
 */
const SHOW_PROOF = false;

type CaseStudy = { client: string; problem: string; built: string; outcome: string };
const cases: CaseStudy[] = [];

export function Proof() {
  if (!SHOW_PROOF || cases.length === 0) return null;
  return (
    <section aria-labelledby="proof-title" className="relative bg-ink/85 py-24">
      <div className="shell">
        <h2 id="proof-title" className="h2 text-bone">Work in the field.</h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <li key={c.client} className="rounded-[var(--radius-surface)] border border-line p-7">
              <p className="text-bone">{c.client}</p>
              <p className="mt-3 text-bone-dim">{c.problem}</p>
              <p className="mt-3 text-bone-dim">{c.built}</p>
              <p className="mt-3 text-survey">{c.outcome}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
