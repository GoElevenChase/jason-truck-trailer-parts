import assert from "node:assert/strict";
import test from "node:test";
import { buildEmailDraft, isAcceptedResponse, validateInquiry, type Inquiry } from "../src/lib/contact";

const valid: Inquiry = { name: "Avery", email: "avery@example.org", service: "Website & SEO", message: "I would like to discuss a new website.", website: "" };
test("inquiry validation rejects missing information and honeypot input", () => {
  assert.equal(validateInquiry(valid), null);
  assert.ok(validateInquiry({ ...valid, email: "invalid" }));
  assert.ok(validateInquiry({ ...valid, name: "" }));
  assert.ok(validateInquiry({ ...valid, message: "short" }));
  assert.ok(validateInquiry({ ...valid, website: "bot" }));
  assert.ok(validateInquiry({ ...valid, message: "a".repeat(4001) }));
});
test("email draft safely encodes message characters without inventing delivery", () => {
  const draft = buildEmailDraft("sales@elevenchase.com", { ...valid, message: "Hello & welcome? Here is #our project." });
  const url = new URL(draft);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "sales@elevenchase.com");
  assert.equal(url.searchParams.get("subject"), "Project inquiry: Website & SEO");
  assert.match(url.searchParams.get("body")!, /Hello & welcome\? Here is #our project\./);
  assert.throws(() => buildEmailDraft("sales@elevenchase.com", { ...valid, email: "bad" }));
});
test("only an explicit affirmative endpoint response counts as accepted", () => {
  assert.equal(isAcceptedResponse({ ok: true }), true);
  for (const value of [null, "ok", {}, { success: true }, { ok: false }, { ok: "true" }, { ok: 1 }]) assert.equal(isAcceptedResponse(value), false);
});
