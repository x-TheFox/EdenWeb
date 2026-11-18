import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFonts } from "./fonts";

loadFonts();

const C = {
  ink: "#0c0f0d",
  ink2: "#131714",
  ink3: "#1b201c",
  line: "#2a302b",
  bone: "#dcddd5",
  dim: "#b9bbb1",
  moss: "#8e968b",
  survey: "#ff5a1f",
  surveyInk: "#1a0a03",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const messages = [
  { at: 40, channel: "Slack", who: "Edencorp", text: "Quote desk agent: staging build is live. Test it in your portal any time." },
  { at: 110, channel: "WhatsApp", who: "Edencorp", text: "Carrier onboarding pipeline: all 14 document checks passing on last week's carriers." },
  { at: 180, channel: "Email", who: "You", text: "Can quote replies cc the account owner? Otherwise looks right." },
  { at: 235, channel: "Discord", who: "Edencorp", text: "Revision round 1 of 3 logged. The change ships to staging tomorrow." },
  { at: 295, channel: "Slack", who: "Edencorp", text: "Shipment status agent is ready for your sign-off." },
];

const features = [
  { name: "Inbound quote desk agent", id: "MF-01", from: 0.55, to: 0.86, status: ["In build", "Ready to test", "Revision 1 of 3"], flips: [60, 250] },
  { name: "Carrier onboarding pipeline", id: "MF-02", from: 0.3, to: 0.72, status: ["In build", "Testing"], flips: [130] },
  { name: "Shipment status agent", id: "MF-03", from: 0.78, to: 1, status: ["Testing", "Awaiting sign-off"], flips: [310] },
];

export const BuildUpdates = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // Fade the whole board out and back so the loop is seamless.
  const loopFade = interpolate(frame, [0, 14, durationInFrames - 24, durationInFrames - 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: "Geist, sans-serif", color: C.bone }}>
      <AbsoluteFill style={{ opacity: loopFade, padding: 44, display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 28 }}>
        {/* Portal */}
        <div style={{ background: C.ink2, border: `1px solid ${C.line}`, borderRadius: 10, padding: 32, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "GeistMono", fontSize: 14, color: C.moss, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Client portal
            </span>
            <span style={{ fontFamily: "GeistMono", fontSize: 14, color: C.moss }}>Marlowe Freight Co.</span>
          </div>
          <div style={{ fontFamily: "Bricolage", fontWeight: 560, fontStretch: "90%", fontSize: 40, letterSpacing: "-0.03em", marginTop: 22, lineHeight: 1 }}>
            Your build, live.
          </div>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 26 }}>
            {features.map((f) => {
              const p = interpolate(frame, [20, durationInFrames - 60], [f.from, f.to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
              const idx = f.flips.filter((t) => frame >= t).length;
              const lastFlip = f.flips[idx - 1] ?? -100;
              const pop = spring({ frame: frame - lastFlip, fps, config: { damping: 18, stiffness: 160 } });
              const status = f.status[idx];
              const hot = status.startsWith("Ready") || status.startsWith("Awaiting") || status.startsWith("Revision");
              return (
                <div key={f.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <div style={{ fontSize: 21 }}>{f.name}</div>
                      <div style={{ fontFamily: "GeistMono", fontSize: 13, color: C.moss, marginTop: 6, letterSpacing: "0.08em" }}>{f.id}</div>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        padding: "6px 12px",
                        borderRadius: 999,
                        border: `1px solid ${hot ? C.survey : C.line}`,
                        color: hot ? C.survey : C.dim,
                        transform: `scale(${0.92 + 0.08 * pop})`,
                        opacity: 0.4 + 0.6 * pop,
                      }}
                    >
                      {status}
                    </span>
                  </div>
                  <div style={{ marginTop: 14, height: 2, background: C.line, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, width: `${p * 100}%`, background: C.bone }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.line}`, paddingTop: 18, fontSize: 15, color: C.dim }}>
            <span>Revision rounds remaining</span>
            <span style={{ fontFamily: "GeistMono", color: C.bone }}>{frame >= 235 ? "2 of 3" : "3 of 3"}</span>
          </div>
        </div>

        {/* Channel */}
        <div style={{ background: C.ink2, border: `1px solid ${C.line}`, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "22px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 17 }}>Updates</span>
            <span style={{ fontFamily: "GeistMono", fontSize: 13, color: C.moss, letterSpacing: "0.08em", textTransform: "uppercase" }}>Where you already talk</span>
          </div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14, flex: 1 }}>
            {messages.map((m) => {
              const s = spring({ frame: frame - m.at, fps, config: { damping: 20, stiffness: 140 } });
              if (frame < m.at) return null;
              const mine = m.who === "You";
              return (
                <div
                  key={m.at}
                  style={{
                    alignSelf: mine ? "flex-end" : "flex-start",
                    maxWidth: "88%",
                    background: mine ? C.ink3 : C.ink,
                    border: `1px solid ${C.line}`,
                    borderRadius: 8,
                    padding: "12px 14px",
                    opacity: s,
                    transform: `translateY(${(1 - s) * 18}px)`,
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: mine ? C.dim : C.survey }}>{m.who}</span>
                    <span style={{ fontFamily: "GeistMono", fontSize: 11, color: C.moss, letterSpacing: "0.08em", textTransform: "uppercase" }}>via {m.channel}</span>
                  </div>
                  <div style={{ fontSize: 16, lineHeight: 1.4, color: C.bone }}>{m.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
