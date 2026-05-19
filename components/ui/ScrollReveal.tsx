"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "fade" | "left" | "right" | "scale";

interface ScrollRevealProps {
    children: React.ReactNode;
    variant?: RevealVariant;
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
}

const initialTransforms: Record<RevealVariant, string> = {
    up: "translateY(36px)",
    fade: "translateY(0)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    scale: "scale(0.93) translateY(16px)",
};

export default function ScrollReveal({
    children,
    variant = "up",
    delay = 0,
    duration = 650,
    className,
    threshold = 0.08,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin: "0px 0px -40px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={cn(className)}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : initialTransforms[variant],
                transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                willChange: visible ? "auto" : "opacity, transform",
            }}
        >
            {children}
        </div>
    );
}
