import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug, getProductBreadcrumbs, getProductPath, getRelatedProducts, getProductAccessories } from '@/lib/catalog';
import { Product } from '@/types';
import { ProductDetail } from '@/components/products';
import { Breadcrumbs } from '@/components/ui';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();

  // Only include products that would use the /product/[slug] route
  // (i.e., products without a parent category - which in our structure
  // all products have parents, so this might not return anything)
  return products
    .filter((p) => {
      const path = getProductPath(p);
      return path.startsWith('/product/');
    })
    .map((product) => ({
      slug: product.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbs = getProductBreadcrumbs(product);
  const relatedProducts = getRelatedProducts(product).map(p => ({ ...p, path: getProductPath(p) }));
  const accessories = getProductAccessories(product).map(p => ({ ...p, path: getProductPath(p) }));

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <ProductDetail 
        product={product} 
        relatedProducts={relatedProducts}
        accessories={accessories}
      />
    </>
  );
}
