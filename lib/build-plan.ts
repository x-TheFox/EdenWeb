import { catalog, type Feature } from "@/components/storefront/catalog";

export const DEFAULT_CART = ["MF-01", "MF-03", "MF-04"];

export type Status = "Planned" | "In build" | "Ready to test" | "Revision 1 of 3" | "Signed off";

export const THRESHOLDS: { at: number; status: Status; channel: string; text: (n: string) => string }[] = [
  { at: 0.0001, status: "In build", channel: "Slack", text: (n) => `${n}: work has started. Follow it in your portal.` },
  { at: 0.55, status: "Ready to test", channel: "email", text: (n) => `${n}: staging build is live. Test it any time.` },
  { at: 0.75, status: "Revision 1 of 3", channel: "WhatsApp", text: (n) => `${n}: revision round 1 of 3 logged. The change ships to staging next.` },
  { at: 1, status: "Signed off", channel: "Discord", text: (n) => `${n}: signed off. Thanks.` },
];

export function cartFeatures(ids: string[]): { features: Feature[]; fallback: boolean } {
  const picked = catalog.filter((f) => ids.includes(f.id));
  if (picked.length) return { features: picked, fallback: false };
  return { features: catalog.filter((f) => DEFAULT_CART.includes(f.id)), fallback: true };
}

export function totalWeeks(features: Feature[]) {
  return features.reduce((m, f) => Math.max(m, f.weeks[1]), 0) || 1;
}

/** Progress 0..1 of one feature at a given build week (parallel build). */
export function featureProgress(f: Feature, week: number) {
  return Math.min(1, Math.max(0, week / f.weeks[1]));
}

export function statusFor(p: number): Status {
  let s: Status = "Planned";
  for (const t of THRESHOLDS) if (p >= t.at) s = t.status;
  return s;
}

export type BuildEvent = { week: number; feature: Feature; channel: string; text: string; key: string };

export function buildEvents(features: Feature[]): BuildEvent[] {
  const ev: BuildEvent[] = [];
  for (const f of features)
    for (const t of THRESHOLDS)
      ev.push({ week: t.at * f.weeks[1], feature: f, channel: t.channel, text: t.text(f.name), key: `${f.id}-${t.status}` });
  return ev.sort((a, b) => a.week - b.week || a.feature.id.localeCompare(b.feature.id));
}
