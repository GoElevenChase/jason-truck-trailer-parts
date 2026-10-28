import type { ReactNode } from "react";
import { siteMetadata } from "@/lib/metadata";
import "./globals.css";
import "./design-one.css";
import "./design-two.css";

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}
