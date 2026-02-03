import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { articles, ArticleData } from "@/components/articles";

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
    return {
      title: "Article Not Found | Haitech Medical",
    };
  }

  return {
    title: `${article.title} | Haitech Medical`,
    description: article.excerpt,
  };
}

function ArticleContent({ content }: { content: React.ReactNode }) {
  return (
    <div className="prose prose-lg max-w-none">
      {content}
    </div>
  );
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

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Support", path: "/support" },
    { name: "Articles", path: "/support/articles" },
    { name: article.title, path: `/support/articles/${article.slug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <article className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/support/articles"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <ArticleContent content={article.content} />

          {/* Article Navigation */}
          <nav className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              {prevArticle ? (
                <Link
                  href={`/support/articles/${prevArticle.slug}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Previous Article</div>
                    <div className="text-sm font-medium line-clamp-2">{prevArticle.title}</div>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}

              {nextArticle ? (
                <Link
                  href={`/support/articles/${nextArticle.slug}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors group text-right"
                >
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Article</div>
                    <div className="text-sm font-medium line-clamp-2">{nextArticle.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </nav>

          {/* Related Articles or CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need more help?
              </h3>
              <p className="text-gray-600 mb-4">
                Browse our full knowledge base or contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/support/articles"
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Browse All Articles
                </Link>
                <Link
                  href="/support/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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