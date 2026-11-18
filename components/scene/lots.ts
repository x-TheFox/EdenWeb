/**
 * The eight audited lots. One lot per storefront feature (MF-01..MF-08), same order as the catalogue.
 * Shared by the shaders, the scene runtime, world labels and the cart.
 */
export const LOT_HALF = 2.25;
export const LOT_X = [-8.55, -2.85, 2.85, 8.55] as const;
export const LOT_Z = [-3.3, -9.0] as const;

export const LOTS: [number, number][] = Array.from({ length: 8 }, (_, i) => [LOT_X[i % 4], LOT_Z[Math.floor(i / 4)]]);

/** "Your infrastructure": separate ground east of the field. */
export const OWN_RECT = { minX: 24.0, maxX: 46.4, minZ: -12.05, maxZ: -0.25 } as const;
export const OWN_SLOTS: [number, number][] = Array.from({ length: 8 }, (_, k) => [26.75 + 5.3 * (k % 4), LOT_Z[Math.floor(k / 4)]]);

export function lotIndexAt(x: number, z: number) {
  for (let i = 0; i < 8; i++) {
    const [cx, cz] = LOTS[i];
    if (Math.abs(x - cx) <= LOT_HALF && Math.abs(z - cz) <= LOT_HALF) return i;
  }
  return -1;
}

/** Checkpoint band (human sign-off line) and the wilt seam. */
export const CHECK_Z = 4.0;
export const SEAM_X = 2.0;

/** JS twin of the GLSL terrain() so DOM labels sit on the ground. */
export function terrain(x: number, z: number) {
  return (
    0.55 * Math.sin(x * 0.14 + 1.0) * Math.cos(z * 0.11 - 0.4) +
    0.3 * Math.sin(x * 0.29 - z * 0.21 + 2.0) +
    0.16 * Math.sin(z * 0.47 + x * 0.09)
  );
}
