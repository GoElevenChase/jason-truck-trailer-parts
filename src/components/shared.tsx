"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { siteContent } from "@/content/site";
import { siteSettings } from "@/lib/site-settings";
import { buildEmailDraft, isAcceptedResponse, validateInquiry, type Inquiry } from "@/lib/contact";

const { business } = siteContent;

export function Arrow({ className = "" }: { className?: string }) {
  return <svg className={`arrow-icon ${className}`} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" /></svg>;
}

/** The JASON wordmark. Heavy Duty uses the amber descriptor; Open Road adds the arrow mark. */
export function Logo({ variant, inverse = false }: { variant: "heavy" | "open"; inverse?: boolean }) {
  return <span className={`logo logo-${variant} ${inverse ? "logo-inverse" : ""}`}>
    <span className="logo-word">{business.shortName.toUpperCase()}{variant === "open" && <svg className="logo-arrow" viewBox="0 0 30 12" aria-hidden="true"><path d="M0 6h26m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>}</span>
    <span className="logo-descriptor">{business.descriptor.toUpperCase()}</span>
  </span>;
}

export interface NavLink { readonly label: string; readonly href: string }

/** Header navigation with a keyboard-accessible mobile panel. */
export function HeaderNav({ links, cta, children }: { links: readonly NavLink[]; cta: NavLink; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return <header className="site-header">
    <a className="brand-link" href="#top" aria-label={`${business.name} home`}>{children}</a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(item => <a key={item.label} href={item.href}>{item.label}</a>)}</nav>
    <a className="header-cta" href={cta.href}>{cta.label} <Arrow /></a>
    <button ref={trigger} type="button" className="mobile-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}><span className={`burger ${open ? "is-open" : ""}`} aria-hidden="true"><i /><i /><i /></span></button>
    {open && <div id="mobile-navigation" ref={panel} className="mobile-navigation"><nav aria-label="Mobile navigation">{links.map(item => <a key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}<Arrow /></a>)}<a href={cta.href} onClick={() => setOpen(false)}>{cta.label}<Arrow /></a></nav></div>}
  </header>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    // Content starts visible in the HTML. Only animate elements below the first fold.
    if (node.getBoundingClientRect().top < window.innerHeight) return;
    node.dataset.reveal = "waiting";
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { node.dataset.reveal = "visible"; observer.disconnect(); }
    }, { threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={el} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

export function FaqList({ faqs = siteContent.faqs }: { faqs?: SiteFaqs }) {
  return <div className="faq-list">{faqs.map((faq, index) => <details key={faq.question}><summary><span className="faq-number">0{index + 1}</span><span className="faq-question">{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>;
}
type SiteFaqs = readonly { readonly question: string; readonly answer: string }[];

/**
 * The inquiry form for both designs. The third field differs by design: Heavy
 * Duty asks for a part/reference number, Open Road asks for a phone number.
 */
export function InquiryForm({ extraField, submitLabel }: { extraField: "reference" | "phone"; submitLabel: string }) {
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<"idle" | "working" | "draft" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const emailMode = siteSettings.contactMode === "email";
  // An unhydrated form must not fall back to a native GET with inquiry text
  // in the URL.
  useEffect(() => { setHydrated(true); }, []);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated || status === "working") return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const extra = String(values.get("extra") || "").trim();
    const body = String(values.get("message") || "");
    const inquiry: Inquiry = {
      name: String(values.get("name") || ""),
      email: String(values.get("email") || ""),
      service: "Parts inquiry",
      message: extra ? `${extraField === "reference" ? "Part or reference number" : "Phone number"}: ${extra}\n\n${body}` : body,
      website: String(values.get("website") || ""),
    };
    const error = validateInquiry({ ...inquiry, message: body });
    if (error) { setStatus("error"); setMessage(error); return; }
    if (emailMode) {
      if (!business.email) {
        setStatus("error"); setMessage("Our contact details are still being added, so this inquiry can’t be sent yet. Please check back soon.");
        return;
      }
      window.location.href = buildEmailDraft(business.email, inquiry);
      setStatus("draft"); setMessage("Your email draft is ready. Send it from your email app to complete your inquiry.");
      return;
    }
    setStatus("working"); setMessage("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(siteSettings.contactEndpoint!, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...inquiry, [extraField]: extra, formId: "parts-inquiry", submissionId: crypto.randomUUID() }), signal: controller.signal, credentials: "omit" });
      const result: unknown = await response.json();
      if (!response.ok || !isAcceptedResponse(result)) throw new Error("The server did not confirm your inquiry.");
      setStatus("success"); setMessage("Your inquiry was received. We’ll get back to you with the information you need."); form.reset();
    } catch {
      setStatus("error"); setMessage("We couldn’t confirm delivery. Please try again. Your message is still here.");
    } finally { window.clearTimeout(timeout); }
  }
  const req = extraField === "phone" ? " *" : "";
  return <form className="inquiry-form" onSubmit={onSubmit} aria-label="Parts inquiry">
    <div className="form-row">
      <label><span className="sr-label">Full name</span><input name="name" autoComplete="name" placeholder={`Full name${req}`} required minLength={2} maxLength={120} /></label>
      <label><span className="sr-label">Email address</span><input name="email" type="email" autoComplete="email" placeholder={`Email address${req}`} required maxLength={254} /></label>
    </div>
    {extraField === "reference"
      ? <label><span className="sr-label">Part or reference number</span><input name="extra" placeholder="Part or reference number" maxLength={120} /></label>
      : <label><span className="sr-label">Phone number</span><input name="extra" type="tel" autoComplete="tel" placeholder="Phone number *" required maxLength={40} /></label>}
    <label><span className="sr-label">Message</span><textarea name="message" rows={4} minLength={10} maxLength={4000} placeholder={extraField === "phone" ? "Your message *" : "Message"} required /></label>
    <div className="honey-field" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button type="submit" className="form-submit" disabled={!hydrated || status === "working"}>{status === "working" ? "Sending…" : emailMode ? "Open email draft" : submitLabel}<Arrow /></button>
    {emailMode && <p className="form-helper">Opens your email app with your message. Nothing is sent until you press Send there.</p>}
    <p className={`form-status status-${status}`} role="status" aria-live="polite">{message}</p>
  </form>;
}

/** Contact detail line: shows real details when supplied, otherwise an honest pending note. */
export function ContactDetails() {
  if (!business.email && !business.phone) return <span>Contact details <br />to be added</span>;
  return <span>{business.phone && <a href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}>{business.phone}</a>}{business.phone && business.email && <br />}{business.email && <a href={`mailto:${business.email}`}>{business.email}</a>}</span>;
}

export function MailIcon() {
  return <svg className="mail-icon" width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true"><rect x="1" y="1" width="26" height="20" stroke="currentColor" strokeWidth="1.6" /><path d="m1.5 1.5 12.5 10 12.5-10" stroke="currentColor" strokeWidth="1.6" /></svg>;
}

export function DesignSwitcher({ active }: { active: "design-1" | "design-2" }) {
  if (siteSettings.isProduction) return null;
  return <nav className="design-switcher" aria-label="Design review navigation"><Link className="switcher-back" href="/" aria-label="Back to both designs"><span aria-hidden="true">⊞</span><span>All designs</span></Link><span className="switcher-divider" /><Link href="/design-1/" aria-current={active === "design-1" ? "page" : undefined}>A <span>Heavy Duty</span></Link><Link href="/design-2/" aria-current={active === "design-2" ? "page" : undefined}>B <span>Open Road</span></Link></nav>;
}

type RevealRule = { selector: string; fx: "up" | "wipe" };
type ParallaxRule = { selector: string; amp: number };

// Per-design scroll motion. Targets are selectors inside each design's root so
// the markup stays free of animation wrappers.
const MOTION: Record<"design-1" | "design-2", { root: string; reveal: RevealRule[]; parallax: ParallaxRule[] }> = {
  "design-1": {
    root: ".design-one",
    reveal: [
      { selector: ".ha-feature-media", fx: "wipe" },
      { selector: ".ha-runaround-media", fx: "wipe" },
      { selector: ".ha-lines li", fx: "up" },
      { selector: ".ha-faq-intro", fx: "up" },
      { selector: ".ha-faq details", fx: "up" },
      { selector: ".ha-contact-copy", fx: "up" },
      { selector: ".ha-contact .inquiry-form", fx: "up" },
      { selector: ".ha-contact-details", fx: "up" },
      { selector: ".ha-footer", fx: "up" },
    ],
    parallax: [
      { selector: ".ha-hero-img", amp: 70 },
      { selector: ".ha-feature-media img", amp: 28 },
      { selector: ".ha-runaround-media img", amp: 28 },
    ],
  },
  "design-2": {
    root: ".design-two",
    reveal: [
      { selector: ".ob-browse-head", fx: "up" },
      { selector: ".ob-cat", fx: "up" },
      { selector: ".ob-feature-media", fx: "wipe" },
      { selector: ".ob-featured-media", fx: "wipe" },
      { selector: ".ob-highlight", fx: "up" },
      { selector: ".ob-faq > div", fx: "up" },
      { selector: ".ob-faq details", fx: "up" },
      { selector: ".ob-contact-copy", fx: "up" },
      { selector: ".ob-contact .inquiry-form", fx: "up" },
      { selector: ".ob-contact-media", fx: "wipe" },
      { selector: ".ob-footer", fx: "up" },
    ],
    parallax: [
      { selector: ".ob-hero-media img", amp: 60 },
      { selector: ".ob-feature-media img", amp: 28 },
      { selector: ".ob-featured-media img", amp: 28 },
      { selector: ".ob-philosophy > img", amp: 40 },
    ],
  },
};

/**
 * Scroll motion for a design: a progress bar, staggered reveals, photo wipes and
 * gentle parallax. Content is visible in the HTML; only elements below the first
 * fold are hidden after hydration, and nothing runs with reduced motion.
 */
export function MotionLayer({ design }: { design: "design-1" | "design-2" }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const config = MOTION[design];
    const root = document.querySelector<HTMLElement>(config.root);
    if (!root || !("IntersectionObserver" in window)) return;

    // A fully clipped element never reports as intersecting, so photo wipes are
    // watched through their parent section and revealed together.
    const watched = new Map<Element, HTMLElement[]>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const node of watched.get(entry.target) ?? []) node.dataset.reveal = "visible";
        watched.delete(entry.target);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    const siblingCount = new Map<Element, number>();
    for (const { selector, fx } of config.reveal) {
      root.querySelectorAll<HTMLElement>(selector).forEach(node => {
        const parent = node.parentElement;
        const index = parent ? siblingCount.get(parent) ?? 0 : 0;
        if (parent) siblingCount.set(parent, index + 1);
        const box = node.getBoundingClientRect();
        if (box.top < window.innerHeight) return; // already on screen at load
        node.dataset.fx = fx;
        if (fx === "wipe") node.dataset.dir = box.left + box.width / 2 < window.innerWidth / 2 ? "l" : "r";
        node.style.setProperty("--fx-delay", `${Math.min(index, 5) * 90}ms`);
        node.dataset.reveal = "waiting";
        const watch = fx === "wipe" && parent ? parent : node;
        watched.set(watch, [...(watched.get(watch) ?? []), node]);
        observer.observe(watch);
      });
    }

    const layers = config.parallax.flatMap(({ selector, amp }) =>
      Array.from(root.querySelectorAll<HTMLElement>(selector), el => ({ el, amp })));
    layers.forEach(({ el }) => { el.dataset.parallax = ""; });

    let queued = false;
    const update = () => {
      queued = false;
      const height = window.innerHeight;
      for (const { el, amp } of layers) {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -120 || box.top > height + 120) continue;
        const offset = Math.max(-1.2, Math.min(1.2, (box.top + box.height / 2 - height / 2) / height));
        el.style.setProperty("--py", `${(-offset * amp).toFixed(1)}px`);
      }
      const max = document.documentElement.scrollHeight - height;
      bar.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [design]);
  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}

/** Pointer-follow tilt for the two concept cards on the home page. */
export function ChooserMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover)").matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".concept-card"));
    const cleanups = cards.map(card => {
      const move = (event: PointerEvent) => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        card.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
      };
      const reset = () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", reset);
      return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", reset); };
    });
    return () => cleanups.forEach(clean => clean());
  }, []);
  return null;
}
