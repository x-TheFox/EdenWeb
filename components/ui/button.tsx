import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Common = { children: ReactNode; className?: string; icon?: "arrow" | "up" | "none" };

const primary =
  "group relative inline-flex select-none items-center gap-3 whitespace-nowrap rounded-full bg-survey py-2 pl-5 pr-2 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color] duration-300 ease-[var(--ease-out-expo)] hover:bg-survey-soft active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

function Trail({ icon }: { icon: Common["icon"] }) {
  if (icon === "none") return null;
  const I = icon === "up" ? ArrowUpRight : ArrowRight;
  return (
    <span className="grid size-8 place-items-center rounded-full bg-survey-ink/10 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:scale-105">
      <I weight="bold" className="size-3.5" aria-hidden />
    </span>
  );
}

export function PrimaryLink({ href, children, className = "", icon = "arrow", ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`${primary} ${className}`} {...rest}>
      <span>{children}</span>
      <Trail icon={icon} />
    </Link>
  );
}

export function PrimaryAnchor({ children, className = "", icon = "up", ...rest }: Common & ComponentProps<"a">) {
  return (
    <a className={`${primary} ${className}`} {...rest}>
      <span>{children}</span>
      <Trail icon={icon} />
    </a>
  );
}

export function PrimaryButton({ children, className = "", icon = "arrow", ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={`${primary} ${className}`} {...rest}>
      <span>{children}</span>
      <Trail icon={icon} />
    </button>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 py-2 text-[0.95rem] text-bone transition-colors hover:text-white ${className}`}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowRight weight="light" className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
