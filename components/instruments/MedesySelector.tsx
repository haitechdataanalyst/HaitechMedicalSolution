"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MedesyCategory, MedesyProduct } from "@/types";

interface MedesyCategoryCardProps {
    category: MedesyCategory;
    isSelected: boolean;
    onSelect: () => void;
}

function MedesyCategoryCard({ category, isSelected, onSelect }: MedesyCategoryCardProps) {
    return (
        <button
            onClick={onSelect}
            className={`group relative w-full overflow-hidden rounded-2xl border-2 bg-white p-6 text-left shadow-sm transition-all hover:shadow-lg ${
                isSelected ? "border-primary-500 ring-primary-200 ring-2" : "border-neutral-100 hover:border-neutral-200"
            }`}
        >
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
            </div>

            <div className="flex justify-center">
                <span className={`btn btn-primary w-full py-2 ${isSelected ? "bg-primary-600 text-white" : "bg-primary-600 group-hover:bg-primary-700 text-white"}`}>{category.name}</span>
            </div>

            <div className="absolute top-4 right-4 flex h-7 min-w-7 items-center justify-center rounded-full bg-neutral-100 px-2 text-xs font-semibold text-neutral-600">{category.products.length}</div>

            {isSelected && (
                <div className="bg-primary-500 absolute top-4 left-4 flex h-6 w-6 items-center justify-center rounded-full text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );
}

interface MedesyProductCardProps {
    product: MedesyProduct;
}

function MedesyProductCard({ product }: MedesyProductCardProps) {
    return (
        <div className="group flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:border-primary-100 hover:shadow-lg">
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            <div className="mb-3 flex justify-center">
                {!product.catalogueFile ? (
                    <Link href={`/our-instruments/${product.id}`} className="btn btn-primary w-full py-2">
                        {product.name}
                    </Link>
                ) : (
                    <span className="btn btn-primary w-full py-2">{product.name}</span>
                )}
            </div>

            <p className="mb-4 grow text-center text-sm text-neutral-600">{product.description}</p>

            {product.features && product.features.length > 0 && (
                <ul className="mb-4 space-y-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                            <svg className="text-primary-500 mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>
            )}

            {product.catalogueFile ? (
                <a href={product.catalogueFile} target="_blank" rel="noopener noreferrer" className="btn btn-outline py-2 text-sm">
                    Download Catalogue
                </a>
            ) : (
                <div className="mt-auto pt-2">
                    <Link href={`/our-instruments/${product.id}`} className="btn btn-ghost group-hover:bg-surface-tertiary w-full py-2 text-sm">
                        View Models →
                    </Link>
                </div>
            )}
        </div>
    );
}

interface MedesySelectorProps {
    categories: MedesyCategory[];
    initialCategorySlug?: string | null;
}

export function MedesySelector({ categories, initialCategorySlug }: MedesySelectorProps) {
    const getInitialCategoryId = () => {
        if (!initialCategorySlug) return null;
        const slugToCategoryId: Record<string, string> = {
            elevators: "elevators",
            forceps: "forceps",
            "periosteal-elevators": "periosteal-elevators",
            scissors: "scissors",
        };
        const categoryId = slugToCategoryId[initialCategorySlug];
        return categoryId && categories.some((c) => c.id === categoryId) ? categoryId : null;
    };

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(getInitialCategoryId());
    const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
    };

    return (
        <div className="space-y-12">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                    <MedesyCategoryCard key={category.id} category={category} isSelected={selectedCategoryId === category.id} onSelect={() => handleCategorySelect(category.id)} />
                ))}
            </div>

            {selectedCategory && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="mb-8 border-t-4 border-neutral-100 pt-8">
                        <div className="mx-auto mb-8 flex max-w-4xl flex-col items-center gap-8 md:flex-row">
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-50 md:w-1/2">
                                <Image src={selectedCategory.image} alt={selectedCategory.name} fill className="object-contain p-4" sizes="(max-width: 768px) 100vw, 50vw" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="heading-3 text-primary-800 mb-3">{selectedCategory.description}</h3>
                                <p className="text-body text-neutral-600">{selectedCategory.tagline}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {selectedCategory.products.map((product) => (
                                <MedesyProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
