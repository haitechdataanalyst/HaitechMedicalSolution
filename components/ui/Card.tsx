import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import ImageWithFallback from "./ImageWithFallback";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    /** "dark" uses a tinted border/fill instead of a drop-shadow, for cards placed on a dark or gradient surface. Shares the same radius token either way. */
    tone?: "light" | "dark";
}

export default function Card({ children, className, hover = false, tone = "light", ...rest }: CardProps) {
    return (
        <div className={cn(tone === "dark" ? "card-dark" : "card", hover && "card-hover", className)} {...rest}>
            {children}
        </div>
    );
}

interface CardImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function CardImage({ src, alt, className }: CardImageProps) {
    return (
        <div className="overflow-hidden">
            <ImageWithFallback
                src={src}
                alt={alt}
                containerClassName={cn("aspect-square transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]", className)}
            />
        </div>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return <div className={cn("p-4 md:p-5", className)}>{children}</div>;
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
    return <h3 className={cn("text-[17px] leading-snug font-semibold tracking-[-0.015em] text-neutral-900", className)}>{children}</h3>;
}

interface CardDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
    return <p className={cn("mt-1 text-sm leading-relaxed text-neutral-500", className)}>{children}</p>;
}
