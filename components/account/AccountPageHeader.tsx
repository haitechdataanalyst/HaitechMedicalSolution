interface AccountPageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function AccountPageHeader({ title, subtitle, action }: AccountPageHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
                {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
