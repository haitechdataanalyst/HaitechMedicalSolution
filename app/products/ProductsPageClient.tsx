'use client';

import { CategoryBrowser } from '@/components/products';
import { Category } from '@/types';
import { fetchCategoryContentsAction } from '@/app/actions/catalog';

interface ProductsPageClientProps {
  initialCategories: Category[];
}

export function ProductsPageClient({ initialCategories }: ProductsPageClientProps) {
  return (
    <CategoryBrowser
      initialCategories={initialCategories}
      fetchCategoryContents={fetchCategoryContentsAction}
    />
  );
}
