import { PerspectiveCamera, Vector3 } from "three";
import { LOT_HALF, LOT_X, LOT_Z, OWN_RECT } from "./lots";

/**
 * Runtime camera framing. The lot beats (survey, choose, build, own) must show all eight lots between
 * the copy column and the step rail at ANY viewport size, so the camera is solved from the real
 * viewport instead of hard-coded: binary-search the distance at a fixed pitch until the subject's
 * projected box fits the free screen region, then shift the view (setViewOffset) to centre it there.
 */

export type Fit = { pos: [number, number, number]; look: [number, number, number]; shiftX: number; shiftY: number; far: number };

const LOTS_BOX = {
  x0: LOT_X[0] - LOT_HALF,
  x1: LOT_X[3] + LOT_HALF,
  z0: LOT_Z[1] - LOT_HALF,
  z1: LOT_Z[0] + LOT_HALF,
};
const OWN_BOX = { x0: OWN_RECT.minX, x1: OWN_RECT.maxX, z0: OWN_RECT.minZ, z1: OWN_RECT.maxZ };

type Region = { x0: number; x1: number; y0: number; y1: number };

const cam = new PerspectiveCamera(42, 1, 0.1, 900);
const v = new Vector3();

function solve(
  box: { x0: number; x1: number; z0: number; z1: number },
  height: number,
  pitchDeg: number,
  r: Region,
  W: number,
  H: number,
  lookX = 0,
): Fit {
  const cx = (box.x0 + box.x1) / 2 + lookX;
  const cz = (box.z0 + box.z1) / 2;
  const p = (pitchDeg * Math.PI) / 180;
  cam.aspect = W / H;
  cam.clearViewOffset();
  cam.updateProjectionMatrix();
  const pts: [number, number, number][] = [];
  for (const x of [box.x0, box.x1]) for (const z of [box.z0, box.z1]) for (const y of [0, height]) pts.push([x, y, z]);
  const project = (dist: number) => {
    cam.position.set(cx, Math.sin(p) * dist, cz + Math.cos(p) * dist);
    cam.lookAt(cx, 0, cz);
    cam.updateMatrixWorld();
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const q of pts) {
      v.set(q[0], q[1], q[2]).project(cam);
      const sx = (v.x * 0.5 + 0.5) * W;
      const sy = (-v.y * 0.5 + 0.5) * H;
      x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
    }
    return { x0, x1, y0, y1 };
  };
  const tw = r.x1 - r.x0;
  const th = r.y1 - r.y0;
  let lo = 6, hi = 260;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    const b = project(mid);
    if (b.x1 - b.x0 <= tw && b.y1 - b.y0 <= th) hi = mid;
    else lo = mid;
  }
  const b = project(hi);
  const shiftX = ((r.x0 + r.x1) / 2 - (b.x0 + b.x1) / 2) / W;
  const shiftY = ((r.y0 + r.y1) / 2 - (b.y0 + b.y1) / 2) / H;
  return {
    pos: [cx, Math.sin(p) * hi, cz + Math.cos(p) * hi],
    look: [cx, 0, cz],
    shiftX,
    shiftY,
    far: hi * 1.9,
  };
}

/** Free screen region beside the copy for a given beat, in CSS pixels. */
function region(beat: "survey" | "lots" | "build" | "own", W: number, H: number): Region {
  const pad = Math.min(56, Math.max(16, W * 0.04));
  if (W < 768) {
    // Mobile: copy is top-anchored; the subject lives in the lower part of the screen.
    return { x0: 14, x1: W - 14, y0: H * 0.6, y1: H * 0.93 };
  }
  const railLeft = W >= 1280 ? W - pad - 150 : W - pad; // the step rail shows from 1280px
  const shell = Math.min(W, 1408) - 2 * pad;
  const shellLeft = (W - Math.min(W, 1408)) / 2 + pad;
  const copyRight =
    beat === "lots"
      ? W >= 1024
        ? shellLeft + (shell * 7) / 12 + 32 // the storefront panel spans 7 of 12 columns
        : shellLeft + 544 + 40
      : beat === "build"
        ? shellLeft + 640 + 40 // the build portal column
        : shellLeft + 544 + 40; // the copy column (34rem)
  const x0 = Math.min(copyRight, W * 0.62);
  const x1 = Math.max(x0 + 220, railLeft - 24);
  return { x0, x1, y0: H * 0.2, y1: H * 0.86 };
}

const cache = new Map<string, Fit>();

export function fitFor(i: number, W: number, H: number): Fit | null {
  if (i < 5 || i > 9 || !W || !H) return null;
  const key = `${i}|${Math.round(W)}|${Math.round(H)}`;
  const hit = cache.get(key);
  if (hit) return hit;
  let f: Fit;
  if (i === 5) f = solve(LOTS_BOX, 0.8, 62, region("survey", W, H), W, H, -0.2);
  else if (i === 6) f = solve(LOTS_BOX, 0.8, 68, region("lots", W, H), W, H, -0.2);
  else if (i === 7) f = solve(LOTS_BOX, 2.8, 30, region("build", W, H), W, H, -0.2);
  else if (i === 8) f = solve(OWN_BOX, 1.2, 40, region("own", W, H), W, H);
  else {
    const o = solve(OWN_BOX, 1.2, 28, { x0: W * 0.25, x1: W * 0.95, y0: H * 0.1, y1: H * 0.9 }, W, H);
    f = o;
  }
  if (cache.size > 64) cache.clear();
  cache.set(key, f);
  return f;
}
