import type { Submission } from "./validate";

/**
 * Delivery adapter for fit-check submissions.
 * Currently posts to a Discord channel via webhook (Worker secret DISCORD_WEBHOOK_URL).
 * To move to a CRM or email provider, replace this function only.
 */
export async function deliver(q: Submission, meta: { ua?: string }, url: string | undefined) {
  if (!url) throw new Error("Delivery is not configured");

  const clip = (s: string, n = 1024) => (s.length > n ? `${s.slice(0, n - 3)}...` : s);
  // Discord markdown is harmless here, but stop accidental mass mentions.
  const clean = (s: string) => clip(s.replace(/@(everyone|here)/gi, "@​$1"));

  const body = {
    username: "Edencorp fit check",
    allowed_mentions: { parse: [] as string[] },
    embeds: [
      {
        title: clip(`${q.company} / ${q.name}`, 256),
        color: 0xff5a1f,
        fields: [
          { name: "Email", value: clean(q.email), inline: true },
          { name: "Role", value: clean(q.role), inline: true },
          { name: "Decision", value: clean(q.decision), inline: true },
          { name: "Company size", value: clean(q.size), inline: true },
          { name: "Budget", value: clean(q.budget), inline: true },
          { name: "Timeline", value: clean(q.timeline), inline: true },
          { name: "Wants", value: clean(q.interests.join(", ")) },
          { name: "Bottleneck or vision", value: clean(q.bottleneck) },
        ],
        footer: { text: clip(`edencorp.org${meta.ua ? ` / ${meta.ua}` : ""}`, 200) },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Discord responded ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}
