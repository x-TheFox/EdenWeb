export const dynamic = "force-static";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Edencorp. Built for your ground. Nobody else's.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const poster = await readFile(path.join(process.cwd(), "public/scene/og-field.jpg")).catch(() => null);
  const src = poster ? `data:image/jpeg;base64,${poster.toString("base64")}` : null;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0c0f0d", color: "#dcddd5" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {src && <img src={src} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(12,15,13,0.92) 0%, rgba(12,15,13,0.4) 60%, rgba(12,15,13,0) 100%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, width: "100%" }}>
          <div style={{ fontSize: 30, letterSpacing: "-0.02em", display: "flex" }}>Edencorp</div>
          <div style={{ fontSize: 76, lineHeight: 1, letterSpacing: "-0.04em", marginTop: 28, display: "flex", flexDirection: "column" }}>
            <span>Built for your ground.</span>
            <span style={{ color: "#b9bbb1" }}>Nobody else&apos;s.</span>
          </div>
          <div style={{ marginTop: 34, width: 120, height: 4, background: "#ff5a1f", display: "flex" }} />
        </div>
      </div>
    ),
    size,
  );
}
