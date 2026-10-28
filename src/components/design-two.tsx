import type { ReactNode } from "react";
import { siteContent } from "@/content/site";
import { Arrow, ContactDetails, FaqList, HeaderNav, InquiryForm, Logo, MailIcon, MotionLayer, Reveal } from "@/components/shared";

const nav = [
  { label: "Parts", href: "#parts" },
  { label: "Truck Parts", href: "#truck-parts" },
  { label: "Trailer Parts", href: "#trailer-parts" },
  { label: "Support", href: "#questions" },
] as const;

const features = [
  { id: "truck-parts", label: "Truck parts", title: <>Built for<br />heavy-duty<br />performance.</>, copy: "From engines to electrical systems, we carry the parts that keep your truck on the road.", link: "Explore truck parts", image: "/images/engine-bay.jpg", alt: "Engine bay with intake, hoses and wiring" },
  { id: "trailer-parts", label: "Trailer parts", title: <>Keep your<br />fleet moving.</>, copy: "Find reliable trailer components for safety, stability, and long-term performance.", link: "Explore trailer parts", image: "/images/white-semi-side.jpg", alt: "White semi truck parked in an industrial yard" },
  { id: "braking", label: "Braking & wheel-end", title: <>Safety in<br />every mile.</>, copy: "High-quality braking and wheel-end parts for maximum control and durability.", link: "Explore braking & wheel-end", image: "/images/brake-disc-studio.jpg", alt: "Drilled brake disc mounted on a wheel hub" },
  { id: "air-suspension", label: "Air suspension", title: <>A smoother,<br />stronger ride.</>, copy: "Enhance stability and reduce wear with premium air suspension components.", link: "Explore air suspension", image: "/images/undercarriage.jpg", alt: "Vehicle undercarriage showing suspension and axle components" },
] as const;

// Open Road's own wording for two of the shared categories.
const categoryLabels: Record<string, string> = { "brakes-wheel-ends": "Braking & Wheel-End", "air-systems": "Air Suspension" };

const icons: Record<string, ReactNode> = {
  truck: <svg viewBox="0 0 32 22" aria-hidden="true"><path d="M1 3h18v13H1zM19 8h7l4 5v3H19" /><circle cx="7" cy="18" r="2.5" /><circle cx="24" cy="18" r="2.5" /></svg>,
  trailer: <svg viewBox="0 0 32 22" aria-hidden="true"><path d="M2 3h28v12H2zM2 9h28" /><circle cx="22" cy="18" r="2.5" /><circle cx="28" cy="18" r="2.5" /></svg>,
  shield: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>,
  support: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H4zM17 14h3v6h-3zM20 20c0 2-3 2-6 2" /></svg>,
};

const highlights = [
  { icon: "truck", title: "Truck Parts", copy: "Engine, electrical, cooling, and more." },
  { icon: "trailer", title: "Trailer Parts", copy: "Axles, suspension, brakes, and more." },
  { icon: "shield", title: "Reliable Quality", copy: "Durable parts for demanding work." },
  { icon: "support", title: "Dedicated Support", copy: "We’re here to help with your needs." },
] as const;

/** Design B — Open Road: light, editorial, generous whitespace and photo-led rows. */
export function DesignTwo() {
  const { business, categories, generalFaqs } = siteContent;
  return <div className="design-two" id="top">
    <MotionLayer design="design-2" />
    <HeaderNav links={nav} cta={{ label: "Request a quote", href: "#contact" }}><Logo variant="open" /></HeaderNav>
    <main id="main-content">
      <section className="ob-hero" aria-labelledby="ob-hero-title">
        <div className="ob-hero-copy">
          <span className="ob-kicker">Quality parts / Reliable performance</span>
          <h1 id="ob-hero-title">The right parts.<br />The road ahead.</h1>
          <p>We supply high-quality truck and trailer components built for durability, performance, and the demands of the road.</p>
          <div className="ob-actions"><a className="ob-btn ob-btn-dark" href="#parts">Explore parts <Arrow /></a><a className="ob-btn ob-btn-line" href="#contact">Request a quote <Arrow /></a></div>
        </div>
        <div className="ob-hero-media"><img src="/images/white-trucks-road.jpg" alt="White semi trucks on a curving road in golden light" /></div>
      </section>

      <section className="ob-browse" id="parts" aria-labelledby="ob-browse-title">
        <div className="ob-browse-head"><div><span className="ob-kicker">Browse by category</span><h2 id="ob-browse-title">Find the right parts<br />for your needs.</h2></div><p><i aria-hidden="true" />Quality components for trucks and trailers, all in one place.</p></div>
        <div className="ob-cats">{categories.map(category => <a key={category.id} href="#contact" className="ob-cat"><span className="ob-num">{category.number}</span><strong>{categoryLabels[category.id] ?? category.title}</strong><span>{category.summary}</span><Arrow /></a>)}</div>
      </section>

      {features.map((feature, index) => <section key={feature.id} id={feature.id} className={`ob-feature ${index % 2 ? "is-flipped" : ""}`} aria-labelledby={`${feature.id}-title`}>
        <div className="ob-feature-media"><img src={feature.image} alt={feature.alt} loading="lazy" /></div>
        <Reveal className="ob-feature-copy"><span className="ob-label"><span className="ob-num">0{index + 1}</span>{feature.label}</span><h2 id={`${feature.id}-title`}>{feature.title}</h2><p>{feature.copy}</p><a href="#contact" className="ob-link">{feature.link} <Arrow /></a></Reveal>
      </section>)}

      <section className="ob-philosophy" aria-labelledby="ob-philosophy-title">
        <img src="/images/black-trucks-row.jpg" alt="" loading="lazy" />
        <Reveal className="ob-philosophy-inner"><div><span className="ob-kicker ob-kicker-amber">Our philosophy</span><h2 id="ob-philosophy-title">Keeping hard work<br />moving forward.</h2><i className="ob-rule" aria-hidden="true" /></div><p>At {business.name}, we understand that every mile matters. That’s why we provide dependable parts, practical support, and straightforward answers to keep your trucks and trailers running strong.</p></Reveal>
      </section>

      <section className="ob-featured" aria-labelledby="ob-featured-title">
        <Reveal className="ob-featured-copy"><span className="ob-kicker">Featured specialization</span><h2 id="ob-featured-title">Trusted Parts for<br />Trucks and Trailers.</h2><p>From axles to air systems, we specialize in the components that power your business.</p><a href="#parts" className="ob-btn ob-btn-line ob-btn-sm">View all parts <Arrow /></a></Reveal>
        <div className="ob-featured-media"><img src="/images/engine-bw.jpg" alt="Close-up of engine pulleys, belts and alternator" loading="lazy" /></div>
      </section>

      <section className="ob-highlights" aria-label="Why choose us">{highlights.map(item => <div key={item.title} className="ob-highlight"><span className="ob-icon">{icons[item.icon]}</span><div><strong>{item.title}</strong><span>{item.copy}</span></div></div>)}</section>

      <section className="ob-faq" id="questions" aria-labelledby="ob-faq-title">
        <div><span className="ob-kicker">Frequently asked questions</span><h2 id="ob-faq-title">Quick Answers</h2><p>Find answers to the most common questions about our parts, shipping, and support.</p></div>
        <FaqList faqs={generalFaqs} />
      </section>

      <section className="ob-contact" id="contact" aria-labelledby="ob-contact-title">
        <div className="ob-contact-copy"><span className="ob-kicker">Get in touch</span><h2 id="ob-contact-title">Send Us an Inquiry</h2><p>Have a question or need a quote? Fill out the form and our team will get back to you as soon as possible.</p><div className="ob-contact-line"><MailIcon /><div><strong><ContactDetails /></strong><span>We’re here to help.</span></div></div></div>
        <InquiryForm extraField="phone" submitLabel="Send message" />
        <div className="ob-contact-media"><img src="/images/trucks-sunset-lot.jpg" alt="Trucks parked in a yard at sunset" loading="lazy" /></div>
      </section>
    </main>
    <footer className="ob-footer">
      <div className="ob-footer-top">
        <a href="#top" aria-label="Back to top"><Logo variant="open" inverse /></a>
        <nav aria-label="Footer navigation"><a href="#parts">Parts</a><a href="#truck-parts">Truck Parts</a><a href="#trailer-parts">Trailer Parts</a><a href="#questions">Support</a></nav>
        <div className="ob-footer-contact"><MailIcon /><div><strong><ContactDetails /></strong><span>We look forward to hearing from you.</span></div></div>
      </div>
      <div className="ob-footer-bottom"><span>© {new Date().getFullYear()} {business.name}. All rights reserved.</span></div>
    </footer>
  </div>;
}
