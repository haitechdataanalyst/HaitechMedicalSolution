import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { longDescription, packageContents, parseLenses, parseNumberedFeatures, specValue } from "@/lib/product-highlights";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PHOTOS = {
    system: "/images/products/admetec/Lights/Flamingo/Flamingo-with-Loupes-and-PowerPack.webp",
    clinician: "/images/products/admetec/catalog/flamingo-product.jpg",
    controlUnit: "/images/products/admetec/catalog/flamingo-camera.jpg",
    kit: "/images/products/admetec/catalog/flamingo-kit.webp",
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
            <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 720px" className={fit === "contain" ? "object-contain p-6 mix-blend-multiply md:p-10" : "object-cover"} />
        </div>
    );
}

/** Flamingo (Admetec's loupe camera + light) as a full section on the brand page; every fact comes from the catalogue record. */
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
                <ScrollReveal variant="fade">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-primary-700 text-[15px] font-medium">{product.name}</p>
                        <h2 id="flamingo-heading" className="mt-2 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl">
                            Camera, light and AI editing. Built for loupes.
                        </h2>
                        {product.description && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">{product.description}</p>}
                    </div>
                </ScrollReveal>

                {/* Photo mosaic */}
                <div className="mt-12 grid gap-4 md:mt-16 md:gap-6 lg:grid-cols-3">
                    <ScrollReveal className="lg:col-span-2 lg:row-span-2">
                        <Link href={href} className={cn(INTERACTIVE_CARD, "h-full p-2")}>
                            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                            <Tile
                                src={PHOTOS.system}
                                alt="Admetec Flamingo camera and headlight mounted on loupes, with the power pack"
                                fit="contain"
                                className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[30rem]"
                            />
                        </Link>
                    </ScrollReveal>
                    <ScrollReveal delay={90}>
                        <div className={cn(SURFACE_CARD, "p-2")}>
                            <Tile src={PHOTOS.clinician} alt="Clinician wearing loupes with the Flamingo camera and light" fit="cover" className="aspect-[4/3]" />
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={180}>
                        <div className={cn(SURFACE_CARD, "p-2")}>
                            <Tile src={PHOTOS.controlUnit} alt="Flamingo control unit with screen and record button, next to the camera module" fit="contain" className="aspect-[4/3]" />
                        </div>
                    </ScrollReveal>
                </div>

                {stats.length > 1 && (
                    <ScrollReveal variant="fade">
                        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 md:mt-16 md:grid-cols-4">
                            {stats.map((stat) => (
                                <li key={stat.l} className="text-center">
                                    <p className="text-primary-800 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{stat.v}</p>
                                    <p className="mt-1.5 text-[13px] text-neutral-500">{stat.l}</p>
                                </li>
                            ))}
                        </ul>
                    </ScrollReveal>
                )}

                {lenses.length > 0 && (
                    <ScrollReveal variant="fade">
                        <div className="mt-10 text-center">
                            <p className="text-[13px] text-neutral-500">Interchangeable lenses</p>
                            <ul className="mt-3 flex flex-wrap justify-center gap-2.5">
                                {lenses.map((lens) => (
                                    <li key={lens.millimetres} className="rounded-full bg-white px-5 py-2 text-[15px] font-medium text-neutral-900 ring-1 ring-neutral-900/10">
                                        {lens.millimetres} mm · {lens.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollReveal>
                )}

                {shown.length > 0 && (
                    <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-6 lg:grid-cols-3">
                        {shown.map((feature, index) => (
                            <li key={feature.title}>
                                <ScrollReveal delay={(index % 3) * 80} className="h-full">
                                    <div className={cn(SURFACE_CARD, "h-full p-6 md:p-7")}>
                                        <h3 className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">{feature.title}</h3>
                                        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{sentence(feature.text)}</p>
                                    </div>
                                </ScrollReveal>
                            </li>
                        ))}
                    </ul>
                )}

                {kit.length > 0 && (
                    <div className="mt-12 grid items-center gap-4 md:mt-16 md:gap-6 lg:grid-cols-2">
                        <ScrollReveal>
                            <div className={cn(SURFACE_CARD, "p-2")}>
                                <Tile src={PHOTOS.kit} alt="Flamingo carry case opened to show the camera, control unit and accessories" fit="contain" className="aspect-[4/3]" />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={90}>
                            <div className={cn(SURFACE_CARD, "p-6 md:p-8")}>
                                <h3 className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">What&apos;s in the kit</h3>
                                <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                                    {kit.map((item) => (
                                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-neutral-700">
                                            <span className="bg-primary-600 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScrollReveal>
                    </div>
                )}

                <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12">
                    <Link href={href} className={PILL_PRIMARY}>
                        Explore Flamingo
                    </Link>
                    <Link href="/support/contact" className="btn btn-lg btn-outline rounded-full px-7">
                        Request a quote
                    </Link>
                </div>
            </div>
        </section>
    );
}
