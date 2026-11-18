/**
 * Mutable, render-free store shared by the DOM (scroll, pointer, cart, toggles) and the WebGL scene.
 * Writers never trigger React renders; the scene reads it every frame.
 */

export type StoryKey =
  | "comb"
  | "statement"
  | "capabilities"
  | "qualify"
  | "survey"
  | "storefront"
  | "build"
  | "own"
  | "security";

export type Drivers = { comb: number; wilt: number; survey: number; split: number; build: number; lift: number };

const zeros8 = () => [0, 0, 0, 0, 0, 0, 0, 0];

export const sceneStore = {
  progress: {
    comb: 0,
    statement: 0,
    capabilities: 0,
    qualify: 0,
    survey: 0,
    storefront: 0,
    build: 0,
    own: 0,
    security: 0,
  } as Record<StoryKey, number>,
  /** Pointer in normalized device coords (-1..1). */
  pointer: { x: 0, y: 0, active: false, lastMove: 0 },
  /** 0 = autonomous, 1 = alongside your team. */
  human: 0,
  /** 0 = full handover, 1 = managed retainer. */
  retainer: 0,
  /** Cart, mirrored from the cart store. 1 = lot in the build request. */
  lotSel: zeros8(),
  /** Cart order slot (0..7) for selected lots; used for transplant destinations and stagger. */
  lotSlot: zeros8(),
  /** Hovered storefront / portal row, -1 none. */
  lotHover: -1,
  /** performance.now() of the last add per lot, for the one-shot ripple. */
  lotPulseAt: [-1e9, -1e9, -1e9, -1e9, -1e9, -1e9, -1e9, -1e9],
  /** performance.now() of the last checkout "sent". */
  sentAt: -1e9,
  /** Survey findings state, written by the scene. */
  found: [false, false, false, false, false, false, false, false],
  foundCount: 0,
  /** Reduced motion: explicit build week from the stepper (null = follow scroll). */
  buildWeek: null as number | null,
  /** True when the scene is at rest and only needs a frame every 250ms. */
  throttle: false,
  /** Mobile layout flag, written by the backdrop. */
  mobile: false,
  /** Scene readiness. */
  ready: false,
  readyListeners: new Set<() => void>(),
  /** Generic change listeners (used by reduced-motion demand rendering and DOM mirrors). */
  listeners: new Set<() => void>(),
};

let lastRounded = -1;
/** Called on every scroll progress write; notifies listeners only when the rounded stage changes. */
export function progressChanged() {
  const r = Math.round(storyStage(sceneStore.progress));
  if (r !== lastRounded) {
    lastRounded = r;
    notify();
  }
}

export function notify() {
  sceneStore.listeners.forEach((fn) => fn());
}

export function markSceneReady() {
  if (sceneStore.ready) return;
  sceneStore.ready = true;
  sceneStore.readyListeners.forEach((fn) => fn());
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const remap = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

/**
 * One timing table for the whole story. Every pinned beat has an "arrive" window (the camera travels,
 * nothing else changes) and then a "drive" window (the meaningful change, scrubbed while the camera holds).
 * Values are fractions of each section's own scroll progress. Sections, the scene and the DOM all read this,
 * so copy, field and portal can never drift apart.
 */
export const TIMING = {
  // Sizes below are tied to the section heights so that the camera never travels more than ~30 world
  // units per screen of scroll, and every scrubbed change gets at least about one screen of its own.
  comb: { drive: [0.14, 0.74] },
  statement: { arrive: [0.02, 0.24], drive: [0.3, 0.86] },
  capabilities: { arrive: [0.1, 0.5] },
  qualify: { arrive: [0.1, 0.9] },
  survey: { arrive: [0.0, 0.27], drive: [0.32, 0.92] },
  storefront: { arrive: [0.0, 0.36], drive: [0.42, 0.9] },
  build: { arrive: [0.0, 0.44], drive: [0.5, 0.94] },
  own: { arrive: [0.0, 0.5], drive: [0.55, 0.92] },
  security: { arrive: [0.0, 0.4] },
} as const satisfies Record<StoryKey, { arrive?: readonly [number, number]; drive?: readonly [number, number] }>;

/** Section progress at which a drive value d (0..1) is reached. */
export const atDrive = (key: "comb" | "statement" | "survey" | "storefront" | "build" | "own", d: number) => {
  const [a, b] = TIMING[key].drive;
  return a + (b - a) * d;
};

/**
 * Stage index (0..9) that rises monotonically with scroll.
 *  0 wild, 1 combed, 2 split, 3 rest, 4 qualify, 5 survey, 6 lots, 7 build, 8 own, 9 rest-own
 */
export function storyStage(p: Record<StoryKey, number>) {
  const r = (k: StoryKey, w: readonly [number, number]) => remap(p[k], w[0], w[1]);
  let s = 0;
  s += r("comb", TIMING.comb.drive);
  s += r("statement", TIMING.statement.arrive);
  s += r("capabilities", TIMING.capabilities.arrive);
  s += r("qualify", TIMING.qualify.arrive);
  s += r("survey", TIMING.survey.arrive);
  s += r("storefront", TIMING.storefront.arrive);
  s += r("build", TIMING.build.arrive);
  s += r("own", TIMING.own.arrive);
  s += r("security", TIMING.security.arrive);
  return s;
}

export function storyDrivers(p: Record<StoryKey, number>): Drivers {
  const r = (k: StoryKey, w: readonly [number, number]) => remap(p[k], w[0], w[1]);
  return {
    comb: r("comb", TIMING.comb.drive),
    wilt: r("statement", TIMING.statement.drive),
    survey: r("survey", TIMING.survey.drive),
    split: r("storefront", TIMING.storefront.drive),
    build: r("build", TIMING.build.drive),
    lift: r("own", TIMING.own.drive),
  };
}
