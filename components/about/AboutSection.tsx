import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
    title: string;
    children: ReactNode;
    variant?: "default" | "primary" | "light";
    icon?: ReactNode;
    className?: string;
}

export function AboutSection({ title, children, variant = "default", icon, className }: AboutSectionProps) {
    const variants = {
        default: "bg-white",
        primary: "bg-brand-gradient text-white",
        light: "bg-neutral-50",
    };

    const titleColors = {
        default: "text-neutral-900",
        primary: "text-white",
        light: "text-neutral-900",
    };

    const textColors = {
        default: "text-neutral-500",
        primary: "text-white/85",
        light: "text-neutral-500",
    };

    const iconBg = {
        default: "bg-primary-50 text-primary-600",
        primary: "bg-white/15 text-white",
        light: "bg-primary-50 text-primary-600",
    };

    return (
        <section className={cn("section", variants[variant], className)}>
            <div className="container">
                <div className="mx-auto max-w-4xl text-center">
                    {icon && (
                        <div className="mb-6 flex justify-center">
                            <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl", iconBg[variant])}>
                                {icon}
                            </div>
                        </div>
                    )}
                    <h2 className={cn("heading-2 mb-6", titleColors[variant])}>{title}</h2>
                    <div className={cn("text-body-lg leading-relaxed", textColors[variant])}>{children}</div>
                </div>
            </div>
        </section>
    );
}
