import { BUDGET, DECISION, INTERESTS, SIZE, TIMELINE } from "./options";

/**
 * Dependency-free server validator (runs in the Worker). Mirrors schema.ts.
 */
export type Submission = {
  name: string;
  email: string;
  company: string;
  role: string;
  decision: (typeof DECISION)[number];
  size: (typeof SIZE)[number];
  interests: (typeof INTERESTS)[number][];
  bottleneck: string;
  budget: (typeof BUDGET)[number];
  timeline: (typeof TIMELINE)[number];
};

type Result = { ok: true; data: Submission } | { ok: false; issues: Record<string, string[]>; bot: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(input: unknown): Result {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const issues: Record<string, string[]> = {};
  const str = (k: string, min: number, max: number, msg: string) => {
    const v = typeof o[k] === "string" ? (o[k] as string).trim() : "";
    if (v.length < min) issues[k] = [msg];
    else if (v.length > max) issues[k] = [`Keep this under ${max} characters.`];
    return v;
  };
  const one = <T extends readonly string[]>(k: string, list: T, msg: string) => {
    const v = o[k];
    if (typeof v !== "string" || !list.includes(v)) issues[k] = [msg];
    return v as T[number];
  };

  const name = str("name", 2, 120, "Tell us your name.");
  const email = str("email", 3, 200, "Enter a valid work email.");
  if (!issues.email && !EMAIL.test(email)) issues.email = ["Enter a valid work email."];
  const company = str("company", 1, 160, "Tell us the company name.");
  const role = str("role", 2, 120, "Tell us your role.");
  const decision = one("decision", DECISION, "Choose one.");
  const size = one("size", SIZE, "Choose a company size.");
  const raw = Array.isArray(o.interests) ? o.interests : [];
  const interests = raw.filter((x): x is (typeof INTERESTS)[number] => typeof x === "string" && (INTERESTS as readonly string[]).includes(x));
  if (interests.length === 0 || interests.length !== raw.length) issues.interests = ["Pick at least one."];
  const bottleneck = str("bottleneck", 20, 2000, "A sentence or two helps us prepare. At least 20 characters.");
  const budget = one("budget", BUDGET, "Choose a range. Any range is fine.");
  const timeline = one("timeline", TIMELINE, "Choose a timeline.");

  const bot = typeof o.website === "string" && o.website.length > 0;
  if (bot || Object.keys(issues).length) return { ok: false, issues, bot };
  return { ok: true, data: { name, email, company, role, decision, size, interests: [...new Set(interests)], bottleneck, budget, timeline } };
}
