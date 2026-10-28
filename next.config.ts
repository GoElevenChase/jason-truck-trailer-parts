import type { NextConfig } from "next";
import { siteSettings } from "./src/lib/site-settings";

const config: NextConfig = {
  output: "export",
  // App Router resolves page.<extension> exactly. Review routes use
  // page.preview.tsx, so production never registers or exports those pages.
  // Their source stays in place when switching modes; no file mutation is
  // needed and normal page.tsx routes keep their usual behavior.
  pageExtensions: siteSettings.isProduction
    ? ["tsx", "ts", "jsx", "js"]
    : ["preview.tsx", "tsx", "ts", "jsx", "js"],
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default config;
