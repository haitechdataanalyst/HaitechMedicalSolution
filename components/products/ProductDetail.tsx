import { Product } from '@/types';
import { getRelatedProducts, getProductAccessories } from '@/lib/catalog';
import ContentRenderer from './ContentRenderer';
import ProductGrid from './ProductGrid';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const relatedProducts = getRelatedProducts(product.id);
  const accessories = getProductAccessories(product.id);

  // Separate blocks for layout purposes
  const heroBlock = product.contentBlocks.find((b) => b.type === 'hero');
  const actionsBlock = product.contentBlocks.find((b) => b.type === 'actions');
  const descriptionBlock = product.contentBlocks.find((b) => b.type === 'description');
  const otherBlocks = product.contentBlocks.filter(
    (b) => !['hero', 'actions', 'description'].includes(b.type)
  );

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Product Header & Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-12">
        {/* Left Column - Images */}
        <div>
          {heroBlock && (
            <ContentRenderer blocks={[heroBlock]} product={product} />
          )}
        </div>

        {/* Right Column - Info & Actions */}
        <div className="space-y-6">
          {/* Title & SKU */}
          <div>
            <h1 className="heading-2 lg:heading-1 mb-2">
              {product.name}
            </h1>
            <p className="text-muted">SKU: {product.sku}</p>
          </div>

          {/* Description */}
          {descriptionBlock && (
            <ContentRenderer blocks={[descriptionBlock]} product={product} />
          )}

          {/* Actions (Add to Cart) */}
          {actionsBlock && (
            <ContentRenderer blocks={[actionsBlock]} product={product} />
          )}
        </div>
      </div>

      {/* Additional Content Blocks */}
      {otherBlocks.length > 0 && (
        <div className="border-t border-[var(--border-color)] pt-8 lg:pt-12 space-y-8 lg:space-y-12">
          <ContentRenderer blocks={otherBlocks} product={product} />
        </div>
      )}

      {/* Accessories */}
      {accessories.length > 0 && (
        <div className="border-t border-[var(--border-color)] pt-8 lg:pt-12 mt-8 lg:mt-12">
          <h2 className="heading-3 mb-6">
            Recommended Accessories
          </h2>
          <ProductGrid items={accessories} />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[var(--border-color)] pt-8 lg:pt-12 mt-8 lg:mt-12">
          <h2 className="heading-3 mb-6">
            Related Products
          </h2>
          <ProductGrid items={relatedProducts} />
        </div>
      )}
    </div>
  );
}
