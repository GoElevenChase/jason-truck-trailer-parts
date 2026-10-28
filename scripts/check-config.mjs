import nextEnv from "@next/env";
import { siteContent } from "../src/content/site.ts";

// Match Next's .env loading before importing the eagerly resolved settings.
nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV === "development");
let settingsModule;
try {
  settingsModule = await import("../src/lib/site-settings.ts");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Unable to read the site configuration.");
  process.exit(1);
}
const { siteSettings, isPublicHostname } = settingsModule;

const failures = [];
const placeholder = /\b(?:TODO(?:_[A-Z0-9]+)?|FIXME|REPLACE_ME|CHANGE_ME|your company name|your-domain\.[a-z]+)\b|(?:https?:\/\/)?(?:www\.)?example\.(?:com|org|net)\b/i;

function checkContent(value, path = "siteContent") {
  if (typeof value === "string") {
    if (!value.trim()) failures.push(`${path} must not be empty.`);
    if (placeholder.test(value)) failures.push(`${path} contains unfinished placeholder content.`);
  } else if (Array.isArray(value)) {
    if (value.length === 0) failures.push(`${path} must not be empty.`);
    value.forEach((item, index) => checkContent(item, `${path}[${index}]`));
  } else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) checkContent(entry, `${path}.${key}`);
  }
}

if (siteSettings.isProduction) {
  checkContent(siteContent);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteContent.business.email)) {
    failures.push("siteContent.business.email must be a valid public contact email.");
  }
  if (/(?:^|@|\.)example\.(?:com|org|net)$/i.test(siteContent.business.email)) {
    failures.push("Replace the example contact email before production.");
  }
  let businessUrl;
  try { businessUrl = new URL(siteContent.business.url); } catch { /* Report below. */ }
  if (!businessUrl || businessUrl.protocol !== "https:" || !isPublicHostname(businessUrl.hostname) || businessUrl.username || businessUrl.password) {
    failures.push("siteContent.business.url must be a public HTTPS business URL without credentials.");
  }
}

if (failures.length) {
  console.error(`Configuration check failed:\n${failures.map((message) => `- ${message}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Configuration valid: ${siteSettings.mode}; ${siteSettings.selectedDesign}; ` +
    `${siteSettings.publishedRoutes.length} published route${siteSettings.publishedRoutes.length === 1 ? "" : "s"}; ` +
    `indexing ${siteSettings.shouldIndex ? "enabled" : "disabled"}; ${siteSettings.contactMode} contact.`,
  );
  if (!siteSettings.isProduction) {
    console.log("Preview builds are intentionally noindex. Choose a design and set the public site origin before a production build.");
  }
}
