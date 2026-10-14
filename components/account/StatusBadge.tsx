import { cn } from "@/lib/utils";
import { OrderStatus, STATUS_CONFIG } from "@/lib/mock-account";

type Size = "sm" | "md" | "lg";

// Quiet tinted pills. Nothing below 12px so the status stays readable.
const SIZE: Record<Size, string> = {
    sm: "gap-1.5 px-2 py-0.5 text-xs",
    md: "gap-1.5 px-2.5 py-1 text-xs",
    lg: "gap-1.5 px-3 py-1 text-[13px]",
};

export function StatusBadge({ status, size = "md" }: { status: OrderStatus; size?: Size }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={cn("inline-flex items-center rounded-full font-medium whitespace-nowrap", SIZE[size], cfg.bg, cfg.text)}>
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
        </span>
    );
}
