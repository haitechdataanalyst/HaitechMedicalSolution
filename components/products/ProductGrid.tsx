import { Product, Category } from "@/types";
import ProductCard from "./ProductCard";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import BalancedGrid from "@/components/catalog/BalancedGrid";

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
        return <div className={`${SURFACE_CARD} flex h-40 items-center justify-center px-6 text-center text-sm text-neutral-500`}>{emptyMessage}</div>;
    }

    return (
        <BalancedGrid>
            {items.map((item) => (
                <ProductCard key={item.id} entity={item} href={item.path} image={item.defaultImage} />
            ))}
        </BalancedGrid>
    );
}
