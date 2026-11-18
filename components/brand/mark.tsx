/** Edencorp mark: three furrows receding into the distance, a single stalk rising from the farthest. */
export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 -1 28 25"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <rect x="2" y="19" width="24" height="2.2" rx="0.4" fill="currentColor" />
      <rect x="2" y="13.4" width="17.3" height="2.2" rx="0.4" fill="currentColor" />
      <rect x="2" y="7.8" width="10.6" height="2.2" rx="0.4" fill="currentColor" />
      <path d="M11.2 8.4 C11.4 5.2 12.9 2.6 16.2 0.9" stroke="var(--color-survey)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M12.4 4.6 C10.6 3.2 9.2 3.1 7.9 3.6" stroke="var(--color-survey)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="h-[1.15em] w-auto" />
      <span className="font-display text-[1.08em] font-[620] tracking-[-0.03em] [font-stretch:92%]">Edencorp</span>
    </span>
  );
}
