import { continueRender, delayRender, staticFile } from "remotion";

const faces: [string, string, string][] = [
  ["Bricolage", "bricolage-latin.woff2", "200 800"],
  ["Geist", "Geist-Regular.woff2", "400"],
  ["Geist", "Geist-Medium.woff2", "500"],
  ["GeistMono", "GeistMono-Regular.woff2", "400"],
];

let loaded = false;
export function loadFonts() {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("fonts");
  Promise.all(
    faces.map(([family, file, weight]) => {
      const f = new FontFace(family, `url(${staticFile(file)})`, { weight });
      document.fonts.add(f);
      return f.load();
    }),
  ).then(() => continueRender(handle));
}
