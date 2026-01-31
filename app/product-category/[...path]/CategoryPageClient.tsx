'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CategoryBrowser, type CategoryWithPath, type ProductWithPath } from '@/components/products';
import { fetchCategoryContentsAction } from '@/app/actions/catalog';

interface CategoryPageClientProps {
  initialItems: CategoryWithPath[] | ProductWithPath[];
  initialType: 'categories' | 'products';
}

export function CategoryPageClient({ initialItems, initialType }: CategoryPageClientProps) {
  // If we have categories, use the CategoryBrowser
  if (initialType === 'categories') {
    return (
      <CategoryBrowser
        initialCategories={initialItems as CategoryWithPath[]}
        fetchCategoryContents={fetchCategoryContentsAction}
      />
    );
  }

  // If we have products directly, render them in a simple grid
  const products = initialItems as ProductWithPath[];
  
  return (
    <div className="w-full">
      {/* Section Header with divider lines */}
      <div className="my-6 flex items-center gap-4 sm:my-8">
        <div className="h-px flex-1 bg-gray-200" />
        <h2 className="px-4 text-xl font-light whitespace-nowrap text-gray-600 sm:text-2xl">
          Products
        </h2>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Products Grid */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
        {products.map((product) => {
          const productImage = product.defaultImage || 
            (product.variants && product.variants.length > 0 ? product.variants[0].image : '') ||
            (product.gallery && product.gallery.length > 0 ? product.gallery[0] : '') ||
            '/images/placeholder.jpg';
          const productPath = product.path || `/product/${product.slug}`;

          return (
            <Link
              key={product.id}
              href={productPath}
              className="group flex flex-col items-center p-4 text-center transition-transform hover:scale-105"
            >
              <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-sm transition-shadow group-hover:shadow-md sm:h-28 sm:w-28 md:h-32 md:w-32">
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                />
              </div>
              <span className="group-hover:text-primary-600 line-clamp-2 max-w-30 text-sm font-medium text-gray-700 transition-colors">
                {product.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
