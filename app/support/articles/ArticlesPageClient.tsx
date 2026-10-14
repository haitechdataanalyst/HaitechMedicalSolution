"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { articles, ArticleData } from "@/components/articles";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, SURFACE_CARD } from "@/components/ui/surfaces";
import { cn } from "@/lib/utils";

const categories = ["All", "Loupes", "Lights", "Ergonomics", "Support"];

function ArticleCard({ article }: { article: ArticleData }) {
    const meta = [
        article.author, // Fixed locale + timezone so server and browser render the same string (no hydration mismatch)
        new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
        article.publishedTime,
        typeof article.views === "number" ? `${article.views} views` : undefined,
    ].filter(Boolean);

    return (
        <Link href={`/support/articles/${article.slug}`} className={`${INTERACTIVE_CARD} h-full overflow-hidden`}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            {article.imageSrc && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                    <Image
                        src={article.imageSrc}
                        alt={article.imageAlt || article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.02]"
                        loading="lazy"
                    />
                </div>
            )}

            <div className="flex flex-1 flex-col p-6 md:p-7">
                <p className="text-primary-700 text-[13px] font-medium">{article.category}</p>
                <h2 className="mt-2 line-clamp-2 text-lg leading-snug font-semibold tracking-[-0.015em] text-neutral-900 md:text-xl">{article.title}</h2>
                <p className="mt-2 line-clamp-3 flex-1 text-[15px] leading-relaxed text-neutral-600">{article.excerpt}</p>
                <p className="mt-4 text-[13px] text-neutral-500">{meta.join(" · ")}</p>
                <span className="text-primary-700 mt-4 inline-flex items-center gap-1 text-[15px] font-medium">
                    Read More
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
            </div>
        </Link>
    );
}

export function ArticlesPageClient() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredArticles = useMemo(() => (selectedCategory === "All" ? articles : articles.filter((article: ArticleData) => article.category === selectedCategory)), [selectedCategory]);

    return (
        <div className="space-y-8">
            {/* Category Filter */}
            <div role="tablist" aria-label="Filter articles by category" className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
                {categories.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "focus-visible:outline-primary-500 inline-flex min-h-11 flex-none items-center rounded-full px-5 text-[15px] font-medium transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
                                isActive ? "bg-neutral-900 text-white" : "bg-neutral-900/[0.05] text-neutral-700 hover:bg-neutral-900/10"
                            )}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>

            {/* Articles List */}
            <div role="tabpanel" aria-label={`${selectedCategory} articles`}>
                {filteredArticles.length > 0 ? (
                    <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
                        {filteredArticles.map((article: ArticleData) => (
                            <li key={article.id}>
                                <article className="h-full">
                                    <ArticleCard article={article} />
                                </article>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={`${SURFACE_CARD} py-16 text-center`}>
                        <p className="text-[15px] text-neutral-600">No articles found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
