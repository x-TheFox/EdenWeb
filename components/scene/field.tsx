"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { markSceneReady, sceneStore, storyStage } from "./scene-store";
import {
  FIELD,
  bladeFragment,
  bladeVertex,
  groundFragment,
  groundVertex,
  skyFragment,
  skyVertex,
} from "./shaders";

const HORIZON = new THREE.Color(0.082, 0.088, 0.08);

/* -------------------------------------------------------------------------- */
/* Story keyframes                                                             */
/* -------------------------------------------------------------------------- */

type Key = {
  pos: [number, number, number];
  look: [number, number, number];
  comb: number;
  wilt: number;
  plots: number;
  survey: number;
  lots: number;
  grow: number;
  lift: number;
  fence: number;
  own: number;
  dim: number;
  fog: [number, number];
};

const base: Omit<Key, "pos" | "look"> = {
  comb: 1,
  wilt: 0,
  plots: 0,
  survey: 0,
  lots: 0,
  grow: 1,
  lift: 0,
  fence: 0,
  own: 0,
  dim: 1,
  fog: [10, 46],
};

// 0 hero, 1 combed, 2 statement, 3 capabilities, 4 qualify, 5 survey, 6 choose, 7 build, 8 own, 9 calm
const KEYS: Key[] = [
  { ...base, pos: [-5.5, 1.7, 14.5], look: [1.5, -0.7, 0], comb: 0 },
  { ...base, pos: [0.33, 2.4, 14.5], look: [0.33, -0.9, -2] },
  { ...base, pos: [3.5, 1.9, 12.5], look: [-0.5, -0.3, -2], wilt: 0.75, dim: 0.62 },
  { ...base, pos: [0, 24, 20], look: [0, 0, -4], plots: 1, dim: 0.95, fog: [20, 70] },
  { ...base, pos: [-17, 9, 27], look: [0, 0, -4], fence: 1, dim: 0.85, fog: [18, 70] },
  { ...base, pos: [2, 15, 13], look: [0, 0, -2], survey: 1, fence: 0.25, dim: 0.75, fog: [14, 60] },
  { ...base, pos: [7, 18, 16], look: [0, 0, -4], lots: 1, dim: 0.85, fog: [16, 64] },
  { ...base, pos: [-3, 1.5, 11.5], look: [0, 0.4, 0], grow: 1.5 },
  { ...base, pos: [26, 10, 21], look: [16, 0, -1], lift: 1, own: 1, grow: 1.1, fog: [14, 64] },
  { ...base, pos: [-2, 3.6, 17], look: [2, -0.4, -6], lift: 1, own: 0.35, dim: 0.78 },
];

const NUM_KEYS: (keyof Omit<Key, "pos" | "look" | "fog">)[] = [
  "comb",
  "wilt",
  "plots",
  "survey",
  "lots",
  "grow",
  "lift",
  "fence",
  "own",
  "dim",
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function sample(stage: number) {
  const s = Math.min(KEYS.length - 1, Math.max(0, stage));
  const i = Math.min(KEYS.length - 2, Math.floor(s));
  const f = s - i;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const e = smooth(f);
  const out = {} as Record<string, number>;
  for (const k of NUM_KEYS) out[k] = lerp(a[k], b[k], e);
  // The comb itself is scrubbed linearly so the sweep tracks the scroll exactly.
  if (i === 0) out.comb = f;
  return {
    values: out,
    pos: [lerp(a.pos[0], b.pos[0], e), lerp(a.pos[1], b.pos[1], e), lerp(a.pos[2], b.pos[2], e)] as const,
    look: [lerp(a.look[0], b.look[0], e), lerp(a.look[1], b.look[1], e), lerp(a.look[2], b.look[2], e)] as const,
    fog: [lerp(a.fog[0], b.fog[0], e), lerp(a.fog[1], b.fog[1], e)] as const,
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

  // Blade: tapered strip, 6 levels.
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

  // A few clumps make the wild field properly uneven.
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

    meta[n * 2] = Math.min(3, Math.max(0, Math.floor((rx - FIELD.minX) / 10)));
    meta[n * 2 + 1] = r;
  }

  geo.setAttribute("aWild", new THREE.InstancedBufferAttribute(wild, 2));
  geo.setAttribute("aRow", new THREE.InstancedBufferAttribute(row, 2));
  geo.setAttribute("aRand", new THREE.InstancedBufferAttribute(rnd, 4));
  geo.setAttribute("aMeta", new THREE.InstancedBufferAttribute(meta, 2));
  geo.instanceCount = count;
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(5, 0, -8), 60);
  return geo;
}

/* -------------------------------------------------------------------------- */
/* Scene                                                                       */
/* -------------------------------------------------------------------------- */

export function Field({ blades, reduced }: { blades: number; reduced: boolean }) {
  const { camera, gl } = useThree();
  const geometry = useMemo(() => buildBlades(blades), [blades]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uComb: { value: 0 },
      uWilt: { value: 0 },
      uGrow: { value: 0.2 },
      uLift: { value: 0 },
      uHuman: { value: 0 },
      uSurvey: { value: 0 },
      uLots: { value: 0 },
      uPlots: { value: 0 },
      uCap: { value: 0 },
      uEnergy: { value: 0 },
      uFence: { value: 0 },
      uOwn: { value: 0 },
      uDim: { value: 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uFog: { value: new THREE.Vector2(10, 46) },
      uHorizon: { value: HORIZON.clone() },
    }),
    [],
  );

  const bladeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: bladeVertex,
        fragmentShader: bladeFragment,
        uniforms,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  );
  const groundMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: groundVertex,
        fragmentShader: groundFragment,
        uniforms,
      }),
    [uniforms],
  );
  const skyMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        uniforms,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [uniforms],
  );
  const groundGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(180, 180, 220, 220);
    g.rotateX(-Math.PI / 2);
    g.translate(4, 0, -20);
    return g;
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      groundGeo.dispose();
      bladeMat.dispose();
      groundMat.dispose();
      skyMat.dispose();
    },
    [geometry, groundGeo, bladeMat, groundMat, skyMat],
  );

  const state = useRef({
    t: 0,
    intro: 0,
    frames: 0,
    slowFrames: 0,
    trimmed: false,
    camPos: new THREE.Vector3(...KEYS[0].pos),
    camLook: new THREE.Vector3(...KEYS[0].look),
    pointer: new THREE.Vector2(999, 999),
    lastNdc: new THREE.Vector2(),
    energy: 0,
  });
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.4), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDt) => {
    const s = state.current;
    const dt = Math.min(rawDt, 1 / 20);
    s.frames++;

    // Adaptive trim: if the first seconds run slow, drop instances and resolution.
    if (!s.trimmed && s.frames > 30 && s.frames < 150) {
      if (rawDt > 1 / 40) s.slowFrames++;
      if (s.slowFrames > 45) {
        s.trimmed = true;
        geometry.instanceCount = Math.floor(geometry.instanceCount * 0.55);
        gl.setPixelRatio(1);
      }
    }

    if (!reduced) s.t += dt;
    s.intro = Math.min(1, s.intro + dt / (reduced ? 0.01 : 2.4));
    const introE = 1 - Math.pow(1 - s.intro, 3);

    const story = sample(storyStage(sceneStore.progress));
    const v = story.values;
    const k = 1 - Math.exp(-dt * 3.2);
    const kFast = 1 - Math.exp(-dt * 9);

    uniforms.uTime.value = s.t;
    uniforms.uComb.value = lerp(uniforms.uComb.value, v.comb, kFast);
    uniforms.uWilt.value = lerp(uniforms.uWilt.value, v.wilt, k);
    uniforms.uPlots.value = lerp(uniforms.uPlots.value, v.plots, k);
    uniforms.uSurvey.value = lerp(uniforms.uSurvey.value, v.survey, k);
    uniforms.uLots.value = lerp(uniforms.uLots.value, v.lots, k);
    uniforms.uLift.value = lerp(uniforms.uLift.value, v.lift, k * 0.8);
    uniforms.uFence.value = lerp(uniforms.uFence.value, v.fence, k);
    uniforms.uOwn.value = lerp(uniforms.uOwn.value, v.own, k);
    uniforms.uGrow.value = lerp(uniforms.uGrow.value, v.grow * lerp(0.12, 1, introE), k * 1.4);
    uniforms.uDim.value = lerp(uniforms.uDim.value, v.dim * introE, k * 1.4);
    uniforms.uHuman.value = lerp(uniforms.uHuman.value, sceneStore.human, k);
    uniforms.uCap.value = sceneStore.capHighlight;
    uniforms.uFog.value.set(
      lerp(uniforms.uFog.value.x, story.fog[0], k),
      lerp(uniforms.uFog.value.y, story.fog[1], k),
    );

    // Camera with a little pointer parallax.
    const p = sceneStore.pointer;
    const par = reduced ? 0 : 1;
    tmp.set(story.pos[0] + p.x * 0.55 * par, story.pos[1] + p.y * 0.25 * par, story.pos[2]);
    s.camPos.lerp(tmp, k);
    tmp.set(...story.look);
    s.camLook.lerp(tmp, k);
    camera.position.copy(s.camPos);
    camera.lookAt(s.camLook);

    // Pointer on the ground plane, plus "energy" from movement.
    if (p.active && !reduced) {
      ndc.set(p.x, p.y);
      const moved = ndc.distanceTo(s.lastNdc);
      s.lastNdc.copy(ndc);
      s.energy = Math.min(1, s.energy + moved * 3.5);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        s.pointer.lerp(new THREE.Vector2(hit.x, hit.z), 1 - Math.exp(-dt * 10));
      }
    }
    s.energy = Math.max(0.25 * (p.active ? 1 : 0), s.energy * Math.exp(-dt * 1.1));
    uniforms.uPointer.value.copy(s.pointer);
    uniforms.uEnergy.value = s.energy;

    if (s.frames === 3) markSceneReady();
  });

  return (
    <>
      <mesh material={skyMat} frustumCulled={false} renderOrder={-1}>
        <sphereGeometry args={[400, 32, 16]} />
      </mesh>
      <mesh geometry={groundGeo} material={groundMat} />
      <mesh geometry={geometry} material={bladeMat} frustumCulled={false} />
    </>
  );
}
