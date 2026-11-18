const lines = ["Built for your ground.", "Nobody else's."];

/** Line-mask reveal done in CSS so it runs before hydration. */
export function HeroTitle() {
  return (
    <h1 id="hero-title" className="display max-w-[16ch] text-[clamp(2.9rem,7.4vw,6.6rem)] text-bone">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.06em]">
          <span
            className={`hero-line block ${i === 1 ? "text-bone-dim" : ""}`}
            style={{ animationDelay: `${180 + i * 130}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
