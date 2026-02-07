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
  specialPage?: string; // Optional URL for categories with their own dedicated page (e.g., "/our-frames")
}

// Frame Color type for frames.json
export interface FrameColor {
  id: string;
  name: string;
  hex: string | string[]; // Single color or array for gradients/combinations
  image?: string; // Optional image path for this specific color variant
}

// Frame type for frames.json
export interface Frame {
  id: string;
  name: string;
  image: string;
  priceModifier: number;
  colors: FrameColor[];
}

// Frames data structure
export interface FramesData {
  frames: Frame[];
}

// Headlight Product type
export interface HeadlightProduct {
  id: string;
  name: string;
  image: string;
  description: string;
  features: string[];
}

// Headlight Category type (Wireless/Wired)
export interface HeadlightCategory {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image: string;
  products: HeadlightProduct[];
}

// Headlights data structure
export interface HeadlightsData {
  intro: {
    title: string;
    description: string;
    features: string[];
  };
  categories: HeadlightCategory[];
}

// Medesy Product type
export interface MedesyProduct {
  id: string;
  name: string;
  image: string;
  description: string;
  features: string[];
}

// Medesy Category type (Elevators/Forceps/Periosteal Elevators/Scissors)
export interface MedesyCategory {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image: string;
  products: MedesyProduct[];
}

// Medesy data structure
export interface MedesyData {
  intro: {
    title: string;
    description: string;
    features: string[];
  };
  categories: MedesyCategory[];
}

// Frame variant configuration for products with frame-color variants
export interface FrameVariantConfig {
  availableFrames: string[]; // References to frame IDs from frames.json
  images: Record<string, string>; // Maps "frameId-colorId" to image path
  skuPattern?: string; // Pattern for generating SKUs e.g., "{baseSku}-{frame}-{color}"
}

// Product Variant type (legacy, for non-frame variants like grit, color, etc.)
export interface ProductVariant {
  id: string;
  name?: string;
  frameStyle?: string;
  color?: string;
  colorCode?: string; // e.g. Salli products use colorCode for swatch
  grit?: string;
  sku: string;
  image: string;
  priceModifier?: number;
  price?: number;
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
  variants?: ProductVariant[]; // Legacy flat variants
  frameVariants?: FrameVariantConfig; // New structured frame variants
  defaultImage?: string;
  gallery?: string[];
  catalogueFile?: string; // Path to product catalogue PDF for download
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
    primaryImage?: string;
    gallery?: string[];
    useVariantImages?: boolean;
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
    rows?: Array<{
      label: string;
      value: string;
    }>;
    specs?: Array<{
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
