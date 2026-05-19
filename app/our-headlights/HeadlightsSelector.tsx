"use client";

import { useState } from "react";
import Image from "next/image";
import { HeadlightCategory, HeadlightProduct, CartItem } from "@/types";
import { Button } from "@/components/ui";
import { useCart } from "@/components/cart/CartProvider";
import { Check, ShoppingCart } from "lucide-react";

interface HeadlightCategoryCardProps {
    category: HeadlightCategory;
    isSelected: boolean;
    onSelect: () => void;
}

export function HeadlightCategoryCard({ category, isSelected, onSelect }: HeadlightCategoryCardProps) {
    return (
        <button
            onClick={onSelect}
            className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl border-2 bg-white p-6 text-left shadow-sm transition-all hover:shadow-lg ${
                isSelected ? "border-primary-500 ring-primary-200 ring-2" : "border-neutral-100 hover:border-neutral-200"
            }`}
        >
            {/* Category Image */}
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image src={category.image} alt={category.name} fill className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
            </div>

            {/* Category Name Button */}
            <div className="flex justify-center">
                <span className={`btn btn-primary w-full py-2 ${isSelected ? "bg-primary-600 text-white" : "bg-primary-600 group-hover:bg-primary-700 text-white"}`}>{category.name}</span>
            </div>

            {/* Selection indicator */}
            {isSelected && (
                <div className="bg-primary-500 absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );
}

interface HeadlightProductCardProps {
    product: HeadlightProduct;
}

function HeadlightProductCard({ product }: HeadlightProductCardProps) {
    const { addItem, openCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        const cartItem: CartItem = {
            productId: product.id,
            productName: product.name,
            sku: product.id,
            quantity: 1,
            image: product.image,
        };
        addItem(cartItem);
        setAdded(true);
        openCart();
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="group rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:border-primary-100 hover:shadow-lg">
            {/* Product Image */}
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            {/* Product Name */}
            <div className="mb-3 flex justify-center">
                <span className="btn btn-primary hover:bg-primary-500 w-full cursor-default py-2">{product.name}</span>
            </div>

            {/* Product Description */}
            <p className="mb-4 text-sm text-neutral-600">{product.description}</p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
                <ul className="mb-4 space-y-1">
                    {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                            <Check className="size-4" />
                            {feature}
                        </li>
                    ))}
                </ul>
            )}

            {/* Add to Cart */}
            <div className="mt-auto pt-2">
                <Button variant={added ? "primary" : "outline"} className="w-full gap-2" onClick={handleAddToCart}>
                    {added ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
                </Button>
            </div>
        </div>
    );
}

interface HeadlightsSelectorProps {
    categories: HeadlightCategory[];
}

export function HeadlightsSelector({ categories }: HeadlightsSelectorProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
    };

    return (
        <div className="space-y-12">
            {/* Category Selection Cards */}
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
                {categories.map((category) => (
                    <HeadlightCategoryCard key={category.id} category={category} isSelected={selectedCategoryId === category.id} onSelect={() => handleCategorySelect(category.id)} />
                ))}
            </div>

            {/* Selected Category Products */}
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

                        {/* Products Grid */}
                        <div className="flex flex-wrap justify-center gap-6">
                            {selectedCategory.products.map((product) => (
                                <div key={product.id} className="flex w-full flex-col sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                                    <HeadlightProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
