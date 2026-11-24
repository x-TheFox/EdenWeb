export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/services/ai-agent-development`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/services/ai-development`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/services/custom-software-development`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/guides/ai-project-planning`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/guides/custom-ai-project-cost`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
