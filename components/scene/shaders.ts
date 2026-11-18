/**
 * GLSL for the "Cultivated Ground" field.
 * Colours are authored in display space (the canvas renders with linear output, no tone mapping).
 */
import { CHECK_Z, LOT_HALF, OWN_RECT, SEAM_X } from "./lots";

export const FIELD = {
  minX: -20,
  maxX: 20,
  minZ: -30,
  maxZ: 13.5,
  rowSpacing: 0.66,
} as const;

const f = (n: number) => n.toFixed(3);

const common = /* glsl */ `
  const vec3 SURVEY = vec3(1.0, 0.353, 0.122);
  const vec3 BONE = vec3(0.86, 0.867, 0.835);
  const float LOT_HALF = ${f(LOT_HALF)};
  const float CHECK_Z = ${f(CHECK_Z)};
  const float SEAM_X = ${f(SEAM_X)};

  uniform vec2 uLotC[8];

  float terrain(vec2 p) {
    return 0.55 * sin(p.x * 0.14 + 1.0) * cos(p.y * 0.11 - 0.4)
         + 0.30 * sin(p.x * 0.29 - p.y * 0.21 + 2.0)
         + 0.16 * sin(p.y * 0.47 + p.x * 0.09);
  }

  // Survey potential: terrain plus a "stuck" knot at every lot, so contours bunch where the problems are.
  float potential(vec2 p) {
    float pot = terrain(p) * 6.0;
    for (int i = 0; i < 8; i++) {
      vec2 d = p - uLotC[i];
      pot += 2.2 * exp(-dot(d, d) / 5.0);
    }
    return pot;
  }

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
`;

const fragCommon = /* glsl */ `
  uniform vec4 uCopyRect;
  uniform float uCopyMask;
  uniform float uDpr;

  // Darken the field itself behind the active copy block (device pixels, gl_FragCoord space).
  float copyMask() {
    vec2 c = (uCopyRect.xy + uCopyRect.zw) * 0.5;
    vec2 h = max((uCopyRect.zw - uCopyRect.xy) * 0.5, vec2(0.0));
    vec2 q = abs(gl_FragCoord.xy - c) - h;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    return (1.0 - smoothstep(0.0, 140.0 * uDpr, d)) * uCopyMask;
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
  uniform float uBuild;
  uniform float uFocus;
  uniform float uRetainer;
  uniform float uTend;
  uniform float uStaticTend;
  uniform float uEnergy;
  uniform float uLowTier;
  uniform vec2 uPointer;
  uniform vec2 uFog;
  uniform vec2 uLotDest[8];
  uniform float uLotSel[8];
  uniform float uLotGrow[8];
  uniform float uLotSlot[8];
  uniform float uLotPulse[8];
  uniform float uLotHover;

  attribute vec2 aWild;
  attribute vec2 aRow;
  attribute vec4 aRand;
  attribute vec2 aMeta; // x: lot index (-1 none, 0..7), y: row index

  varying float vT;
  varying float vTone;
  varying float vAccent;
  varying float vGlow;
  varying float vFog;
  varying float vSide;
  varying float vWilt;
  varying float vFocus;
  varying float vDone;
  varying float vSun;

  float backOut(float t) {
    float s = 1.9;
    t -= 1.0;
    return t * t * ((s + 1.0) * t + s) + 1.0;
  }

  void main() {
    float t = position.y;

    // The comb: a front sweeping +x. Behind it, blades spring into their rows.
    float front = mix(${f(FIELD.minX)} - 4.0, ${f(FIELD.maxX)} + 4.0, uComb) + step(0.999, uComb) * 60.0;
    float local = clamp((front - aWild.x) / 3.2, 0.0, 1.0);
    float order = backOut(local);
    float orderS = clamp(order, 0.0, 1.0);

    // Built twice: only the cheap half (east of the seam) falls apart over time.
    float cheap = smoothstep(SEAM_X - 0.3, SEAM_X + 0.3, aRow.x);
    float fall = step(aRand.w, uWilt * 0.85) * cheap;
    float orderEff = order * (1.0 - fall * 0.9);
    vec2 base = mix(aWild, aRow, orderEff);

    // Lot membership.
    float sel = 0.0;
    float grow = 1.0;
    float hov = 0.0;
    float slot = 0.0;
    float pulse = 99.0;
    vec2 lc = vec2(0.0);
    vec2 dst = vec2(0.0);
    if (aMeta.x > -0.5) {
      int li = int(aMeta.x + 0.5);
      sel = uLotSel[li];
      grow = uLotGrow[li];
      slot = uLotSlot[li];
      pulse = uLotPulse[li];
      lc = uLotC[li];
      dst = uLotDest[li];
      hov = 1.0 - step(0.5, abs(uLotHover - aMeta.x));
    }

    // Handover: each built lot lifts out and settles in its slot in "Your infrastructure".
    float moving = sel * step(0.5, orderS);
    float l = clamp(uLift * 1.5 - slot * 0.07, 0.0, 1.0) * moving;
    float le = smoothstep(0.0, 1.0, l);
    base = mix(base, base - lc + dst, le);
    float arc = sin(3.14159 * l) * 2.0;

    float ground = terrain(base);

    float hWild = 0.42 + aRand.x * 0.8;
    float hRow = 0.62 + aRand.x * 0.12;
    float H = mix(hWild, hRow, orderS) * uGrow * (1.0 - fall * uWilt * 0.6);
    float signedOff = step(0.999, grow) * uBuild;
    H *= mix(1.0, mix(0.22, 2.6, grow), sel * uBuild);

    float w = 0.036 * (1.0 - t * 0.88) * mix(1.0, 1.4, uLowTier);
    float ang = mix(aRand.z * 6.2831, 0.0, orderS);
    vec2 side = vec2(cos(ang), sin(ang));

    // Two motion registers: incoherent wild sway vs a phase-locked wave.
    // With a person in the loop, the wave waits at the checkpoint band and then continues.
    float ph = aRand.y * 6.2831;
    vec2 wDir = normalize(vec2(cos(ph + uTime * 0.35), sin(ph * 1.7 + uTime * 0.27)) + vec2(0.55, 0.0));
    float wBend = 0.24 + 0.16 * sin(uTime * 1.25 + ph * 3.0) + 0.08 * sin(uTime * 2.7 + ph * 5.0);
    float gate = smoothstep(CHECK_Z - 0.3, CHECK_Z + 0.3, base.y);
    float wave = sin(uTime * 1.5 - base.y * 0.38 + base.x * 0.015 + gate * uHuman * 1.4);
    vec2 bend = mix(wDir * wBend, vec2(0.025 + 0.035 * wave, -0.06 - 0.16 * wave), orderS);

    bend += (vec2(0.45, 0.6) * fall + vec2(0.06, 0.18) * cheap) * uWilt;

    // Pointer: parts the wild field; sends synchronised ripples down ordered rows.
    vec2 d = base - uPointer;
    float dist = length(d);
    float part = 1.0 - smoothstep(0.0, 3.0, dist);
    vec2 pushWild = (d / max(dist, 0.001)) * part * part * 1.15;
    float ring = sin(dist * 2.3 - uTime * 6.5) * exp(-dist * 0.3) * (1.0 - smoothstep(5.0, 13.0, dist));
    vec2 pushRow = vec2(ring * 0.32, 0.0);
    bend += mix(pushWild, pushRow, orderS) * uEnergy;

    // One-shot ripple when a lot is added to the cart (600ms).
    if (pulse < 0.6) {
      float ld = length(base - lc);
      float r = sin(ld * 3.0 - pulse * 14.0) * (1.0 - pulse / 0.6) * (1.0 - smoothstep(0.0, 4.0, abs(ld - pulse * 9.0)));
      bend.x += r * 0.35;
    }

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
    vWilt = fall * uWilt;

    // Accents (all survey orange, each with a meaning stated in copy).
    float tipBand = smoothstep(0.55, 0.9, t);
    float band = (1.0 - smoothstep(0.35, 0.75, abs(base.y - CHECK_Z))) * uHuman * orderS;
    float humanAcc = band * smoothstep(0.2, 0.6, t);
    float surveyHit = 0.0;
    #ifdef SURVEY_BLADES
      float c = potential(base);
      float lens = 1.0 - smoothstep(2.5, 6.5, dist);
      surveyHit = (1.0 - smoothstep(0.0, 0.12, abs(fract(c + 0.5) - 0.5))) * uSurvey * (0.12 + 0.88 * lens);
    #endif
    float cartAcc = sel * uLots * tipBand * (1.0 - signedOff);
    float tendAcc = moving * uRetainer * uStaticTend * tipBand * (1.0 - le);
    vAccent = max(max(humanAcc, surveyHit), max(cartAcc, tendAcc));

    // Comb front glow, plus the retainer's tending pass (the same comb, repeated).
    vGlow = exp(-abs(front - base.x) * 0.9) * (1.0 - fall);
    float tf = mix(-12.0, 12.0, uTend);
    vGlow += exp(-abs(base.x - tf) * 1.2) * moving * uRetainer * 0.8 * (1.0 - le) * (1.0 - uStaticTend);

    vFocus = mix(1.0, 0.55, uFocus * (1.0 - sel)) * (1.0 + 0.25 * hov);
    vDone = sel * signedOff;
    vSun = 0.5 + 0.5 * dot(normalize(bend + vec2(1e-3)), normalize(vec2(-0.4, -1.0)));
  }
`;

export const bladeFragment = /* glsl */ `
  ${common}
  ${fragCommon}

  uniform float uDim;
  uniform vec3 uHorizon;

  varying float vT;
  varying float vTone;
  varying float vAccent;
  varying float vGlow;
  varying float vFog;
  varying float vSide;
  varying float vWilt;
  varying float vFocus;
  varying float vDone;
  varying float vSun;

  void main() {
    vec3 root = vec3(0.03, 0.038, 0.033);
    vec3 tip = mix(vec3(0.5, 0.52, 0.48), vec3(0.88, 0.89, 0.85), vTone);
    tip = mix(tip, vec3(0.26, 0.27, 0.25), vWilt);
    vec3 col = mix(root, tip, pow(vT, 1.25));
    // Fake cylindrical shading across the blade, and a low sun catching the tips.
    col *= 0.82 + 0.18 * (1.0 - abs(vSide) * 2.0);
    col *= mix(1.0, 0.85 + 0.3 * vSun, step(0.5, vT));
    col = mix(col, SURVEY * (0.3 + 0.8 * vT), clamp(vAccent, 0.0, 1.0));
    col += SURVEY * vGlow * (0.25 + vT) * 1.1;
    col = mix(col, vec3(0.95, 0.95, 0.91) * (0.3 + 0.8 * vT), vDone * 0.6);
    col *= vFocus;
    col *= uDim;
    col *= mix(1.0, 0.32, copyMask());
    // Back-rim: the far edge reads as a silhouette rather than a grey band.
    col += uHorizon * 1.6 * pow(vT, 3.0) * vFog * 0.5;
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
  ${fragCommon}

  uniform float uComb;
  uniform float uSurvey;
  uniform float uLots;
  uniform float uBuild;
  uniform float uFocus;
  uniform float uOwn;
  uniform float uOwnDraw;
  uniform float uWiltGate;
  uniform float uSentFlash;
  uniform float uDim;
  uniform vec2 uPointer;
  uniform vec3 uHorizon;
  uniform float uLotSel[8];
  uniform float uLotFound[8];
  uniform float uLotFlash[8];
  uniform float uLotGrow[8];
  uniform float uLotHover;

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
    float field = step(${f(FIELD.minX)}, p.x) * step(p.x, ${f(FIELD.maxX)})
                * step(${f(FIELD.minZ)}, p.y) * step(p.y, ${f(FIELD.maxZ)});

    vec3 col = vec3(0.036, 0.044, 0.039) + 0.01 * h + 0.012 * (hash12(floor(p * 6.0)) - 0.5);

    // Tilled furrows appear behind the comb front.
    float front = mix(${f(FIELD.minX)} - 4.0, ${f(FIELD.maxX)} + 4.0, uComb) + step(0.999, uComb) * 60.0;
    float tilled = smoothstep(front, front - 2.5, p.x) * field;
    float fr = fract((p.x - ${f(FIELD.minX)}) / ${f(FIELD.rowSpacing)});
    float ridge = 1.0 - smoothstep(0.0, 0.32, abs(fr - 0.5));
    col += vec3(0.035, 0.037, 0.032) * ridge * tilled;
    col -= vec3(0.014) * (1.0 - ridge) * tilled;
    col += SURVEY * exp(-abs(p.x - front) * 2.6) * field * 0.85;

    // Built twice: the seam between the two halves.
    float fwx = max(fwidth(p.x), 1e-4);
    col += vec3(0.25) * (1.0 - smoothstep(0.0, 1.5, abs(p.x - SEAM_X) / fwx)) * uWiltGate * field;

    // Survey: contours bunch around the eight stuck points; strongest inside the cursor lens.
    float lens = 1.0 - smoothstep(2.5, 6.5, length(p - uPointer));
    float contour = aaLine(potential(p), 0.6);
    col = mix(col, SURVEY * 0.8, contour * uSurvey * (0.12 + 0.88 * lens) * field);

    // The eight lots.
    float inSel = 0.0;
    for (int i = 0; i < 8; i++) {
      vec2 mn = uLotC[i] - vec2(LOT_HALF);
      vec2 mx = uLotC[i] + vec2(LOT_HALF);
      float o = rectOutline(p, mn, mx, 1.0);
      float inside = step(mn.x, p.x) * step(p.x, mx.x) * step(mn.y, p.y) * step(p.y, mx.y);
      float sel = uLotSel[i];
      float hov = 1.0 - step(0.5, abs(uLotHover - float(i)));
      float signedOff = step(0.999, uLotGrow[i]) * uBuild * sel;
      // Found during the survey: orange outline that flashes in.
      col = mix(col, SURVEY, o * uLotFound[i] * (0.45 + 0.55 * uLotFlash[i]) * uSurvey);
      // Storefront: unselected lots outlined bone, selected filled and outlined orange.
      float edgeSurvey = max(sel * (1.0 - signedOff), hov * 0.6);
      col = mix(col, BONE * 0.45, o * uLots * (1.0 - edgeSurvey) * 0.3 * (1.0 - signedOff));
      col = mix(col, SURVEY, o * uLots * edgeSurvey * (0.8 + 0.2 * uSentFlash));
      col += SURVEY * inside * sel * uLots * (0.09 + 0.1 * uSentFlash) * (1.0 - signedOff);
      // Signed off: calm, solid bone outline.
      col = mix(col, BONE * 0.8, o * signedOff);
      inSel = max(inSel, inside * sel);
    }
    col *= mix(1.0, 0.55, uFocus * (1.0 - inSel) * field);

    // Your infrastructure: separate ground, outline drawn clockwise as a single line.
    vec2 omn = vec2(${f(OWN_RECT.minX)}, ${f(OWN_RECT.minZ)});
    vec2 omx = vec2(${f(OWN_RECT.maxX)}, ${f(OWN_RECT.maxZ)});
    float W = omx.x - omn.x;
    float D = omx.y - omn.y;
    float P = 2.0 * (W + D);
    float dTop = abs(p.y - omn.y);
    float dRight = abs(p.x - omx.x);
    float dBot = abs(p.y - omx.y);
    float dLeft = abs(p.x - omn.x);
    float m = min(min(dTop, dRight), min(dBot, dLeft));
    float s = (2.0 * W + D + omx.y - p.y) / P;
    if (m == dTop) s = (p.x - omn.x) / P;
    else if (m == dRight) s = (W + p.y - omn.y) / P;
    else if (m == dBot) s = (W + D + omx.x - p.x) / P;
    float own = rectOutline(p, omn, omx, 1.0) * step(s, uOwnDraw);
    float ownIn = step(omn.x, p.x) * step(p.x, omx.x) * step(omn.y, p.y) * step(p.y, omx.y);
    col += vec3(0.75, 0.76, 0.72) * own * uOwn * 0.85;
    col += vec3(0.018) * ownIn * uOwn * step(0.99, uOwnDraw);

    col *= mix(1.0, uDim, 0.6);
    col *= mix(1.0, 0.32, copyMask());
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
    gl_FragColor = vec4(mix(uHorizon, top, k), 1.0);
  }
`;
