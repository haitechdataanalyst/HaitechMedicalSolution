import { cn } from "@/lib/utils";

interface SectionCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    iconBg: string;
    iconColor: string;
    children: React.ReactNode;
    noPadding?: boolean;
}

export function SectionCard({ icon: Icon, title, iconBg, iconColor, children, noPadding }: SectionCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", iconBg)}>
                    <Icon className={cn("h-4 w-4", iconColor)} />
                </div>
                <h2 className="text-sm font-bold text-neutral-900">{title}</h2>
            </div>
            <div className={noPadding ? undefined : "p-6"}>{children}</div>
        </div>
    );
}
