import AdmetecBrandBadge from "@/components/brand/AdmetecBrandBadge";
import { linkAdmetec } from "@/components/brand/AdmetecText";
import Image from "next/image";
import type { HeadlightCategory, HeadlightProduct } from "@/types";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { cleanText, parseFeatures } from "@/lib/headlight-specs";
import { headlightSku } from "@/lib/headlight-products";
import { HeadlightAddToCart } from "./HeadlightAddToCart";
import { HeadlightCardActions } from "./HeadlightCardActions";

const TONE_BG = { white: "bg-white", gray: "bg-neutral-50" } as const;
const SERIES_H3 = "text-lg font-semibold tracking-[-0.015em] text-neutral-900";

/** The light's own page; the card still reads fine without one (e.g. the catalogue has no Lights category). */
function Actions({ product, href }: { product: HeadlightProduct; href?: string }) {
    return href ? <HeadlightCardActions href={href} name={cleanText(product.name)} sku={headlightSku(product.id)} /> : null;
}

function ModelTitle({ name, href, className }: { name: string; href?: string; className: string }) {
    return (
        <h3 className={className}>
            {href ? (
                <Link href={href} className="hover:text-primary-800 focus-visible:outline-primary-500 rounded focus-visible:outline-2 focus-visible:outline-offset-2">
                    {name}
                </Link>
            ) : (
                name
            )}
        </h3>
    );
}

function ModelCard({ product, href }: { product: HeadlightProduct; href?: string }) {
    const { specs, notes } = parseFeatures(product.features);
    return (
        <article className={cn(SURFACE_CARD, "flex h-full flex-col p-2")}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={product.image}
                    alt={cleanText(product.name)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 600px"
                    className="object-contain p-8 mix-blend-multiply md:p-10"
                />
            </div>
            <div className="flex flex-1 flex-col px-4 pt-6 pb-4 md:px-5">
                <div className="flex-1">
                    <ModelTitle name={cleanText(product.name)} href={href} className="text-xl font-semibold tracking-[-0.02em] text-neutral-900" />
                    {product.bestFor && <p className="bg-primary-50 text-primary-800 mt-3 w-fit rounded-full px-3 py-1 text-[13px] font-medium">Best for: {product.bestFor}</p>}
                    <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{cleanText(product.description)}</p>
                </div>

                {specs.length > 0 && (
                    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-neutral-900/[0.06] pt-5">
                        {specs.map((spec) => (
                            <div key={spec.label}>
                                <dt className="text-[13px] text-neutral-500">{spec.label}</dt>
                                <dd className="mt-0.5 text-[15px] font-medium text-neutral-900">{spec.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}
                {notes.length > 0 && (
                    <ul className="mt-4 space-y-1 text-[13px] leading-relaxed text-neutral-500">
                        {notes.map((note) => (
                            <li key={note}>{note}</li>
                        ))}
                    </ul>
                )}

                <div className="mt-auto space-y-3 pt-6 empty:hidden">
                    <Actions product={product} href={href} />
                    <HeadlightAddToCart product={product} />
                </div>
            </div>
        </article>
    );
}

function AccessoryRow({ product, href }: { product: HeadlightProduct; href?: string }) {
    const { notes } = parseFeatures(product.features);
    return (
        <article className={cn(SURFACE_CARD, "flex items-center gap-5 p-3 pr-6 md:gap-8 md:p-4 md:pr-8")}>
            <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-50 md:w-32">
                <Image src={product.image} alt={cleanText(product.name)} fill sizes="128px" className="object-contain p-3 mix-blend-multiply" />
            </div>
            <div className="min-w-0">
                <p className="text-[13px] font-medium text-neutral-500">Accessory</p>
                <ModelTitle name={cleanText(product.name)} href={href} className={SERIES_H3} />
                <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">{cleanText(product.description)}</p>
                {notes.length > 0 && <p className="mt-1 text-[13px] text-neutral-500">{notes.join(" · ")}</p>}
                {href && (
                    <Link href={href} className="text-primary-700 hover:text-primary-800 mt-2 inline-flex min-h-11 items-center text-[15px] font-medium">
                        View details
                    </Link>
                )}
            </div>
        </article>
    );
}

/** One headlight series (Wireless / Wired): headline, every model with its specs, accessories, benefits and case contents. */
export function HeadlightSeries({ category, tone, paths = {} }: { category: HeadlightCategory; tone: keyof typeof TONE_BG; paths?: Record<string, string> }) {
    const models = category.products.filter((p) => !p.isAccessory);
    const accessories = category.products.filter((p) => p.isAccessory);
    const headingId = `${category.id}-heading`;

    return (
        <section id={category.id} aria-labelledby={headingId} className={cn("scroll-mt-20", TONE_BG[tone])}>
            <div className="section container">
                <ScrollReveal variant="fade">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-primary-700 text-[15px] font-medium">{category.name}</p>
                        <h2 id={headingId} className="mt-2 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl">
                            {category.description}
                        </h2>
                        {/* Admetec requires its logo on every page about its products; a link to #wireless or #wired lands here, below the page heading */}
                        <div className="mt-2 flex justify-center">
                            <AdmetecBrandBadge size="category" />
                        </div>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">{linkAdmetec(cleanText(category.tagline))}</p>
                    </div>
                </ScrollReveal>

                <div className="mt-12 grid gap-5 md:mt-16 md:gap-6 lg:grid-cols-2">
                    {models.map((product, index) => (
                        <ScrollReveal key={product.id} delay={(index % 2) * 90} className="h-full">
                            <ModelCard product={product} href={paths[product.id]} />
                        </ScrollReveal>
                    ))}
                </div>

                {accessories.length > 0 && (
                    <div className="mt-5 grid gap-5 md:mt-6 md:gap-6">
                        {accessories.map((product) => (
                            <ScrollReveal key={product.id}>
                                <AccessoryRow product={product} href={paths[product.id]} />
                            </ScrollReveal>
                        ))}
                    </div>
                )}

                {(category.benefits?.length || category.inTheBox) && (
                    <div className="mt-12 grid gap-5 md:mt-16 md:gap-6 lg:grid-cols-[1.4fr_1fr]">
                        {category.benefits && category.benefits.length > 0 && (
                            <ScrollReveal className="h-full">
                                <div className={cn(SURFACE_CARD, "h-full p-6 md:p-8")}>
                                    <h3 className={cn(SERIES_H3, "mb-5")}>Benefits</h3>
                                    <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                                        {category.benefits.map((benefit) => (
                                            <li key={benefit.title} className="text-sm leading-relaxed text-neutral-600">
                                                <span className="mb-0.5 block text-[15px] font-semibold text-neutral-900">{cleanText(benefit.title)}</span>
                                                {linkAdmetec(cleanText(benefit.text))}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ScrollReveal>
                        )}
                        {category.inTheBox && (
                            <ScrollReveal delay={90} className="h-full">
                                <div className={cn(SURFACE_CARD, "h-full p-6 md:p-8")}>
                                    <h3 className={cn(SERIES_H3, "mb-5")}>What&apos;s in the case</h3>
                                    {category.inTheBox.image && (
                                        <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50">
                                            <Image
                                                src={category.inTheBox.image}
                                                alt={`${category.name} headlight case contents`}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 33vw"
                                                className="object-contain p-4 mix-blend-multiply"
                                            />
                                        </div>
                                    )}
                                    <ul className="space-y-2 text-sm leading-relaxed text-neutral-700">
                                        {category.inTheBox.items.map((item) => (
                                            <li key={item} className="flex gap-2.5">
                                                <span className="bg-primary-600 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
                                                {cleanText(item)}
                                            </li>
                                        ))}
                                    </ul>
                                    {category.inTheBox.note && <p className="mt-4 text-[13px] leading-relaxed text-neutral-500">{cleanText(category.inTheBox.note)}</p>}
                                </div>
                            </ScrollReveal>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
