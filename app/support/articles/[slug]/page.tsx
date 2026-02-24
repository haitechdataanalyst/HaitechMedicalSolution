import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { articles, ArticleData } from "@/components/articles";
import { getArticleBreadcrumbs } from "@/lib/breadcrumbs";
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

    const breadcrumbs = getArticleBreadcrumbs(article.title, article.slug);

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <article className="container mx-auto px-4 py-6 sm:py-8">
                <div className="mx-auto max-w-4xl">
                    {/* Back Link */}
                    <Link href="/support/articles" className="text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Articles
                    </Link>

                    {/* Article Header */}
                    <header className="mb-8">
                        {/* Category Badge */}
                        <div className="mb-4 flex items-center gap-2">
                            <Tag className="text-primary-600 h-4 w-4" />
                            <span className="text-primary-600 text-sm font-medium tracking-wide uppercase">{article.category}</span>
                        </div>

                        {/* Title */}
                        <h1 className="mb-4 text-3xl leading-tight font-bold text-gray-900 sm:text-4xl">{article.title}</h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 pb-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{article.readTime}</span>
                            </div>
                        </div>
                    </header>

                    {/* Article Content */}
                    <ArticleContent content={article.content} />

                    {/* Article Navigation */}
                    <nav className="mt-12 border-t border-gray-200 pt-8">
                        <div className="flex items-center justify-between">
                            {prevArticle ? (
                                <Link href={`/support/articles/${prevArticle.slug}`} className="hover:text-primary-600 group flex items-center gap-3 text-gray-600 transition-colors">
                                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                    <div className="text-left">
                                        <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">Previous Article</div>
                                        <div className="line-clamp-2 text-sm font-medium">{prevArticle.title}</div>
                                    </div>
                                </Link>
                            ) : (
                                <div></div>
                            )}

                            {nextArticle ? (
                                <Link href={`/support/articles/${nextArticle.slug}`} className="hover:text-primary-600 group flex items-center gap-3 text-right text-gray-600 transition-colors">
                                    <div>
                                        <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">Next Article</div>
                                        <div className="line-clamp-2 text-sm font-medium">{nextArticle.title}</div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </nav>

                    {/* Related Articles or CTA */}
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <div className="text-center">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">Need more help?</h3>
                            <p className="mb-4 text-gray-600">Browse our full knowledge base or contact our support team.</p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link
                                    href="/support/articles"
                                    className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium text-white transition-colors"
                                >
                                    Browse All Articles
                                </Link>
                                <Link
                                    href="/support/contact"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
