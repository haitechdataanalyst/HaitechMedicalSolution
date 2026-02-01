import fs from "fs";
import path from "path";
import { Product, Category, Breadcrumb } from "@/types";

const categoriesPath = path.join(process.cwd(), "data", "categories.json");
const productsPath = path.join(process.cwd(), "data", "products.json");

let categoriesCache: Category[] | null = null;
let productsCache: Product[] | null = null;

function loadCategories(): Category[] {
  if (!categoriesCache) {
    const fileContents = fs.readFileSync(categoriesPath, "utf8");
    categoriesCache = JSON.parse(fileContents);
  }
  return categoriesCache!;
}

function loadProducts(): Product[] {
  if (!productsCache) {
    const fileContents = fs.readFileSync(productsPath, "utf8");
    productsCache = JSON.parse(fileContents);
  }
  return productsCache!;
}

// Get all categories
export function getAllCategories(): Category[] {
  return loadCategories().sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get all products
export function getAllProducts(): Product[] {
  return loadProducts().sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get category by ID
export function getCategoryById(id: number): Category | null {
  const categories = loadCategories();
  return categories.find((c) => c.id === id) || null;
}

// Get product by ID
export function getProductById(id: number): Product | null {
  const products = loadProducts();
  return products.find((p) => p.id === id) || null;
}

// Get category by slug
export function getCategoryBySlug(slug: string): Category | null {
  const categories = loadCategories();
  return categories.find((c) => c.slug === slug) || null;
}

// Get product by slug
export function getProductBySlug(slug: string): Product | null {
  const products = loadProducts();
  return products.find((p) => p.slug === slug) || null;
}

// Get top-level categories (parent = null)
export function getTopCategories(): Category[] {
  const categories = loadCategories();
  return categories.filter((c) => c.parent === null).sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get child categories of a parent category
export function getChildCategories(parentId: number): Category[] {
  const parent = getCategoryById(parentId);
  if (!parent || !parent.children || parent.children.length === 0) return [];

  const categories = loadCategories();
  return parent.children
    .map((childId) => categories.find((c) => c.id === childId))
    .filter((c): c is Category => c !== undefined)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get products in a category
export function getProductsByCategory(categoryId: number): Product[] {
  const products = loadProducts();
  return products.filter((p) => p.category === categoryId).sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get category children (subcategories or products if no subcategories)
export function getCategoryContents(categoryId: number): { type: "categories" | "products"; items: Category[] | Product[] } {
  const childCategories = getChildCategories(categoryId);

  if (childCategories.length > 0) {
    return { type: "categories", items: childCategories };
  }

  const products = getProductsByCategory(categoryId);
  return { type: "products", items: products };
}

// Build URL path for a category
export function getCategoryPath(category: Category): string {
  const categories = loadCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const pathParts: string[] = [];
  let current: Category | undefined = category;

  while (current) {
    pathParts.unshift(current.slug);
    current = current.parent !== null ? categoryMap.get(current.parent) : undefined;
  }

  return `/product-category/${pathParts.join("/")}`;
}

// Build URL path for a product
export function getProductPath(product: Product): string {
  const category = getCategoryById(product.category);

  if (category) {
    // Build full category path first
    const categoryPath = getCategoryPath(category);
    return `${categoryPath}/${product.slug}`;
  }

  return `/product/${product.slug}`;
}

// Resolve a URL path to find the category or product
export function resolvePathToEntity(pathSegments: string[]): { type: "category" | "product"; entity: Category | Product } | null {
  const categories = loadCategories();
  const products = loadProducts();

  // Build category slug path map
  const categoryPathMap = new Map<string, Category>();
  categories.forEach((cat) => {
    const fullPath = getCategoryPath(cat).replace("/product-category/", "");
    categoryPathMap.set(fullPath, cat);
  });

  // First, try to match as a category
  const fullPath = pathSegments.join("/");
  const matchedCategory = categoryPathMap.get(fullPath);
  if (matchedCategory) {
    return { type: "category", entity: matchedCategory };
  }

  // Try to match as a product (last segment is product slug)
  if (pathSegments.length > 0) {
    const productSlug = pathSegments[pathSegments.length - 1];
    const categoryPath = pathSegments.slice(0, -1).join("/");

    const parentCategory = categoryPathMap.get(categoryPath);
    if (parentCategory) {
      const product = products.find((p) => p.slug === productSlug && p.category === parentCategory.id);
      if (product) {
        return { type: "product", entity: product };
      }
    }
  }

  return null;
}

// Get breadcrumb trail for a category
export function getCategoryBreadcrumbs(category: Category): Breadcrumb[] {
  const categories = loadCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const crumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  const trail: Category[] = [];
  let current: Category | undefined = category;

  while (current) {
    trail.unshift(current);
    current = current.parent !== null ? categoryMap.get(current.parent) : undefined;
  }

  trail.forEach((cat) => {
    crumbs.push({
      name: cat.name,
      path: getCategoryPath(cat),
    });
  });

  return crumbs;
}

// Get breadcrumb trail for a product
export function getProductBreadcrumbs(product: Product): Breadcrumb[] {
  const category = getCategoryById(product.category);

  if (!category) {
    return [
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: product.name, path: getProductPath(product) },
    ];
  }

  const crumbs = getCategoryBreadcrumbs(category);
  crumbs.push({
    name: product.name,
    path: getProductPath(product),
  });

  return crumbs;
}

// Get related products
export function getRelatedProducts(product: Product): Product[] {
  if (!product.relatedProducts || product.relatedProducts.length === 0) return [];

  const products = loadProducts();
  return product.relatedProducts.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => p !== undefined);
}

// Get product accessories
export function getProductAccessories(product: Product): Product[] {
  if (!product.accessories || product.accessories.length === 0) return [];

  const products = loadProducts();
  return product.accessories.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => p !== undefined);
}

// Generate all static paths for dynamic routing
export function getAllStaticPaths(): string[][] {
  const categories = loadCategories();
  const products = loadProducts();
  const paths: string[][] = [];

  // Add all category paths
  categories.forEach((cat) => {
    const urlPath = getCategoryPath(cat);
    const segments = urlPath.replace("/product-category/", "").split("/");
    paths.push(segments);
  });

  // Add all product paths
  products.forEach((product) => {
    const urlPath = getProductPath(product);
    if (urlPath.startsWith("/product-category/")) {
      const segments = urlPath.replace("/product-category/", "").split("/");
      paths.push(segments);
    }
  });

  return paths;
}

// Helper to get product image (default or first variant)
export function getProductImage(product: Product): string {
  if (product.defaultImage) return product.defaultImage;
  if (product.variants && product.variants.length > 0) {
    return product.variants[0].image;
  }
  if (product.gallery && product.gallery.length > 0) {
    return product.gallery[0];
  }
  return "/images/placeholder.jpg";
}
