export type SiteMode = "preview" | "production";
export type DesignId = "design-1" | "design-2";
export type ContactMode = "email" | "external";

export interface PublicSiteEnv {
  readonly NEXT_PUBLIC_SITE_MODE?: string;
  readonly NEXT_PUBLIC_SELECTED_DESIGN?: string;
  readonly NEXT_PUBLIC_SITE_URL?: string;
  readonly NEXT_PUBLIC_CONTACT_MODE?: string;
  readonly NEXT_PUBLIC_CONTACT_ENDPOINT?: string;
}

export interface SiteSettings {
  readonly mode: SiteMode;
  readonly selectedDesign: DesignId;
  /** Canonical origin without a trailing slash, path, query, or fragment. */
  readonly siteUrl: string;
  readonly isProduction: boolean;
  readonly shouldIndex: boolean;
  readonly contactMode: ContactMode;
  /** An intentionally public browser-facing endpoint, never a credential. */
  readonly contactEndpoint: string | null;
  readonly publishedRoutes: readonly string[];
}

const DESIGNS = new Set<string>(["design-1", "design-2"]);
const MODES = new Set<string>(["preview", "production"]);
const CONTACT_MODES = new Set<string>(["email", "external"]);
const PLACEHOLDER_HOST = /(?:^|\.)(?:example\.(?:com|org|net)|localhost|local|test|invalid)$/i;
const PLACEHOLDER_VALUE = /(?:^|[._-])(?:todo|replace[_-]?me|change[_-]?me|your[_-]?(?:site|domain|company))(?:[._-]|$)/i;

function value(input: string | undefined): string {
  return input?.trim() ?? "";
}

function fail(message: string): never {
  throw new Error(`Site configuration: ${message}`);
}

function parseHttpUrl(raw: string, label: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return fail(`${label} must be an absolute URL.`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return fail(`${label} must use HTTP or HTTPS.`);
  }
  if (url.username || url.password) {
    return fail(`${label} must not contain credentials.`);
  }
  return url;
}

export function isPublicHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return (
    host.includes(".") &&
    !PLACEHOLDER_HOST.test(host) &&
    !PLACEHOLDER_VALUE.test(host) &&
    !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host) &&
    !host.includes(":") &&
    !host.endsWith(".internal") &&
    !host.endsWith(".lan")
  );
}

/**
 * A pure, shared source of truth for routes, metadata, UI, and build checks.
 * Preview is the safe default. Production must be deliberately configured.
 */
export function createSiteSettings(env: PublicSiteEnv): SiteSettings {
  const modeValue = value(env.NEXT_PUBLIC_SITE_MODE) || "preview";
  if (!MODES.has(modeValue)) {
    return fail("NEXT_PUBLIC_SITE_MODE must be preview or production.");
  }
  const mode = modeValue as SiteMode;
  const isProduction = mode === "production";

  const requestedDesign = value(env.NEXT_PUBLIC_SELECTED_DESIGN);
  if (isProduction && !requestedDesign) {
    return fail("Set NEXT_PUBLIC_SELECTED_DESIGN to design-1 or design-2 before production.");
  }
  const designValue = requestedDesign || "design-1";
  if (!DESIGNS.has(designValue)) {
    return fail("NEXT_PUBLIC_SELECTED_DESIGN must be design-1 or design-2.");
  }

  const requestedOrigin = value(env.NEXT_PUBLIC_SITE_URL);
  if (isProduction && !requestedOrigin) {
    return fail("Set NEXT_PUBLIC_SITE_URL to your public HTTPS origin before production.");
  }
  const origin = parseHttpUrl(requestedOrigin || "http://localhost:3000", "NEXT_PUBLIC_SITE_URL");
  if (origin.pathname !== "/" || origin.search || origin.hash) {
    return fail("NEXT_PUBLIC_SITE_URL must be an origin only, without a path, query, or fragment.");
  }
  if (isProduction && (origin.protocol !== "https:" || !isPublicHostname(origin.hostname))) {
    return fail("Production NEXT_PUBLIC_SITE_URL must use HTTPS and a real public domain, not localhost, an IP address, or a placeholder.");
  }

  const contactValue = value(env.NEXT_PUBLIC_CONTACT_MODE) || "email";
  if (!CONTACT_MODES.has(contactValue)) {
    return fail("NEXT_PUBLIC_CONTACT_MODE must be email or external.");
  }
  const contactMode = contactValue as ContactMode;
  const requestedEndpoint = value(env.NEXT_PUBLIC_CONTACT_ENDPOINT);
  let contactEndpoint: string | null = null;
  if (contactMode === "external") {
    if (!requestedEndpoint) {
      return fail("External contact mode requires NEXT_PUBLIC_CONTACT_ENDPOINT.");
    }
    const endpoint = parseHttpUrl(requestedEndpoint, "NEXT_PUBLIC_CONTACT_ENDPOINT");
    if (endpoint.protocol !== "https:" || !isPublicHostname(endpoint.hostname)) {
      return fail("NEXT_PUBLIC_CONTACT_ENDPOINT must use HTTPS and a real public domain.");
    }
    if (endpoint.hash) {
      return fail("NEXT_PUBLIC_CONTACT_ENDPOINT must not contain a URL fragment.");
    }
    contactEndpoint = endpoint.href;
  }

  return Object.freeze({
    mode,
    selectedDesign: designValue as DesignId,
    siteUrl: origin.origin,
    isProduction,
    shouldIndex: isProduction,
    contactMode,
    contactEndpoint,
    publishedRoutes: Object.freeze(isProduction ? ["/"] : ["/", "/design-1", "/design-2"]),
  });
}

// Each reference must remain explicit: Next.js replaces public env variables
// at build time, including when this module is used by a client component.
export const siteSettings = createSiteSettings({
  NEXT_PUBLIC_SITE_MODE: process.env.NEXT_PUBLIC_SITE_MODE,
  NEXT_PUBLIC_SELECTED_DESIGN: process.env.NEXT_PUBLIC_SELECTED_DESIGN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_CONTACT_MODE: process.env.NEXT_PUBLIC_CONTACT_MODE,
  NEXT_PUBLIC_CONTACT_ENDPOINT: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT,
});
