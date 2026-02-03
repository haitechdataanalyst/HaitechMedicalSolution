"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, User, Tag, ArrowRight, Clock, Eye } from "lucide-react";
import { articles, ArticleData } from "@/components/articles";

const categories = ["All", "Loupes", "Lights", "Ergonomics", "Support"];

export function ArticlesPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article: ArticleData) => article.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article: ArticleData) => (
          <article
            key={article.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col md:flex-row md:items-center"
          >
            {/* Thumbnail Image / Placeholder */}
            <div className="relative h-40 w-full md:h-40 md:w-52 lg:w-64 overflow-hidden shrink-0 bg-gray-50">
              {article.imageSrc ? (
                <img
                  src={article.imageSrc}
                  alt={article.imageAlt || article.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="p-6 flex-1">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-primary-600" />
                <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                <Link
                  href={`/support/articles/${article.slug}`}
                  className="hover:text-primary-600 transition-colors"
                >
                  {article.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                {article.publishedTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.publishedTime}</span>
                  </div>
                )}
                {typeof article.views === "number" && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{article.views} views</span>
                  </div>
                )}
              </div>

              {/* Read More Link */}
              <Link
                href={`/support/articles/${article.slug}`}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
              >
                Read More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}