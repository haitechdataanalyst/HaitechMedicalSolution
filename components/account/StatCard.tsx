import { cn } from "@/lib/utils";

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
        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
            <div className={cn("mb-3 inline-flex rounded-xl p-2.5", iconBg)}>
                <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-neutral-500">{label}</p>
            {sub && <p className="text-[10px] text-neutral-400">{sub}</p>}
        </div>
    );
}
