export interface BrandInfo {
    name: string;
    cls: string;
}

export const BRAND_MAP: Record<string, BrandInfo> = {
    ADM: { name: "Admetec",  cls: "bg-indigo-50  text-indigo-700  border-indigo-200"  },
    MED: { name: "Medesy",   cls: "bg-rose-50    text-rose-700    border-rose-200"    },
    SAL: { name: "Salli",    cls: "bg-teal-50    text-teal-700    border-teal-200"    },
    ALM: { name: "Almadent", cls: "bg-orange-50  text-orange-700  border-orange-200"  },
};

const STRAUSS: BrandInfo = { name: "Strauss", cls: "bg-violet-50 text-violet-700 border-violet-200" };

export function detectBrand(sku: string): BrandInfo {
    const prefix = sku.split("-")[0].toUpperCase();
    return BRAND_MAP[prefix] ?? STRAUSS;
}
