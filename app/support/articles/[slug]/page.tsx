import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { articles, ArticleData } from "@/components/articles";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const article = articles.find((a: ArticleData) => a.slug === slug);

    if (!article) {
        return getMetadata("articleNotFound");
    }

    return getDynamicMetadata(article.title, article.excerpt);
}

function ArticleContent({ content }: { content: React.ReactNode }) {
    return <div className="prose prose-lg max-w-none">{content}</div>;
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = articles.find((a: ArticleData) => a.slug === slug);

    if (!article) {
        notFound();
    }

    const currentIndex = articles.findIndex((a: ArticleData) => a.slug === slug);
    const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
    const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

    return (
        <article className="mx-auto max-w-4xl py-2 sm:py-4">
            {/* Back Link */}
            <Link href="/support/articles" className="text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Articles
            </Link>

            {/* Article Header */}
            <header className="mb-8">
                {/* Category Badge */}
                <div className="mb-4">
                    <span className="label-tag label-tag-primary inline-flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                        {article.category}
                    </span>
                </div>

                {/* Title */}
                <h2 className="heading-2 mb-4">{article.title}</h2>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 border-b border-neutral-100 pb-6 text-sm text-neutral-500">
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" aria-hidden="true" />
                        <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span>
                            {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        <span>{article.readTime}</span>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <ArticleContent content={article.content} />

            {/* Article Navigation */}
            <nav aria-label="Article navigation" className="mt-12 border-t border-neutral-100 pt-8">
                <div className="flex items-center justify-between gap-4">
                    {prevArticle ? (
                        <Link href={`/support/articles/${prevArticle.slug}`} className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-4 transition-all hover:border-primary-100 hover:shadow-md">
                            <ChevronLeft className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-hover:-translate-x-1 group-hover:text-primary-500" aria-hidden="true" />
                            <div className="text-left">
                                <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">Previous</span>
                                <span className="line-clamp-2 block text-sm font-medium text-neutral-700 group-hover:text-primary-600">{prevArticle.title}</span>
                            </div>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {nextArticle ? (
                        <Link href={`/support/articles/${nextArticle.slug}`} className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-4 text-right transition-all hover:border-primary-100 hover:shadow-md">
                            <div>
                                <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">Next</span>
                                <span className="line-clamp-2 block text-sm font-medium text-neutral-700 group-hover:text-primary-600">{nextArticle.title}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-500" aria-hidden="true" />
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </nav>

            {/* Related Articles or CTA */}
            <aside className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center">
                <h3 className="mb-2 text-lg font-semibold text-neutral-900">Need more help?</h3>
                <p className="mb-6 text-neutral-500">Browse our full knowledge base or contact our support team.</p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/support/articles"
                        className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-medium text-white transition-colors"
                    >
                        Browse All Articles
                    </Link>
                    <Link
                        href="/support/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2.5 font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                    >
                        Contact Support
                    </Link>
                </div>
            </aside>
        </article>
    );
}
