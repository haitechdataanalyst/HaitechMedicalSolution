import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { PILL_ON_DARK } from "@/components/ui/surfaces";
import SectionHeader from "./SectionHeader";
import { CountUp } from "@/components/about/motion";

const stats: { value: string; label: string }[] = [
    { value: "6+", label: "Global Brands" },
    { value: "1500+", label: "Workshops & Conferences Supported" },
    { value: "30+", label: "Active Partnerships" },
    { value: "15+", label: "Years of Excellence" },
];

export default function WhySection() {
    return (
        <section className="bg-white">
            <div className="container py-16 md:py-24">
                <ScrollReveal variant="scale">
                    {/* One calm panel: the figures are the content, the surface only frames them. */}
                    <div className="bg-navy-gradient rounded-3xl px-6 py-12 md:px-14 md:py-16 lg:px-20 lg:py-20">
                        <SectionHeader
                            tone="dark"
                            title="Why Choose Haitech Medical?"
                            subtitle="Trusted by dental professionals across India for over a decade of clinical excellence, now expanding our reach globally."
                        />

                        {/* Every figure starts on the same line and every label gets the same room, so the row reads as one set. */}
                        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-4 lg:gap-x-10">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex flex-col items-start">
                                    <dt className="text-navy-200 mt-3 max-w-[22ch] text-[15px] leading-snug md:text-base">{stat.label}</dt>
                                    <dd className="order-first text-[2rem] leading-none font-semibold tracking-[-0.035em] text-white tabular-nums min-[360px]:text-[2.5rem] sm:text-[3rem] md:text-[4.25rem]">
                                        <CountUp value={stat.value} />
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-12 md:mt-16">
                            <Link href="/support/contact" className={PILL_ON_DARK}>
                                Request a Quote
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
