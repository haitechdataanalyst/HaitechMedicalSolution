import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { BrandSection } from "@/components/brand/BrandSections";
import { PILL_PRIMARY } from "@/components/ui/surfaces";
import ScrollReveal from "@/components/ui/ScrollReveal";

export interface BrandHighlight {
    title: string;
    text: string;
}

/**
 * One "About the brand" block in place of a pillar grid and a separate partnership band: the brand's story and what sets
 * it apart on one side, Haitech's role as its distributor on the other. Every word comes from the page that uses it.
 */
export function BrandAbout({
    brand,
    title,
    eyebrow = "About the brand",
    children,
    highlights,
    media,
}: {
    brand: string;
    title: ReactNode;
    eyebrow?: string;
    /** The brand's story, as paragraphs. */
    children?: ReactNode;
    /** What sets the brand apart: short title + line pairs, set as a quiet two-column list rather than a card grid. */
    highlights?: BrandHighlight[];
    /** Optional visual above the Haitech card. */
    media?: ReactNode;
}) {
    return (
        <BrandSection tone="gray">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16">
                <ScrollReveal variant="fade">
                    <div>
                        <p className="text-primary-700 mb-2 text-[15px] font-medium">{eyebrow}</p>
                        <h2 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl">{title}</h2>
                        {children && <div className="mt-5 space-y-5 text-base leading-relaxed text-neutral-600 md:text-lg">{children}</div>}
                        {highlights && highlights.length > 0 && (
                            <dl className="mt-8 grid gap-x-8 gap-y-6 border-t border-neutral-900/[0.08] pt-8 sm:grid-cols-2">
                                {highlights.map((item) => (
                                    <div key={item.title}>
                                        <dt className="text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">{item.title}</dt>
                                        <dd className="mt-1 text-[15px] leading-relaxed text-neutral-600">{item.text}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </ScrollReveal>

                <ScrollReveal variant="scale" delay={80}>
                    <div className="space-y-5">
                        {media}
                        <div className="rounded-3xl bg-white p-6 ring-1 ring-neutral-900/[0.04] md:p-8">
                            <Image src="/brand/haitech/mark.png" alt="Haitech Medical" width={40} height={40} />
                            <p className="text-primary-700 mt-5 text-[15px] font-medium">Authorized distribution partner</p>
                            <h3 className="mt-1 text-[1.375rem] leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-2xl">Backed by Haitech Medical Solutions</h3>
                            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                                Haitech Medical Solutions brings {brand} to dental professionals across India — with local stock, service, warranty support, and a team that knows the equipment inside
                                out.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link href="/support/contact" className={PILL_PRIMARY}>
                                    Request a quote
                                </Link>
                                <Link
                                    href="/about"
                                    className="group text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    Learn more about Haitech
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </BrandSection>
    );
}
