/** Stage keys: camera and scene values per story stage (docs/SCROLL-SCRIPT.md section 2). */
import { fitFor } from "./fit";

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* -------------------------------------------------------------------------- */
/* Stage keys (docs/SCROLL-SCRIPT.md section 2)                                */
/* -------------------------------------------------------------------------- */

type Key = {
  pos: [number, number, number];
  look: [number, number, number];
  comb: number;
  wilt: number;
  survey: number;
  lots: number;
  build: number;
  lift: number;
  own: number;
  focus: number;
  dim: number;
  rest: number;
  shiftX: number;
  shiftY: number;
  fog: [number, number];
};

const base: Omit<Key, "pos" | "look"> = {
  comb: 1,
  wilt: 0,
  survey: 0,
  lots: 0,
  build: 0,
  lift: 0,
  own: 0,
  focus: 0,
  dim: 1,
  rest: 0,
  shiftX: 0,
  shiftY: 0,
  fog: [10, 46],
};

// Camera x is offset by half a row spacing so no row sits on the view axis (no bright seam).
export const KEYS: Key[] = [
  { ...base, pos: [-5.5, 1.7, 14.5], look: [1.5, -0.7, 0], comb: 0 },
  { ...base, pos: [-0.2, 2.6, 14.5], look: [-0.2, -0.9, -6] },
  { ...base, pos: [-1.2, 4.4, 12.5], look: [3.2, -0.6, -7], wilt: 1, dim: 0.9, shiftX: 0.04 },
  { ...base, pos: [-0.2, 9, 22], look: [-0.2, 0, -8], dim: 0.42, rest: 1, fog: [18, 70] },
  { ...base, pos: [-0.2, 28, 22], look: [-0.2, 0, -6.15], dim: 0.5, rest: 1, fog: [30, 85] },
  // Survey, lots, build and own are framed by projection so the subject sits right of the copy and left of the rail.
  { ...base, pos: [-0.2, 45.9, 18.3], look: [-0.2, 0, -6.15], survey: 1, dim: 0.75, shiftX: 0.15, shiftY: 0.05, fog: [40, 90] },
  { ...base, pos: [-0.2, 68.6, 21.6], look: [-0.2, 0, -6.15], lots: 1, survey: 0.15, focus: 1, dim: 0.9, shiftX: 0.25, shiftY: 0.06, fog: [60, 125] },
  { ...base, pos: [-0.2, 29.3, 44.5], look: [-0.2, 0, -6.15], lots: 1, focus: 1, build: 1, dim: 0.95, shiftX: 0.18, shiftY: 0.06, fog: [45, 110] },
  { ...base, pos: [35.2, 35, 35.6], look: [35.2, 0, -6.15], lots: 1, build: 1, lift: 1, own: 1, focus: 0.6, dim: 0.95, shiftX: 0.07, shiftY: 0.02, fog: [40, 95] },
  { ...base, pos: [36, 22, 40], look: [36, 0, -6.15], build: 1, lift: 1, own: 1, dim: 0.38, rest: 1, fog: [35, 90] },
];

const NUM: (keyof Omit<Key, "pos" | "look" | "fog">)[] = [
  "comb",
  "wilt",
  "survey",
  "lots",
  "build",
  "lift",
  "own",
  "focus",
  "dim",
  "rest",
  "shiftX",
  "shiftY",
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function keyFor(i: number, mobile: boolean, low: boolean, W = 1440, H = 900): Key {
  let k: Key = KEYS[i];
  // Lot beats are framed from the real viewport so all eight lots always fit beside the copy.
  const fit = fitFor(i, W, H);
  if (fit) {
    const dist = Math.hypot(fit.pos[1], fit.pos[2] - fit.look[2]);
    k = { ...k, pos: fit.pos, look: fit.look, shiftX: fit.shiftX, shiftY: fit.shiftY, fog: [dist * 0.85, Math.max(dist * 1.9, k.fog[1])] };
  }
  if (!mobile) return k;
  const m: Key = fit ? { ...k } : { ...k, shiftX: 0 };
  if (i === 1) m.pos = [-0.2, 3.0, 14.5];
  if (low && i <= 2) m.fog = [8, 30];
  return m;
}

export function sample(stage: number, mobile: boolean, low: boolean, W = 1440, H = 900) {
  const s = Math.min(KEYS.length - 1, Math.max(0, stage));
  const i = Math.min(KEYS.length - 2, Math.floor(s));
  const f = s - i;
  const a = keyFor(i, mobile, low, W, H);
  const b = keyFor(i + 1, mobile, low, W, H);
  // Scene values ease across the stage; camera position maps linearly to scroll (the camera's
  // smooth-damp follow does the easing in time), which halves the peak speed of every move.
  const e = smooth(f);
  const out = {} as Record<(typeof NUM)[number], number>;
  for (const k of NUM) out[k] = lerp(a[k], b[k], e);
  const c = f;
  return {
    v: out,
    pos: [lerp(a.pos[0], b.pos[0], c), lerp(a.pos[1], b.pos[1], c), lerp(a.pos[2], b.pos[2], c)] as const,
    look: [lerp(a.look[0], b.look[0], c), lerp(a.look[1], b.look[1], c), lerp(a.look[2], b.look[2], c)] as const,
    fog: [lerp(a.fog[0], b.fog[0], e), lerp(a.fog[1], b.fog[1], e)] as const,
    wiltGate: Math.max(0, 1 - Math.abs(s - 2)),
  };
}

