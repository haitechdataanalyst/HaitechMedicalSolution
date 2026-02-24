"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Calendar, User, Tag, ArrowRight, Clock, Eye } from "lucide-react";
import { articles, ArticleData } from "@/components/articles";

const categories = ["All", "Loupes", "Lights", "Ergonomics", "Support"];

export function ArticlesPageClient() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredArticles = useMemo(
        () => (selectedCategory === "All" ? articles : articles.filter((article: ArticleData) => article.category === selectedCategory)),
        [selectedCategory]
    );

    return (
        <div className="space-y-8">
            {/* Category Filter */}
            <div role="tablist" aria-label="Filter articles by category" className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        role="tab"
                        aria-selected={selectedCategory === category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === category ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Articles List */}
            <div role="tabpanel" aria-label={`${selectedCategory} articles`} className="space-y-4">
                {filteredArticles.map((article: ArticleData) => (
                    <article
                        key={article.id}
                        className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md md:flex-row md:items-center"
                    >
                        {/* Thumbnail Image / Placeholder */}
                        {article.imageSrc && (
                            <div className="relative h-40 w-full shrink-0 overflow-hidden bg-gray-50 md:h-40 md:w-52 lg:w-64">
                                <Image
                                    src={article.imageSrc}
                                    alt={article.imageAlt || article.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 256px"
                                    className="object-cover"
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <div className="flex-1 p-6">
                            {/* Category Badge */}
                            <div className="mb-3 flex items-center gap-2">
                                <Tag className="text-primary-600 h-4 w-4" />
                                <span className="text-primary-600 text-xs font-medium tracking-wide uppercase">{article.category}</span>
                            </div>

                            {/* Title */}
                            <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                                <Link href={`/support/articles/${article.slug}`} className="hover:text-primary-600 transition-colors">
                                    {article.title}
                                </Link>
                            </h3>

                            {/* Excerpt */}
                            <p className="mb-4 line-clamp-3 text-sm text-gray-600">{article.excerpt}</p>

                            {/* Meta Info */}
                            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{article.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                </div>
                                {article.publishedTime && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{article.publishedTime}</span>
                                    </div>
                                )}
                                {typeof article.views === "number" && (
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        <span>{article.views} views</span>
                                    </div>
                                )}
                            </div>

                            {/* Read More Link */}
                            <Link href={`/support/articles/${article.slug}`} className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2 text-sm font-medium transition-colors">
                                Read More
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-gray-500">No articles found in this category.</p>
                </div>
            )}
        </div>
    );
}
