import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    const errorId = error ? `${inputId}-error` : undefined;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="form-label">
                    {label}
                    {props.required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                className={cn("form-input", error && "form-input-error", className)}
                aria-describedby={errorId}
                aria-invalid={error ? "true" : undefined}
                {...props}
            />
            {error && (
                <p id={errorId} className="form-error" role="alert" aria-live="polite">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
