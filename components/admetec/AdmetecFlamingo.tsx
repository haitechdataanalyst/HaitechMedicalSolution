import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { longDescription, packageContents, parseLenses, parseNumberedFeatures, specValue } from "@/lib/product-highlights";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PHOTOS = {
    system: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308361/haitech/images/products/admetec/lights/flamingo/flamingo-with-loupes-and-powerpack.webp",
    clinician: "https://res.cloudinary.com/gwnakzdo/image/upload/v1793102093/haitech/images/products/admetec/camera/flamingo/product/flamingo-product.jpg",
    controlUnit: "https://res.cloudinary.com/gwnakzdo/image/upload/v1793102092/haitech/images/products/admetec/camera/flamingo/product/flamingo-camera.jpg",
    kit: "https://res.cloudinary.com/gwnakzdo/image/upload/v1793102094/haitech/images/products/admetec/camera/flamingo/product/flamingo-kit.webp",
};

// The capabilities worth leading with, by their catalogue titles; falls back to the first few if the copy changes.
const LEAD_FEATURES = ["Voice Recording", "AI Editing", "Remote Control", "Cloud Sync", "Teaching tool", "Patient confidence"];
const MIN_LEAD_FEATURES = 3;
const FALLBACK_FEATURE_COUNT = 6;

const sentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Headline figures, read straight from the product's specification rows. */
function headlineStats(product: Product): { v: string; l: string }[] {
    const resolution = specValue(product, "Camera resolution")?.split("|")[0]?.trim();
    return [
        { v: resolution, l: "Camera resolution" },
        { v: specValue(product, "Weight"), l: "Weight" },
        { v: specValue(product, "Light intensity"), l: "Light intensity" },
        { v: specValue(product, "Charging time"), l: "Charging time" },
    ].filter((s): s is { v: string; l: string } => Boolean(s.v));
}

function Tile({ src, alt, fit, className }: { src: string; alt: string; fit: "contain" | "cover"; className?: string }) {
    return (
        <div className={cn("relative overflow-hidden rounded-xl bg-white", className)}>
            <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 640px" className={fit === "contain" ? "object-contain p-5 mix-blend-multiply md:p-8" : "object-cover"} />
        </div>
    );
}

/**
 * Flamingo (Admetec's loupe camera + light) as one compact section: the photos beside the story and figures, then what
 * it can do, with the kit contents folded away until asked for. Every fact comes from the catalogue record.
 */
export function AdmetecFlamingo({ product, href }: { product: Product; href: string }) {
    const features = parseNumberedFeatures(longDescription(product));
    const lead = features.filter((f) => LEAD_FEATURES.includes(f.title));
    const shown = lead.length >= MIN_LEAD_FEATURES ? lead : features.slice(0, FALLBACK_FEATURE_COUNT);
    const stats = headlineStats(product);
    const lenses = parseLenses(specValue(product, "Lenses"));
    const kit = packageContents(product);

    return (
        <section aria-labelledby="flamingo-heading" className="bg-neutral-50">
            <div className="section container">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <ScrollReveal variant="scale">
                        <div className="space-y-4">
                            <Link href={href} className={cn(INTERACTIVE_CARD, "p-2")}>
                                <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                <Tile src={PHOTOS.system} alt="Admetec Flamingo camera and headlight mounted on loupes, with the power pack" fit="contain" className="aspect-[4/3]" />
                            </Link>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={cn(SURFACE_CARD, "p-1.5")}>
                                    <Tile src={PHOTOS.clinician} alt="Clinician wearing loupes with the Flamingo camera and light" fit="cover" className="aspect-[4/3]" />
                                </div>
                                <div className={cn(SURFACE_CARD, "p-1.5")}>
                                    <Tile src={PHOTOS.controlUnit} alt="Flamingo control unit with screen and record button, next to the camera module" fit="contain" className="aspect-[4/3]" />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fade" delay={80}>
                        <div>
                            <p className="text-primary-700 text-[15px] font-medium">{product.name}</p>
                            <h2 id="flamingo-heading" className="mt-2 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl">
                                Camera, light and AI editing. Built for loupes.
                            </h2>
                            {product.description && <p className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg">{product.description}</p>}

                            {stats.length > 1 && (
                                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-neutral-900/[0.08] pt-8">
                                    {stats.map((stat) => (
                                        <div key={stat.l} className="flex flex-col-reverse">
                                            <dt className="mt-1 text-[13px] text-neutral-500">{stat.l}</dt>
                                            <dd className="text-primary-800 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{stat.v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            )}

                            {lenses.length > 0 && (
                                <div className="mt-8">
                                    <p className="text-[13px] text-neutral-500">Interchangeable lenses</p>
                                    <ul className="mt-3 flex flex-wrap gap-2">
                                        {lenses.map((lens) => (
                                            <li key={lens.millimetres} className="rounded-full bg-white px-4 py-1.5 text-[15px] font-medium text-neutral-900 ring-1 ring-neutral-900/10">
                                                {lens.millimetres} mm · {lens.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link href={href} className={PILL_PRIMARY}>
                                    Explore Flamingo
                                </Link>
                                <Link href="/support/contact" className="btn btn-secondary btn-lg">
                                    Request a quote
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {shown.length > 0 && (
                    <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-3">
                        {shown.map((feature, index) => (
                            <li key={feature.title}>
                                <ScrollReveal delay={(index % 3) * 80} className="h-full">
                                    <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-neutral-900/[0.04] md:p-7">
                                        <h3 className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">{feature.title}</h3>
                                        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{sentence(feature.text)}</p>
                                    </div>
                                </ScrollReveal>
                            </li>
                        ))}
                    </ul>
                )}

                {kit.length > 0 && (
                    <details className="group mt-6 rounded-3xl bg-white ring-1 ring-neutral-900/[0.04]">
                        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-6 text-[17px] font-semibold tracking-[-0.01em] text-neutral-900 md:px-8 [&::-webkit-details-marker]:hidden">
                            What&apos;s in the kit
                            <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform duration-200 ease-out group-open:rotate-180" aria-hidden="true" />
                        </summary>
                        <div className="grid items-center gap-6 px-6 pb-6 md:px-8 md:pb-8 lg:grid-cols-2">
                            <Tile src={PHOTOS.kit} alt="Flamingo carry case opened to show the camera, control unit and accessories" fit="contain" className="aspect-[4/3] bg-neutral-50" />
                            <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                                {kit.map((item) => (
                                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-neutral-700">
                                        <span className="bg-primary-600 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </details>
                )}
            </div>
        </section>
    );
}
