import { siteContent } from "@/content/site";
import { Arrow, ContactDetails, FaqList, HeaderNav, InquiryForm, Logo, MailIcon, MotionLayer, Reveal } from "@/components/shared";

const nav = [
  { label: "Parts", href: "#parts" },
  { label: "Truck Parts", href: "#truck-parts" },
  { label: "Trailer Parts", href: "#trailer-parts" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

const features = [
  { id: "truck-parts", number: "01", title: <>Built for heavy-duty<br />miles.</>, copy: "High-quality engine and drivetrain components that help your truck perform, even under the toughest conditions.", image: "/images/engine-bw.jpg", alt: "Close-up of an engine’s pulleys, belts and alternator", tone: "dark" },
  { id: "trailer-parts", number: "02", title: <>The trailer essentials.</>, copy: "Reliable trailer parts and components for stability, safety and long-term durability on the road.", image: "/images/trailers-dock.jpg", alt: "White semi trailers backed into a loading dock", tone: "light" },
  { id: "wheel-ends", number: "03", title: <>Control starts at<br />the wheel end.</>, copy: "Brakes, wheel ends and air systems designed to keep you in control and on the move.", image: "/images/brake-disc-lift.jpg", alt: "Drilled brake disc and hub on a vehicle lift", tone: "dark" },
] as const;

/** Design A — Heavy Duty: dark, industrial, condensed type and amber accents. */
export function DesignOne() {
  const { business, categories, productLines, process } = siteContent;
  return <div className="design-one" id="top">
    <MotionLayer design="design-1" />
    <HeaderNav links={nav} cta={{ label: "Request a quote", href: "#contact" }}><Logo variant="heavy" inverse /></HeaderNav>
    <main id="main-content">
      <section className="ha-hero" aria-labelledby="ha-hero-title">
        <img className="ha-hero-img" src="/images/truck-garage-night.jpg" alt="" />
        <div className="ha-hero-copy">
          <span className="ha-kicker">Heavy-duty components</span>
          <h1 id="ha-hero-title">Parts that keep<br /><em>you moving.</em></h1>
          <p>Truck and trailer components for the work ahead.</p>
          <div className="ha-actions"><a className="ha-btn ha-btn-solid" href="#parts">Browse parts <Arrow /></a><a className="ha-btn ha-btn-ghost" href="#contact">Talk to our team</a></div>
        </div>
      </section>

      <section className="ha-categories" id="parts" aria-label="Part categories">
        {categories.map(category => <a key={category.id} href="#contact" className="ha-category"><span className="ha-num">{category.number}</span><span className="ha-category-title">{category.title}</span></a>)}
      </section>

      {features.map((feature, index) => <section key={feature.id} id={feature.id} className={`ha-feature ha-feature-${feature.tone} ${index % 2 ? "is-flipped" : ""}`} aria-labelledby={`${feature.id}-title`}>
        <div className="ha-feature-media"><img src={feature.image} alt={feature.alt} loading="lazy" /></div>
        <Reveal className="ha-feature-copy"><span className="ha-num ha-num-lg">{feature.number}<i aria-hidden="true" /></span><h2 id={`${feature.id}-title`}>{feature.title}</h2><p>{feature.copy}</p></Reveal>
      </section>)}

      <section className="ha-runaround" id="about" aria-labelledby="ha-runaround-title">
        <Reveal className="ha-runaround-intro"><i className="ha-rule" aria-hidden="true" /><h2 id="ha-runaround-title">Parts, without<br /><em>the runaround.</em></h2><p>The right parts. The right support.<br />All in one place.</p></Reveal>
        <ol className="ha-lines">{productLines.map((line, index) => <li key={line.title}><a href="#contact"><span className="ha-line-num">0{index + 1}</span><span><strong>{line.title}</strong><small>{line.summary}</small></span><Arrow /></a></li>)}</ol>
        <div className="ha-runaround-media"><img src="/images/black-trucks-row.jpg" alt="A row of black long-nose semi trucks" loading="lazy" /></div>
      </section>

      <section className="ha-process" aria-labelledby="ha-process-title">
        <Reveal className="ha-process-intro"><h2 id="ha-process-title">Find the part. Get the details right.</h2><p>A simple process to help us find the right parts for your truck or trailer.</p></Reveal>
        {process.map(step => <Reveal key={step.id} className="ha-step"><span className="ha-num ha-num-lg">{step.id}<i aria-hidden="true" /></span><h3>{step.title}</h3><p>{step.description}</p></Reveal>)}
      </section>

      <section className="ha-details" aria-labelledby="ha-details-title">
        <img className="ha-details-truck" src="/images/truck-backlit-road.jpg" alt="" loading="lazy" />
        <img className="ha-details-parts" src="/images/brake-disc-studio.jpg" alt="" loading="lazy" />
        <Reveal className="ha-details-copy"><i className="ha-rule" aria-hidden="true" /><h2 id="ha-details-title">The details <em>matter.</em></h2><p>Confirm the right fit and application for your truck or trailer. Our team is here to help you find the right parts.</p><a className="ha-btn ha-btn-solid ha-btn-sm" href="#contact">Ask about a part <Arrow /></a></Reveal>
      </section>

      <section className="ha-faq" id="questions" aria-labelledby="ha-faq-title">
        <div className="ha-faq-intro"><i className="ha-rule" aria-hidden="true" /><h2 id="ha-faq-title">FAQ</h2><p>Quick answers to common questions about our parts and inquiry process.</p></div>
        <FaqList />
      </section>

      <section className="ha-contact" id="contact" aria-labelledby="ha-contact-title">
        <div className="ha-contact-copy"><i className="ha-rule" aria-hidden="true" /><h2 id="ha-contact-title">Let’s find the<br /><em>right part.</em></h2><p>Fill out the form and our team will get back to you with the information you need.</p></div>
        <InquiryForm extraField="reference" submitLabel="Send inquiry" />
        <div className="ha-contact-details"><MailIcon /><ContactDetails /></div>
      </section>
    </main>
    <footer className="ha-footer">
      <a href="#top" aria-label="Back to top"><Logo variant="heavy" inverse /></a>
      <nav aria-label="Footer navigation"><a href="#parts">Parts</a><a href="#truck-parts">Truck Parts</a><a href="#trailer-parts">Trailer Parts</a><a href="#contact">Contact</a></nav>
      <span>© {new Date().getFullYear()} {business.name}. All rights reserved.</span>
    </footer>
  </div>;
}
