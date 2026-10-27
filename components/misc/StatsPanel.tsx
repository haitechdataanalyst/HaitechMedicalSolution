import type { ReactNode } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { CountUp } from "@/components/about/motion";
import SectionHeader from "./SectionHeader";

export interface Stat {
    value: string;
    label: string;
    /** A figure that is a date or a name, not a count: shown as is, without counting up. */
    fixed?: boolean;
}

/**
 * A set of headline figures on one calm rounded panel. The figures are the content; the surface only frames them.
 * Every figure starts on the same line and every label gets the same room, so the row reads as one set.
 */
export default function StatsPanel({ title, subtitle, stats, children, id }: { title: string; subtitle?: ReactNode; stats: Stat[]; children?: ReactNode; id?: string }) {
    return (
        <section id={id} className="scroll-mt-32 bg-white">
            <div className="container py-16 md:py-24">
                <ScrollReveal variant="scale">
                    <div className="bg-navy-gradient rounded-3xl px-6 py-12 md:px-14 md:py-16 lg:px-20 lg:py-20">
                        <SectionHeader tone="dark" title={title} subtitle={subtitle} />

                        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-4 lg:gap-x-10">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex flex-col items-start">
                                    <dt className="text-navy-200 mt-3 max-w-[22ch] text-[15px] leading-snug md:text-base">{stat.label}</dt>
                                    <dd className="order-first text-[2rem] leading-none font-semibold tracking-[-0.035em] text-white tabular-nums min-[360px]:text-[2.5rem] sm:text-[3rem] md:text-[4.25rem]">
                                        {stat.fixed ? stat.value : <CountUp value={stat.value} />}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {children && <div className="mt-12 md:mt-16">{children}</div>}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
