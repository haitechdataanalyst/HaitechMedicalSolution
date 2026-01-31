import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  title: string;
  children: ReactNode;
  variant?: "default" | "primary" | "light";
  icon?: ReactNode;
  className?: string;
}

export function AboutSection({
  title,
  children,
  variant = "default",
  icon,
  className,
}: AboutSectionProps) {
  const variants = {
    default: "bg-white",
    primary: "bg-primary-gradient text-white",
    light: "bg-neutral-50",
  };

  const titleColors = {
    default: "text-foreground",
    primary: "text-white",
    light: "text-foreground",
  };

  const textColors = {
    default: "text-muted",
    primary: "text-primary-100",
    light: "text-muted",
  };

  return (
    <section className={cn("section", variants[variant], className)}>
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {icon && (
            <div className="flex justify-center mb-6">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center",
                  variant === "primary"
                    ? "bg-white/20"
                    : "bg-primary-100 text-primary-600"
                )}
              >
                {icon}
              </div>
            </div>
          )}
          <h2 className={cn("heading-2 mb-6", titleColors[variant])}>{title}</h2>
          <div className={cn("text-body-lg leading-relaxed", textColors[variant])}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
