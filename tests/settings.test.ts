import assert from "node:assert/strict";
import { test } from "node:test";
import { createSiteSettings, type PublicSiteEnv } from "../src/lib/site-settings";

const production: PublicSiteEnv = {
  NEXT_PUBLIC_SITE_MODE: "production",
  NEXT_PUBLIC_SELECTED_DESIGN: "design-2",
  NEXT_PUBLIC_SITE_URL: "https://www.elevenchase.com/",
};

test("an unconfigured checkout stays a noindex two-design preview", () => {
  const settings = createSiteSettings({});
  assert.equal(settings.mode, "preview");
  assert.equal(settings.shouldIndex, false);
  assert.equal(settings.siteUrl, "http://localhost:3000");
  assert.equal(settings.selectedDesign, "design-1");
  assert.equal(settings.contactMode, "email");
  assert.equal(settings.contactEndpoint, null);
  assert.deepEqual(settings.publishedRoutes, ["/", "/design-1", "/design-2"]);
});

test("production publishes only the selected homepage and normalizes the canonical origin", () => {
  const settings = createSiteSettings(production);
  assert.equal(settings.isProduction, true);
  assert.equal(settings.shouldIndex, true);
  assert.equal(settings.selectedDesign, "design-2");
  assert.equal(settings.siteUrl, "https://www.elevenchase.com");
  assert.deepEqual(settings.publishedRoutes, ["/"]);
});

test("a real preview hostname never enables search indexing by itself", () => {
  const settings = createSiteSettings({ NEXT_PUBLIC_SITE_URL: "https://preview.elevenchase.com" });
  assert.equal(settings.shouldIndex, false);
  assert.equal(settings.publishedRoutes.length, 3);
});

test("production requires an explicit design and public origin", () => {
  assert.throws(() => createSiteSettings({ NEXT_PUBLIC_SITE_MODE: "production" }), /NEXT_PUBLIC_SELECTED_DESIGN/);
  assert.throws(() => createSiteSettings({ ...production, NEXT_PUBLIC_SITE_URL: "" }), /NEXT_PUBLIC_SITE_URL/);
});

test("misspelled modes and designs cannot silently publish the wrong experience", () => {
  assert.throws(() => createSiteSettings({ NEXT_PUBLIC_SITE_MODE: "prod" }), /SITE_MODE/);
  assert.throws(() => createSiteSettings({ ...production, NEXT_PUBLIC_SELECTED_DESIGN: "design-3" }), /SELECTED_DESIGN/);
  assert.throws(() => createSiteSettings({ NEXT_PUBLIC_CONTACT_MODE: "form" }), /CONTACT_MODE/);
});

test("production rejects insecure, local, placeholder, and path-bearing canonical URLs", () => {
  const invalid = [
    "http://www.elevenchase.com",
    "https://localhost:3000",
    "https://127.0.0.1",
    "https://example.com",
    "https://www.example.org",
    "https://client.test",
    "https://your-domain.com",
    "https://www.elevenchase.com/preview",
    "https://www.elevenchase.com/?preview=1",
    "https://www.elevenchase.com/#home",
    "https://name:password@www.elevenchase.com",
  ];
  for (const url of invalid) {
    assert.throws(() => createSiteSettings({ ...production, NEXT_PUBLIC_SITE_URL: url }), /Site configuration/, url);
  }
});

test("external contact needs an intentional public HTTPS endpoint", () => {
  assert.throws(() => createSiteSettings({ NEXT_PUBLIC_CONTACT_MODE: "external" }), /CONTACT_ENDPOINT/);
  for (const endpoint of ["http://api.elevenchase.com/leads", "https://example.com/leads", "https://api.elevenchase.com/leads#form"]) {
    assert.throws(() => createSiteSettings({ NEXT_PUBLIC_CONTACT_MODE: "external", NEXT_PUBLIC_CONTACT_ENDPOINT: endpoint }), /CONTACT_ENDPOINT/);
  }
  const settings = createSiteSettings({
    NEXT_PUBLIC_CONTACT_MODE: "external",
    NEXT_PUBLIC_CONTACT_ENDPOINT: "https://api.elevenchase.com/leads",
  });
  assert.equal(settings.contactEndpoint, "https://api.elevenchase.com/leads");
});

test("email mode cannot accidentally start using a leftover form endpoint", () => {
  const settings = createSiteSettings({ NEXT_PUBLIC_CONTACT_ENDPOINT: "https://api.elevenchase.com/leads" });
  assert.equal(settings.contactMode, "email");
  assert.equal(settings.contactEndpoint, null);
});
