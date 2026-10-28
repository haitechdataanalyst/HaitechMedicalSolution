/**
 * The Admetec brand page FAQ. One list feeds both the visible accordion (components/misc/FAQ) and the FAQPage JSON-LD
 * (faqSchema in lib/structured-data.ts), so the markup can never differ from the text on the page.
 * Wording follows the brand copy supplied by the business; it states who makes the loupes, that they are made to
 * measure, and what Haitech does as the authorised dealer in India, and nothing about prices, stock or delivery.
 */
export const ADMETEC_FAQ = [
    {
        question: "Who manufactures Admetec loupes?",
        answer: "Admetec, an Israeli company headquartered in Haifa. Haitech Medical Solutions is its authorised dealer in India.",
    },
    {
        question: "Are Admetec loupes custom-made?",
        answer: "Yes. Each pair is built to your interpupillary distance, working distance and preferences.",
    },
    {
        question: "Which magnification should I choose?",
        answer: "It depends on your specialty and the procedures you do. A fitting session lets you compare options before you order.",
    },
    {
        question: "Can I try Admetec loupes before buying?",
        answer: "Yes. Book a demonstration with our team.",
    },
    {
        question: "Who handles service in India?",
        answer: "Haitech Medical Solutions coordinates after-sales support and warranty matters with Admetec.",
    },
] as const;
