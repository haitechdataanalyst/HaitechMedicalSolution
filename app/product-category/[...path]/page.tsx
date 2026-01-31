import { notFound } from 'next/navigation';
import {
  getAllStaticPaths,
  getEntityByPath,
  getCategoryChildren,
  getBreadcrumbs,
} from '@/lib/catalog';
import { Product, Category } from '@/types';
import { ProductDetail, ProductGrid } from '@/components/products';
import { Breadcrumbs } from '@/components/ui';

interface PageProps {
  params: Promise<{ path: string[] }>;
}

export async function generateStaticParams() {
  const paths = getAllStaticPaths();
  return paths.map((segments) => ({ path: segments }));
}

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  const fullPath = `/product-category/${path.join('/')}`;
  const entity = getEntityByPath(fullPath);

  if (!entity) {
    return {
      title: 'Not Found | Haitech Medical',
    };
  }

  return {
    title: `${entity.name} | Haitech Medical`,
    description: entity.description || `Browse ${entity.name} at Haitech Medical`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { path } = await params;
  const fullPath = `/product-category/${path.join('/')}`;
  const entity = getEntityByPath(fullPath);

  if (!entity) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbs(entity);

  // If it's a product nested in categories
  if (entity.type === 'product') {
    return (
      <>
        <Breadcrumbs items={breadcrumbs} />
        <ProductDetail product={entity as Product} />
      </>
    );
  }

  // If it's a category, show children
  const children = getCategoryChildren(entity.id);
  const category = entity as Category;

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Category Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="heading-1 mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-base sm:text-lg text-muted max-w-3xl">{category.description}</p>
          )}
        </div>

        {/* Products/Subcategories Grid */}
        <ProductGrid
          items={children}
          emptyMessage={`No items found in ${category.name}`}
        />
      </div>
    </>
  );
}
