'use server';

import { getCategoryContents, getChildCategories, getProductsByCategory, getCategoryPath, getProductPath } from '@/lib/catalog';
import { Category, Product } from '@/types';

export interface CategoryWithPath extends Category {
  path: string;
}

export interface ProductWithPath extends Product {
  path: string;
}

export async function fetchCategoryContentsAction(categoryId: number): Promise<{ 
  type: 'categories' | 'products'; 
  items: CategoryWithPath[] | ProductWithPath[];
}> {
  const contents = getCategoryContents(categoryId);
  
  if (contents.type === 'categories') {
    const categoriesWithPaths = (contents.items as Category[]).map(cat => ({
      ...cat,
      path: getCategoryPath(cat),
    }));
    return { type: 'categories', items: categoriesWithPaths };
  } else {
    const productsWithPaths = (contents.items as Product[]).map(prod => ({
      ...prod,
      path: getProductPath(prod),
    }));
    return { type: 'products', items: productsWithPaths };
  }
}

export async function getCategoryPathAction(category: Category): Promise<string> {
  return getCategoryPath(category);
}

export async function getProductPathAction(product: Product): Promise<string> {
  return getProductPath(product);
}
