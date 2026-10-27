import { getTopCategories } from "@/lib/catalog";
import { CategoryBrowser } from "@/components/products";
import { fetchCategoryContentsAction } from "@/app/actions/catalog";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Headset } from "lucide-react";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";
import { PageIntro } from "@/components/catalog/listing";
import { HUBS, hubPath, PRODUCT_TYPE_LINKS } from "@/lib/hubs";

export const metadata = getMetadata("products");

const SECTION_TITLE = "text-xl font-semibold tracking-[-0.02em] text-neutral-900 md:text-2xl";
const SECTION_HINT = "mt-1.5 text-[15px] text-neutral-500";

const equipmentLinks = [...HUBS.map((hub) => ({ label: hub.name, href: hubPath(hub), description: hub.summary })), ...PRODUCT_TYPE_LINKS];

// A real catalogue photo per equipment type (UI only — keyed by the existing hub / category paths).
const EQUIPMENT_IMAGE: Record<string, string> = {
    "/dental-loupes": "/images/products/admetec/loupes/ergo/gallery/ergo-10x-blues-black.jpg",
    "/dental-chairs": "/images/products/almadent/brand/almadent-primary.jpg",
    "/saddle-chairs": "/images/products/salli/sway-fit/sway-fit-black.jpg",
    "/endodontics": "/images/products/bondent/endo-device/irrigation/actor-i-pro.png",
    "/cbct": "/images/products/bondent/imaging/bondent-cbct-1030-pro.png",
    "/product-category/strauss": "/images/products/strauss/a-series/a0c.jpg",
    "/product-category/medesy": "/images/products/medesy/elevators/700slash8.jpg",
};

export default async function ProductsPage() {
    const categories = await getTopCategories();
    const breadcrumbs = getBreadcrumbs("products");

    return (
        <div className="bg-neutral-50/50">
            {/* ── Page header ── */}
            <div className="container pt-6">
                <JsonLd data={breadcrumbSchema(breadcrumbs)} />
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-neutral-500">
                    {breadcrumbs.map((crumb, i) => (
                        <span key={crumb.path} className="flex items-center gap-1.5">
                            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                            {i < breadcrumbs.length - 1 ? (
                                <Link href={crumb.path} className="hover:text-primary-700 inline-flex min-h-11 items-center transition-colors">
                                    {crumb.name}
                                </Link>
                            ) : (
                                <span aria-current="page" className="font-medium text-neutral-800">
                                    {crumb.name}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>
            </div>
            <PageIntro title="All Products" subtitle={<>Premium dental &amp; medical equipment · 6 global brands · 130+ products</>} className="pt-8 pb-6 md:pt-12 md:pb-8" />

            {/* ── Shop by equipment type ── */}
            <section id="equipment" aria-labelledby="equipment-heading" className="scroll-mt-28 pb-12 md:pb-16">
                <div className="container">
                    <h2 id="equipment-heading" className={SECTION_TITLE}>
                        Shop by equipment type
                    </h2>
                    <p className={SECTION_HINT}>Know what you need? Start here.</p>

                    <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                        {equipmentLinks.map((link) => {
                            const image = EQUIPMENT_IMAGE[link.href];
                            return (
                                <li key={link.href} className="flex">
                                    <Link href={link.href} className={`${INTERACTIVE_CARD} w-full p-2`}>
                                        <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-50">
                                            {image && (
                                                <Image
                                                    src={image}
                                                    alt=""
                                                    fill
                                                    sizes="(min-width: 1024px) 300px, 50vw"
                                                    className="object-contain p-4 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col px-2 pt-3 pb-2">
                                            <span className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{link.label}</span>
                                            <span className="mt-1 hidden text-[13px] leading-relaxed text-neutral-500 sm:block">{link.description}</span>
                                            <span className="text-primary-700 mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium">
                                                Shop
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}

                        {/* Fills the last grid slot and answers "I'm not sure what I need" */}
                        <li className="flex">
                            <Link
                                href="/support/contact"
                                className="bg-primary-50 hover:bg-primary-100 focus-visible:outline-primary-500 group flex w-full flex-col justify-center rounded-2xl p-5 transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.985]"
                            >
                                <span className="bg-primary-800 flex h-11 w-11 items-center justify-center rounded-full text-white">
                                    <Headset className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <span className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">Not sure what you need?</span>
                                <span className="mt-1 text-[13px] leading-relaxed text-neutral-600">Tell us about your clinic and a specialist will help you choose.</span>
                                <span className="text-primary-800 mt-3 inline-flex items-center gap-1 text-sm font-medium">
                                    Talk to a specialist
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>

            {/* ── Browse by brand ── */}
            <section id="brands" aria-labelledby="brands-heading" className="scroll-mt-28 pb-16 md:pb-24">
                <div className="container">
                    <h2 id="brands-heading" className={SECTION_TITLE}>
                        Browse by brand
                    </h2>
                    <p className={SECTION_HINT}>Prefer a specific manufacturer? Choose a brand to see its range.</p>
                    <div className="mt-6">
                        <CategoryBrowser initialCategories={categories} fetchCategoryContents={fetchCategoryContentsAction} />
                    </div>
                </div>
            </section>
        </div>
    );
}
