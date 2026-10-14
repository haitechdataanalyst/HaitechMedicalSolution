import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || props.name;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={textareaId} className="form-label">
                    {label}
                    {props.required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                className={cn("form-input min-h-32 resize-y leading-relaxed", error && "form-input-error", className)}
                rows={4}
                aria-describedby={errorId}
                aria-invalid={error ? "true" : undefined}
                {...props}
            />
            {error && (
                <p id={errorId} className="form-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

Textarea.displayName = "Textarea";

export default Textarea;
