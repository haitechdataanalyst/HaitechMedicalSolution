interface AccountPageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function AccountPageHeader({ title, subtitle, action }: AccountPageHeaderProps) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
                <h1 className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.025em] text-neutral-900 md:text-4xl">{title}</h1>
                {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-neutral-500 md:text-base">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
