import { getTopCategories, getCategoryContents } from '@/lib/catalog';
import { ProductsPageClient } from './ProductsPageClient';
import { Breadcrumbs } from '@/components/ui';
import { Category, Product } from '@/types';

export const metadata = {
  title: 'Products | Haitech Medical',
  description: 'Browse our range of premium medical and dental equipment including loupes, LED headlights, and accessories.',
};

export default function ProductsPage() {
  const categories = getTopCategories();
  
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Page Header - Centered */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Products</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of premium medical and dental equipment
          </p>
        </div>

        {/* Category Browser */}
        <ProductsPageClient initialCategories={categories} />
      </div>
    </>
  );
}
