import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { getHeadlightProducts, getHeadlightsData } from "@/lib/catalog";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { cleanText, headlightFigures, specOf } from "@/lib/headlight-specs";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, SURFACE_CARD } from "@/components/ui/surfaces";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BRAND_LEAD, BrandChecklist, BrandCTA, BrandFeature, BrandSection, MediaTile } from "@/components/brand/BrandSections";
import { HeadlightSeries } from "@/components/headlights/HeadlightSeries";
import AdmetecBrandBadge from "@/components/brand/AdmetecBrandBadge";

export const metadata = getMetadata("ourHeadlights");

// Spec labels compared across models; values come from each model's "Label: value" feature list.
const COMPARE_LABELS = ["Intensity", "Weight", "Run time", "Charge time", "Batteries", "Yellow filter"];

export default async function OurHeadlightsPage() {
    const { intro, categories } = await getHeadlightsData();
    // Each light has its own product page (quote, compare, specs); the cards link there by model id.
    const productPaths = Object.fromEntries((await getHeadlightProducts()).map((p) => [p.slug, p.path]));
    const totals = headlightFigures(categories);
    const figures = [
        { v: String(totals.models), l: "Light models" },
        { v: totals.maxIntensity, l: "Peak intensity" },
        { v: totals.lightestWeight, l: "Lightest model" },
        { v: totals.colorTemperature, l: "Colour temperature" },
    ].filter((f): f is { v: string; l: string } => Boolean(f.v));
    const caseImage = categories.find((c) => c.inTheBox?.image);

    return (
        <>
            <Breadcrumbs items={getBreadcrumbs("ourHeadlights")} />

            {/* Hero: the two power types are the navigation */}
            <section className="bg-white">
                <div className="container pt-6 pb-14 md:pt-10 md:pb-20">
                    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                        <p className="text-primary-700 text-[15px] font-medium md:text-base">LED Technology</p>
                        <h1 className="mt-3 text-[3rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-neutral-900 sm:text-7xl md:text-8xl">{intro.title}</h1>
                        <div className="mt-2">
                            <AdmetecBrandBadge size="brand" />
                        </div>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-xl">{intro.description}</p>
                    </div>

                    <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-6">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link href={`#${category.id}`} className={`${INTERACTIVE_CARD} h-full p-2`}>
                                    <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50">
                                        <Image
                                            src={category.image}
                                            alt={`${category.name} Admetec headlight`}
                                            fill
                                            priority
                                            sizes="(max-width: 640px) 100vw, 600px"
                                            className="object-contain p-8 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03] md:p-12"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-4 px-4 pt-5 pb-4">
                                        <div>
                                            <p className="text-xl font-semibold tracking-[-0.02em] text-neutral-900">{category.name}</p>
                                            <p className="mt-1 text-[15px] text-neutral-500">{category.description}</p>
                                        </div>
                                        <ArrowDown
                                            className="group-hover:text-primary-700 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ease-out motion-safe:group-hover:translate-y-0.5"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Headline figures, taken from the model specs below */}
            {figures.length > 1 && (
                <BrandSection tone="gray" className="py-12 md:py-16">
                    <ScrollReveal variant="fade">
                        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
                            {figures.map((figure) => (
                                <li key={figure.l} className="text-center">
                                    <p className="text-primary-800 text-3xl font-semibold tracking-[-0.02em] tabular-nums md:text-4xl">{figure.v}</p>
                                    <p className="mt-1.5 text-[13px] text-neutral-500">{figure.l}</p>
                                </li>
                            ))}
                        </ul>
                    </ScrollReveal>
                </BrandSection>
            )}

            <BrandFeature
                eyebrow="Why Admetec lights"
                title="Premium Quality Lighting"
                media={caseImage?.inTheBox?.image ? <MediaTile src={caseImage.inTheBox.image} alt={`${caseImage.name} headlight case contents`} /> : <div />}
            >
                <p className={BRAND_LEAD}>All our lights are ultra-lightweight and engineered for demanding clinical environments.</p>
                <BrandChecklist items={intro.features.map(cleanText)} />
            </BrandFeature>

            {categories.map((category, index) => (
                <HeadlightSeries key={category.id} category={category} tone={index % 2 === 0 ? "gray" : "white"} paths={productPaths} />
            ))}

            {/* Buying guide + all-model comparison, built from the same data as the model cards */}
            <BrandSection tone={categories.length % 2 === 0 ? "gray" : "white"}>
                {intro.buyingGuide && (
                    <ScrollReveal variant="fade">
                        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
                            <h2 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl">{intro.buyingGuide.title}</h2>
                            <p className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg">{intro.buyingGuide.text}</p>
                        </div>
                    </ScrollReveal>
                )}
                <h2 className="mb-5 text-xl font-semibold tracking-[-0.02em] text-neutral-900">Light comparison</h2>
                <div className={`${SURFACE_CARD} overflow-x-auto`}>
                    <table className="w-full min-w-[760px] border-collapse text-sm">
                        <caption className="sr-only">Admetec headlight models compared by intensity, weight, run time, charge time, batteries and yellow filter</caption>
                        <thead>
                            <tr className="border-b border-neutral-900/[0.06] text-left">
                                {["Model", "Type", ...COMPARE_LABELS, "Best for"].map((label, i) => (
                                    <th key={label} scope="col" className={`px-5 py-4 text-[13px] font-medium text-neutral-500 ${i === 0 ? "sticky left-0 z-10 bg-white" : ""}`}>
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-900/[0.06]">
                            {categories.flatMap((category) =>
                                category.products
                                    .filter((product) => !product.isAccessory)
                                    .map((product) => (
                                        <tr key={product.id} className="hover:bg-neutral-50/70">
                                            <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-3.5 text-left font-semibold text-neutral-900">
                                                {cleanText(product.name).replace(/ Headlight$/, "")}
                                            </th>
                                            <td className="px-5 py-3.5 text-neutral-700">{category.name}</td>
                                            {COMPARE_LABELS.map((label) => (
                                                <td key={label} className="px-5 py-3.5 text-neutral-700">
                                                    {specOf(product, label) ?? "—"}
                                                </td>
                                            ))}
                                            <td className="px-5 py-3.5 text-neutral-700">{product.bestFor ?? "—"}</td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </BrandSection>

            <BrandCTA
                title="Pair with Premium Loupes"
                description="Pair your headlight with our premium loupes for the ultimate clinical experience. Browse our loupe collections to find your perfect match."
                primary={{ href: "/product-category/admetec/ergo-loupes", label: "Explore Ergo Loupes" }}
                secondary={{ href: "/product-category/admetec/galilean-loupes", label: "Explore Galilean Loupes" }}
            />
        </>
    );
}
