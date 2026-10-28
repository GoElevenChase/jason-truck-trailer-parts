import type { MetadataRoute } from "next";
import { siteSettings } from "@/lib/site-settings";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return siteSettings.shouldIndex ? [{ url: `${siteSettings.siteUrl}/`, changeFrequency: "monthly", priority: 1 }] : [];
}
