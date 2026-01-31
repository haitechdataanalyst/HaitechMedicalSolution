import { Entity } from '@/types';
import ProductCard from './ProductCard';
import { InboxIcon } from '@/components/icons';

interface ProductGridProps {
  items: Entity[];
  emptyMessage?: string;
}

export default function ProductGrid({ items, emptyMessage = 'No products found' }: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <InboxIcon size={64} className="text-gray-300 mx-auto mb-4" />
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {items.map((item) => (
        <ProductCard key={item.id} entity={item} />
      ))}
    </div>
  );
}
