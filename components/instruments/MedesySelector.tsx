"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MedesyCategory, MedesyProduct } from "@/types";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { SelectionMark, StepHeading, selectorTileClass } from "@/components/catalog/listing";

interface MedesyCategoryCardProps {
    category: MedesyCategory;
    isSelected: boolean;
    onSelect: () => void;
}

function MedesyCategoryCard({ category, isSelected, onSelect }: MedesyCategoryCardProps) {
    return (
        <button type="button" onClick={onSelect} aria-pressed={isSelected} className={selectorTileClass(isSelected)}>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain p-6 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                />
            </div>
            <div className="flex min-h-11 items-center justify-between gap-3 px-2.5 pt-4 pb-2.5">
                <span>
                    <span className="block text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{category.name}</span>
                    <span className="block text-[13px] text-neutral-500 tabular-nums">
                        {category.products.length} {category.products.length === 1 ? "range" : "ranges"}
                    </span>
                </span>
                <SelectionMark isSelected={isSelected} />
            </div>
        </button>
    );
}

interface MedesyProductCardProps {
    product: MedesyProduct;
}

function MedesyProductCard({ product }: MedesyProductCardProps) {
    return (
        <div className={`${SURFACE_CARD} flex h-full flex-col p-2`}>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 mix-blend-multiply"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
                <h4 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">{product.name}</h4>

                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{product.description}</p>

                {product.features && product.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                        {product.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                                <Check className="text-primary-700 mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-auto pt-5">
                    {product.catalogueFile ? (
                        <a href={product.catalogueFile} target="_blank" rel="noopener noreferrer" className="btn btn-md btn-outline w-full">
                            Download Catalogue
                        </a>
                    ) : (
                        <Link href={`/our-instruments/${product.id}`} className="btn btn-md btn-secondary group w-full">
                            View Models
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                    )}
                </div>
            </div>
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
        <div className="space-y-14 md:space-y-16">
            <div className="mx-auto max-w-5xl">
                <StepHeading step={1}>Choose an instrument type</StepHeading>
                <div className="mt-5 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
                    {categories.map((category) => (
                        <MedesyCategoryCard key={category.id} category={category} isSelected={selectedCategoryId === category.id} onSelect={() => handleCategorySelect(category.id)} />
                    ))}
                </div>
            </div>

            {selectedCategory && (
                <div className="motion-safe:animate-popover-in">
                    <div className="mx-auto max-w-5xl">
                        <StepHeading step={2}>Choose a range</StepHeading>
                        <div className="mt-5 flex flex-col items-center gap-6 md:flex-row md:gap-10">
                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-900/[0.05] md:w-1/2">
                                <Image src={selectedCategory.image} alt={selectedCategory.name} fill className="object-contain p-6" sizes="(max-width: 768px) 100vw, 50vw" />
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-[1.75rem]">{selectedCategory.description}</p>
                                <p className="mt-3 text-base leading-relaxed text-neutral-600 md:text-[17px]">{selectedCategory.tagline}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {selectedCategory.products.map((product) => (
                            <MedesyProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
