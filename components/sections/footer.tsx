import Link from "next/link";
import { Wordmark } from "@/components/brand/mark";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="shell flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <Wordmark className="text-[1.3rem] text-bone" />
          <p className="mt-4 max-w-[22rem] text-[0.95rem] text-bone-dim">Bespoke AI and software engineering.</p>
        </div>
        <div className="flex flex-col gap-3 text-[0.95rem] md:items-end">
          <a href={`mailto:${site.email}`} className="text-bone transition-colors hover:text-survey">
            {site.email}
          </a>
          <div className="flex gap-6 text-moss">
            <Link href="/privacy" className="transition-colors hover:text-bone">Privacy</Link>
            <span>&copy; {new Date().getFullYear()} Edencorp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
