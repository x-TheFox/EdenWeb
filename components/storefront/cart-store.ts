"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_CART } from "@/lib/build-plan";
import { notify, sceneStore } from "@/components/scene/scene-store";
import { catalog } from "./catalog";

/**
 * One cart shared by the storefront, the build portal, the ownership beat and the scene.
 */
export type CartStage = "browse" | "sending" | "sent";
type CartState = { ids: string[]; stage: CartStage };

let state: CartState = { ids: [...DEFAULT_CART], stage: "browse" };
const subs = new Set<() => void>();

function mirror() {
  // Slots are packed in catalogue order so the transplant fills "Your infrastructure" left to right.
  let slot = 0;
  catalog.forEach((f, i) => {
    const on = state.ids.includes(f.id);
    sceneStore.lotSel[i] = on ? 1 : 0;
    sceneStore.lotSlot[i] = on ? slot++ : 0;
  });
  notify();
}
mirror();

function set(next: Partial<CartState>) {
  state = { ...state, ...next };
  mirror();
  subs.forEach((fn) => fn());
}

export const cart = {
  get: () => state,
  subscribe(fn: () => void) {
    subs.add(fn);
    return () => subs.delete(fn);
  },
  toggle(id: string) {
    if (state.stage !== "browse") return;
    const on = state.ids.includes(id);
    if (!on) {
      const i = catalog.findIndex((f) => f.id === id);
      if (i >= 0) sceneStore.lotPulseAt[i] = performance.now();
    }
    set({ ids: on ? state.ids.filter((x) => x !== id) : [...state.ids, id] });
  },
  setStage(stage: CartStage) {
    if (stage === "sent") sceneStore.sentAt = performance.now();
    set({ stage });
  },
  reset() {
    set({ ids: [...DEFAULT_CART], stage: "browse" });
  },
};

const server: CartState = { ids: [...DEFAULT_CART], stage: "browse" };

export function useCart() {
  return useSyncExternalStore(cart.subscribe, cart.get, () => server);
}

export function hoverLot(id: string | null) {
  sceneStore.lotHover = id ? catalog.findIndex((f) => f.id === id) : -1;
  notify();
}
