import type { ReactNode } from "react";
import { DescriptionBlock as DescriptionBlockType } from "@/types";
import sanitizeHtml from "sanitize-html";
import { ExpandableList, ExpandableText } from "@/components/ui/Expandable";
import type { ResolvedPresentation } from "@/lib/product-presentation";

interface DescriptionBlockProps {
    data: DescriptionBlockType["data"];
    /** Opt-in progressive disclosure; without it the block renders exactly as before. */
    presentation?: ResolvedPresentation | null;
    /** Rendered directly under the short description (e.g. a quick-enquiry button). */
    afterPrimary?: ReactNode;
}

const inlineAllowedTags = ["br", "strong", "em", "b", "i"];

const inlineMarkup = (value: string) =>
    sanitizeHtml(value, {
        allowedTags: inlineAllowedTags,
        allowedAttributes: {},
    });

interface ParsedSecondary {
    /** Sanitized inline HTML of the overview paragraph ("" if none). */
    introHtml: string;
    /** Plain-text length of the overview, for the "Read more" threshold. */
    introLength: number;
    /** Sanitized inline HTML of each numbered item, in original order. */
    itemHtmls: string[];
}

/** Splits "Overview text 1. First 2. Second" into the overview and its numbered items. */
function parseSecondary(value: string): ParsedSecondary {
    const trimmedValue = value.trim();
    const whole = { introHtml: inlineMarkup(trimmedValue), introLength: trimmedValue.length, itemHtmls: [] };
    if (!trimmedValue) return { introHtml: "", introLength: 0, itemHtmls: [] };

    const firstNumberMatch = trimmedValue.match(/\d+\.\s/);
    if (!firstNumberMatch || firstNumberMatch.index === undefined) return whole;

    const introText = trimmedValue.slice(0, firstNumberMatch.index).trim();
    const numberedParts = trimmedValue
        .slice(firstNumberMatch.index)
        .trim()
        .split(/\s(?=\d+\.\s)/)
        .map((part) => part.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);

    if (numberedParts.length === 0) return whole;
    return { introHtml: introText ? inlineMarkup(introText) : "", introLength: introText.length, itemHtmls: numberedParts.map(inlineMarkup) };
}

function toSecondaryHtml(value: string): string {
    const { introHtml, itemHtmls } = parseSecondary(value);
    const introMarkup = introHtml ? `<p>${introHtml}</p>` : "";
    const listMarkup = itemHtmls.length > 0 ? `<ol>${itemHtmls.map((item) => `<li>${item}</li>`).join("")}</ol>` : "";

    return sanitizeHtml(`${introMarkup}${listMarkup}`, {
        allowedTags: ["ol", "li", "p", ...inlineAllowedTags],
        allowedAttributes: {},
    });
}

export default function DescriptionBlock({ data, presentation, afterPrimary }: DescriptionBlockProps) {
    if (!presentation) {
        const secondaryHtml = data.secondary ? toSecondaryHtml(data.secondary) : "";
        return (
            <div className="space-y-4">
                <p className="text-[17px] leading-relaxed text-neutral-700">{data.primary}</p>
                {afterPrimary}
                {secondaryHtml && <div className="text-[15px] leading-relaxed text-neutral-600 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: secondaryHtml }} />}
            </div>
        );
    }

    const { introHtml, introLength, itemHtmls } = parseSecondary(data.secondary ?? "");
    const count = itemHtmls.length;

    return (
        <div id="overview" className="space-y-4">
            {/* Short description — never collapsed */}
            <p className="text-[17px] leading-relaxed text-neutral-700">{data.primary}</p>
            {afterPrimary}

            {introHtml && (
                <ExpandableText
                    id="overview-text"
                    textLength={introLength}
                    lines={presentation.overviewLines}
                    readMoreMinChars={presentation.overviewReadMoreMinChars}
                    className="text-[15px] leading-relaxed text-neutral-600"
                >
                    <span dangerouslySetInnerHTML={{ __html: introHtml }} />
                </ExpandableText>
            )}

            {count > 0 && (
                <ExpandableList
                    id="features"
                    ordered
                    items={itemHtmls.map((html) => (
                        <span key={html} dangerouslySetInnerHTML={{ __html: html }} />
                    ))}
                    visible={presentation.featuresVisible}
                    listClassName="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 marker:text-neutral-500"
                    moreLabel={`Show all ${count} features`}
                    lessLabel="Show fewer features"
                />
            )}
        </div>
    );
}
