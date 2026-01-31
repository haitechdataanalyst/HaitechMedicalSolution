import Link from 'next/link';
import { Entity } from '@/types';
import { getEntityPath } from '@/lib/catalog';
import { formatCurrency } from '@/lib/cart';
import Card, { CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';

interface ProductCardProps {
  entity: Entity;
}

export default function ProductCard({ entity }: ProductCardProps) {
  const href = getEntityPath(entity);
  const isProduct = entity.type === 'product';
  const price = isProduct ? (entity as any).basePrice : null;

  return (
    <Link href={href} className="block h-full">
      <Card hover className="h-full">
        <CardImage
          src={entity.image || '/images/placeholder.jpg'}
          alt={entity.name}
        />
        <CardContent>
          <CardTitle>{entity.name}</CardTitle>
          {entity.description && (
            <CardDescription className="line-clamp-2">
              {entity.description}
            </CardDescription>
          )}
          {isProduct && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-lg font-semibold text-primary-600">
                {price ? formatCurrency(price) : 'POA'}
              </span>
              <span className="text-xs text-subtle uppercase tracking-wide truncate">
                {(entity as any).sku}
              </span>
            </div>
          )}
          {!isProduct && (
            <div className="mt-3">
              <span className="text-sm text-primary-600 font-medium">
                View Products →
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
