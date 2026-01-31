import { notFound } from 'next/navigation';
import { getAllProducts, getEntityBySlug, getBreadcrumbs, getEntityPath } from '@/lib/catalog';
import { Product } from '@/types';
import { ProductDetail } from '@/components/products';
import { Breadcrumbs } from '@/components/ui';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();

  // Only include products that would use the /product/[slug] route
  // (i.e., products without a parent category, though in our data structure
  // all products have parents, so this might not return anything)
  return products
    .filter((p) => {
      const path = getEntityPath(p);
      return path.startsWith('/product/');
    })
    .map((product) => ({
      slug: product.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getEntityBySlug(slug);

  if (!product || product.type !== 'product') {
    return {
      title: 'Product Not Found | Haitech Medical',
    };
  }

  return {
    title: `${product.name} | Haitech Medical`,
    description: product.description || `View ${product.name} at Haitech Medical`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getEntityBySlug(slug);

  if (!product || product.type !== 'product') {
    notFound();
  }

  const breadcrumbs = getBreadcrumbs(product);

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <ProductDetail product={product as Product} />
    </>
  );
}
