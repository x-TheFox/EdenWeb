export type QualityTier = "high" | "medium" | "low" | "none";

export interface Quality {
  tier: QualityTier;
  blades: number;
  dpr: [number, number];
}

const TIERS: Record<Exclude<QualityTier, "none">, Quality> = {
  high: { tier: "high", blades: 52000, dpr: [1, 1.5] },
  medium: { tier: "medium", blades: 28000, dpr: [1, 1.25] },
  low: { tier: "low", blades: 14000, dpr: [1, 1] },
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function detectQuality(): Quality {
  if (typeof window === "undefined" || !hasWebGL()) return { tier: "none", blades: 0, dpr: [1, 1] };

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return { tier: "none", blades: 0, dpr: [1, 1] };

  const params = new URLSearchParams(window.location.search);
  const forced = params.get("quality");
  if (forced === "high" || forced === "medium" || forced === "low") return TIERS[forced];

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;

  if (coarse || small) return TIERS.low;
  if (cores <= 4 || memory <= 4) return TIERS.medium;
  return TIERS.high;
}
