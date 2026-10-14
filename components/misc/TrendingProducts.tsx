import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "./SectionHeader";

interface ProductWithPath extends Product {
    path: string;
}

interface TrendingProductsProps {
    products: ProductWithPath[];
}

// Three calm rows of four on desktop; "See all" carries the rest of the catalog.
const VISIBLE_COUNT = 12;

function productImage(product: ProductWithPath) {
    return product.defaultImage || product.variants?.[0]?.image || product.gallery?.[0];
}

export default function TrendingProducts({ products }: TrendingProductsProps) {
    const items = products.slice(0, VISIBLE_COUNT);

    return (
        <section className="bg-neutral-50">
            <div className="section container">
                <ScrollReveal variant="fade">
                    <SectionHeader title="Trending Products" link={{ href: "/products", label: "See all" }} />
                </ScrollReveal>

                {/* Mobile: a snapping shelf that bleeds to the screen edge */}
                <ul className="scrollbar-hide -mx-(--container-padding) flex snap-x snap-mandatory scroll-px-(--container-padding) gap-3 overflow-x-auto px-(--container-padding) pb-4 md:hidden">
                    {items.map((product) => (
                        <li key={product.slug} className="w-[46%] max-w-[200px] flex-none snap-start">
                            <ProductCard entity={product} href={product.path} image={productImage(product)} />
                        </li>
                    ))}
                </ul>

                <ul className="hidden gap-5 md:grid md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                    {items.map((product) => (
                        <li key={product.slug} className="grid">
                            <ProductCard entity={product} href={product.path} image={productImage(product)} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
