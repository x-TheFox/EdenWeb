/**
 * Mutable, render-free store shared by the DOM (scroll + pointer) and the WebGL scene.
 * Writers never trigger React renders; the scene reads it every frame.
 */

export type StoryKey =
  | "comb"
  | "statement"
  | "capabilities"
  | "process"
  | "storefront";

export const sceneStore = {
  /** Scroll progress per story section, 0..1. */
  progress: {
    comb: 0,
    statement: 0,
    capabilities: 0,
    process: 0,
    storefront: 0,
  } as Record<StoryKey, number>,
  /** Pointer in normalized device coords (-1..1). */
  pointer: { x: 0, y: 0, active: false, lastMove: 0 },
  /** 0 = autonomous, 1 = alongside your team. */
  human: 0,
  /** 0 none, 1..4 highlighted capability plot. */
  capHighlight: 0,
  /** Set once the first frame has been drawn. */
  ready: false,
  readyListeners: new Set<() => void>(),
};

export function markSceneReady() {
  if (sceneStore.ready) return;
  sceneStore.ready = true;
  sceneStore.readyListeners.forEach((fn) => fn());
}

/**
 * Camera stage index: a monotonic value that rises as the visitor scrolls the story.
 *  0 hero, 1 combed, 2 statement, 3 capabilities, 4..8 process steps, 9 calm
 */
export function storyStage(p: Record<StoryKey, number>) {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const remap = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
  let s = 0;
  s += remap(p.comb, 0.12, 0.72);
  s += remap(p.statement, 0.2, 0.48);
  s += remap(p.capabilities, 0.18, 0.42);
  // Process spans five steps; the section reports 0..1 across its full height.
  s += remap(p.process, 0.02, 0.1); // arrive at "qualify"
  s += remap(p.process, 0.14, 0.3); // survey
  s += remap(p.process, 0.34, 0.5); // choose
  s += remap(p.process, 0.54, 0.7); // build
  s += remap(p.process, 0.74, 0.9); // own
  s += remap(p.storefront, 0.05, 0.35); // calm
  return s;
}
