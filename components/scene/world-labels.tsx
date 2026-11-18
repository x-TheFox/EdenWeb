"use client";

import { useEffect, useRef } from "react";
import type { Camera } from "three";
import { Vector3 } from "three";
import { catalog, usd } from "@/components/storefront/catalog";
import { FINDINGS } from "@/lib/findings";
import { LOTS, OWN_RECT, SEAM_X, terrain } from "./lots";
import type { Drivers } from "./scene-store";

/**
 * DOM labels pinned to world positions in the field. Crisp text, no texture text in GLSL.
 * Positions are written straight to the DOM from the scene's frame loop: no React renders per frame.
 * Every label's content also exists as normal text in its section, so this layer is decorative for
 * assistive tech (aria-hidden) and simply absent without WebGL.
 */

export type LabelCtx = {
  stage: number;
  drivers: Drivers;
  found: boolean[];
  latestFound: number;
  sel: number[];
  retainer: number;
  ownDraw: number;
  lift: number;
  mobile: boolean;
  /** Screen rect of the active copy block; labels never sit on top of copy. */
  avoid: { l: number; t: number; r: number; b: number } | null;
  /** Keep clear of the step rail on the right edge (px). */
  avoidRight: number;
};

type Def = {
  id: string;
  text: string;
  mobileText?: string;
  world: [number, number, number];
  /** Leader line height in px (0 for none). */
  line?: number;
  mobile?: boolean;
  kind?: "price" | "tick";
  lot?: number;
  visible: (c: LabelCtx) => boolean;
};

const near = (s: number, a: number, b: number) => s >= a && s <= b;
const front = (comb: number) => -24 + 48 * comb;
const g = (x: number, z: number): [number, number, number] => [x, terrain(x, z), z];

const COMB_ROWS: [string, number, boolean][] = [
  ["Support tickets", -9.2, true],
  ["Data entry", -5.2, true],
  ["Outbound follow-ups", -1.2, false],
  ["Invoice matching", 2.8, true],
  ["QA test cases", 6.8, false],
  ["Order updates", 10.8, false],
];

const ownCx = (OWN_RECT.minX + OWN_RECT.maxX) / 2;

const DEFS: Def[] = [
  ...COMB_ROWS.map(
    ([text, x, mobile]): Def => ({
      id: `row-${x}`,
      text,
      world: g(x, 6),
      line: 40,
      mobile,
      visible: (c) => near(c.stage, 0.3, 1.6) && front(c.drivers.comb) > x,
    }),
  ),
  {
    id: "hold",
    text: "Built to hold",
    mobileText: "To hold",
    world: [0.2, terrain(0.2, -2) + 1.2, -2],
    line: 28,
    mobile: true,
    visible: (c) => near(c.stage, 1.55, 2.5),
  },
  {
    id: "cheap",
    text: "Built cheap",
    mobileText: "Cheap",
    world: [6, terrain(6, -2) + 1.2, -2],
    line: 28,
    mobile: true,
    visible: (c) => near(c.stage, 1.55, 2.5),
  },
  {
    id: "overtime",
    text: "Over time",
    world: g(SEAM_X, 4),
    kind: "tick",
    visible: (c) => near(c.stage, 1.55, 2.5) && !c.mobile,
  },
  ...FINDINGS.map(
    (text, i): Def => ({
      id: `find-${i}`,
      text,
      world: [LOTS[i][0], terrain(LOTS[i][0], LOTS[i][1]) + 0.3, LOTS[i][1]],
      line: 24,
      mobile: true,
      lot: i,
      visible: (c) => near(c.stage, 4.55, 5.55) && c.found[i] && (!c.mobile || c.latestFound === i),
    }),
  ),
  ...catalog.map(
    (f, i): Def => ({
      id: `price-${i}`,
      text: `${f.id}\n${usd(f.price)}`,
      world: [LOTS[i][0], terrain(LOTS[i][0], LOTS[i][1]) + 0.2, LOTS[i][1]],
      line: 0,
      mobile: false,
      kind: "price",
      lot: i,
      visible: (c) => near(c.stage, 5.55, 6.55) && c.drivers.split > i * 0.09 + 0.05,
    }),
  ),
  {
    id: "own",
    text: "Your infrastructure",
    world: g(ownCx, OWN_RECT.maxZ + 0.6),
    line: 20,
    mobile: true,
    visible: (c) => near(c.stage, 7.55, 8.6) && c.ownDraw > 0.3 && c.retainer < 0.5,
  },
  {
    id: "source",
    text: "Full source code",
    world: g(ownCx, -6.2),
    line: 24,
    mobile: false,
    visible: (c) => near(c.stage, 7.55, 8.6) && c.lift > 0.98 && c.retainer < 0.5,
  },
  {
    id: "tended",
    text: "Tended by Edencorp",
    world: g(0, -6.2),
    line: 24,
    mobile: true,
    visible: (c) => near(c.stage, 7.55, 8.6) && c.retainer >= 0.5,
  },
];

type Entry = { def: Def; el: HTMLElement; on: boolean; tick?: HTMLElement; text: HTMLElement; sel: boolean };
const registry: Entry[] = [];
const v = new Vector3();

/** Called from the scene's frame loop. */
export function updateLabels(camera: Camera, width: number, height: number, ctx: LabelCtx) {
  if (!registry.length) return;
  const candidates: { e: Entry; x: number; y: number; d: number }[] = [];
  for (const e of registry) {
    const { def } = e;
    let show = def.visible(ctx) && (!ctx.mobile || def.mobile !== false);
    let x = 0;
    let y = 0;
    if (show) {
      v.set(def.world[0], def.world[1], def.world[2]).project(camera);
      if (v.z > 1 || v.z < -1) show = false;
      x = (v.x * 0.5 + 0.5) * width;
      y = (-v.y * 0.5 + 0.5) * height;
      if (x < -40 || x > width + 40 || y < -40 || y > height + 40) show = false;
    }
    if (show && ctx.avoidRight && x + 90 > width - ctx.avoidRight) show = false;
    if (show && ctx.avoid) {
      const a = ctx.avoid;
      // Label box: centred on x, above the anchor (pill + leader line).
      const half = 90;
      const top = y - (def.line ?? 0) - 34;
      if (x + half > a.l && x - half < a.r && y > a.t && top < a.b) show = false;
    }
    if (show) candidates.push({ e, x, y, d: Math.hypot(x - width / 2, y - height / 2) });
    else if (e.on) {
      e.on = false;
      e.el.dataset.on = "0";
    }
  }
  // Mobile: at most three labels, closest to the screen centre win.
  if (ctx.mobile) candidates.sort((a, b) => a.d - b.d);
  candidates.forEach((c, idx) => {
    const { e } = c;
    if (ctx.mobile && idx >= 3) {
      if (e.on) {
        e.on = false;
        e.el.dataset.on = "0";
      }
      return;
    }
    e.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0)`;
    if (!e.on) {
      e.on = true;
      e.el.dataset.on = "1";
    }
    const txt = ctx.mobile && e.def.mobileText ? e.def.mobileText : e.def.text;
    if (e.text.textContent !== txt) e.text.textContent = txt;
    if (e.def.kind === "price" && e.def.lot !== undefined) {
      const sel = ctx.sel[e.def.lot] > 0.5;
      if (sel !== e.sel) {
        e.sel = sel;
        e.el.dataset.sel = sel ? "1" : "0";
      }
    }
    if (e.tick) e.tick.style.transform = `scaleX(${ctx.drivers.wilt.toFixed(3)})`;
  });
}

export function WorldLabels() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const nodes = el.querySelectorAll<HTMLElement>("[data-label]");
    nodes.forEach((n) => {
      const def = DEFS.find((d) => d.id === n.dataset.label);
      if (!def) return;
      registry.push({
        def,
        el: n,
        on: false,
        sel: false,
        tick: n.querySelector<HTMLElement>("[data-tick]") ?? undefined,
        text: n.querySelector<HTMLElement>("[data-text]")!,
      });
    });
    return () => {
      registry.length = 0;
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="world-labels pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {DEFS.map((d) => (
        <div key={d.id} data-label={d.id} data-on="0" className="wl absolute left-0 top-0 will-change-transform">
          <div className="wl-inner flex flex-col items-center">
            {d.kind === "tick" ? (
              <>
                <span data-text className="annot text-moss">{d.text}</span>
                <span className="mt-2 block h-px w-[120px] overflow-hidden">
                  <span data-tick className="block h-px w-full origin-left bg-bone" style={{ transform: "scaleX(0)" }} />
                </span>
              </>
            ) : (
              <>
                <span
                  data-text
                  className={`wl-pill annot rounded-full bg-ink/80 px-2 py-1 text-center leading-snug text-bone ${
                    d.kind === "price" ? "whitespace-pre rounded-[8px] leading-tight" : d.text.length > 24 ? "w-max max-w-[21ch] rounded-[10px]" : "whitespace-nowrap"
                  }`}
                >
                  {d.text}
                </span>
                {!!d.line && <span className="block w-px bg-bone/40" style={{ height: d.line }} />}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
