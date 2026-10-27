import { Fragment, type ReactNode } from "react";
import { ADMETEC_URL } from "./AdmetecBrandBadge";

// Admetec asks for the word "Admetec" in our page text to link to its site, next to the logo. One helper does it for
// plain strings (React nodes) and for already-sanitised HTML strings, so every place that shows product or brand copy
// can use it. Use it on body text only: not inside another link (a card), not in a heading, title, alt text or markup.
const WORD = /\bAdmetec\b/g;

/** Underlined so it reads as a link in running text without relying on colour alone. */
const LINK_CLASS = "underline decoration-current/50 underline-offset-2 transition-colors hover:text-primary-700 hover:decoration-primary-700";
/** On a dark band the hover goes lighter, not to the teal, which would be hard to read there. */
const LINK_CLASS_ON_DARK = "underline decoration-white/50 underline-offset-2 transition-colors hover:text-white hover:decoration-white";

/** The word "Admetec" (or the given text) as a link to www.admetec.com, opening in a new tab. */
export function AdmetecLink({ children = "Admetec", onDark = false }: { children?: ReactNode; onDark?: boolean }) {
    return (
        <a href={ADMETEC_URL} target="_blank" rel="noopener" className={onDark ? LINK_CLASS_ON_DARK : LINK_CLASS}>
            {children}
        </a>
    );
}

/** A plain string with every "Admetec" turned into a link ("Admetec's" links the name only). */
export function linkAdmetec(text: string, options: { onDark?: boolean } = {}): ReactNode {
    if (!text.includes("Admetec")) return text;
    return text.split(/(\bAdmetec\b)/).map((part, index) => (part === "Admetec" ? <AdmetecLink key={index} onDark={options.onDark} /> : <Fragment key={index}>{part}</Fragment>));
}

/**
 * The same for an HTML string. Run it on markup that has already been sanitised: that markup carries no attributes,
 * so the word can only appear in text, never inside a tag.
 */
export function linkAdmetecHtml(html: string): string {
    return html.replace(WORD, `<a href="${ADMETEC_URL}" target="_blank" rel="noopener" class="${LINK_CLASS}">Admetec</a>`);
}
