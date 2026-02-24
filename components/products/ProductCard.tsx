import Link from "next/link";
import { Product, Category } from "@/types";
import Card, { CardImage, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "../ui";

interface ProductCardProps {
    entity: Product | Category;
    href: string;
    image?: string;
}

function isProduct(entity: Product | Category): entity is Product {
    return "sku" in entity;
}

export default function ProductCard({ entity, href, image }: ProductCardProps) {
    const entityIsProduct = isProduct(entity);

    const displayImage = image || "/images/placeholder.jpg";

    return (
        <Card hover className="h-full">
            <Link href={href}>
                <CardImage src={displayImage} alt={entity.name} />
            </Link>
            <CardContent>
                <CardTitle>{entity.name}</CardTitle>
                {entity.description && <CardDescription className="line-clamp-2">{entity.description}</CardDescription>}
                {entityIsProduct && (
                    <div className="flex h-full w-full items-center justify-center pt-2">
                        <Link className="w-full" href={href}>
                            <Button variant="outline" className="w-full">
                                Get a Quote
                            </Button>
                        </Link>
                    </div>
                )}
                {!entityIsProduct && (
                    <div className="mt-3">
                        <span className="text-primary-600 text-sm font-medium">View Products →</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
