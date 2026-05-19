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
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === category ? "bg-primary-500 text-white shadow-sm" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
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
                        className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:border-primary-100 hover:shadow-lg md:flex-row md:items-center"
                    >
                        {/* Thumbnail Image / Placeholder */}
                        {article.imageSrc && (
                            <div className="relative h-40 w-full shrink-0 overflow-hidden bg-neutral-50 md:h-40 md:w-52 lg:w-64">
                                <Image
                                    src={article.imageSrc}
                                    alt={article.imageAlt || article.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 256px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <div className="flex-1 p-6">
                            {/* Category Badge */}
                            <div className="mb-3">
                                <span className="label-tag label-tag-primary inline-flex items-center gap-1.5">
                                    <Tag className="h-3 w-3" />
                                    {article.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-neutral-900">
                                <Link href={`/support/articles/${article.slug}`} className="hover:text-primary-600 transition-colors">
                                    {article.title}
                                </Link>
                            </h3>

                            {/* Excerpt */}
                            <p className="mb-4 line-clamp-3 text-sm text-neutral-500">{article.excerpt}</p>

                            {/* Meta Info */}
                            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3 w-3" />
                                    <span>{article.author}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                </div>
                                {article.publishedTime && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" />
                                        <span>{article.publishedTime}</span>
                                    </div>
                                )}
                                {typeof article.views === "number" && (
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="h-3 w-3" />
                                        <span>{article.views} views</span>
                                    </div>
                                )}
                            </div>

                            {/* Read More Link */}
                            <Link href={`/support/articles/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">
                                Read More
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 py-16 text-center">
                    <p className="text-neutral-500">No articles found in this category.</p>
                </div>
            )}
        </div>
    );
}
