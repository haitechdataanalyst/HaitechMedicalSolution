import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";

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
        <section className={cn(SURFACE_CARD, "overflow-hidden")}>
            <div className="flex items-center gap-3 px-6 pt-6 pb-1 md:px-7">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", iconBg)}>
                    <Icon className={cn("h-4 w-4", iconColor)} aria-hidden="true" />
                </span>
                <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">{title}</h2>
            </div>
            <div className={noPadding ? "pt-3" : "px-6 pt-5 pb-6 md:px-7 md:pb-7"}>{children}</div>
        </section>
    );
}
