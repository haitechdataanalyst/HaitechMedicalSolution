import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Card widths for each column count, worked out from the gaps in the container classes below
// (gap-4 = 1rem, gap-5 = 1.25rem, gap-6 = 1.5rem), so a full row fills the line exactly.
const CELL_STANDARD = "flex w-[calc((100%-1rem)/2)] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]";
// For listings beside a filter sidebar: 3 columns from sm, 4 from xl.
const CELL_DENSE = "flex w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]";
// Full-width category page: 2, then 3 from lg, 4 only from 2xl.
const CELL_WIDE = "flex w-[calc((100%-1rem)/2)] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3rem)/3)] 2xl:w-[calc((100%-4.5rem)/4)]";

// Large tiles: one column on a phone, two from md.
const CELL_HALF = "flex w-full md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-1.5rem)/2)]";

// Portrait tiles: 2 columns, then 3 from sm, 4 from lg, 5 from xl.
const CELL_TEAM = "flex w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-4.5rem)/4)] xl:w-[calc((100%-6rem)/5)]";

const CELLS = { standard: CELL_STANDARD, dense: CELL_DENSE, wide: CELL_WIDE, half: CELL_HALF, team: CELL_TEAM } as const;

interface BalancedGridProps {
    children: ReactNode;
    /** Column breakpoints: standard = 2 / 3 at lg / 4 at xl; dense = 2 / 3 at sm / 4 at xl; wide = 2 / 3 at lg / 4 at 2xl; half = 1, then 2 from md; team = 2 / 3 / 4 / 5. */
    layout?: keyof typeof CELLS;
    /** Cards from this index on stay in the HTML (so their links are crawlable) but are hidden and take no space. */
    visibleCount?: number;
    /** Render a real list (ul/li) instead of divs, for a set of equal items such as people. */
    list?: boolean;
    className?: string;
}

/**
 * A product grid whose unfinished last row is centred. A plain CSS grid leaves a lone card hanging at the left
 * (a 3rd card beside an empty half-row on a phone); centring it keeps every row balanced at every width.
 */
export default function BalancedGrid({ children, layout = "standard", visibleCount = Infinity, list = false, className }: BalancedGridProps) {
    const cell = CELLS[layout];
    const Outer = list ? "ul" : "div";
    const Cell = list ? "li" : "div";
    return (
        <Outer className={cn("flex flex-wrap justify-center gap-4 sm:gap-5", layout !== "dense" && "lg:gap-6", className)}>
            {Children.toArray(children).map((child, index) => (
                <Cell key={index} className={index < visibleCount ? cell : "hidden"}>
                    {/* the card fills its cell, so every card in a row has the same height */}
                    <div className="flex w-full flex-col [&>*]:flex-1">{child}</div>
                </Cell>
            ))}
        </Outer>
    );
}
