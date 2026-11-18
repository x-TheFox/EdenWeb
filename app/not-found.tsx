import { SiteNav } from "@/components/nav/site-nav";
import { PrimaryLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell flex min-h-[100dvh] flex-col justify-center py-32">
        <p className="annot text-survey">404</p>
        <h1 className="display mt-5 max-w-[14ch] text-[clamp(2.6rem,6vw,5rem)] text-bone">Nothing planted here.</h1>
        <p className="lede mt-6 max-w-[30rem]">The page you were looking for doesn&rsquo;t exist, or it moved.</p>
        <div className="mt-10">
          <PrimaryLink href="/">Back to the field</PrimaryLink>
        </div>
      </main>
    </>
  );
}
