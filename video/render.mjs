import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, "..", "public", "video");
const browserExecutable = process.env.BROWSER || "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";

const serveUrl = await bundle({ entryPoint: path.join(here, "src/index.ts"), publicDir: path.join(here, "public") });

for (const id of ["BuildUpdates"]) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const slug = "build-updates";
  await renderMedia({ composition, serveUrl, codec: "h264", crf: 23, outputLocation: `${outDir}/${slug}.mp4`, browserExecutable, pixelFormat: "yuv420p" });
  await renderMedia({ composition, serveUrl, codec: "vp9", crf: 34, outputLocation: `${outDir}/${slug}.webm`, browserExecutable });
  await renderStill({ composition, serveUrl, frame: 330, output: `${outDir}/${slug}-poster.png`, browserExecutable });
  console.log("rendered", slug);
}
