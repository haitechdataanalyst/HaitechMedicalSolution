import Link from "next/link";
import { Entity, Product } from "@/types";
import { getEntityPath } from "@/lib/catalog";
import { formatCurrency } from "@/lib/cart";
import Card, { CardImage, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "../ui";

interface ProductCardProps {
  entity: Entity;
}

function isProduct(entity: Entity): entity is Product {
  return entity.type === "product";
}

export default function ProductCard({ entity }: ProductCardProps) {
  const href = getEntityPath(entity);
  const entityIsProduct = isProduct(entity);

  return (
    <Card hover className="h-full">
      <Link href={href}>
        <CardImage src={entity.image || ""} alt={entity.name} />
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
