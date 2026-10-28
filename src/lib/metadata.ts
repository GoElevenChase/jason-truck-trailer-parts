import type { Metadata } from "next";
import { siteContent } from "@/content/site";
import { siteSettings } from "@/lib/site-settings";

export interface PageMetadataOptions {
  readonly title?: string;
  readonly description?: string;
  readonly path?: string;
}

/** Metadata and crawl visibility use the same configuration as the routes. */
export function buildMetadata(options: PageMetadataOptions = {}): Metadata {
  const path = options.path ?? "/";
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Page metadata requires a local absolute path.");
  }
  const title = options.title
    ? `${options.title} | ${siteContent.business.name}`
    : `${siteContent.business.name} | ${siteContent.business.tagline}`;
  const description = options.description ?? siteContent.business.description;
  const url = new URL(path, siteSettings.siteUrl);

  return {
    metadataBase: new URL(siteSettings.siteUrl),
    title,
    description,
    applicationName: siteContent.business.name,
    ...(siteSettings.shouldIndex ? { alternates: { canonical: url.href } } : {}),
    robots: {
      index: siteSettings.shouldIndex,
      follow: siteSettings.shouldIndex,
      googleBot: {
        index: siteSettings.shouldIndex,
        follow: siteSettings.shouldIndex,
        "max-image-preview": siteSettings.shouldIndex ? "large" : "none",
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteContent.business.name,
      title,
      description,
      url: url.href,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: siteContent.business.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/og-image.png", alt: siteContent.business.name }],
    },
  };
}

export const siteMetadata = buildMetadata();
