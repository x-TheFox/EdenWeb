import posthog from "posthog-js";

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  posthog.init("phc_CbGQK3TZ2ux3zJQdbsVMiedurF5XWLmiAVvDnjHMSH5Q", {
    api_host: "https://us.i.posthog.com",
    persistence: "memory",
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_exceptions: false,
    disable_session_recording: true,
    person_profiles: "never",
  });
  initialized = true;
  posthog.capture("$pageview", { route: window.location.pathname });
}

export function captureFunnelEvent(event: string, properties?: Record<string, string>) {
  if (!initialized) return;
  posthog.capture(event, properties);
}
