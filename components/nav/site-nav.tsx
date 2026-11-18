"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/mark";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#storefront", label: "Storefront" },
  { href: "/#security", label: "Security" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteNav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setSolid((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)] ${
          solid || open ? "border-b border-line/70 bg-ink/80 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-6">
          <Link href="/" className="relative z-10 text-bone" aria-label="Edencorp home" onClick={() => setOpen(false)}>
            <Wordmark className="text-[1.05rem]" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-[0.9rem] text-bone-dim transition-colors duration-300 hover:text-bone"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/#fit"
              className="hidden rounded-full bg-survey px-4 py-2 text-[0.9rem] font-medium text-survey-ink transition-[transform,background-color] duration-300 ease-[var(--ease-out-expo)] hover:bg-survey-soft active:scale-[0.97] sm:inline-flex"
            >
              Check fit
            </Link>
            <button
              type="button"
              className="relative z-10 grid size-10 place-items-center rounded-full border border-line text-bone lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 h-px w-4 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    open ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-4 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    open ? "top-1.5 -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 top-16 z-40 bg-ink/97 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="shell flex flex-col gap-1 pt-8">
              {[...links, { href: "/#fit", label: "Check fit" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 font-display text-[2.4rem] leading-none tracking-[-0.03em] [font-stretch:88%] ${
                      l.href === "/#fit" ? "text-survey" : "text-bone"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
