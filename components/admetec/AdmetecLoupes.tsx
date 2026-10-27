import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionHeader from "@/components/misc/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";

export interface LoupeSeries {
    name: string;
    description: string;
    /** The magnifications in the series, as text: the series card is one link, so these are not links themselves. */
    mags: string;
    image: string;
    href: string;
    cta?: string;
}

/**
 * Every loupe series on one screen: one card each, the whole card a link to that series' page. Replaces a tall section
 * per series, so a clinician compares the range at a glance instead of scrolling through it. Children (the Ergo V
 * magnification chooser) continue the same section below the cards.
 */
export function AdmetecLoupes({ series, children }: { series: LoupeSeries[]; children?: ReactNode }) {
    return (
        <section id="loupes" className="scroll-mt-24 bg-white">
            <div className="section container">
                <SectionHeader title="Choose your loupes." subtitle="From a wide everyday field to higher power and adjustable magnification." />
                {/* A phone gets one row to swipe, with the next card peeking in; from md up they sit in a grid. */}
                <ul className="-mx-[var(--container-padding)] flex snap-x snap-mandatory scroll-pl-[var(--container-padding)] [scrollbar-width:none] gap-4 overflow-x-auto px-[var(--container-padding)] pb-3 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
                    {series.map((item, i) => (
                        <li key={item.name} className="flex w-[78%] shrink-0 snap-start md:w-auto">
                            <ScrollReveal variant="scale" delay={i * 70} className="flex w-full">
                                <Link href={item.href} className={`${INTERACTIVE_CARD} w-full`}>
                                    <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-neutral-50">
                                        <Image
                                            src={item.image}
                                            alt={`Admetec ${item.name}`}
                                            fill
                                            sizes="(min-width: 768px) 30vw, 78vw"
                                            className="object-contain p-5 mix-blend-multiply transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-5 md:p-6">
                                        <h3 className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">{item.name}</h3>
                                        <p className="mt-1 text-[15px] font-medium text-neutral-900 tabular-nums">{item.mags}</p>
                                        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{item.description}</p>
                                        <span className="text-primary-700 mt-auto inline-flex items-center gap-1 pt-4 text-[15px] font-medium">
                                            {item.cta ?? "Explore series"}
                                            <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                        </span>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        </li>
                    ))}
                </ul>
                {children && <div className="mt-14 md:mt-20">{children}</div>}
            </div>
        </section>
    );
}
