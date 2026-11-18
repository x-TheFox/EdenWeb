import { deliver } from "../lib/qualify/deliver";
import { validate } from "../lib/qualify/validate";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DISCORD_WEBHOOK_URL?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// Best-effort per-isolate rate limit: 5 submissions per minute per IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

async function qualify(req: Request, env: Env) {
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);
  const ip = req.headers.get("cf-connecting-ip") || "unknown";
  if (limited(ip)) return json({ ok: false, error: "Too many attempts. Wait a minute and try again." }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const parsed = validate(body);
  if (!parsed.ok) {
    // Honeypot filled: pretend it worked.
    if (parsed.bot) return json({ ok: true });
    return json({ ok: false, error: "Some fields need another look.", issues: parsed.issues }, 422);
  }

  try {
    await deliver(parsed.data, { ua: req.headers.get("user-agent")?.slice(0, 120) ?? undefined }, env.DISCORD_WEBHOOK_URL);
  } catch (err) {
    console.error("[qualify] delivery failed", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "delivery" }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.hostname === "www.edencorp.org") {
      url.hostname = "edencorp.org";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/api/qualify") return qualify(req, env);
    const res = await env.ASSETS.fetch(req);
    if (res.status === 404 && (req.method === "GET" || req.method === "HEAD")) {
      const page = await env.ASSETS.fetch(new Request(new URL("/404", url), req));
      return new Response(page.body, { status: 404, headers: page.headers });
    }
    return res;
  },
};
