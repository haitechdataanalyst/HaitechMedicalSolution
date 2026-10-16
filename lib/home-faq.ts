import siteConfig from "@/data/site-config.json";

/**
 * The homepage FAQ. One list feeds both the visible accordion (components/misc/FAQ) and the FAQPage JSON-LD
 * (faqSchema in lib/structured-data.ts), so the markup can never differ from the text on the page.
 * The contact answer is built from data/site-config.json, the same source as the footer and the Organization schema.
 */
const { company } = siteConfig;
const address = `${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.postcode}`;

export const HOME_FAQ = [
    {
        question: "Who is Haitech Medical Solutions?",
        answer: "Haitech Medical Solutions Private Limited is a Mumbai-based supplier of premium dental and medical equipment in India, working with six specialist brands: Admetec, Almadent, Medesy, Salli, Strauss and Bondent.",
    },
    {
        question: "Which dental equipment brands does Haitech Medical supply in India?",
        answer: "Haitech Medical supplies Admetec dental loupes and LED headlights, Almadent dental chairs, Medesy surgical instruments, Salli ergonomic saddle chairs, Strauss diamond burs, and Bondent endodontics, CBCT imaging and implant systems.",
    },
    {
        question: "How do I get a quote from Haitech Medical?",
        answer: "Use the Request a Quote form on the website and tell the team what your clinic needs. Haitech prepares a single quote that can combine products from all six brands.",
    },
    {
        question: "Where is Haitech Medical located?",
        answer: `Haitech Medical Solutions is at ${address}. You can call ${company.phone} or email ${company.email}.`,
    },
    {
        // TODO(owner): confirm the exact delivery terms and any exclusions, then say them here. Until then this
        // repeats only what the site already states ("Authorized distributor", "Free delivery on all orders").
        question: "Are Haitech Medical products authorized and is delivery free?",
        answer: "Products are listed as authorized and with free delivery on the website.",
    },
] as const;
