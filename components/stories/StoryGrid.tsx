import StoryCard from "./StoryCard";
import type { StoryCardData } from "./StoryCard";

/**
 * The listing grid: one column of compact rows on phones, then 2 → 3 → 4 portrait cards.
 * Used by the customer-stories page for any number of profiles — adding data never changes this layout.
 */
export default function StoryGrid({ cards, placeholder = false }: { cards: StoryCardData[]; placeholder?: boolean }) {
    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {cards.map((card, index) => (
                <li key={`${card.id ?? card.name}-${index}`}>
                    <StoryCard story={card} stackFrom="sm" placeholder={placeholder} />
                </li>
            ))}
        </ul>
    );
}
