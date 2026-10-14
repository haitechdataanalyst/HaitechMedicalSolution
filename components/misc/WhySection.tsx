import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { PILL_ON_DARK } from "@/components/ui/surfaces";
import SectionHeader from "./SectionHeader";

const stats: { value: string; label: string }[] = [
    { value: "6+", label: "Global Brands" },
    { value: "1500+", label: "Workshops & Conferences Supported" },
    { value: "30+", label: "Active Partnerships" },
    { value: "15+", label: "Years of Excellence" },
];

export default function WhySection() {
    return (
        <section className="bg-navy-gradient">
            <div className="section container">
                <ScrollReveal variant="fade">
                    <SectionHeader
                        tone="dark"
                        title="Why Choose Haitech Medical?"
                        subtitle="Trusted by dental professionals across India for over a decade of clinical excellence, now expanding our reach globally."
                    />
                </ScrollReveal>

                {/* The numbers are the story — large, tight, no boxes or icons competing with them */}
                <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col-reverse">
                            <dt className="text-navy-200 mt-2 max-w-[16ch] text-[15px] leading-snug">{stat.label}</dt>
                            <dd className="text-5xl leading-none font-semibold tracking-[-0.03em] text-white tabular-nums md:text-6xl">{stat.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-12 md:mt-14">
                    <Link href="/support/contact" className={PILL_ON_DARK}>
                        Request a Quote
                    </Link>
                </div>
            </div>
        </section>
    );
}
