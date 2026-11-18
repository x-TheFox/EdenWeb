import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { Footer } from "@/components/sections/footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Edencorp handles information submitted through edencorp.org.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell pb-28 pt-36">
        <h1 className="display text-[clamp(2.6rem,6vw,4.8rem)] text-bone">Privacy</h1>
        <div className="mt-12 grid max-w-[44rem] gap-10 text-bone-dim [&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:tracking-[-0.02em] [&_h2]:text-bone">
          <section>
            <h2>What we collect</h2>
            <p className="mt-3">
              When you fill in the fit check, we receive what you type: your name, work email, company, role, company
              size, what you want to build, the bottleneck behind it, a budget range and a timeline. We do not use
              analytics cookies or advertising trackers on this site.
            </p>
          </section>
          <section>
            <h2>How we use it</h2>
            <p className="mt-3">
              Only to judge fit, prepare for a call and reply to you. Submissions go to Edencorp&rsquo;s internal
              channel and to nobody else. We never sell or share them.
            </p>
          </section>
          <section>
            <h2>Booking</h2>
            <p className="mt-3">
              Fit calls are scheduled through Cal.com. Their handling of the details you enter there is covered by
              Cal.com&rsquo;s own privacy policy.
            </p>
          </section>
          <section>
            <h2>Engagement data</h2>
            <p className="mt-3">
              Client engagements run under NDA, with zero data retention, an isolated environment per client and the
              option to deploy inside your own infrastructure. The specifics are set out in each engagement&rsquo;s
              agreement.
            </p>
          </section>
          <section>
            <h2>Your choices</h2>
            <p className="mt-3">
              Ask us to see, correct or delete anything you sent at{" "}
              <a className="text-bone underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
          </section>
          <p>
            <Link href="/" className="text-bone underline underline-offset-4">
              Back to edencorp.org
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
