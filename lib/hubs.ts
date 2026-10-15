/**
 * Product-type hubs: one landing page per kind of equipment a dentist
 * searches for, sitting above the brand-first category tree. Products are
 * never duplicated: a hub lists existing catalog categories and links to
 * each product's one canonical URL.
 *
 * Copy here may only restate facts already in the catalog data
 * (data/categories.json, data/products.json) or existing site content.
 */

export interface HubLink {
    label: string;
    href: string;
    description: string;
}

/**
 * One curated comparison row. Values come from the named spec rows (joined
 * with " / "), or from explicit per-product values keyed by product slug.
 */
export interface HubComparisonRow {
    label: string;
    fromSpecs?: string[];
    values?: Record<string, string>;
}

export interface HubDefinition {
    slug: string;
    name: string;
    /** One line for cards and menus. */
    summary: string;
    metaTitle: string;
    metaDescription: string;
    intro: string[];
    /** Catalog category slugs listed on the hub, in display order. */
    productCategories: string[];
    /** Every category slug whose breadcrumb trail should start at this hub. */
    breadcrumbCategories: string[];
    /** Key into data/faq.json categories. */
    faqCategory?: string;
    /** Show a specification comparison table built from catalog spec rows. */
    showComparison?: boolean;
    /** Curated rows; when absent the table shows every spec row. */
    comparisonRows?: HubComparisonRow[];
    extraLinks?: HubLink[];
    /** Article slugs from components/articles. */
    guideSlugs?: string[];
    offerLoupeFitting?: boolean;
}

export const HUBS: HubDefinition[] = [
    {
        slug: "dental-loupes",
        summary: "Admetec Galilean, prismatic, Ergo and Ergo V loupes.",
        name: "Dental Loupes",
        metaTitle: "Admetec Dental Loupes in India",
        metaDescription: "Admetec dental loupes in India: Galilean 2.5x to 3.2x, prismatic, Ergo 3.0x to 10x and Ergo V loupes, plus LED headlights and frames. Book a loupe fitting.",
        intro: [
            "Haitech Medical supplies Admetec dental loupes in India. The range covers lightweight Galilean loupes at 2.5x, 2.7x and 3.2x, prismatic loupes for higher magnification, Ergo loupes from 3.0x to 10x, and the Ergo V series with adjustable declination.",
            "Loupes are fitted to your face, posture and working distance, so every pair starts with a fitting consultation. LED headlights and frames are listed separately below.",
        ],
        productCategories: ["galilean-loupes", "prismatic-loupes", "ergo-loupes", "ergo-v-series"],
        breadcrumbCategories: ["admetec", "galilean-loupes", "prismatic-loupes", "ergo-loupes", "ergo-v-series", "admetec-frames", "admetec-headlights", "admetec-camera"],
        faqCategory: "dental-loupes",
        extraLinks: [
            { label: "LED headlights", href: "/our-headlights", description: "Wireless and wired headlights for Admetec loupes." },
            { label: "Loupe frames", href: "/our-frames", description: "Frame styles and colours compatible with Admetec loupe systems." },
            { label: "Flamingo camera", href: "/product-category/admetec/admetec-camera", description: "Full HD wireless camera and headlight for recording through your loupes." },
            { label: "About Admetec", href: "/product/admetec", description: "The manufacturer behind the Galilean, prismatic and Ergo ranges." },
        ],
        guideSlugs: ["choose-perfect-dental-loupes", "choosing-right-magnification", "what-are-ergo-loupes", "clean-maintain-loupes-lights"],
        offerLoupeFitting: true,
    },
    {
        slug: "dental-chairs",
        summary: "Anya AY-3000, AY-6000 and AY-8000 chairs from Almadent.",
        name: "Dental Chairs",
        metaTitle: "Anya Dental Chairs in India",
        metaDescription: "Compare Anya dental chairs from Almadent: the hydraulic AY-3000, electric AY-6000 and AY-8000 with servo motors. Specifications, warranty and quote requests.",
        intro: [
            "Haitech Medical supplies the Anya range of dental chairs from Almadent. The AY-3000 is a hydraulic chair, the AY-6000 is electric with six programmable positions and an LED shadowless light, and the AY-8000 is fully electric with servo motors and twelve preset positions.",
            "Compare the listed specifications below, then request a quote or book a demo for the model that suits your clinic.",
        ],
        productCategories: ["dental-chairs"],
        breadcrumbCategories: ["dental-chairs"],
        faqCategory: "dental-chairs",
        showComparison: true,
        extraLinks: [
            { label: "Saddle chairs", href: "/saddle-chairs", description: "Salli operator seating for dentists and assistants." },
            { label: "About Almadent", href: "/product/almadent", description: "Chairs, handpieces, implant motors and auxiliary equipment." },
        ],
    },
    {
        slug: "saddle-chairs",
        summary: "Five Salli saddle chair models from Finland.",
        name: "Saddle Chairs",
        metaTitle: "Salli Saddle Chairs for Dentists in India",
        metaDescription: "Salli saddle chairs from Finland for dentists and clinicians: Ultra Triple Fit, Triple Fit, Chin Tilt, Sway Fit and Light. Prices in INR and model guidance.",
        intro: [
            "Salli saddle chairs are Finnish ergonomic chairs designed to promote healthy posture and reduce strain during long clinical hours. Haitech Medical supplies five Salli models in India, from the lightweight Salli Light to the Ultra Triple Fit with movable armrests.",
        ],
        productCategories: ["salli"],
        breadcrumbCategories: ["salli"],
        faqCategory: "saddle-chairs",
        extraLinks: [
            { label: "Dental loupes", href: "/dental-loupes", description: "Ergo loupes help you keep an upright working posture." },
            { label: "About Salli", href: "/product/salli", description: "The company and research behind the split saddle seat." },
        ],
    },
    {
        slug: "endodontics",
        summary: "Bondent endo motors, apex locators and NiTi files.",
        name: "Endodontics",
        metaTitle: "Endo Motors, Apex Locators & NiTi Files",
        metaDescription: "Bondent endodontic equipment in India: cordless endo motors, apex locators, rotary and reciprocating NiTi files, hand files, obturation and irrigation from Haitech Medical.",
        intro: [
            "Haitech Medical supplies the Bondent Group endodontic range: cordless endo motors, including models with an integrated apex locator, standalone apex locators, rotary, reciprocating and special-function NiTi files, stainless steel hand files, obturation, irrigation and training accessories.",
        ],
        productCategories: ["endo-motor", "apex-locator", "rotary-files", "reciprocating-files", "special-function-niti", "hand-files", "obturation", "irrigation", "accessory"],
        breadcrumbCategories: [
            "endo-motor",
            "apex-locator",
            "rotary-files",
            "reciprocating-files",
            "special-function-niti",
            "hand-files",
            "obturation",
            "irrigation",
            "accessory",
            "preparation",
            "endo-device",
            "endo-files",
        ],
        faqCategory: "endodontics",
        extraLinks: [
            { label: "CBCT imaging", href: "/cbct", description: "Bondent CBCT, panoramic and cephalometric systems." },
            { label: "About Bondent", href: "/product/bondent", description: "The Bondent Group endodontics, optics and imaging range." },
        ],
    },
    {
        slug: "cbct",
        summary: "Bondent CBCT, panoramic and cephalometric systems.",
        name: "CBCT Imaging",
        metaTitle: "Bondent CBCT Machines in India",
        metaDescription: "Bondent CBCT, panoramic and cephalometric imaging systems in India: CBCT-1030 Pro, CBCT-1030 Pro 2-in-1 and CBCT 1020MS. Compare field of view and request a quote.",
        intro: [
            "Haitech Medical supplies three Bondent CBCT systems. The CBCT-1030 Pro and CBCT 1020MS combine CBCT, panoramic and cephalometric imaging, and the CBCT-1030 Pro (2-in-1) combines CBCT, panoramic and 3D cephalometric imaging.",
            "The CBCT-1030 Pro and CBCT-1030 Pro (2-in-1) offer six fields of view from 5x5 to 16x18 cm. The CBCT 1020MS offers four fields of view from 4x4 to 18x10 cm, with a 10-inch touch console.",
            "CBCT prices are shared on request. Book a demo or request a quote and the Haitech team will contact you.",
        ],
        productCategories: ["imaging"],
        breadcrumbCategories: ["imaging"],
        faqCategory: "cbct",
        showComparison: true,
        comparisonRows: [
            { label: "Function", fromSpecs: ["Function"] },
            {
                label: "Ceph method",
                values: {
                    "bondent-cbct-1030-pro": "Dedicated CMOS ceph detector",
                    "bondent-cbct-1030-pro-2-in-1": "Smart 3D Ceph, no ceph detector",
                    "cbct-1020ms": "Dedicated CMOS ceph detector",
                },
            },
            { label: "FOVs", fromSpecs: ["FOVs"] },
            { label: "Tube voltage / current", fromSpecs: ["Tube voltage", "Tube current"] },
            {
                label: "Ceph scan time",
                values: {
                    "bondent-cbct-1030-pro": "8.4 s or 14 s",
                    "bondent-cbct-1030-pro-2-in-1": "Not listed",
                    "cbct-1020ms": "4.2 s or 8.4 s",
                },
            },
            { label: "Net weight", fromSpecs: ["Net weight"] },
            { label: "Installation area", fromSpecs: ["Min. installation area"] },
        ],
        extraLinks: [
            { label: "Endodontics", href: "/endodontics", description: "Bondent endo motors, apex locators and NiTi files." },
            { label: "About Bondent", href: "/product/bondent", description: "The Bondent Group endodontics, optics and imaging range." },
        ],
    },
];

/** Product-type links that are not hubs because a brand page already is that product type. */
export const PRODUCT_TYPE_LINKS: HubLink[] = [
    { label: "Diamond Burs", href: "/product-category/strauss", description: "Strauss diamond and carbide burs and procedure kits." },
    { label: "Surgical Instruments", href: "/product-category/medesy", description: "Medesy elevators, forceps, periosteal elevators and scissors." },
];

export function hubPath(hub: HubDefinition): string {
    return `/${hub.slug}`;
}

export function getHub(slug: string): HubDefinition {
    const hub = HUBS.find((h) => h.slug === slug);
    if (!hub) throw new Error(`[hubs] unknown hub "${slug}"`);
    return hub;
}

/** First hub claiming any category in the trail, checked from the leaf upward. */
export function findHubForCategoryTrail(slugsLeafFirst: string[]): HubDefinition | null {
    for (const slug of slugsLeafFirst) {
        const hub = HUBS.find((h) => h.breadcrumbCategories.includes(slug));
        if (hub) return hub;
    }
    return null;
}
