/**
 * Admetec's own YouTube videos, shown together on the Admetec brand page (/product/admetec). Import-free (testable with node --test).
 *
 * `id`, `uploadDate` and `seconds` were read from each video's YouTube page. The headings, summaries and key points are
 * written for that page from the video descriptions Admetec published and from the catalogue's own spec rows; nothing
 * here is a transcript. Keep any new claim to what the video description or the catalogue already says.
 */
export interface AdmetecVideo {
    /** YouTube video id. */
    id: string;
    /** Our own heading for the page; the schema name too. */
    heading: string;
    summary: string;
    points: string[];
    /** As YouTube reports it, with its UTC offset. */
    uploadDate: string;
    seconds: number;
    cta?: { href: string; label: string };
}

/** In watching order: the brand, the Ergo loupes, then how to choose and be fitted. */
export const ADMETEC_VIDEOS: AdmetecVideo[] = [
    {
        id: "4nBe3IvGvG0",
        heading: "Admetec loupes and lights: made for the clinician, supplied in India",
        summary:
            "Admetec designs, develops and manufactures its loupes and lights in-house, and every product is handcrafted and customised for the person who will use it. Haitech Medical supplies them in India as Admetec's authorised dealer.",
        points: [
            "Designed, developed and made in-house by Admetec, founded in 2006 in Haifa, Israel",
            "Each product individually handcrafted for the person who will use it",
            "Built to be lightweight, convenient to use and ergonomic",
            "New to the range: a Full HD camera and light that mounts on your loupes",
        ],
        uploadDate: "2023-08-24T06:02:52-07:00",
        seconds: 104,
        cta: { href: "/book-loupe-fitting", label: "Book a loupe fitting" },
    },
    {
        id: "kOCvOpF45Ac",
        heading: "Meet the Ergo loupes: the full walkthrough",
        summary: "Admetec's own walkthrough of its Ergo loupes, covering what you need to know before you choose one. Every pair is made to your measurements.",
        points: [
            "Everything about the Ergo loupes in one film from Admetec",
            "Six single-power magnifications: 3.0x, 4.0x, 5.0x, 6.0x, 7.5x and 10x",
            "Not sure which one? A fitting lets you compare options before you order",
        ],
        uploadDate: "2021-04-06T03:37:31-07:00",
        seconds: 255,
        cta: { href: "/product-category/admetec/ergo-loupes", label: "Explore Ergo loupes" },
    },
    {
        id: "IppWfsMoAEo",
        heading: "Ergo loupes: a neutral head position, less strain on neck and back",
        summary: "Watch how Admetec's Ergo loupes are designed to prevent neck and back pain by keeping your head in a neutral position while you work.",
        points: [
            "Designed to prevent neck and back pain by maintaining a neutral head position",
            "An ergonomic declination angle lets you work in a natural posture",
            "Six single-power Ergo loupes from 3.0x to 10x, plus the switchable Ergo V and Ergo V Pro",
        ],
        uploadDate: "2024-08-14T05:42:21-07:00",
        seconds: 51,
    },
    {
        id: "_iBLA3UrcUg",
        heading: "Field of view vs depth of field: what to know before you choose",
        summary: "Field of view (FOV) and depth of field (DOF) are closely related but affect your vision in different ways. Admetec explains how to weigh them when you pick a magnification.",
        points: [
            "As magnification increases, both FOV and DOF decrease",
            "A generous depth of field matters even more at higher magnification, for comfort and precision",
            "Prismatic 3.8x has a 90mm field of view and 85mm depth of field; Prismatic 7.2x has 40mm and 50mm. Each product page lists its own figures",
        ],
        uploadDate: "2025-12-08T01:04:32-08:00",
        seconds: 77,
        cta: { href: "/support/articles/choosing-right-magnification", label: "Choosing the right magnification" },
    },
    {
        id: "vpk_HcZlpwI",
        heading: "Why working distance matters when you choose loupes",
        summary:
            "Working distance is the measurement from your eyes to the patient's mouth while you work in a natural posture. It differs from person to person, and it changes the field of view, depth of field and magnification that suit you.",
        points: [
            "You wear loupes for hours, so a healthy, ergonomic posture comes first",
            "As working distance increases, you may need higher magnification to keep a sharp view without giving up your posture",
            "Your working distance is one of the things your loupe fitting takes into account",
        ],
        uploadDate: "2025-12-21T04:06:42-08:00",
        seconds: 55,
        cta: { href: "/book-loupe-fitting", label: "Book a loupe fitting" },
    },
];

/** "1 min 44 s", "55 s": for the label above the heading. */
export function watchTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return [minutes ? `${minutes} min` : "", rest ? `${rest} s` : ""].filter(Boolean).join(" ");
}
