import { NextResponse } from "next/server";
import { deliver } from "@/lib/qualify/deliver";
import { qualification } from "@/lib/qualify/schema";

export const runtime = "nodejs";

// Best-effort per-instance rate limit: 5 submissions per minute per IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Wait a minute and try again." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = qualification.safeParse(json);
  if (!parsed.success) {
    // Honeypot filled: pretend it worked.
    if (json && typeof json === "object" && "website" in json && (json as { website?: string }).website) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: "Some fields need another look.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    await deliver(parsed.data, { ip, ua: req.headers.get("user-agent")?.slice(0, 120) ?? undefined });
  } catch (err) {
    console.error("[qualify] delivery failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
