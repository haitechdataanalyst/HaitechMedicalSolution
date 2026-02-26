"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScrollToTopButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: "sm" | "md" | "lg";
    iconOnly?: boolean;
    label?: string;
}

const ScrollToTopButton = forwardRef<HTMLButtonElement, ScrollToTopButtonProps>(({ size = "md", iconOnly = false, label = "Up", className, onClick, ...props }, ref) => {
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClick?.(event);
    };

    return (
        <button
            ref={ref}
            type="button"
            onClick={handleClick}
            className={cn(
                "btn btn-solid inline-flex items-center justify-center gap-2 rounded-lg transition-colors",
                sizes[size],
                iconOnly && "px-2!",
                className
            )}
            {...props}
        >
            <ArrowUp size={iconSizes[size]} aria-hidden="true" />
            {!iconOnly && <span>{label}</span>}
        </button>
    );
});

ScrollToTopButton.displayName = "ScrollToTopButton";

export default ScrollToTopButton;
