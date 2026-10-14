"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ElementType, ReactNode, RefObject } from "react";

// Scroll motion for the About page. Everything here is transform/opacity only, runs on one
// rAF-throttled passive listener, and collapses to the plain static page under reduced motion.

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const REVEAL_MS = 900;
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function subscribeReducedMotion(onChange: () => void) {
    const query = window.matchMedia(REDUCED_QUERY);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
}

export function useReducedMotion(): boolean {
    return useSyncExternalStore(
        subscribeReducedMotion,
        () => window.matchMedia(REDUCED_QUERY).matches,
        () => false
    );
}

/** True once the element has scrolled into view (and stays true). Always true under reduced motion. */
function useInView(ref: RefObject<HTMLElement | null>, disabled: boolean): boolean {
    const [seen, setSeen] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || disabled) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setSeen(true);
                observer.disconnect();
            },
            { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, disabled]);
    return seen || disabled;
}

/**
 * Runs `apply` on every animation frame while the page scrolls or resizes.
 * `reset` undoes the inline styles `apply` wrote — needed because hydration first assumes motion is
 * allowed, so a reduced-motion visitor's effect starts once and must then be cleanly switched off.
 */
function useScrollFrame(apply: () => void, enabled: boolean, reset?: () => void) {
    const applyRef = useRef(apply);
    const resetRef = useRef(reset);
    useEffect(() => {
        applyRef.current = apply;
        resetRef.current = reset;
    });
    useEffect(() => {
        if (!enabled) {
            resetRef.current?.();
            return;
        }
        let frame = 0;
        const run = () => {
            frame = 0;
            applyRef.current();
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(run);
        };
        run();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [enabled]);
}

// Progress 0 → 1 while an element travels from 85% down the viewport to 40% down the viewport.
const PROGRESS_START = 0.85;
const PROGRESS_END = 0.4;

function elementProgress(el: HTMLElement): number {
    const { top, height } = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp01((vh * PROGRESS_START - top) / (vh * (PROGRESS_START - PROGRESS_END) + height));
}

// ── Reveal: fade + rise (or gentle scale) once, as the element enters ───────────────────────

const HIDDEN_TRANSFORM = {
    up: "translate3d(0, 28px, 0)",
    scale: "translate3d(0, 20px, 0) scale(0.96)",
} as const;

interface RevealProps {
    children: ReactNode;
    delay?: number;
    variant?: keyof typeof HIDDEN_TRANSFORM;
    as?: ElementType;
    className?: string;
}

export function Reveal({ children, delay = 0, variant = "up", as: Tag = "div", className }: RevealProps) {
    const ref = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();
    const visible = useInView(ref, reduced);

    return (
        <Tag
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : HIDDEN_TRANSFORM[variant],
                transition: reduced ? undefined : `opacity ${REVEAL_MS}ms ${EASE} ${delay}ms, transform ${REVEAL_MS}ms ${EASE} ${delay}ms`,
                willChange: visible ? undefined : "opacity, transform",
            }}
        >
            {children}
        </Tag>
    );
}

/** Headline that slides up out of a mask, one line at a time. */
export function MaskReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const reduced = useReducedMotion();
    const visible = useInView(ref, reduced);

    return (
        // Bottom padding + negative margin keeps descenders from being clipped by the mask
        <span ref={ref} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span
                className="block"
                style={{
                    transform: visible ? "none" : "translate3d(0, 110%, 0)",
                    transition: reduced ? undefined : `transform 1100ms ${EASE} ${delay}ms`,
                }}
            >
                {children}
            </span>
        </span>
    );
}

// ── Hero: content drifts, shrinks and fades as you scroll away; the glow lags behind ────────

export function HeroScene({ children, contentClassName }: { children: ReactNode; contentClassName?: string }) {
    const sceneRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    useScrollFrame(
        () => {
            const scene = sceneRef.current;
            if (!scene) return;
            const p = clamp01(window.scrollY / (scene.offsetHeight || 1));
            if (contentRef.current) {
                contentRef.current.style.transform = `translate3d(0, ${p * 56}px, 0) scale(${1 - p * 0.06})`;
                contentRef.current.style.opacity = String(1 - clamp01(p * 1.15));
            }
            if (glowRef.current) glowRef.current.style.transform = `translate3d(0, ${p * 140}px, 0)`;
        },
        !reduced,
        () => {
            for (const el of [contentRef.current, glowRef.current]) {
                if (!el) continue;
                el.style.transform = "";
                el.style.opacity = "";
            }
        }
    );

    return (
        <section ref={sceneRef} className="relative overflow-hidden bg-white">
            <div
                ref={glowRef}
                aria-hidden="true"
                className="pointer-events-none absolute -top-44 -right-[12%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,var(--color-primary-100),transparent)] opacity-80"
            />
            <div ref={contentRef} className={contentClassName} style={{ transformOrigin: "left top" }}>
                {children}
            </div>
        </section>
    );
}

// ── Statement text: words light up one after another as you scroll through it ──────────────

const DIM_OPACITY = 0.2;
const WORD_WINDOW = 5;

export function ScrollWords({ text, className }: { text: string; className?: string }) {
    const ref = useRef<HTMLParagraphElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const words = useMemo(() => text.split(" "), [text]);
    const reduced = useReducedMotion();

    useScrollFrame(
        () => {
            const el = ref.current;
            if (!el) return;
            const p = elementProgress(el);
            const total = words.length;
            wordRefs.current.forEach((word, i) => {
                if (!word) return;
                const lit = clamp01((p * (total + WORD_WINDOW) - i) / WORD_WINDOW);
                word.style.opacity = String(DIM_OPACITY + (1 - DIM_OPACITY) * lit);
            });
        },
        !reduced,
        () => {
            wordRefs.current.forEach((word) => {
                if (word) word.style.opacity = "";
            });
        }
    );

    return (
        <p ref={ref} className={className} aria-label={text}>
            {words.map((word, i) => (
                <span
                    key={`${word}-${i}`}
                    aria-hidden="true"
                    ref={(node) => {
                        wordRefs.current[i] = node;
                    }}
                >
                    {word}
                    {i < words.length - 1 ? " " : ""}
                </span>
            ))}
        </p>
    );
}

// ── Timeline rail: a line that draws itself down the list as you read ───────────────────────

export function ScrollRail({ children, className }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const reduced = useReducedMotion();

    useScrollFrame(
        () => {
            if (ref.current && fillRef.current) fillRef.current.style.transform = `scaleY(${elementProgress(ref.current)})`;
        },
        !reduced,
        () => {
            if (fillRef.current) fillRef.current.style.transform = "scaleY(1)";
        }
    );

    return (
        <div ref={ref} className={`relative pl-8 ${className ?? ""}`}>
            <span aria-hidden="true" className="absolute top-7 bottom-7 left-0 w-px bg-neutral-900/10" />
            <span ref={fillRef} aria-hidden="true" className="bg-primary-700 absolute top-7 bottom-7 left-0 w-px origin-top" style={{ transform: reduced ? "scaleY(1)" : "scaleY(0)" }} />
            {children}
        </div>
    );
}

// ── Numbers count up once, when they scroll into view ───────────────────────────────────────

const COUNT_MS = 1600;

export function CountUp({ value, className }: { value: string; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const el = ref.current;
        const match = /^(\d+)(.*)$/.exec(value);
        if (!el || !match || reduced) return;

        const target = Number(match[1]);
        const suffix = match[2];
        let frame = 0;
        el.textContent = `0${suffix}`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const startedAt = performance.now();
                const tick = (now: number) => {
                    const t = clamp01((now - startedAt) / COUNT_MS);
                    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                    el.textContent = `${Math.round(target * eased)}${suffix}`;
                    if (t < 1) frame = requestAnimationFrame(tick);
                };
                frame = requestAnimationFrame(tick);
            },
            { threshold: 0.6 }
        );
        observer.observe(el);

        return () => {
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
            el.textContent = value;
        };
    }, [value, reduced]);

    return (
        <span ref={ref} className={className}>
            {value}
        </span>
    );
}
