import fs from 'fs';
import path from 'path';
import { Entity, Product, Category, Breadcrumb } from '@/types';

const catalogPath = path.join(process.cwd(), 'data', 'catalog.json');

let catalogCache: { entities: Entity[] } | null = null;

function loadCatalog(): { entities: Entity[] } {
  if (!catalogCache) {
    const fileContents = fs.readFileSync(catalogPath, 'utf8');
    catalogCache = JSON.parse(fileContents);
  }
  return catalogCache!;
}

export function getAllEntities(): Entity[] {
  const catalog = loadCatalog();
  return catalog.entities;
}

export function getEntityById(id: string): Entity | null {
  const entities = getAllEntities();
  return entities.find(e => e.id === id) || null;
}

export function getEntityBySlug(slug: string, parent?: string): Entity | null {
  const entities = getAllEntities();
  return entities.find(e => 
    e.slug === slug && (!parent || e.parent === parent)
  ) || null;
}

// Build URL path for an entity
export function getEntityPath(entity: Entity): string {
  const entities = getAllEntities();
  const entityMap = new Map(entities.map(e => [e.id, e]));
  
  // Build path by walking up the tree
  const pathParts: string[] = [];
  let current: Entity | undefined = entity;
  
  while (current) {
    pathParts.unshift(current.slug);
    current = current.parent ? entityMap.get(current.parent) : undefined;
  }
  
  // Determine URL pattern based on type and depth
  if (entity.type === 'product') {
    // Check if product has a parent category
    if (entity.parent) {
      // Product nested in categories
      return `/product-category/${pathParts.join('/')}`;
    } else {
      // Direct product (no category)
      return `/product/${entity.slug}`;
    }
  } else if (entity.type === 'category') {
    if (!entity.parent) {
      // Top level category
      return `/product-category/${entity.slug}`;
    } else {
      return `/product-category/${pathParts.join('/')}`;
    }
  }
  
  return '/';
}

// Resolve path to entity (for dynamic routing)
export function getEntityByPath(urlPath: string): Entity | null {
  const entities = getAllEntities();
  
  for (const entity of entities) {
    const entityPath = getEntityPath(entity);
    if (entityPath === urlPath) {
      return entity;
    }
  }
  
  return null;
}

// Get children of a category
export function getCategoryChildren(categoryId: string): Entity[] {
  const entities = getAllEntities();
  const category = entities.find(e => e.id === categoryId && e.type === 'category') as Category | undefined;
  
  if (!category || !category.children) return [];
  
  return category.children
    .map(childId => entities.find(e => e.id === childId))
    .filter((e): e is Entity => e !== undefined)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get breadcrumb trail
export function getBreadcrumbs(entity: Entity): Breadcrumb[] {
  const entities = getAllEntities();
  const entityMap = new Map(entities.map(e => [e.id, e]));
  
  const crumbs: Breadcrumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' }
  ];
  
  // Build path from root to current entity
  const trail: Entity[] = [];
  let current: Entity | undefined = entity;
  
  while (current) {
    trail.unshift(current);
    current = current.parent ? entityMap.get(current.parent) : undefined;
  }
  
  // Add each entity in the trail to breadcrumbs
  trail.forEach(e => {
    crumbs.push({
      name: e.name,
      path: getEntityPath(e)
    });
  });
  
  return crumbs;
}

// Get top-level categories
export function getTopCategories(): Category[] {
  const entities = getAllEntities();
  return entities
    .filter((e): e is Category => e.type === 'category' && !e.parent)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get all products (for sitemap, search, etc.)
export function getAllProducts(): Product[] {
  const entities = getAllEntities();
  return entities.filter((e): e is Product => e.type === 'product');
}

// Get all categories
export function getAllCategories(): Category[] {
  const entities = getAllEntities();
  return entities.filter((e): e is Category => e.type === 'category');
}

// Get related products
export function getRelatedProducts(productId: string): Product[] {
  const product = getEntityById(productId) as Product | null;
  if (!product || !product.relatedProducts) return [];
  
  return product.relatedProducts
    .map(id => getEntityById(id) as Product | null)
    .filter((p): p is Product => p !== null && p.type === 'product');
}

// Get accessories for a product
export function getProductAccessories(productId: string): Product[] {
  const product = getEntityById(productId) as Product | null;
  if (!product || !product.accessories) return [];
  
  return product.accessories
    .map(id => getEntityById(id) as Product | null)
    .filter((p): p is Product => p !== null && p.type === 'product');
}

// Generate all static paths for categories and nested products
export function getAllStaticPaths(): string[][] {
  const entities = getAllEntities();
  const paths: string[][] = [];
  
  entities.forEach(entity => {
    const urlPath = getEntityPath(entity);
    if (urlPath.startsWith('/product-category/')) {
      const segments = urlPath.replace('/product-category/', '').split('/');
      paths.push(segments);
    }
  });
  
  return paths;
}
