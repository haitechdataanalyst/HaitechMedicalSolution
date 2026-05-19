import { Product, Category } from "@/types";
import ProductCard from "./ProductCard";
import { InboxIcon } from "@/components/icons";

// Items should include a path property for linking
interface ItemWithPath {
    path: string;
    defaultImage?: string;
}

interface ProductGridProps {
    items: ((Product | Category) & ItemWithPath)[];
    emptyMessage?: string;
}

export default function ProductGrid({ items, emptyMessage = "No products found" }: ProductGridProps) {
    if (items.length === 0) {
        return (
            <div className="py-12 text-center">
                <InboxIcon size={64} className="mx-auto mb-4 text-neutral-300" />
                <p className="text-muted">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
                <ProductCard key={item.id} entity={item} href={item.path} image={item.defaultImage} />
            ))}
        </div>
    );
}
