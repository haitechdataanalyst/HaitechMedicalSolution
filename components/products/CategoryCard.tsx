import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";

interface CategoryCardProps {
    category: Category;
    href: string;
    childCount?: number;
}

export default function CategoryCard({ category, href, childCount }: CategoryCardProps) {
    return (
        <Link href={href} className={`${INTERACTIVE_CARD} h-full p-2`}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={category.image || "/images/site/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-contain p-6 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 300px"
                />
            </div>
            <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
                <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{category.name}</h3>
                {category.description && <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">{category.description}</p>}
                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <span className="text-primary-700 inline-flex items-center gap-1 text-sm font-medium">
                        Browse
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    {childCount !== undefined && (
                        <span className="text-[13px] text-neutral-500">
                            {childCount} {childCount === 1 ? "item" : "items"}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
