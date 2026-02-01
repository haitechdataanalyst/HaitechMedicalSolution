// Entity Types
export type EntityType = "category" | "product";

// Content Block Types
export type ContentBlock = HeroBlock | DescriptionBlock | SpecificationsBlock | InfoBlock | ActionsBlock | GalleryBlock;

// Category type for categories.json
export interface Category {
  id: number;
  slug: string;
  name: string;
  type: "category";
  description?: string;
  image?: string;
  parent: number | null;
  order: number;
  children: number[];
}

// Product Variant type
export interface ProductVariant {
  id: string;
  frameStyle?: string;
  color?: string;
  grit?: string;
  sku: string;
  image: string;
  priceModifier: number;
}

// Product type for products.json
export interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  category: number;
  order: number;
  sku: string;
  basePrice?: number;
  currency?: string;
  colorCode?: string;
  hasVariants?: boolean;
  variantType?: string;
  variants?: ProductVariant[];
  defaultImage?: string;
  gallery?: string[];
  contentBlocks: ContentBlock[];
  relatedProducts?: number[];
  accessories?: number[];
}

// Union type for backwards compatibility in some components
export type Entity = Category | Product;

// Legacy BaseEntity interface for components still using it
export interface BaseEntity {
  id: number;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  parent?: number | null;
  order?: number;
}

// Content Blocks
export interface HeroBlock {
  type: "hero";
  data: {
    primaryImage: string;
    gallery?: string[];
  };
}

export interface DescriptionBlock {
  type: "description";
  data: {
    primary: string;
    secondary?: string;
  };
}

export interface SpecificationsBlock {
  type: "specifications";
  data: {
    title?: string;
    rows: Array<{
      label: string;
      value: string;
    }>;
  };
}

export interface InfoBlock {
  type: "info";
  data: {
    manufacturer?: string;
    warranty?: string;
    packageContents?: string[];
  };
}

export interface CustomField {
  id?: string;
  name?: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  required?: boolean;
  options?: (string | { value: string; label: string })[];
  min?: number;
  max?: number;
}

export interface ActionsBlock {
  type: "actions";
  data: {
    addToCart: boolean;
    customization?: boolean;
    customFields?: CustomField[];
  };
}

export interface GalleryBlock {
  type: "gallery";
  data: {
    images: string[];
    layout?: "grid" | "carousel";
  };
}

// Cart Types
export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  basePrice?: number;
  customization?: Record<string, string | number>;
  image?: string;
}

// Site Configuration Types
export interface SiteConfig {
  company: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  };
  emails: {
    quotes: string;
    contact: string;
    support: string;
  };
  currencies: string[];
  defaultCurrency: string;
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export interface Navigation {
  header: NavItem[];
  footer: {
    sections: FooterSection[];
  };
}

// Form Types
export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Breadcrumb Types
export interface Breadcrumb {
  name: string;
  path: string;
}
