import { forwardRef, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || props.name;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={selectId} className="form-label">
                    {label}
                    {props.required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    className={cn("form-input cursor-pointer appearance-none pr-11", error && "form-input-error", className)}
                    aria-describedby={errorId}
                    aria-invalid={error ? "true" : undefined}
                    {...props}
                >
                    <option value="">Select an option</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
            </div>
            {error && (
                <p id={errorId} className="form-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

Select.displayName = "Select";

export default Select;
