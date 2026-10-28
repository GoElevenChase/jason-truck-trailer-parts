import type { MetadataRoute } from "next";
import { siteSettings } from "@/lib/site-settings";

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return siteSettings.shouldIndex
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteSettings.siteUrl}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
