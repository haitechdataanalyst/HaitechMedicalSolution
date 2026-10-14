"use client";

/**
 * Progressive disclosure that never removes content.
 *
 * The server HTML always contains every line, item and row. What is hidden
 * while collapsed is decided by data attributes plus CSS in globals.css
 * ("Progressive disclosure"), so the collapsed layout is correct on first
 * paint (no layout shift) and everything stays readable without JavaScript.
 * Whether a toggle is needed is decided from the data (text length, item
 * count) per breakpoint, never by measuring after load.
 */
import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { flushSync } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Responsive } from "@/types";

const DURATION_MS = 200;

type MoreAttrs = Record<"data-more-base" | "data-more-sm" | "data-more-lg", "on" | "off">;

function moreAttrs(more: Responsive<boolean>): MoreAttrs {
    return {
        "data-more-base": more.base ? "on" : "off",
        "data-more-sm": more.sm ? "on" : "off",
        "data-more-lg": more.lg ? "on" : "off",
    };
}

/** Attributes that hide item `index` at the breakpoints where it lies beyond the visible limit. */
export function hideAttrs(index: number, limit: Responsive<number>): Record<string, string> {
    return {
        ...(index >= limit.base ? { "data-xp-hide-base": "" } : {}),
        ...(index >= limit.sm ? { "data-xp-hide-sm": "" } : {}),
        ...(index >= limit.lg ? { "data-xp-hide-lg": "" } : {}),
    };
}

function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateHeight(el: HTMLElement, from: number, to: number): Animation {
    return el.animate(
        [
            { height: `${from}px`, overflow: "hidden" },
            { height: `${to}px`, overflow: "hidden" },
        ],
        { duration: DURATION_MS, easing: "ease-out" }
    );
}

/**
 * Open/close state with a 200 ms height animation (skipped for reduced
 * motion), scroll-back after "Show less", and deep-link opening when the URL
 * hash equals hashId (the root id, or an enclosing section's id).
 */
function useExpandable(hashId: string) {
    const [expanded, setExpanded] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const openFromHash = () => {
            if (decodeURIComponent(window.location.hash.slice(1)) !== hashId) return;
            setExpanded(true);
            requestAnimationFrame(() => document.getElementById(hashId)?.scrollIntoView({ block: "start" }));
        };
        openFromHash();
        window.addEventListener("hashchange", openFromHash);
        return () => window.removeEventListener("hashchange", openFromHash);
    }, [hashId]);

    const toggle = useCallback(() => {
        const el = rootRef.current;
        if (!el) {
            setExpanded((value) => !value);
            return;
        }
        const reduce = prefersReducedMotion();
        const from = el.offsetHeight;

        if (!expanded) {
            flushSync(() => setExpanded(true));
            if (!reduce) animateHeight(el, from, el.offsetHeight);
            return;
        }

        // Measure the collapsed height without showing it, shrink to it, then collapse.
        el.dataset.state = "collapsed";
        const to = el.offsetHeight;
        el.dataset.state = "expanded";

        const finish = () => {
            flushSync(() => setExpanded(false));
            // Scroll back only when the section's top is hidden under the sticky header (its scroll-margin-top).
            const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
            if (el.getBoundingClientRect().top < offset) {
                el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
            }
        };
        if (reduce) {
            finish();
            return;
        }
        animateHeight(el, from, to).finished.then(finish, finish);
    }, [expanded]);

    return { expanded, toggle, rootRef, state: expanded ? "expanded" : "collapsed" };
}

interface ExpandToggleProps {
    expanded: boolean;
    controls: string;
    onClick: () => void;
    moreLabel: string;
    lessLabel: string;
}

function ExpandToggle({ expanded, controls, onClick, moreLabel, lessLabel }: ExpandToggleProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={expanded}
            aria-controls={controls}
            className="xp-toggle text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 mt-1 min-h-11 items-center gap-1 rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            {expanded ? lessLabel : moreLabel}
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200 ease-out", expanded && "rotate-180")} aria-hidden="true" />
        </button>
    );
}

function Fade() {
    return <span className="xp-fade pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[var(--color-surface,#fff)]" aria-hidden="true" />;
}

// ── Text ──────────────────────────────────────────────────────────────────────

interface ExpandableTextProps {
    /** Root id; also the deep-link hash that opens it. */
    id: string;
    children: ReactNode;
    /** Plain-text length used to decide, per breakpoint, whether "Read more" is needed. */
    textLength: number;
    lines: Responsive<number>;
    readMoreMinChars: Responsive<number>;
    className?: string;
    moreLabel?: string;
    lessLabel?: string;
}

export function ExpandableText({ id, children, textLength, lines, readMoreMinChars, className, moreLabel = "Read more", lessLabel = "Show less" }: ExpandableTextProps) {
    const { expanded, toggle, rootRef, state } = useExpandable(id);
    const more = { base: textLength > readMoreMinChars.base, sm: textLength > readMoreMinChars.sm, lg: textLength > readMoreMinChars.lg };
    const style = { "--xp-lines-base": lines.base, "--xp-lines-sm": lines.sm, "--xp-lines-lg": lines.lg } as CSSProperties;

    return (
        <div id={id} ref={rootRef} data-state={state} {...moreAttrs(more)} style={style} className="xp xp-text">
            <div id={`${id}-body`} className="relative">
                <p className={cn("xp-clamp", className)}>{children}</p>
                <Fade />
            </div>
            <ExpandToggle expanded={expanded} controls={`${id}-body`} onClick={toggle} moreLabel={moreLabel} lessLabel={lessLabel} />
        </div>
    );
}

// ── List ──────────────────────────────────────────────────────────────────────

interface ExpandableListProps {
    id: string;
    items: ReactNode[];
    visible: Responsive<number>;
    ordered?: boolean;
    listClassName?: string;
    itemClassName?: string;
    moreLabel: string;
    lessLabel: string;
}

export function ExpandableList({ id, items, visible, ordered = false, listClassName, itemClassName, moreLabel, lessLabel }: ExpandableListProps) {
    const { expanded, toggle, rootRef, state } = useExpandable(id);
    const more = { base: items.length > visible.base, sm: items.length > visible.sm, lg: items.length > visible.lg };
    const ListTag = ordered ? "ol" : "ul";

    return (
        <div id={id} ref={rootRef} data-state={state} {...moreAttrs(more)} className="xp">
            <div id={`${id}-body`} className="relative">
                <ListTag className={listClassName}>
                    {items.map((item, index) => (
                        <li key={index} className={itemClassName} {...hideAttrs(index, visible)}>
                            {item}
                        </li>
                    ))}
                </ListTag>
                <Fade />
            </div>
            <ExpandToggle expanded={expanded} controls={`${id}-body`} onClick={toggle} moreLabel={moreLabel} lessLabel={lessLabel} />
        </div>
    );
}

// ── Table ─────────────────────────────────────────────────────────────────────

interface ExpandableTableProps {
    id: string;
    /** URL hash that opens the table; defaults to id. Use the enclosing section id when it carries the heading. */
    hashId?: string;
    /** <tr> elements, in display order. */
    rows: ReactElement<Record<string, unknown>>[];
    visibleRows: number;
    tableClassName?: string;
    frameClassName?: string;
    /** Always-visible content directly under the table (e.g. a footnote). */
    footer?: ReactNode;
    moreLabel: string;
    lessLabel: string;
}

export function ExpandableTable({ id, hashId, rows, visibleRows, tableClassName, frameClassName, footer, moreLabel, lessLabel }: ExpandableTableProps) {
    const { expanded, toggle, rootRef, state } = useExpandable(hashId ?? id);
    const limit = { base: visibleRows, sm: visibleRows, lg: visibleRows };
    const hasMore = rows.length > visibleRows;
    const rowElements = Children.toArray(rows).filter(isValidElement) as ReactElement<Record<string, unknown>>[];

    return (
        <div id={id} ref={rootRef} data-state={state} {...moreAttrs({ base: hasMore, sm: hasMore, lg: hasMore })} className="xp">
            <div id={`${id}-body`} className={cn("relative", frameClassName)}>
                <table className={tableClassName}>
                    <tbody>{rowElements.map((row, index) => cloneElement(row, hideAttrs(index, limit)))}</tbody>
                </table>
                <Fade />
            </div>
            {footer}
            <ExpandToggle expanded={expanded} controls={`${id}-body`} onClick={toggle} moreLabel={moreLabel} lessLabel={lessLabel} />
        </div>
    );
}
