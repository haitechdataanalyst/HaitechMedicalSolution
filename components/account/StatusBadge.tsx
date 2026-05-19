import { cn } from "@/lib/utils";
import { OrderStatus, STATUS_CONFIG } from "@/lib/mock-account";

type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, string> = {
    sm: "gap-1   px-2   py-0.5 text-[10px]",
    md: "gap-1.5 px-2.5 py-1   text-[11px]",
    lg: "gap-1.5 px-3   py-1   text-xs",
};

export function StatusBadge({ status, size = "md" }: { status: OrderStatus; size?: Size }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={cn("inline-flex items-center rounded-full border font-semibold", SIZE[size], cfg.bg, cfg.text, cfg.border)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
        </span>
    );
}
