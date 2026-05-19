import { cn } from "@/lib/utils";

interface FormFieldProps {
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    hint?: string;
    className?: string;
}

export function FormField({ label, value, type = "text", placeholder, onChange, readOnly, hint, className }: FormFieldProps) {
    return (
        <div className={className}>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-700">{label}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                readOnly={readOnly}
                onChange={(e) => onChange?.(e.target.value)}
                className={cn(
                    "w-full rounded-xl border px-3 py-2.5 text-sm transition-all",
                    readOnly
                        ? "cursor-default border-neutral-100 bg-neutral-50 text-neutral-500"
                        : "border-neutral-200 bg-white text-neutral-800 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                )}
            />
            {hint && <p className="mt-1 text-[10px] text-neutral-400">{hint}</p>}
        </div>
    );
}
