import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Glasses, MessageSquare, Phone } from "lucide-react";
import { Product } from "@/types";
import { getHubProductGroups, HubProductGroup } from "@/lib/catalog";
import { getHub, hubPath, HUBS, PRODUCT_TYPE_LINKS, HubComparisonRow } from "@/lib/hubs";
import { faqSchema } from "@/lib/structured-data";
import { productImageAlt, productNameWithBrand } from "@/lib/product-seo";
import { Breadcrumbs, JsonLd } from "@/components/ui";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_GHOST_ON_DARK, PILL_ON_DARK, SURFACE_CARD } from "@/components/ui/surfaces";
import { PAGE_TITLE, chipClass } from "@/components/catalog/listing";
import { ProductGrid } from "@/components/products";
import { FAQ, FAQGroup } from "@/components/misc/FAQ";
import AdmetecBrandBadge from "@/components/brand/AdmetecBrandBadge";
import { linkAdmetec } from "@/components/brand/AdmetecText";
import { articles } from "@/components/articles";
import faqData from "@/data/faq.json";
import siteConfig from "@/data/site-config.json";

// Spec rows that describe catalog filing, not the product.
const NON_COMPARABLE_LABELS = new Set(["category", "original brand"]);

// Sections sit below the sticky header (h-16) and the sticky section bar.
const SECTION_SCROLL_MARGIN = "scroll-mt-36";

interface ComparisonTable {
    products: (Product & { path: string })[];
    rows: { label: string; values: string[] }[];
}

interface SectionLink {
    id: string;
    label: string;
    count?: number;
}

function specRows(product: Product): { label: string; value: string }[] {
    return product.contentBlocks.flatMap((b) => (b.type === "specifications" ? (b.data.rows ?? b.data.specs ?? []) : []));
}

function warrantyOf(product: Product): string | undefined {
    const info = product.contentBlocks.find((b) => b.type === "info");
    return info?.type === "info" ? info.data.warranty : undefined;
}

/** Side-by-side table using only the spec rows and warranty already in the catalog. */
function buildComparison(groups: HubProductGroup[], curated?: HubComparisonRow[]): ComparisonTable | null {
    const products = groups.flatMap((g) => g.products);
    if (products.length < 2) return null;

    if (curated) {
        const valueFor = (row: HubComparisonRow, product: Product): string => {
            const explicit = row.values?.[product.slug];
            if (explicit) return explicit;
            const parts = (row.fromSpecs ?? []).map((label) => specRows(product).find((r) => r.label === label)?.value).filter(Boolean);
            return parts.length > 0 ? parts.join(" / ") : "—";
        };
        return { products, rows: curated.map((row) => ({ label: row.label, values: products.map((p) => valueFor(row, p)) })) };
    }

    const labels: string[] = [];
    for (const product of products) {
        for (const row of specRows(product)) {
            if (!NON_COMPARABLE_LABELS.has(row.label.toLowerCase()) && !labels.includes(row.label)) labels.push(row.label);
        }
    }

    const rows = labels.map((label) => ({
        label,
        values: products.map((p) => specRows(p).find((r) => r.label === label)?.value ?? "—"),
    }));
    if (products.some((p) => warrantyOf(p))) {
        rows.push({ label: "Warranty", values: products.map((p) => warrantyOf(p) ?? "—") });
    }
    return rows.length > 0 ? { products, rows } : null;
}

/** Hide auto-generated descriptions like "Bondent Group Endo Motor" that only repeat the heading. */
function usefulDescription(name: string, description?: string): string | undefined {
    if (!description) return undefined;
    return description
        .toLowerCase()
        .replace(/^bondent group\s*/, "")
        .trim() === name.toLowerCase()
        ? undefined
        : description;
}

function getFaqGroup(id?: string): FAQGroup | undefined {
    return (faqData.categories as FAQGroup[]).find((group) => group.id === id);
}

function flattenFaqs(group?: FAQGroup): { question: string; answer: string }[] {
    if (!group) return [];
    return group.faqs ?? group.sections?.flatMap((s) => s.faqs) ?? [];
}

const RELATED_CARD = `${INTERACTIVE_CARD} flex-row items-start justify-between gap-3 p-5 md:p-6`;
const RELATED_ARROW = "group-hover:text-primary-700 mt-1 h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5";

export default async function HubPage({ slug }: { slug: string }) {
    const hub = getHub(slug);
    const groups = await getHubProductGroups(hub);
    const productCount = groups.reduce((sum, g) => sum + g.products.length, 0);
    const comparison = hub.showComparison ? buildComparison(groups, hub.comparisonRows) : null;
    const faqGroup = getFaqGroup(hub.faqCategory);
    const guides = (hub.guideSlugs ?? []).map((s) => articles.find((a) => a.slug === s)).filter((a) => a !== undefined);
    const hasRelated = (hub.extraLinks?.length ?? 0) > 0 || guides.length > 0;
    const otherHubs = [...HUBS.filter((h) => h.slug !== hub.slug).map((h) => ({ label: h.name, href: hubPath(h) })), ...PRODUCT_TYPE_LINKS];
    const phone = siteConfig.company.phone;

    // The hero shows the first catalogue product that has a photo — real data only.
    const heroProduct = groups.flatMap((g) => g.products).find((p) => p.defaultImage);

    const sectionLinks: SectionLink[] = [
        ...(groups.length > 1 ? groups.map((g) => ({ id: g.category.slug, label: g.category.name, count: g.products.length })) : []),
        ...(comparison ? [{ id: "compare", label: "Compare" }] : []),
        ...(hasRelated ? [{ id: "related", label: guides.length > 0 ? "Guides & links" : "Related" }] : []),
    ];

    return (
        <>
            <JsonLd data={faqSchema(flattenFaqs(faqGroup))} />
            <Breadcrumbs
                items={[
                    { name: "Home", path: "/" },
                    { name: hub.name, path: hubPath(hub) },
                ]}
            />

            {/* ── Header ── */}
            <header className="bg-white">
                <div className={`container grid items-center gap-10 pt-10 pb-12 md:pt-16 md:pb-16 ${heroProduct ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16" : ""}`}>
                    <div>
                        <span className="label-tag label-tag-primary mb-5 inline-flex">
                            {productCount} {productCount === 1 ? "product" : "products"} · Supplied in India
                        </span>
                        <h1 className={`${PAGE_TITLE} max-w-3xl`}>{hub.name}</h1>
                        {hub.showsAdmetecLogo && <AdmetecBrandBadge size="category" className="mt-2" />}
                        <div className="mt-5 max-w-3xl space-y-3 text-base leading-relaxed text-neutral-600 md:text-lg">
                            {hub.intro.map((paragraph) => (
                                <p key={paragraph}>{linkAdmetec(paragraph)}</p>
                            ))}
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {hub.offerLoupeFitting && (
                                <Link href="/book-loupe-fitting" className="btn btn-lg btn-primary gap-2 rounded-full px-7">
                                    <Glasses className="h-4 w-4" aria-hidden="true" />
                                    Book a loupe fitting
                                </Link>
                            )}
                            <Link href="/book-demo" className={`btn btn-lg gap-2 rounded-full px-7 ${hub.offerLoupeFitting ? "btn-outline" : "btn-primary"}`}>
                                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                                Book a demo
                            </Link>
                            <Link href="/support/contact" className="btn btn-lg btn-outline gap-2 rounded-full px-7">
                                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                                Request a quote
                            </Link>
                        </div>
                    </div>

                    {heroProduct?.defaultImage && (
                        <Link
                            href={heroProduct.path}
                            className="group focus-visible:outline-primary-500 relative hidden aspect-square overflow-hidden rounded-3xl bg-neutral-50 ring-1 ring-neutral-900/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 lg:block"
                        >
                            <Image
                                src={heroProduct.defaultImage}
                                alt={productImageAlt(heroProduct)}
                                fill
                                sizes="416px"
                                className="object-contain px-10 pt-10 pb-20 mix-blend-multiply transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03]"
                            />
                            <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-full bg-white/90 py-2 pr-3 pl-4 text-[13px] font-medium text-neutral-800 ring-1 ring-neutral-900/[0.06]">
                                <span className="truncate">{productNameWithBrand(heroProduct)}</span>
                                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                            </span>
                        </Link>
                    )}
                </div>
            </header>

            {/* ── Section bar: jump around long pages ── */}
            {sectionLinks.length >= 3 && (
                <nav aria-label={`${hub.name} sections`} className="material-bar sticky top-16 z-40 border-b border-neutral-900/[0.06]">
                    <div className="container">
                        <ul className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 py-2 [&::-webkit-scrollbar]:hidden">
                            {sectionLinks.map((link) => (
                                <li key={link.id} className="shrink-0">
                                    <a href={`#${link.id}`} className={chipClass(false)}>
                                        {link.label}
                                        {link.count !== undefined && <span className="text-[13px] text-neutral-500 tabular-nums">{link.count}</span>}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            )}

            <div className="bg-neutral-50/50">
                {/* ── Product groups ── */}
                <div className="container space-y-16 py-12 md:space-y-20 md:py-16">
                    {groups.map((group) => {
                        const description = usefulDescription(group.category.name, group.category.description);
                        const count = group.products.length;
                        return (
                            <section key={group.category.slug} id={group.category.slug} aria-labelledby={`${group.category.slug}-heading`} className={SECTION_SCROLL_MARGIN}>
                                <div className="mb-6 flex items-end justify-between gap-4">
                                    <div className="max-w-3xl">
                                        <h2 id={`${group.category.slug}-heading`} className="heading-3 text-neutral-900">
                                            {groups.length === 1 ? `All ${hub.name}` : group.category.name}
                                        </h2>
                                        {description && <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">{description}</p>}
                                    </div>
                                    {groups.length > 1 && (
                                        <span className="shrink-0 pb-0.5 text-[13px] text-neutral-500 tabular-nums">
                                            {count} {count === 1 ? "product" : "products"}
                                        </span>
                                    )}
                                </div>
                                <ProductGrid items={group.products} />
                            </section>
                        );
                    })}

                    {groups.length === 0 && (
                        <p className={`${SURFACE_CARD} px-6 py-12 text-center text-[15px] text-neutral-500`}>Products in this range are being updated. Contact us for current availability.</p>
                    )}
                </div>

                {/* ── Comparison ── */}
                {comparison && (
                    <section id="compare" aria-labelledby="compare-heading" className={`bg-white ${SECTION_SCROLL_MARGIN}`}>
                        <div className="container py-12 md:py-16">
                            <h2 id="compare-heading" className="heading-3 text-neutral-900">
                                Compare {hub.name}
                            </h2>
                            <p className="mt-2 mb-6 text-[15px] leading-relaxed text-neutral-500">From the published specifications. A dash means the specification is not listed for that model.</p>
                            <div className={`${SURFACE_CARD} overflow-x-auto`}>
                                <table className="w-full min-w-[640px] border-collapse text-sm">
                                    <caption className="sr-only">{hub.name} specifications, one column per model</caption>
                                    <thead>
                                        <tr className="border-b border-neutral-900/[0.06]">
                                            <th scope="col" className="sticky left-0 z-10 w-1/4 bg-white px-5 py-4 text-left text-[13px] font-medium text-neutral-500">
                                                Specification
                                            </th>
                                            {comparison.products.map((p) => (
                                                <th key={p.id} scope="col" className="px-5 py-4 text-left font-semibold tracking-[-0.01em] text-neutral-900">
                                                    <Link href={p.path} className="hover:text-primary-700 hover:underline">
                                                        {productNameWithBrand(p)}
                                                    </Link>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-900/[0.06]">
                                        {comparison.rows.map((row) => (
                                            <tr key={row.label} className="hover:bg-neutral-50/70">
                                                <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-3.5 text-left font-medium text-neutral-500">
                                                    {row.label}
                                                </th>
                                                {row.values.map((value, i) => (
                                                    <td key={comparison.products[i].id} className="px-5 py-3.5 text-neutral-800">
                                                        {value}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Related ranges and guides ── */}
                {hasRelated && (
                    <div id="related" className={`container space-y-12 py-12 md:py-16 ${SECTION_SCROLL_MARGIN}`}>
                        {hub.extraLinks && hub.extraLinks.length > 0 && (
                            <section aria-labelledby="related-heading">
                                <h2 id="related-heading" className="heading-3 mb-6 text-neutral-900">
                                    Related
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                                    {hub.extraLinks.map((link) => (
                                        <Link key={link.href} href={link.href} className={RELATED_CARD}>
                                            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                            <span>
                                                <span className="block text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{link.label}</span>
                                                <span className="mt-1 block text-[13px] leading-relaxed text-neutral-500">{link.description}</span>
                                            </span>
                                            <ArrowRight className={RELATED_ARROW} aria-hidden="true" />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {guides.length > 0 && (
                            <section aria-labelledby="guides-heading">
                                <h2 id="guides-heading" className="heading-3 mb-6 text-neutral-900">
                                    Buying guides
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                                    {guides.map((guide) => (
                                        <Link key={guide.slug} href={`/support/articles/${guide.slug}`} className={RELATED_CARD}>
                                            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                            <span>
                                                <span className="text-primary-700 mb-1 block text-[13px] font-medium">{guide.readTime}</span>
                                                <span className="block text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{guide.title}</span>
                                            </span>
                                            <ArrowRight className={RELATED_ARROW} aria-hidden="true" />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            {/* ── FAQ ── */}
            {faqGroup && <FAQ groups={[faqGroup]} title={`${hub.name} FAQs`} subtitle="Answers based on the product specifications and Haitech's support team." />}

            {/* ── Enquiry band ── */}
            <section className="bg-navy-gradient section">
                <div className="container text-center">
                    <h2 className="mx-auto max-w-2xl text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.02em] text-white md:text-4xl">Need help choosing?</h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                        Tell us about your clinic and the procedures you do. We typically reply within 24 hours, or call us on{" "}
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold whitespace-nowrap text-white underline-offset-4 hover:underline">
                            {phone}
                        </a>
                        .
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/support/contact" className={PILL_ON_DARK}>
                            <MessageSquare className="h-4 w-4" aria-hidden="true" />
                            Request a quote
                        </Link>
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className={PILL_GHOST_ON_DARK}>
                            <Phone className="h-4 w-4" aria-hidden="true" />
                            Call us
                        </a>
                    </div>
                    <nav aria-label="Other product types" className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
                        {otherHubs.map((link) => (
                            <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center text-white/70 transition-colors hover:text-white">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </section>
        </>
    );
}
