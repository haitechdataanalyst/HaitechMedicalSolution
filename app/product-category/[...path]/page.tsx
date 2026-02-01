import { notFound } from "next/navigation";
import {
  getAllStaticPaths,
  resolvePathToEntity,
  getCategoryContents,
  getCategoryBreadcrumbs,
  getProductBreadcrumbs,
  getProductPath,
  getCategoryPath,
  getRelatedProducts,
  getProductAccessories,
} from "@/lib/catalog";
import { Product, Category } from "@/types";
import { ProductDetail } from "@/components/products";
import { Breadcrumbs } from "@/components/ui";
import { CategoryPageClient } from "./CategoryPageClient";

interface PageProps {
  params: Promise<{ path: string[] }>;
}

export async function generateStaticParams() {
  const paths = getAllStaticPaths();
  return paths.map((segments) => ({ path: segments }));
}

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  const result = resolvePathToEntity(path);

  if (!result) {
    return {
      title: "Not Found | Haitech Medical",
    };
  }

  return {
    title: `${result.entity.name} | Haitech Medical`,
    description: result.entity.description || `Browse ${result.entity.name} at Haitech Medical`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { path } = await params;
  const result = resolvePathToEntity(path);

  if (!result) {
    notFound();
  }

  // If it's a product, show product detail
  if (result.type === "product") {
    const product = result.entity as Product;
    const breadcrumbs = getProductBreadcrumbs(product);
    const relatedProducts = getRelatedProducts(product).map((p) => ({ ...p, path: getProductPath(p) }));
    console.log("RElated Products:", relatedProducts);
    const accessories = getProductAccessories(product).map((p) => ({ ...p, path: getProductPath(p) }));

    return (
      <>
        <Breadcrumbs items={breadcrumbs} />
        <ProductDetail product={product} relatedProducts={relatedProducts} accessories={accessories} />
      </>
    );
  }

  // If it's a category, show category browser starting from this category
  const category = result.entity as Category;
  const breadcrumbs = getCategoryBreadcrumbs(category);
  const contents = getCategoryContents(category.id);

  // Add paths to the initial items
  const initialItemsWithPaths =
    contents.type === "categories"
      ? (contents.items as Category[]).map((cat) => ({ ...cat, path: getCategoryPath(cat) }))
      : (contents.items as Product[]).map((prod) => ({ ...prod, path: getProductPath(prod) }));

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Category Header - Centered */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{category.name}</h1>
          {category.description && <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">{category.description}</p>}
        </div>

        {/* Category Browser Client Component */}
        <CategoryPageClient initialItems={initialItemsWithPaths} initialType={contents.type} />
      </div>
    </>
  );
}
