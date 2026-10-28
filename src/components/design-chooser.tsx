import Link from "next/link";
import { Arrow, ChooserMotion, Logo } from "@/components/shared";
import { siteContent } from "@/content/site";

const concepts = [
  {
    number: "1",
    href: "/design-1/",
    mood: "Dark · Industrial · Bold",
    title: "Heavy Duty",
    description: "Dark and industrial. A full-bleed workshop hero, alternating photo rows, and a clear path from finding the right part to a conversation with Jason.",
    tags: "Charcoal · Condensed display · Amber accents",
    preview: "/previews/design-1-desktop.webp",
    alt: "Opening screen of Design 1: a dark page with the condensed headline Parts that keep you moving over a photo of a truck in a workshop",
  },
  {
    number: "2",
    href: "/design-2/",
    mood: "Light · Editorial · Clear",
    title: "Open Road",
    description: "Light and editorial. A sunlit highway hero, browsing by category, and photo-led rows built for getting the right part fast.",
    tags: "Warm white · Grotesk display · Clean, open layout",
    preview: "/previews/design-2-desktop.webp",
    alt: "Opening screen of Design 2: a warm white page with the headline The right parts. The road ahead. beside a photo of white semi trucks on a highway",
  },
] as const;

export function DesignChooser() {
  const { business } = siteContent;
  return <main className="chooser" id="main-content">
    <ChooserMotion />
    <header className="chooser-header"><Logo variant="open" /><span className="chooser-prepared">Prepared by ElevenChase</span><span className="chooser-tag">{business.shortName} · Website directions</span></header>
    <section className="chooser-intro" aria-labelledby="chooser-title">
      <p className="chooser-eyebrow"><i aria-hidden="true" />A fresh perspective</p>
      <h1 id="chooser-title">Two fresh directions<br />for <em>{business.shortName} Truck &amp; Trailer.</em></h1>
      <div className="chooser-intro-bottom"><p>The same dependable parts support, expressed two ways. Explore each complete homepage and choose the direction that feels right.</p><span>One parts business. Two possibilities. <Arrow /></span></div>
    </section>
    <section className="chooser-grid" aria-label="Explore the two homepage concepts">
      {concepts.map(concept => <article key={concept.number} className="concept-card">
        <Link href={concept.href} className="concept-preview" tabIndex={-1} aria-hidden="true">
          <span className="preview-window"><i /><i /><i /><small>{business.name} — Design {concept.number}</small></span>
          <img src={concept.preview} width={1920} height={1200} alt={concept.alt} />
          <span className="preview-open"><Arrow className="arrow-diagonal" /></span>
        </Link>
        <div className="concept-info">
          <div className="concept-topline"><span>Design 0{concept.number}</span><span>{concept.mood}</span></div>
          <h2>{concept.title}</h2>
          <p>{concept.description}</p>
          <p className="concept-tags">{concept.tags}</p>
          <Link className="concept-action" href={concept.href}>Explore Design {concept.number}<Arrow className="arrow-diagonal" /></Link>
        </div>
      </article>)}
    </section>
    <section className="chooser-footnote" aria-label="About this presentation">
      <p>Different first impressions. <em>The same dependable parts.</em></p>
      <p>Each direction is a complete, responsive homepage. Use the floating bar to switch designs or return here. Inquiry forms are local previews; contact details will be added before launch.</p>
    </section>
    <footer className="chooser-footer"><span>Thoughtfully prepared for {business.name}.</span><span>Two homepage concepts · October 2026</span><span>Presentation only · Excluded from search</span></footer>
  </main>;
}
