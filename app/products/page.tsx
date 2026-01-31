import { getTopCategories } from '@/lib/catalog';
import ProductGrid from '@/components/products/ProductGrid';
import { Breadcrumbs } from '@/components/ui';

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
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="heading-1 mb-4">Our Products</h1>
          <p className="text-base sm:text-lg text-muted max-w-3xl">
            Explore our comprehensive range of premium medical and dental equipment. 
            From precision loupes to powerful LED headlights, we have everything you need 
            for exceptional clinical performance.
          </p>
        </div>

        {/* Category Grid */}
        <ProductGrid items={categories} emptyMessage="No product categories found" />
      </div>
    </>
  );
}
