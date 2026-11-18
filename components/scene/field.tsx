"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { catalog } from "@/components/storefront/catalog";
import { DEFAULT_CART, featureProgress, totalWeeks } from "@/lib/build-plan";
import { LOTS, OWN_SLOTS, lotIndexAt } from "./lots";
import { markSceneReady, sceneStore, storyDrivers, storyStage, type Drivers } from "./scene-store";
import { FIELD, bladeFragment, bladeVertex, groundFragment, groundVertex, skyFragment, skyVertex } from "./shaders";
import type { QualityTier } from "./quality";
import { updateLabels } from "./world-labels";

const HORIZON = new THREE.Color(0.082, 0.088, 0.08);

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
const KEYS: Key[] = [
  { ...base, pos: [-5.5, 1.7, 14.5], look: [1.5, -0.7, 0], comb: 0 },
  { ...base, pos: [-0.2, 2.6, 14.5], look: [-0.2, -0.9, -6] },
  { ...base, pos: [-1.2, 4.4, 12.5], look: [3.2, -0.6, -7], wilt: 1, dim: 0.9, shiftX: 0.04 },
  { ...base, pos: [-0.2, 9, 22], look: [-0.2, 0, -8], dim: 0.42, rest: 1, fog: [18, 70] },
  { ...base, pos: [-0.2, 28, 22], look: [-0.2, 0, -6.15], dim: 0.5, rest: 1, fog: [30, 85] },
  // Survey, lots, build and own are framed by projection so the subject sits right of the copy and left of the rail.
  { ...base, pos: [-0.2, 45.9, 18.3], look: [-0.2, 0, -6.15], survey: 1, dim: 0.75, shiftX: 0.15, shiftY: 0.05, fog: [40, 90] },
  { ...base, pos: [-0.2, 68.6, 21.6], look: [-0.2, 0, -6.15], lots: 1, survey: 0.15, focus: 1, dim: 0.9, shiftX: 0.25, shiftY: 0.06, fog: [60, 125] },
  { ...base, pos: [-0.2, 29.3, 44.5], look: [-0.2, 0, -6.15], lots: 1, focus: 1, build: 1, dim: 0.95, shiftX: 0.18, shiftY: 0.06, fog: [45, 110] },
  { ...base, pos: [35.2, 35, 35.6], look: [35.2, 0, -6.15], lots: 1, build: 1, lift: 1, own: 1, focus: 0.6, dim: 0.95, shiftX: 0.12, shiftY: 0.02, fog: [40, 95] },
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

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function keyFor(i: number, mobile: boolean, low: boolean): Key {
  const k = KEYS[i];
  if (!mobile) return k;
  const m: Key = { ...k, shiftX: 0 };
  // Mobile: copy is top-anchored, so the subject sits in the lower part of the screen.
  if (i >= 5 && i <= 7) Object.assign(m, { pos: [-0.2, 65.4, 31.6], look: [-0.2, 0, -6.15], shiftX: -0.045, shiftY: 0.19, fog: [50, 120] });
  if (i === 8) Object.assign(m, { pos: [35.2, 46.3, 49], look: [35.2, 0, -6.15], shiftX: 0, shiftY: 0.16, fog: [50, 120] });
  if (i === 1) m.pos = [-0.2, 3.0, 14.5];
  if (low && i <= 2) m.fog = [8, 30];
  return m;
}

function sample(stage: number, mobile: boolean, low: boolean) {
  const s = Math.min(KEYS.length - 1, Math.max(0, stage));
  const i = Math.min(KEYS.length - 2, Math.floor(s));
  const f = s - i;
  const a = keyFor(i, mobile, low);
  const b = keyFor(i + 1, mobile, low);
  const e = smooth(f);
  const out = {} as Record<(typeof NUM)[number], number>;
  for (const k of NUM) out[k] = lerp(a[k], b[k], e);
  return {
    v: out,
    pos: [lerp(a.pos[0], b.pos[0], e), lerp(a.pos[1], b.pos[1], e), lerp(a.pos[2], b.pos[2], e)] as const,
    look: [lerp(a.look[0], b.look[0], e), lerp(a.look[1], b.look[1], e), lerp(a.look[2], b.look[2], e)] as const,
    fog: [lerp(a.fog[0], b.fog[0], e), lerp(a.fog[1], b.fog[1], e)] as const,
    wiltGate: Math.max(0, 1 - Math.abs(s - 2)),
  };
}

/* -------------------------------------------------------------------------- */
/* Geometry                                                                    */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildBlades(count: number) {
  const rand = mulberry32(7);
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const levels = 6;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let l = 0; l < levels; l++) {
    const y = l / (levels - 1);
    positions.push(-0.5, y, 0, 0.5, y, 0);
  }
  for (let l = 0; l < levels - 1; l++) {
    const a = l * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geo = new THREE.InstancedBufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);

  const width = FIELD.maxX - FIELD.minX;
  const depth = FIELD.maxZ - FIELD.minZ;
  const rows = Math.floor(width / FIELD.rowSpacing);
  const perRow = Math.ceil(count / rows);
  const dz = depth / perRow;

  const wild = new Float32Array(count * 2);
  const row = new Float32Array(count * 2);
  const rnd = new Float32Array(count * 4);
  const meta = new Float32Array(count * 2);

  // Shuffled order so the instance count can be trimmed uniformly on slow devices.
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const clumps = Array.from({ length: 26 }, () => ({
    x: FIELD.minX + rand() * width,
    z: FIELD.minZ + rand() * depth,
    r: 1.5 + rand() * 3,
  }));

  for (let n = 0; n < count; n++) {
    const i = order[n];
    const r = i % rows;
    const k = Math.floor(i / rows);
    const rx = FIELD.minX + (r + 0.5) * FIELD.rowSpacing + (rand() - 0.5) * 0.04;
    const rz = FIELD.minZ + (k + rand()) * dz;
    row[n * 2] = rx;
    row[n * 2 + 1] = rz;

    let wx = rx + gauss() * 1.25;
    let wz = rz + gauss() * 0.9;
    if (rand() < 0.22) {
      const c = clumps[Math.floor(rand() * clumps.length)];
      wx = c.x + gauss() * c.r * 0.5;
      wz = c.z + gauss() * c.r * 0.5;
    }
    wild[n * 2] = Math.min(FIELD.maxX + 1, Math.max(FIELD.minX - 1, wx));
    wild[n * 2 + 1] = Math.min(FIELD.maxZ, Math.max(FIELD.minZ, wz));

    rnd[n * 4] = rand();
    rnd[n * 4 + 1] = rand();
    rnd[n * 4 + 2] = rand();
    rnd[n * 4 + 3] = rand();

    meta[n * 2] = lotIndexAt(rx, rz);
    meta[n * 2 + 1] = r;
  }

  geo.setAttribute("aWild", new THREE.InstancedBufferAttribute(wild, 2));
  geo.setAttribute("aRow", new THREE.InstancedBufferAttribute(row, 2));
  geo.setAttribute("aRand", new THREE.InstancedBufferAttribute(rnd, 4));
  geo.setAttribute("aMeta", new THREE.InstancedBufferAttribute(meta, 2));
  geo.instanceCount = count;
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(12, 0, -8), 80);
  return geo;
}

/* -------------------------------------------------------------------------- */
/* Copy mask: find the active [data-copy] block                                */
/* -------------------------------------------------------------------------- */

let copyEls: HTMLElement[] = [];
let copyScan = 0;
function activeCopyRect(now: number) {
  if (now - copyScan > 1000) {
    copyScan = now;
    copyEls = Array.from(document.querySelectorAll<HTMLElement>("[data-copy]"));
  }
  const H = window.innerHeight;
  const W = window.innerWidth;
  let best: DOMRect | null = null;
  let bestArea = 0;
  for (const el of copyEls) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const visH = Math.min(r.bottom, H) - Math.max(r.top, 0);
    const visW = Math.min(r.right, W) - Math.max(r.left, 0);
    if (visH <= 0 || visW <= 0) continue;
    const area = visH * visW;
    if (area > bestArea) {
      bestArea = area;
      best = r;
    }
  }
  return best;
}

/* -------------------------------------------------------------------------- */
/* Scene                                                                       */
/* -------------------------------------------------------------------------- */

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function Field({ blades, reduced, tier }: { blades: number; reduced: boolean; tier: QualityTier }) {
  const { camera, gl, size } = useThree();
  const geometry = useMemo(() => buildBlades(blades), [blades]);
  const low = tier === "low";

  const uniforms = useMemo(
    () => ({
      uTime: { value: 4 },
      uComb: { value: 0 },
      uWilt: { value: 0 },
      uWiltGate: { value: 0 },
      uGrow: { value: 0.2 },
      uLift: { value: 0 },
      uHuman: { value: 0 },
      uSurvey: { value: 0 },
      uLots: { value: 0 },
      uBuild: { value: 0 },
      uFocus: { value: 0 },
      uRetainer: { value: 0 },
      uTend: { value: 0 },
      uStaticTend: { value: reduced ? 1 : 0 },
      uEnergy: { value: 0 },
      uOwn: { value: 0 },
      uOwnDraw: { value: 0 },
      uSentFlash: { value: 0 },
      uDim: { value: 0 },
      uLowTier: { value: low ? 1 : 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uFog: { value: new THREE.Vector2(10, 46) },
      uHorizon: { value: HORIZON.clone() },
      uLotC: { value: LOTS.map(([x, z]) => new THREE.Vector2(x, z)) },
      uLotDest: { value: LOTS.map(() => new THREE.Vector2()) },
      uLotSel: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
      uLotGrow: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
      uLotSlot: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
      uLotPulse: { value: [99, 99, 99, 99, 99, 99, 99, 99] },
      uLotFound: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
      uLotFlash: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
      uLotHover: { value: -1 },
      uCopyRect: { value: new THREE.Vector4(0, 0, 0, 0) },
      uCopyMask: { value: 0 },
      uDpr: { value: 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const materials = useMemo(() => {
    const blade = new THREE.ShaderMaterial({
      vertexShader: bladeVertex,
      fragmentShader: bladeFragment,
      uniforms,
      side: THREE.DoubleSide,
      defines: tier === "high" ? { SURVEY_BLADES: "" } : {},
    });
    const ground = new THREE.ShaderMaterial({ vertexShader: groundVertex, fragmentShader: groundFragment, uniforms });
    const sky = new THREE.ShaderMaterial({
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      uniforms,
      side: THREE.BackSide,
      depthWrite: false,
    });
    return { blade, ground, sky };
  }, [uniforms, tier]);

  const groundGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(200, 200, 260, 260);
    g.rotateX(-Math.PI / 2);
    g.translate(14, 0, -20);
    return g;
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      groundGeo.dispose();
      materials.blade.dispose();
      materials.ground.dispose();
      materials.sky.dispose();
    },
    [geometry, groundGeo, materials],
  );

  const state = useRef({
    t: 4,
    intro: reduced ? 1 : 0,
    frames: 0,
    slowFrames: 0,
    trimmed: false,
    camPos: new THREE.Vector3(...KEYS[0].pos),
    camLook: new THREE.Vector3(...KEYS[0].look),
    shift: new THREE.Vector2(),
    pointer: new THREE.Vector2(999, 999),
    lastNdc: new THREE.Vector2(),
    energy: 0,
    retainer: 0,
    human: 0,
    lensDwell: [0, 0, 0, 0, 0, 0, 0, 0],
    lensFound: [false, false, false, false, false, false, false, false],
    foundAt: [-1e9, -1e9, -1e9, -1e9, -1e9, -1e9, -1e9, -1e9],
    latestFound: -1,
    sel: [0, 0, 0, 0, 0, 0, 0, 0],
    prevSig: "",
    still: 0,
  });

  const copyBox = useRef<{ l: number; t: number; r: number; b: number } | null>(null);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.4), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const tmp2 = useMemo(() => new THREE.Vector2(), []);

  useFrame((_, rawDt) => {
    const s = state.current;
    const now = performance.now();
    const dt = Math.min(rawDt, 1 / 20);
    const mobile = sceneStore.mobile;
    s.frames++;

    // Adaptive trim: if the first seconds run slow, drop instances and resolution.
    if (!reduced && !s.trimmed && s.frames > 30 && s.frames < 150) {
      if (rawDt > 1 / 40) s.slowFrames++;
      if (s.slowFrames > 45) {
        s.trimmed = true;
        geometry.instanceCount = Math.floor(geometry.instanceCount * 0.55);
        gl.setPixelRatio(1);
      }
    }

    if (!reduced) s.t += dt;
    s.intro = Math.min(1, s.intro + dt / 2.4);
    const introE = reduced ? 1 : 1 - Math.pow(1 - s.intro, 3);

    // Stage and drivers. Reduced motion cuts to whole stages and end states.
    const rawStage = storyStage(sceneStore.progress);
    const stage = reduced ? Math.round(rawStage) : rawStage;
    let drv: Drivers = storyDrivers(sceneStore.progress);
    if (reduced) drv = { comb: stage >= 1 ? 1 : 0, wilt: 1, survey: 1, split: 1, build: drv.build, lift: 1 };
    const story = sample(stage, mobile, low);
    const v = story.v;

    const k = reduced ? 1 : 1 - Math.exp(-dt * 3.2);
    const kFast = reduced ? 1 : 1 - Math.exp(-dt * 9);
    const kCart = reduced ? 1 : 1 - Math.exp(-dt * 12);

    // Effective cart: an empty cart builds the example's default request.
    const anySel = sceneStore.lotSel.some((x) => x > 0.5);
    const effSel = anySel ? sceneStore.lotSel : catalog.map((f) => (DEFAULT_CART.includes(f.id) ? 1 : 0));
    const effFeatures = catalog.filter((_, i) => effSel[i] > 0.5);
    let slot = 0;
    const effSlot = effSel.map((x) => (x > 0.5 ? slot++ : 0));
    // Before the build, the scene shows exactly the visitor's cart (empty is allowed to look empty).
    const selNow = stage >= 6.5 ? effSel : sceneStore.lotSel;

    // Build clock: features build in parallel, the longest sets the pace.
    const N = totalWeeks(effFeatures);
    const week = sceneStore.buildWeek ?? drv.build * N;
    for (let i = 0; i < 8; i++) {
      s.sel[i] = lerp(s.sel[i], selNow[i], kCart);
      uniforms.uLotSel.value[i] = s.sel[i];
      uniforms.uLotGrow.value[i] = effSel[i] > 0.5 ? featureProgress(catalog[i], week) : 0;
      uniforms.uLotSlot.value[i] = effSlot[i];
      const [dx, dz] = OWN_SLOTS[effSlot[i]];
      uniforms.uLotDest.value[i].set(dx, dz);
      uniforms.uLotPulse.value[i] = reduced ? 99 : (now - sceneStore.lotPulseAt[i]) / 1000;
    }
    uniforms.uLotHover.value = sceneStore.lotHover;

    // Retainer and human-in-the-loop toggles.
    s.retainer = reduced ? sceneStore.retainer : lerp(s.retainer, sceneStore.retainer, 1 - Math.exp(-dt * 3.5));
    s.human = lerp(s.human, sceneStore.human, k);

    uniforms.uTime.value = s.t;
    uniforms.uComb.value = lerp(uniforms.uComb.value, stage < 1 ? drv.comb : 1, kFast);
    uniforms.uWilt.value = lerp(uniforms.uWilt.value, v.wilt * drv.wilt, kFast);
    uniforms.uWiltGate.value = story.wiltGate;
    uniforms.uSurvey.value = lerp(uniforms.uSurvey.value, v.survey, k);
    uniforms.uLots.value = lerp(uniforms.uLots.value, v.lots, k);
    uniforms.uBuild.value = lerp(uniforms.uBuild.value, v.build, k);
    uniforms.uFocus.value = lerp(uniforms.uFocus.value, v.focus, k);
    uniforms.uOwn.value = lerp(uniforms.uOwn.value, v.own * (1 - s.retainer), k);
    uniforms.uOwnDraw.value = v.own * clamp01(drv.lift / 0.3);
    uniforms.uLift.value = lerp(uniforms.uLift.value, v.lift * drv.lift * (1 - s.retainer), kFast);
    uniforms.uRetainer.value = s.retainer;
    uniforms.uTend.value = reduced ? 0 : (s.t / 5) % 1;
    uniforms.uHuman.value = s.human;
    uniforms.uGrow.value = lerp(uniforms.uGrow.value, lerp(0.12, 1, introE), k * 1.4);
    uniforms.uDim.value = lerp(uniforms.uDim.value, v.dim * introE, k * 1.4);
    uniforms.uSentFlash.value = reduced ? 0 : clamp01(1 - (now - sceneStore.sentAt) / 800);
    uniforms.uFog.value.set(lerp(uniforms.uFog.value.x, story.fog[0], k), lerp(uniforms.uFog.value.y, story.fog[1], k));

    // Retainer: the camera follows the lots back to our ground instead of watching an empty plot.
    const ret = clamp01(1 - Math.abs(stage - 8)) * s.retainer;
    if (ret > 0) {
      const b7 = keyFor(7, mobile, low);
      story.pos = story.pos.map((x, j) => lerp(x, b7.pos[j], ret)) as unknown as typeof story.pos;
      story.look = story.look.map((x, j) => lerp(x, b7.look[j], ret)) as unknown as typeof story.look;
      v.shiftX = lerp(v.shiftX, b7.shiftX, ret);
      v.shiftY = lerp(v.shiftY, b7.shiftY, ret);
    }

    // Camera, lens shift and a little pointer parallax (none at rest).
    const p = sceneStore.pointer;
    const par = reduced ? 0 : 1 - v.rest;
    tmp.set(story.pos[0] + p.x * 0.55 * par, story.pos[1] + p.y * 0.25 * par, story.pos[2]);
    s.camPos.lerp(tmp, k);
    tmp.set(...story.look);
    s.camLook.lerp(tmp, k);
    camera.position.copy(s.camPos);
    camera.lookAt(s.camLook);
    s.shift.x = lerp(s.shift.x, v.shiftX, k);
    s.shift.y = lerp(s.shift.y, v.shiftY, k);
    const cam = camera as THREE.PerspectiveCamera;
    cam.setViewOffset(size.width, size.height, -s.shift.x * size.width, -s.shift.y * size.height, size.width, size.height);

    // Pointer on the ground plane, plus "energy" from movement. Mobile: the survey lens follows scroll.
    const surveying = Math.abs(stage - 5) < 0.6;
    if (mobile && surveying) {
      const tpos = drv.survey * 7;
      const a = Math.min(7, Math.floor(tpos));
      const b = Math.min(7, a + 1);
      const e = smooth(tpos - a);
      s.pointer.set(lerp(LOTS[a][0], LOTS[b][0], e), lerp(LOTS[a][1], LOTS[b][1], e));
    } else if (p.active && !reduced) {
      ndc.set(p.x, p.y);
      const moved = ndc.distanceTo(s.lastNdc);
      s.lastNdc.copy(ndc);
      s.energy = Math.min(1, s.energy + moved * 3.5 * (1 - v.rest));
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) s.pointer.lerp(tmp2.set(hit.x, hit.z), 1 - Math.exp(-dt * 10));
    }
    const energyFloor = 0.25 * (p.active ? 1 : 0) * (1 - v.rest) * (stage >= 5.5 && stage <= 6.5 ? 0 : 1);
    s.energy = reduced ? 0 : Math.max(energyFloor, s.energy * Math.exp(-dt * 1.1) * (1 - v.rest * dt * 4));
    uniforms.uPointer.value.copy(reduced ? tmp2.set(999, 999) : s.pointer);
    uniforms.uEnergy.value = s.energy;

    // Survey findings: on a scroll clock, or sooner when the lens dwells on one for 250ms.
    if (rawStage < 4.5) s.lensFound.fill(false);
    let count = 0;
    for (let i = 0; i < 8; i++) {
      const clock = drv.survey > 0.06 + i * 0.11;
      if (surveying && !mobile && p.active && !reduced) {
        const d = Math.hypot(s.pointer.x - LOTS[i][0], s.pointer.y - LOTS[i][1]);
        s.lensDwell[i] = d < 2.6 ? s.lensDwell[i] + rawDt : 0;
        if (s.lensDwell[i] > 0.25) s.lensFound[i] = true;
      }
      const f = clock || s.lensFound[i] || rawStage > 5.6;
      if (f && !sceneStore.found[i]) {
        s.foundAt[i] = now;
        s.latestFound = i;
      }
      sceneStore.found[i] = f;
      if (f) count++;
      uniforms.uLotFound.value[i] = f ? 1 : 0;
      uniforms.uLotFlash.value[i] = reduced ? 0 : 1 - easeOutExpo(clamp01((now - s.foundAt[i]) / 800));
    }
    if (count !== sceneStore.foundCount) {
      sceneStore.foundCount = count;
      window.dispatchEvent(new CustomEvent("eden:found", { detail: count }));
    }

    // Copy mask: darken the field behind whichever copy block is on screen.
    const dpr = gl.getPixelRatio();
    uniforms.uDpr.value = dpr;
    const r = activeCopyRect(now);
    copyBox.current = r ? { l: r.left - 12, t: r.top - 12, r: r.right + 12, b: r.bottom + 12 } : null;
    if (r) {
      const pad = 24;
      uniforms.uCopyRect.value.set(
        (r.left - pad) * dpr,
        (size.height - r.bottom - pad) * dpr,
        (r.right + pad) * dpr,
        (size.height - r.top + pad) * dpr,
      );
    }
    uniforms.uCopyMask.value = lerp(uniforms.uCopyMask.value, r ? 1 : 0, reduced ? 1 : 1 - Math.exp(-dt * 6));

    updateLabels(camera, size.width, size.height, {
      stage: rawStage,
      drivers: drv,
      found: sceneStore.found,
      latestFound: s.latestFound,
      sel: sceneStore.lotSel,
      retainer: s.retainer,
      ownDraw: uniforms.uOwnDraw.value,
      lift: uniforms.uLift.value,
      mobile,
      avoid: copyBox.current,
      avoidRight: !mobile && size.width >= 1024 && rawStage > 3.5 && rawStage < 8.5 ? 200 : 0,
    });

    // Rest-state throttling: slow sway only, so render a frame every 250ms.
    const sig = `${stage.toFixed(3)}|${uniforms.uComb.value.toFixed(3)}|${uniforms.uLift.value.toFixed(3)}|${s.camPos.x.toFixed(2)},${s.camPos.y.toFixed(2)},${s.camPos.z.toFixed(2)}`;
    s.still = sig === s.prevSig ? s.still + 1 : 0;
    s.prevSig = sig;
    sceneStore.throttle = v.rest > 0.9 && uniforms.uDim.value < 0.45 && s.still > 20;

    if (s.frames === 3) markSceneReady();
  });

  return (
    <>
      <mesh material={materials.sky} frustumCulled={false} renderOrder={-1}>
        <sphereGeometry args={[400, 32, 16]} />
      </mesh>
      <mesh geometry={groundGeo} material={materials.ground} />
      <mesh geometry={geometry} material={materials.blade} frustumCulled={false} />
    </>
  );
}
