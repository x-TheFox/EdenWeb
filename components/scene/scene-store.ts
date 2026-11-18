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
 * Stage index (0..9) that rises monotonically with scroll, and the drivers that scrub
 * the meaningful change inside each pinned hold.
 *  0 wild, 1 combed, 2 split, 3 rest, 4 qualify, 5 survey, 6 lots, 7 build, 8 own, 9 rest-own
 */
export function storyStage(p: Record<StoryKey, number>) {
  let s = 0;
  s += remap(p.comb, 0.15, 0.7);
  s += remap(p.statement, 0.02, 0.2);
  s += remap(p.capabilities, 0.1, 0.45);
  s += remap(p.qualify, 0.1, 0.9);
  s += remap(p.survey, 0.0, 0.15);
  s += remap(p.storefront, 0.0, 0.12);
  s += remap(p.build, 0.0, 0.1);
  s += remap(p.own, 0.0, 0.25);
  s += remap(p.security, 0.0, 0.35);
  return s;
}

export function storyDrivers(p: Record<StoryKey, number>): Drivers {
  return {
    comb: remap(p.comb, 0.15, 0.7),
    wilt: remap(p.statement, 0.22, 0.85),
    survey: remap(p.survey, 0.15, 0.9),
    split: remap(p.storefront, 0.15, 0.7),
    build: remap(p.build, 0.1, 0.85),
    lift: remap(p.own, 0.25, 0.75),
  };
}
