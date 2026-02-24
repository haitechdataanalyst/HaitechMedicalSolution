import Link from "next/link";
import { Product } from "@/types";
import { Button, Carousel } from "../ui";
import { ProductCard } from "../products";

// Product with computed path for linking
interface ProductWithPath extends Product {
    path: string;
}

interface TrendingProductsProps {
    products: ProductWithPath[];
}

export default function TrendingProducts({ products }: TrendingProductsProps) {
    return (
        <section className="section bg-surface-secondary">
            <div className="container">
                <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
                    <div className="text-center-mobile">
                        <h2 className="heading-2 text-foreground mb-2">Trending Products</h2>
                        <p className="text-body-lg text-muted">Our most popular equipment choices</p>
                    </div>
                    <Link href="/products" className="w-full-mobile">
                        <Button variant="outline" className="w-full md:w-auto">
                            View All Products
                        </Button>
                    </Link>
                </div>
                <Carousel
                    slidesToShow={1}
                    gap={24}
                    showDots={true}
                    arrowVariant="default"
                    responsive={{
                        640: { slidesToShow: 2 },
                        768: { slidesToShow: 3 },
                        1024: { slidesToShow: 4 },
                    }}
                >
                    {products.map((product) => (
                        <ProductCard key={product.slug} entity={product} href={product.path} image={product.defaultImage} />
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
