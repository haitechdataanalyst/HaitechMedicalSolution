interface BannerProps {
    title: string;
    description?: string;
    label?: string;
}

export default function Banner({ title, description, label }: BannerProps) {
    return (
        <section className="bg-brand-gradient relative overflow-hidden text-white">
            <div className="section-lg container relative">
                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    {label && (
                        <span className="label-tag label-tag-white mb-5">{label}</span>
                    )}
                    <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance md:text-5xl">{title}</h1>
                    {description && (
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-pretty text-white/80 md:text-lg">{description}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
