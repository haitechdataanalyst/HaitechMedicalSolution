interface BannerProps {
    title: string;
    description?: string;
    label?: string;
}

export default function Banner({ title, description, label }: BannerProps) {
    return (
        <section className="bg-brand-gradient relative overflow-hidden text-white">
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-primary-400/10 blur-2xl" />

            <div className="section-lg container relative">
                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    {label && (
                        <span className="label-tag label-tag-white mb-5 inline-flex">{label}</span>
                    )}
                    <h1 className="heading-1 mb-5">{title}</h1>
                    {description && (
                        <p className="text-body-lg text-white/80">{description}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
