import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ImageWithFallback from "./ImageWithFallback";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return <div className={cn("card", hover && "card-hover", className)}>{children}</div>;
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage({ src, alt, className }: CardImageProps) {
  return <ImageWithFallback src={src} alt={alt} containerClassName={cn("aspect-square", className)} />;
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
  return <h3 className={cn("heading-5 text-primary-900 font-bold", className)}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn("text-muted mt-1 text-sm", className)}>{children}</p>;
}
