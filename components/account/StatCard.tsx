import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    value: string | number;
    label: string;
    sub?: string;
}

export function StatCard({ icon: Icon, iconBg, iconColor, value, label, sub }: StatCardProps) {
    return (
        <div className={cn(SURFACE_CARD, "flex flex-col p-5")}>
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-neutral-600">{label}</p>
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", iconBg)}>
                    <Icon className={cn("h-4 w-4", iconColor)} aria-hidden="true" />
                </span>
            </div>
            <p className="mt-3 text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-neutral-900 tabular-nums">{value}</p>
            {sub && <p className="mt-2 text-[13px] text-neutral-500">{sub}</p>}
        </div>
    );
}
