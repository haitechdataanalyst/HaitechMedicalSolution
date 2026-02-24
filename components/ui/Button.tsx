import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { SpinnerIcon } from "@/components/icons";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "solid";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-outline",
        ghost: "btn-ghost",
        solid: "btn-solid",
    };

    const sizes = {
        sm: "btn-sm",
        md: "btn-md",
        lg: "btn-lg",
    };

    return (
        <button ref={ref} className={cn("btn", variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
            {isLoading && <SpinnerIcon size={16} className="mr-2 -ml-1" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;
