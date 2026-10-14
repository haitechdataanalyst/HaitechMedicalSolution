import { NO_MATERIAL_CONNECTION } from "@/lib/customer-stories";
import type { CustomerStory } from "@/lib/customer-stories";
import type { StoryCardData } from "./StoryCard";

export const hasNoMaterialConnection = (story: CustomerStory): boolean => story.approval.materialConnection.trim().toLowerCase() === NO_MATERIAL_CONNECTION;

/** Maps a verified data entry to what the card shows. The disclosure appears only when there is something to disclose. */
export function toCardData(story: CustomerStory): StoryCardData {
    return {
        id: story.id,
        name: story.name,
        speciality: story.speciality,
        city: story.city,
        clinic: story.clinic,
        photo: story.photo,
        quote: story.quote,
        product: story.product ? { label: story.product.label, href: story.product.href } : undefined,
        disclosure: hasNoMaterialConnection(story) ? undefined : story.approval.materialConnection.trim(),
    };
}

/** The consent line shown under a group of stories. "No payment" is claimed only if it is true for every story shown. */
export function consentLine(stories: CustomerStory[]): string {
    const base = "Shared with each clinician's written consent.";
    return stories.every(hasNoMaterialConnection) ? `${base} No payment or gift was provided.` : base;
}
