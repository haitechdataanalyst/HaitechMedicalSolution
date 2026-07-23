import type { Testimonial } from "@/components/misc/Testimonials";

// Places API (New) — Place Details. Docs: https://developers.google.com/maps/documentation/places/web-service/place-details
// The field mask keeps the request minimal (billing is per-field on this API).
const FIELD_MASK = ["rating", "userRatingCount", "reviews.rating", "reviews.text", "reviews.originalText", "reviews.authorAttribution", "reviews.publishTime", "reviews.name"].join(",");

interface GoogleReviewRaw {
    name?: string;
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; photoUri?: string; uri?: string };
    publishTime?: string;
}

export interface GooglePlaceReviewsResult {
    reviews: Testimonial[];
    rating: number | null;
    totalReviews: number | null;
}

const EMPTY_RESULT: GooglePlaceReviewsResult = { reviews: [], rating: null, totalReviews: null };

/**
 * Fetches the business's live Google reviews via the Places API (New).
 * Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID (server-only env vars — see .env.local.example).
 * Returns an empty result (never throws) if unconfigured or the request fails, so the
 * homepage always falls back to the curated testimonials in data/testimonials.json.
 *
 * Google's API only ever returns up to 5 "most relevant" reviews chosen by their
 * algorithm — there is no supported way to fetch the full review list.
 */
export async function getGooglePlaceReviews(): Promise<GooglePlaceReviewsResult> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) return EMPTY_RESULT;

    try {
        const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
            headers: {
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": FIELD_MASK,
            },
            // Refresh at most every 6h — keeps review content reasonably fresh
            // while avoiding a live API call (and cost) on every page load.
            next: { revalidate: 21600 },
        });

        if (!res.ok) {
            console.error("Google Places API error:", res.status, await res.text());
            return EMPTY_RESULT;
        }

        const data = await res.json();
        const rawReviews: GoogleReviewRaw[] = data.reviews ?? [];

        const reviews: Testimonial[] = rawReviews
            .map((r, i) => ({
                id: r.name ?? `google-${i}`,
                name: r.authorAttribution?.displayName ?? "Google User",
                role: "Verified Google Review",
                company: "",
                location: "",
                rating: Math.round(r.rating ?? 5),
                text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
                image: r.authorAttribution?.photoUri,
                source: "google" as const,
                sourceUrl: r.authorAttribution?.uri,
                publishTime: r.publishTime,
            }))
            .filter((t) => t.text.length > 0);

        return {
            reviews,
            rating: typeof data.rating === "number" ? data.rating : null,
            totalReviews: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
        };
    } catch (error) {
        console.error("Failed to fetch Google reviews:", error);
        return EMPTY_RESULT;
    }
}
