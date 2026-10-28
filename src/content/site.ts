/**
 * The shared business content for both visual directions.
 * Keep genuine business information here so changing a design never changes
 * the offer. Contact details are intentionally empty until the client supplies
 * them; production configuration checks refuse to build while they are empty.
 */
export interface SiteContent {
  readonly business: {
    readonly name: string;
    readonly shortName: string;
    readonly descriptor: string;
    /** Public business email. Empty until the client provides it. */
    readonly email: string;
    /** Public phone number. Empty until the client provides it. */
    readonly phone: string;
    /** Public HTTPS website. Empty until the domain is confirmed. */
    readonly url: string;
    readonly tagline: string;
    readonly description: string;
  };
  readonly categories: readonly {
    readonly id: string;
    readonly number: string;
    readonly title: string;
    readonly summary: string;
  }[];
  readonly productLines: readonly {
    readonly title: string;
    readonly summary: string;
  }[];
  readonly process: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
  }[];
  /** Inquiry-process questions (Heavy Duty). */
  readonly faqs: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
  /** General parts and supply questions (Open Road). */
  readonly generalFaqs: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
}

export const siteContent: SiteContent = {
  business: {
    name: "Jason Truck & Trailer Parts",
    shortName: "Jason",
    descriptor: "Truck & Trailer Parts",
    email: "",
    phone: "",
    url: "",
    tagline: "Parts that keep you moving.",
    description:
      "Truck and trailer components for the work ahead: engine and drivetrain, trailer and suspension, brakes and wheel ends, and air systems.",
  },
  categories: [
    { id: "truck-parts", number: "01", title: "Truck Parts", summary: "Engine, electrical, cooling, and more." },
    { id: "trailer-parts", number: "02", title: "Trailer Parts", summary: "Axles, suspension, brakes, and more." },
    { id: "brakes-wheel-ends", number: "03", title: "Brakes & Wheel Ends", summary: "Brakes, hubs, drums, and components." },
    { id: "air-systems", number: "04", title: "Air Systems", summary: "Ride height, air bags, valves, and more." },
  ],
  productLines: [
    { title: "Engine & Drivetrain", summary: "Power and performance for the long haul." },
    { title: "Trailer & Suspension", summary: "Keep your load secure and your ride steady." },
    { title: "Brakes & Wheel Ends", summary: "Safety and reliability where it matters most." },
    { title: "Air & Electrical", summary: "Keep your systems running smoothly." },
    { title: "Filters & Maintenance", summary: "Clean systems. Longer life." },
  ],
  process: [
    {
      id: "01",
      title: "Identify your component",
      description: "Tell us what part you need or provide a reference number.",
    },
    {
      id: "02",
      title: "Share fitment information",
      description: "Let us know your make, model, year or other relevant details.",
    },
    {
      id: "03",
      title: "Request pricing and availability",
      description: "We’ll provide the details you need, as soon as possible.",
    },
  ],
  faqs: [
    {
      question: "What information helps identify a part?",
      answer:
        "A part or reference number is the quickest route. If you don’t have one, share the make, model, year and VIN of the truck or trailer, plus a description or photo of the component.",
    },
    {
      question: "Can I ask about trailer components too?",
      answer:
        "Yes. We handle inquiries for both truck and trailer parts, including axles, suspension, brakes and wheel-end components.",
    },
    {
      question: "How do I request pricing or availability?",
      answer:
        "Send an inquiry with the part details and fitment information. We’ll get back to you with pricing and availability for that part.",
    },
    {
      question: "Can I inquire about an unlisted item?",
      answer:
        "Yes. The categories on this page are a starting point. Tell us what you’re looking for and we’ll let you know what we can source.",
    },
  ],
  generalFaqs: [
    {
      question: "What types of parts do you offer?",
      answer:
        "Truck parts, trailer parts, braking and wheel-end components, and air suspension parts, including engine, electrical, cooling, axle and suspension components.",
    },
    {
      question: "Do you supply parts for both trucks and trailers?",
      answer: "Yes. We handle inquiries for truck and trailer components alike.",
    },
    {
      question: "What brands do you carry?",
      answer:
        "Availability varies by part. Send us the part or reference number, or the make and model it’s for, and we’ll confirm the options we can supply.",
    },
    {
      question: "Do you offer bulk or fleet pricing?",
      answer:
        "Tell us about your fleet and the quantities you need in your inquiry, and we’ll respond with pricing details for your request.",
    },
  ],
};
