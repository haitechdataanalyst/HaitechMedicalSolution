import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { articles, ArticleData } from "@/components/articles";
import { FAQ } from "@/components/misc/FAQ";
import { JsonLd } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_PRIMARY } from "@/components/ui/surfaces";
import { HUBS, hubPath } from "@/lib/hubs";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";
import { articleSchema, faqSchema } from "@/lib/structured-data";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const RELATED_GUIDE_LIMIT = 3;

export async function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

function findArticle(slug: string): ArticleData | undefined {
    return articles.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const article = findArticle(slug);

    if (!article) {
        return getMetadata("articleNotFound");
    }

    return getDynamicMetadata(article.title, article.excerpt, { path: `/support/articles/${article.slug}`, type: "article", image: article.imageSrc });
}

/**
 * Reading typography for article bodies: a ~68ch measure, 17-18px text, relaxed leading and a
 * tight heading scale. Applied from the wrapper so every article renders the same way.
 */
const ARTICLE_PROSE = [
    "max-w-[68ch] text-[17px] leading-[1.7] text-neutral-700 md:text-lg",
    "[&_p]:text-[17px] [&_p]:leading-[1.7] [&_p]:text-neutral-700 md:[&_p]:text-lg",
    "[&_li]:text-[17px] [&_li]:leading-[1.7] [&_li]:text-neutral-700 md:[&_li]:text-lg [&_li]:marker:text-neutral-400",
    "[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-[1.625rem] [&_h2]:leading-[1.15] [&_h2]:font-semibold [&_h2]:tracking-[-0.022em] [&_h2]:text-neutral-900 md:[&_h2]:text-[1.875rem]",
    "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:leading-snug [&_h3]:font-semibold [&_h3]:tracking-[-0.015em] [&_h3]:text-neutral-900",
    "[&_strong]:font-semibold [&_strong]:text-neutral-900",
    "[&_img]:rounded-2xl [&_img]:bg-neutral-50",
    "[&_p.article-footnote]:text-[13px] [&_p.article-footnote]:leading-relaxed [&_p.article-footnote]:text-neutral-500",
    "[&>*:first-child]:mt-0",
].join(" ");

function ArticleContent({ content }: { content: React.ReactNode }) {
    return <div className={ARTICLE_PROSE}>{content}</div>;
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = findArticle(slug);

    if (!article) {
        notFound();
    }

    const currentIndex = articles.findIndex((a: ArticleData) => a.slug === slug);
    const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
    const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

    // The product hub that lists this guide supplies the related products link and sibling guides.
    const hub = HUBS.find((h) => h.guideSlugs?.includes(article.slug));
    const relatedGuides = (hub?.guideSlugs ?? [])
        .filter((s) => s !== article.slug)
        .map((s) => findArticle(s))
        .filter((a): a is ArticleData => a !== undefined)
        .slice(0, RELATED_GUIDE_LIMIT);
    const relatedLinks = [...(hub ? [{ label: `Browse ${hub.name}`, href: hubPath(hub) }] : []), ...(article.relatedLinks ?? [])];
    const faqs = article.faqs ?? [];
    const path = `/support/articles/${article.slug}`;

    return (
        <article className="mx-auto max-w-3xl">
            <JsonLd
                data={articleSchema({
                    title: article.title,
                    description: article.summary ?? article.excerpt,
                    path,
                    publishedAt: article.publishedAt,
                    author: article.author,
                    image: article.imageSrc,
                })}
            />
            <JsonLd data={faqSchema(faqs)} />

            {/* Back Link */}
            <Link
                href="/support/articles"
                className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[15px] font-medium text-primary-700 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back to Articles
            </Link>

            {/* Article Header */}
            <header className="mt-6 mb-10 md:mb-12">
                <p className="text-[15px] font-medium text-primary-700">{article.category}</p>
                <h1 className="mt-3 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl">{article.title}</h1>

                <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-neutral-500">
                    <span>{article.author}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                </p>
            </header>

            {/* Answer box — the direct answer to the article's main question */}
            {article.summary && (
                <aside aria-labelledby="article-summary" className="mb-12 max-w-[68ch] rounded-2xl bg-primary-50/70 px-6 py-5 md:px-7 md:py-6">
                    <h2 id="article-summary" className="text-[15px] font-semibold text-primary-800">
                        In short
                    </h2>
                    <p className="mt-2 text-[17px] leading-[1.65] text-neutral-800">{article.summary}</p>
                </aside>
            )}

            {/* Article Content */}
            <ArticleContent content={article.content} />

            {/* Article FAQ — only for questions the article itself answers */}
            {faqs.length > 0 && (
                <div className="mt-16 overflow-hidden rounded-3xl">
                    <FAQ
                        groups={[{ id: article.slug, label: article.title, faqs: faqs.map((item, index) => ({ id: index, ...item })) }]}
                        title="Questions answered in this guide"
                        subtitle={article.excerpt}
                    />
                </div>
            )}

            {/* Enquiry CTA */}
            <aside className="mt-16 rounded-3xl bg-neutral-50 px-6 py-12 text-center md:px-12 md:py-14">
                <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-[2rem]">
                    {hub?.offerLoupeFitting ? "Ready to try loupes?" : "Talk to the Haitech team"}
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-neutral-600 md:text-[17px]">
                    {hub?.offerLoupeFitting
                        ? "Every pair is fitted to your posture and working distance. Book a fitting or ask us for a quote."
                        : "Tell us what you are looking for and we will reply with options and a quote."}
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    {hub?.offerLoupeFitting ? (
                        <Link href="/book-loupe-fitting" className={PILL_PRIMARY}>
                            Book a loupe fitting
                        </Link>
                    ) : (
                        <Link href="/book-demo" className={PILL_PRIMARY}>
                            Book a demo
                        </Link>
                    )}
                    <Link href="/support/contact" className="btn btn-secondary btn-lg">
                        Request a quote
                    </Link>
                </div>
            </aside>

            {/* Related content */}
            {(relatedLinks.length > 0 || relatedGuides.length > 0) && (
                <section aria-labelledby="related-content" className="mt-16">
                    <h2 id="related-content" className="mb-5 text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900">
                        Related
                    </h2>
                    <ul className="grid gap-4 sm:grid-cols-2 md:gap-5">
                        {relatedLinks.map((link) => (
                            <li key={link.href} className="flex">
                                <Link href={link.href} className={cn(INTERACTIVE_CARD, "w-full flex-row items-center justify-between gap-3 p-5")}>
                                    <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                    <span className="text-[16px] font-semibold tracking-[-0.01em] text-neutral-900">{link.label}</span>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-primary-700 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                        {relatedGuides.map((guide) => (
                            <li key={guide.slug} className="flex">
                                <Link href={`/support/articles/${guide.slug}`} className={cn(INTERACTIVE_CARD, "w-full flex-row items-center justify-between gap-3 p-5")}>
                                    <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                    <span>
                                        <span className="block text-[13px] font-medium text-neutral-500">Guide · {guide.readTime}</span>
                                        <span className="mt-1 block text-[16px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{guide.title}</span>
                                    </span>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-primary-700 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Article Navigation */}
            <nav aria-label="Article navigation" className="mt-16 grid gap-4 sm:grid-cols-2 md:gap-5">
                {prevArticle ? (
                    <Link href={`/support/articles/${prevArticle.slug}`} className={cn(INTERACTIVE_CARD, "flex-row items-center gap-3 p-5")}>
                        <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                        <ChevronLeft className="h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ease-out motion-safe:group-hover:-translate-x-0.5" aria-hidden="true" />
                        <span className="text-left">
                            <span className="block text-[13px] font-medium text-neutral-500">Previous</span>
                            <span className="mt-0.5 line-clamp-2 block text-[15px] leading-snug font-semibold text-neutral-900">{prevArticle.title}</span>
                        </span>
                    </Link>
                ) : (
                    <div className="hidden sm:block" />
                )}

                {nextArticle ? (
                    <Link href={`/support/articles/${nextArticle.slug}`} className={cn(INTERACTIVE_CARD, "flex-row items-center justify-end gap-3 p-5 text-right")}>
                        <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                        <span>
                            <span className="block text-[13px] font-medium text-neutral-500">Next</span>
                            <span className="mt-0.5 line-clamp-2 block text-[15px] leading-snug font-semibold text-neutral-900">{nextArticle.title}</span>
                        </span>
                        <ChevronRight className="h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                ) : (
                    <div className="hidden sm:block" />
                )}
            </nav>
        </article>
    );
}
