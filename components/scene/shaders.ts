/**
 * GLSL for the "Cultivated Ground" field.
 * Colours are authored in display space (the canvas renders with linear output, no tone mapping).
 */

export const FIELD = {
  minX: -20,
  maxX: 20,
  minZ: -30,
  maxZ: 13.5,
  rowSpacing: 0.66,
  /** Parcel that is transplanted during "Own": plot 2, |z| < 4, moved by +x. */
  parcelShift: 17,
} as const;

const common = /* glsl */ `
  const vec3 SURVEY = vec3(1.0, 0.353, 0.122);
  const vec3 INK = vec3(0.047, 0.059, 0.051);

  float terrain(vec2 p) {
    return 0.55 * sin(p.x * 0.14 + 1.0) * cos(p.y * 0.11 - 0.4)
         + 0.30 * sin(p.x * 0.29 - p.y * 0.21 + 2.0)
         + 0.16 * sin(p.y * 0.47 + p.x * 0.09);
  }

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
`;

export const bladeVertex = /* glsl */ `
  ${common}

  uniform float uTime;
  uniform float uComb;
  uniform float uWilt;
  uniform float uGrow;
  uniform float uLift;
  uniform float uHuman;
  uniform float uSurvey;
  uniform float uLots;
  uniform float uPlots;
  uniform float uCap;
  uniform float uEnergy;
  uniform vec2 uPointer;
  uniform vec2 uFog;

  attribute vec2 aWild;
  attribute vec2 aRow;
  attribute vec4 aRand;
  attribute vec2 aMeta; // x: plot id (0..3), y: row index

  varying float vT;
  varying float vTone;
  varying float vAccent;
  varying float vGlow;
  varying float vHi;
  varying float vFog;
  varying float vSide;

  float backOut(float t) {
    float s = 1.9;
    t -= 1.0;
    return t * t * ((s + 1.0) * t + s) + 1.0;
  }

  void main() {
    float t = position.y;

    // The comb: a front sweeping +x. Behind it, blades spring into their rows.
    float front = mix(${FIELD.minX.toFixed(1)} - 4.0, ${FIELD.maxX.toFixed(1)} + 4.0, uComb) + step(0.999, uComb) * 60.0;
    float local = clamp((front - aWild.x) / 3.2, 0.0, 1.0);
    float order = backOut(local);
    float orderS = clamp(order, 0.0, 1.0);

    // Wilt: cheap systems. A random subset falls back out of order.
    float fall = step(aRand.w, uWilt * 0.55);
    float orderEff = order * (1.0 - fall * 0.9);
    vec2 base = mix(aWild, aRow, orderEff);

    // Transplant: one parcel lifts out and settles in its own fenced plot.
    float parcel = step(abs(aMeta.x - 2.0), 0.1) * step(abs(aRow.y), 4.0) * step(0.5, orderS);
    float liftE = smoothstep(0.0, 1.0, uLift);
    base.x += liftE * parcel * ${FIELD.parcelShift.toFixed(1)};
    float arc = sin(3.14159 * clamp(uLift, 0.0, 1.0)) * parcel * 2.2;

    float ground = terrain(base);

    float hWild = 0.42 + aRand.x * 0.8;
    float hRow = 0.62 + aRand.x * 0.12;
    float H = mix(hWild, hRow, orderS) * uGrow * (1.0 - fall * uWilt * 0.5);
    float w = 0.036 * (1.0 - t * 0.88);

    float ang = mix(aRand.z * 6.2831, 0.0, orderS);
    vec2 side = vec2(cos(ang), sin(ang));

    // Two motion registers: incoherent wild sway vs phase-locked rows.
    float ph = aRand.y * 6.2831;
    vec2 wDir = normalize(vec2(cos(ph + uTime * 0.35), sin(ph * 1.7 + uTime * 0.27)) + vec2(0.55, 0.0));
    float wBend = 0.24 + 0.16 * sin(uTime * 1.25 + ph * 3.0) + 0.08 * sin(uTime * 2.7 + ph * 5.0);
    float wave = sin(uTime * 1.5 - base.y * 0.38 + base.x * 0.015);
    vec2 bend = mix(wDir * wBend, vec2(0.025 + 0.035 * wave, -0.06 - 0.16 * wave), orderS);

    bend += (vec2(0.3, 0.5) * fall + vec2(0.04, 0.14)) * uWilt;

    // Pointer: parts the wild field; sends synchronised ripples down ordered rows.
    vec2 d = base - uPointer;
    float dist = length(d);
    float part = 1.0 - smoothstep(0.0, 3.0, dist);
    vec2 pushWild = (d / max(dist, 0.001)) * part * part * 1.15;
    float ring = sin(dist * 2.3 - uTime * 6.5) * exp(-dist * 0.3) * (1.0 - smoothstep(5.0, 13.0, dist));
    vec2 pushRow = vec2(ring * 0.32, 0.0);
    bend += mix(pushWild, pushRow, orderS) * uEnergy;

    float bl = length(bend);
    if (bl > 0.95) bend *= 0.95 / bl;

    float tt = t * t;
    vec3 pos;
    pos.xz = base + side * position.x * w + bend * tt * H;
    pos.y = ground + t * H * (1.0 - 0.3 * dot(bend, bend)) + arc;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    vT = t;
    vSide = position.x;
    vTone = aRand.x * 0.6 + aRand.w * 0.4;
    vFog = smoothstep(uFog.x, uFog.y, -mv.z);

    // Accents (all survey orange).
    float humanRow = step(abs(mod(aMeta.y, 7.0) - 3.0), 0.1) * uHuman * orderS;
    vec2 lot = floor((aRow + vec2(20.0, 30.0)) / 5.0);
    float picked = step(hash12(lot + 3.0), 0.26) * uLots * orderS;
    float c = ground * 6.0;
    float lens = 1.0 - smoothstep(2.0, 5.5, dist);
    float surveyHit = (1.0 - smoothstep(0.0, 0.12, abs(fract(c + 0.5) - 0.5))) * uSurvey * (0.35 + 0.65 * lens);
    vAccent = max(max(max(humanRow, picked * 0.85), surveyHit), parcel * liftE * 0.55);
    vGlow = exp(-abs(front - base.x) * 0.9) * (1.0 - fall);

    float onPlot = step(abs(aMeta.x - (uCap - 1.0)), 0.1);
    vHi = uCap > 0.5 ? (onPlot * 2.0 - 1.0) : 0.0;
    vHi += uPlots * (mod(aMeta.x, 2.0) * 0.18 - 0.09);
  }
`;

export const bladeFragment = /* glsl */ `
  ${common}

  uniform float uDim;
  uniform vec3 uHorizon;

  varying float vT;
  varying float vTone;
  varying float vAccent;
  varying float vGlow;
  varying float vHi;
  varying float vFog;
  varying float vSide;

  void main() {
    vec3 root = vec3(0.03, 0.038, 0.033);
    vec3 tip = mix(vec3(0.5, 0.52, 0.48), vec3(0.88, 0.89, 0.85), vTone);
    vec3 col = mix(root, tip, pow(vT, 1.25));
    // Fake cylindrical shading across the blade.
    col *= 0.82 + 0.18 * (1.0 - abs(vSide) * 2.0);
    col *= 1.0 + clamp(vHi, -0.5, 1.0) * 0.55;
    col = mix(col, SURVEY * (0.3 + 0.8 * vT), clamp(vAccent, 0.0, 1.0));
    col += SURVEY * vGlow * (0.25 + vT) * 1.1;
    col *= uDim;
    col = mix(col, uHorizon, vFog);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const groundVertex = /* glsl */ `
  uniform vec2 uFog;
  varying vec3 vWorld;
  varying float vFog;
  ${common}
  void main() {
    vec3 p = position;
    p.y = terrain(p.xz) - 0.02;
    vWorld = p;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vFog = smoothstep(uFog.x, uFog.y, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const groundFragment = /* glsl */ `
  ${common}

  uniform float uTime;
  uniform float uComb;
  uniform float uSurvey;
  uniform float uLots;
  uniform float uPlots;
  uniform float uFence;
  uniform float uOwn;
  uniform float uCap;
  uniform float uDim;
  uniform vec2 uPointer;
  uniform vec3 uHorizon;

  varying vec3 vWorld;
  varying float vFog;

  float aaLine(float coord, float width) {
    float fw = max(fwidth(coord), 1e-4);
    float g = abs(fract(coord - 0.5) - 0.5) / fw;
    return 1.0 - smoothstep(width, width + 1.0, g);
  }

  float rectOutline(vec2 p, vec2 mn, vec2 mx, float w) {
    vec2 fw = max(fwidth(p), vec2(1e-4));
    float dx = min(abs(p.x - mn.x), abs(p.x - mx.x)) / fw.x;
    float dy = min(abs(p.y - mn.y), abs(p.y - mx.y)) / fw.y;
    float ex = (1.0 - smoothstep(w, w + 1.0, dx)) * step(mn.y, p.y) * step(p.y, mx.y);
    float ey = (1.0 - smoothstep(w, w + 1.0, dy)) * step(mn.x, p.x) * step(p.x, mx.x);
    return max(ex, ey);
  }

  void main() {
    vec2 p = vWorld.xz;
    float h = terrain(p);
    float field = step(${FIELD.minX.toFixed(1)}, p.x) * step(p.x, ${FIELD.maxX.toFixed(1)})
                * step(${FIELD.minZ.toFixed(1)}, p.y) * step(p.y, ${FIELD.maxZ.toFixed(1)});

    vec3 col = vec3(0.036, 0.044, 0.039) + 0.01 * h + 0.012 * (hash12(floor(p * 6.0)) - 0.5);

    // Tilled furrows appear behind the comb front.
    float front = mix(${FIELD.minX.toFixed(1)} - 4.0, ${FIELD.maxX.toFixed(1)} + 4.0, uComb) + step(0.999, uComb) * 60.0;
    float tilled = smoothstep(front, front - 2.5, p.x) * field;
    float f = fract((p.x - ${FIELD.minX.toFixed(1)}) / ${FIELD.rowSpacing.toFixed(2)});
    float ridge = 1.0 - smoothstep(0.0, 0.32, abs(f - 0.5));
    col += vec3(0.022, 0.024, 0.02) * ridge * tilled;
    col -= vec3(0.012) * (1.0 - ridge) * tilled;

    float frontLine = exp(-abs(p.x - front) * 2.6) * field;
    col += SURVEY * frontLine * 0.85;

    // Survey: contour lines + grid, strongest inside the cursor lens.
    float lens = 1.0 - smoothstep(2.5, 6.5, length(p - uPointer));
    float contour = aaLine(h * 6.0, 0.6);
    col = mix(col, SURVEY * 0.8, contour * uSurvey * (0.3 + 0.7 * lens));
    float grid = max(aaLine(p.x / 4.0, 0.4), aaLine(p.y / 4.0, 0.4));
    col += vec3(0.08, 0.085, 0.08) * grid * uSurvey * 0.6 * field;

    // Capability plots: four bands across x.
    float plotLine = aaLine((p.x - ${FIELD.minX.toFixed(1)}) / 10.0, 0.8) * field;
    col += vec3(0.5, 0.51, 0.48) * plotLine * max(uPlots, step(0.5, uCap));
    float plotId = floor((p.x - ${FIELD.minX.toFixed(1)}) / 10.0);
    float onPlot = step(abs(plotId - (uCap - 1.0)), 0.1) * step(0.5, uCap) * field;
    col += SURVEY * onPlot * 0.06;

    // Storefront lots: priced parcels, a few picked.
    vec2 lp = (p - vec2(${FIELD.minX.toFixed(1)}, ${FIELD.minZ.toFixed(1)})) / 5.0;
    float lotGrid = max(aaLine(lp.x, 0.5), aaLine(lp.y, 0.5)) * field;
    float picked = step(hash12(floor(lp) + 3.0), 0.26) * field;
    col += vec3(0.14, 0.145, 0.135) * lotGrid * uLots;
    col += SURVEY * picked * uLots * 0.07;

    // The gate: a fence around the whole field with an opening at the front.
    float fence = rectOutline(p, vec2(${FIELD.minX.toFixed(1)} - 0.4, ${FIELD.minZ.toFixed(1)} - 0.4), vec2(${FIELD.maxX.toFixed(1)} + 0.4, ${FIELD.maxZ.toFixed(1)} + 0.4), 1.2);
    float gate = 1.0 - step(abs(p.x), 1.6) * step(${FIELD.maxZ.toFixed(1)}, p.y);
    col += SURVEY * fence * gate * uFence * 1.6;

    // Your infrastructure: a separate fenced plot the parcel moves into.
    vec2 omn = vec2(${(0 + FIELD.parcelShift - 0.5).toFixed(1)}, -4.5);
    vec2 omx = vec2(${(10 + FIELD.parcelShift + 0.5).toFixed(1)}, 4.5);
    float own = rectOutline(p, omn, omx, 1.0);
    float ownIn = step(omn.x, p.x) * step(p.x, omx.x) * step(omn.y, p.y) * step(p.y, omx.y);
    col += vec3(0.75, 0.76, 0.72) * own * uOwn * 0.8;
    col += vec3(0.02) * ownIn * uOwn;

    col *= mix(1.0, uDim, 0.6);
    col = mix(col, uHorizon, vFog);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`;

export const skyFragment = /* glsl */ `
  uniform vec3 uHorizon;
  varying vec3 vDir;
  void main() {
    vec3 top = vec3(0.043, 0.054, 0.047);
    float k = smoothstep(-0.02, 0.32, vDir.y);
    vec3 col = mix(uHorizon, top, k);
    gl_FragColor = vec4(col, 1.0);
  }
`;
