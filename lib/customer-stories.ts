import { z } from "zod";

// Customer stories — the publish gate, the homepage selection, and the listing page's filters/pagination.
//
// A named clinician's photo, name and statement is an endorsement. It must never go live by accident,
// so an entry in data/customer-stories.json is shown only if EVERY check below passes. Anything that
// fails is "held" (never shown in production) with a plain-language reason, listed in the dev preview.
//
// This module is pure (no fs, no framework) so the rules can be tested directly.

/** The customer-stories page (and so the whole feature) stays hidden until this many stories are approved. */
export const MIN_STORIES_TO_PUBLISH = 3;
/** The homepage shows only hand-picked `featured` stories: at least this many, or the section stays hidden. */
export const MIN_FEATURED_ON_HOMEPAGE = 3;
export const MAX_FEATURED_ON_HOMEPAGE = 4;
export const MAX_QUOTE_LENGTH = 240;
export const PHOTO_DIR = "/images/customers/";
/** `approval.materialConnection` value meaning no payment, gift, discount or free equipment was given. */
export const NO_MATERIAL_CONNECTION = "none";

const isoDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date written YYYY-MM-DD")
    .refine((value) => !Number.isNaN(Date.parse(value)), "is not a real date");

const mustBeTrue = z.boolean().refine((value) => value === true, "must be true — confirm it before publishing");

const approvalSchema = z.object({
    /** Written consent for this person's name, photo and statement. */
    consentRecordedOn: isoDate,
    /** The exact wording of `quote` was approved by the clinician on this date. */
    quoteApprovedOn: isoDate,
    /** Speciality and professional title checked against their registration. */
    registrationVerified: mustBeTrue,
    /** Purchase / service relationship checked against Haitech's own invoices. */
    purchaseVerified: mustBeTrue,
    /** "none", or a plain-language disclosure such as "Received a demo unit at no charge". */
    materialConnection: z.string().trim().min(1, 'is required — write "none" if there is no connection'),
    /** Consent must be re-confirmed by this date; after it the story is hidden automatically. */
    reviewDueOn: isoDate,
});

const storySchema = z.object({
    id: z.string().trim().min(1),
    /** Flip to true only after the checklist in `approval` is complete. */
    published: z.boolean(),
    /** Hand-picked for the homepage (3–4 of them). Everyone else appears only on the customer-stories page. */
    featured: z.boolean().default(false),
    /** Exactly as the clinician wants it shown, including the title (e.g. "Dr. …"). */
    name: z.string().trim().min(3),
    speciality: z.string().trim().min(2),
    city: z.string().trim().min(2),
    clinic: z.string().trim().min(1).optional(),
    /** A real photograph the clinician approved, stored under public/images/customers/. */
    photo: z.object({
        src: z
            .string()
            .startsWith(PHOTO_DIR, `must start with ${PHOTO_DIR}`)
            .refine((value) => !value.includes(".."), "must not contain .."),
        alt: z.string().trim().min(3),
    }),
    /** The clinician's own words about their experience, approved verbatim. No patient-outcome claims. */
    quote: z.string().trim().min(10).max(MAX_QUOTE_LENGTH, `must be ${MAX_QUOTE_LENGTH} characters or fewer`),
    product: z
        .object({
            label: z.string().trim().min(1),
            href: z.string().regex(/^\/(?!\/)/, "must be a path on this site, starting with /"),
            /** Powers the "Product category" filter, e.g. "Dental loupes". Keep spellings consistent. */
            category: z.string().trim().min(1).optional(),
        })
        .optional(),
    approval: approvalSchema,
});

export type CustomerStory = z.infer<typeof storySchema>;

export interface HeldStory {
    id: string;
    reasons: string[];
}

export interface StoryEvaluation {
    publishable: CustomerStory[];
    held: HeldStory[];
}

export interface EvaluationOptions {
    /** Today as YYYY-MM-DD. */
    today: string;
    photoExists: (src: string) => boolean;
}

function describeIssues(error: z.ZodError): string[] {
    return error.issues.map((issue) => {
        const field = issue.path.join(".");
        return field ? `${field}: ${issue.message}` : issue.message;
    });
}

function readId(item: unknown, index: number): string {
    if (item && typeof item === "object" && "id" in item && typeof item.id === "string" && item.id.trim()) return item.id;
    return `entry #${index + 1}`;
}

export function evaluateStories(raw: unknown, { today, photoExists }: EvaluationOptions): StoryEvaluation {
    const publishable: CustomerStory[] = [];
    const held: HeldStory[] = [];
    if (!Array.isArray(raw)) return { publishable, held };

    const seenIds = new Set<string>();

    raw.forEach((item, index) => {
        const id = readId(item, index);
        const parsed = storySchema.safeParse(item);
        if (!parsed.success) {
            held.push({ id, reasons: describeIssues(parsed.error) });
            return;
        }

        const story = parsed.data;
        const reasons: string[] = [];
        if (!story.published) reasons.push("published is false (draft)");
        if (seenIds.has(story.id)) reasons.push("duplicate id");
        if (story.approval.consentRecordedOn > today) reasons.push("approval.consentRecordedOn is in the future");
        if (story.approval.quoteApprovedOn > today) reasons.push("approval.quoteApprovedOn is in the future");
        if (story.approval.reviewDueOn <= today) reasons.push(`consent review was due ${story.approval.reviewDueOn} — re-confirm with the clinician, then set a new reviewDueOn`);
        if (!photoExists(story.photo.src)) reasons.push(`photo file not found: ${story.photo.src}`);

        seenIds.add(story.id);
        if (reasons.length > 0) held.push({ id: story.id, reasons });
        else publishable.push(story);
    });

    return { publishable, held };
}

// ── What each surface renders ──────────────────────────────────────────────────────────────────

/** The customer-stories page. `dev-preview` exists only when NODE_ENV is exactly "development". */
export type StoriesPageState = { mode: "live"; stories: CustomerStory[] } | { mode: "dev-preview"; held: HeldStory[] } | { mode: "hidden" };

export function resolveStoriesPage(evaluation: StoryEvaluation, nodeEnv: string | undefined): StoriesPageState {
    if (evaluation.publishable.length >= MIN_STORIES_TO_PUBLISH) return { mode: "live", stories: evaluation.publishable };
    if (nodeEnv === "development") return { mode: "dev-preview", held: evaluation.held };
    return { mode: "hidden" };
}

/** The homepage section: only when the page it links to is live AND enough stories are featured. */
export type HomepageSectionState = { mode: "live"; stories: CustomerStory[] } | { mode: "dev-preview"; held: HeldStory[]; publishableCount: number; featuredCount: number } | { mode: "hidden" };

export function resolveHomepageSection(evaluation: StoryEvaluation, nodeEnv: string | undefined): HomepageSectionState {
    const featured = evaluation.publishable.filter((story) => story.featured);
    const pageIsLive = evaluation.publishable.length >= MIN_STORIES_TO_PUBLISH;
    if (pageIsLive && featured.length >= MIN_FEATURED_ON_HOMEPAGE) {
        return { mode: "live", stories: featured.slice(0, MAX_FEATURED_ON_HOMEPAGE) };
    }
    if (nodeEnv === "development") {
        return { mode: "dev-preview", held: evaluation.held, publishableCount: evaluation.publishable.length, featuredCount: featured.length };
    }
    return { mode: "hidden" };
}
