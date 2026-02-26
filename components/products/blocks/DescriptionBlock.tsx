import { DescriptionBlock as DescriptionBlockType } from "@/types";
import sanitizeHtml from "sanitize-html";

interface DescriptionBlockProps {
    data: DescriptionBlockType["data"];
}

const inlineAllowedTags = ["br", "strong", "em", "b", "i"];

function toSecondaryHtml(value: string): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return "";
    }

    const firstNumberMatch = trimmedValue.match(/\d+\.\s/);

    const itemMarkup = (item: string) =>
        sanitizeHtml(item, {
            allowedTags: inlineAllowedTags,
            allowedAttributes: {},
        });

    if (!firstNumberMatch || firstNumberMatch.index === undefined) {
        return sanitizeHtml(`<p>${itemMarkup(trimmedValue)}</p>`, {
            allowedTags: ["p", ...inlineAllowedTags],
            allowedAttributes: {},
        });
    }

    const introText = trimmedValue.slice(0, firstNumberMatch.index).trim();
    const listText = trimmedValue.slice(firstNumberMatch.index).trim();

    const numberedParts = listText
        .split(/\s(?=\d+\.\s)/)
        .map((part) => part.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);

    if (numberedParts.length === 0) {
        return sanitizeHtml(`<p>${itemMarkup(trimmedValue)}</p>`, {
            allowedTags: ["p", ...inlineAllowedTags],
            allowedAttributes: {},
        });
    }

    const introMarkup = introText ? `<p>${itemMarkup(introText)}</p>` : "";
    const listMarkup = `<ol>${numberedParts.map((item) => `<li>${itemMarkup(item)}</li>`).join("")}</ol>`;
    const rawMarkup = `${introMarkup}${listMarkup}`;

    return sanitizeHtml(rawMarkup, {
        allowedTags: ["ol", "li", "p", ...inlineAllowedTags],
        allowedAttributes: {},
    });
}

export default function DescriptionBlock({ data }: DescriptionBlockProps) {
    const secondaryHtml = data.secondary ? toSecondaryHtml(data.secondary) : "";

    return (
        <div className="space-y-4">
            <p className="leading-relaxed text-neutral-700">{data.primary}</p>
            {secondaryHtml && <div className="text-muted leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: secondaryHtml }} />}
        </div>
    );
}
