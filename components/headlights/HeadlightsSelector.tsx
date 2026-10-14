"use client";

import { useState } from "react";
import Image from "next/image";
import { HeadlightCategory, HeadlightProduct, CartItem } from "@/types";
import { Button } from "@/components/ui";
import { useCart } from "@/components/cart/CartProvider";
import { COMMERCE_ENABLED } from "@/lib/config";
import { Check, ShoppingCart } from "lucide-react";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { SelectionMark, StepHeading, selectorTileClass } from "@/components/catalog/listing";

interface HeadlightCategoryCardProps {
    category: HeadlightCategory;
    isSelected: boolean;
    onSelect: () => void;
}

export function HeadlightCategoryCard({ category, isSelected, onSelect }: HeadlightCategoryCardProps) {
    return (
        <button type="button" onClick={onSelect} aria-pressed={isSelected} className={selectorTileClass(isSelected)}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain p-6 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                />
            </div>
            <div className="flex min-h-11 items-center justify-between gap-3 px-3 pt-4 pb-3">
                <h3 className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">{category.name}</h3>
                <SelectionMark isSelected={isSelected} />
            </div>
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
        <div className={`${SURFACE_CARD} flex h-full flex-col p-2`}>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image src={product.image} alt={product.name} fill className="object-contain p-6 mix-blend-multiply" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </div>

            <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
                <h4 className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">{product.name}</h4>

                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{product.description}</p>

                {product.features && product.features.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700">
                                <Check className="text-primary-700 mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Add to Cart stays part of the system for when e-commerce goes
                    live — gated the same way every other product surface
                    (ActionsBlock, ProductCard, MedesyVariantsGrid) already is.
                    Previously this was the one add-to-cart control on the whole
                    site NOT behind this flag, so it stayed live and reachable
                    even with commerce off, sending the JSON's string slug id
                    (e.g. "butterfly-s-evo") to the backend cart API instead of
                    a real integer product id — see [[feedback_architecture_policy]]. */}
                {COMMERCE_ENABLED && (
                    <div className="mt-auto pt-5">
                        <Button variant={added ? "primary" : "outline"} className="w-full gap-2" onClick={handleAddToCart}>
                            {added ? (
                                <>
                                    <Check className="h-4 w-4" aria-hidden="true" /> Added
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="h-4 w-4" aria-hidden="true" /> Add to Cart
                                </>
                            )}
                        </Button>
                    </div>
                )}
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
        <div className="space-y-14 md:space-y-16">
            <div className="mx-auto max-w-5xl">
                <StepHeading step={1}>Choose a power type</StepHeading>
                <div className="mt-5 grid max-w-3xl grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                    {categories.map((category) => (
                        <HeadlightCategoryCard key={category.id} category={category} isSelected={selectedCategoryId === category.id} onSelect={() => handleCategorySelect(category.id)} />
                    ))}
                </div>
            </div>

            {selectedCategory && (
                <div className="motion-safe:animate-popover-in">
                    <div className="mx-auto max-w-5xl">
                        <StepHeading step={2}>Choose your model</StepHeading>
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

                    <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-5 md:gap-6">
                        {selectedCategory.products.map((product) => (
                            <div key={product.id} className="flex w-full flex-col sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                                <HeadlightProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Series benefits and case contents — only when the data provides them */}
                    {(selectedCategory.benefits?.length || selectedCategory.inTheBox) && (
                        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:gap-6 lg:grid-cols-[1.4fr_1fr]">
                            {selectedCategory.benefits && selectedCategory.benefits.length > 0 && (
                                <div className={`${SURFACE_CARD} p-6 md:p-8`}>
                                    <h4 className="mb-5 text-lg font-semibold tracking-[-0.015em] text-neutral-900">Benefits</h4>
                                    <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                                        {selectedCategory.benefits.map((benefit) => (
                                            <li key={benefit.title} className="text-sm leading-relaxed text-neutral-600">
                                                <span className="mb-0.5 block text-[15px] font-semibold text-neutral-900">{benefit.title}</span>
                                                {benefit.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selectedCategory.inTheBox && (
                                <div className={`${SURFACE_CARD} p-6 md:p-8`}>
                                    <h4 className="mb-5 text-lg font-semibold tracking-[-0.015em] text-neutral-900">What&apos;s in the case</h4>
                                    {selectedCategory.inTheBox.image && (
                                        <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50">
                                            <Image
                                                src={selectedCategory.inTheBox.image}
                                                alt={`${selectedCategory.name} headlight case contents`}
                                                fill
                                                className="object-contain p-4 mix-blend-multiply"
                                                sizes="(max-width: 1024px) 100vw, 33vw"
                                            />
                                        </div>
                                    )}
                                    <ul className="space-y-2 text-sm leading-relaxed text-neutral-700">
                                        {selectedCategory.inTheBox.items.map((item) => (
                                            <li key={item} className="flex gap-2.5">
                                                <span className="bg-primary-600 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    {selectedCategory.inTheBox.note && <p className="mt-4 text-[13px] leading-relaxed text-neutral-500">{selectedCategory.inTheBox.note}</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
