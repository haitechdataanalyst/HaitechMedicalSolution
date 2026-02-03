const fs = require('fs');
const path = require('path');

// Read products.json
const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Helper to get a product by ID
const getProductById = (id) => products.find(p => p.id === id);

// Category 22: Forceps - Group into 2400 and 2500 series
const forceps2400Ids = [601, 602, 603, 604];
const forceps2500Ids = [605, 606, 607, 608, 609, 610, 611, 612, 613];

//Category 24: Scissors - Group by pattern
const kellyScissorsIds = [801, 802];
const goldmanFoxScissorsIds = [803, 804];
const castroviejoScissorsIds = [805, 806];

// Create Forceps 2400 parent product
const forceps2400Variants = forceps2400Ids.map(id => {
  const p = getProductById(id);
  const modelMatch = p.name.match(/(\d+\/[\w-]+)/);
  const model = modelMatch ? modelMatch[1] : p.sku.replace('MED-', '');
  return {
    id: p.slug,
    name: model,
    description: p.description.replace('Extraction forceps for ', '').replace('extraction forceps for ', ''),
    sku: p.sku,
    price: p.basePrice,
    image: p.defaultImage
  };
});

const forceps2400 = {
  id: 601,
  slug: "forceps-2400",
  name: "Medesy Forceps 2400 Series",
  description: "Professional extraction forceps 2400 series for roots, third molars, and specialized extractions",
  category: 22,
  order: 1,
  sku: "MED-2400",
  basePrice: 149,
  currency: "AUD",
  hasVariants: true,
  variantType: "model",
  variants: forceps2400Variants,
  defaultImage: "/images/products/medesy/forceps/2400slash51-AL.jpg",
  gallery: forceps2400Ids.map(id => getProductById(id).defaultImage),
  contentBlocks: [
    {
      type: "hero",
      data: {
        primaryImage: "/images/products/medesy/forceps/2400slash51-AL.jpg",
        gallery: forceps2400Ids.map(id => getProductById(id).defaultImage)
      }
    },
    {
      type: "description",
      data: {
        primary: "The Medesy 2400 series extraction forceps provide precision instruments for upper and lower root extractions, third molars, and specialized procedures. Available in multiple configurations to suit various clinical needs.",
        secondary: "Made in Italy from premium surgical-grade stainless steel. Autoclavable and built to last."
      }
    },
    {
      type: "specifications",
      data: {
        title: "Technical Specifications",
        rows: [
          {
            label: "Series",
            value: "2400"
          },
          {
            label: "Material",
            value: "Surgical Stainless Steel"
          },
          {
            label: "Sterilization",
            value: "Autoclavable"
          },
          {
            label: "Origin",
            value: "Italy"
          }
        ]
      }
    },
    {
      type: "info",
      data: {
        manufacturer: "Medesy",
        warranty: "Lifetime against defects",
        packageContents: [
          "Forceps 2400 (selected model)"
        ]
      }
    },
    {
      type: "actions",
      data: {
        addToCart: true,
        customization: false
      }
    }
  ],
  relatedProducts: [602, 501, 502]
};

// Create Forceps 2500 parent product
const forceps2500Variants = forceps2500Ids.map(id => {
  const p = getProductById(id);
  const modelMatch = p.name.match(/(\d+\/[\w-]+)/);
  const model = modelMatch ? modelMatch[1] : p.sku.replace('MED-', '');
  return {
    id: p.slug,
    name: model,
    description: p.description.replace('Extraction forceps for ', '').replace('extraction forceps for ', ''),
    sku: p.sku,
    price: p.basePrice,
    image: p.defaultImage
  };
});

const forceps2500 = {
  id: 602,
  slug: "forceps-2500",
  name: "Medesy Forceps 2500 Series",
  description: "Comprehensive extraction forceps 2500 series for molars, roots, and universal applications",
  category: 22,
  order: 2,
  sku: "MED-2500",
  basePrice: 149,
  currency: "AUD",
  hasVariants: true,
  variantType: "model",
  variants: forceps2500Variants,
  defaultImage: "/images/products/medesy/forceps/2500slash17.jpg",
  gallery: forceps2500Ids.map(id => getProductById(id).defaultImage),
  contentBlocks: [
    {
      type: "hero",
      data: {
        primaryImage: "/images/products/medesy/forceps/2500slash17.jpg",
        gallery: forceps2500Ids.map(id => getProductById(id).defaultImage)
      }
    },
    {
      type: "description",
      data: {
        primary: "The Medesy 2500 series extraction forceps offer a comprehensive range for upper and lower molar extractions, third molars, roots, and universal applications. Includes specialized designs like cow horn forceps for difficult extractions.",
        secondary: "Made in Italy from premium surgical-grade stainless steel. Autoclavable and built to last."
      }
    },
    {
      type: "specifications",
      data: {
        title: "Technical Specifications",
        rows: [
          {
            label: "Series",
            value: "2500"
          },
          {
            label: "Material",
            value: "Surgical Stainless Steel"
          },
          {
            label: "Sterilization",
            value: "Autoclavable"
          },
          {
            label: "Origin",
            value: "Italy"
          }
        ]
      }
    },
    {
      type: "info",
      data: {
        manufacturer: "Medesy",
        warranty: "Lifetime against defects",
        packageContents: [
          "Forceps 2500 (selected model)"
        ]
      }
    },
    {
      type: "actions",
      data: {
        addToCart: true,
        customization: false
      }
    }
  ],
  relatedProducts: [601, 501, 502]
};

// Create Kelly Scissors parent product
const kellyScissorsVariants = kellyScissorsIds.map(id => {
  const p = getProductById(id);
  const typeMatch = p.name.match(/(Straight|Curved)/);
  const type = typeMatch ? typeMatch[1] : '';
  return {
    id: p.slug,
    name: `${p.sku.replace('MED-', '')} ${type}`,
    sku: p.sku,
    price: p.basePrice,
    image: p.defaultImage
  };
});

const kellyScissors = {
  id: 801,
  slug: "kelly-scissors",
  name: "Kelly Scissors",
  description: "Professional Kelly pattern surgical scissors in straight and curved configurations",
  category: 24,
  order: 1,
  sku: "MED-35",
  basePrice: 89,
  currency: "AUD",
  hasVariants: true,
  variantType: "model",
  variants: kellyScissorsVariants,
  defaultImage: "/images/products/medesy/scissors/3509.jpg",
  gallery: kellyScissorsIds.map(id => getProductById(id).defaultImage),
  contentBlocks: [
    {
      type: "hero",
      data: {
        primaryImage: "/images/products/medesy/scissors/3509.jpg",
        gallery: kellyScissorsIds.map(id => getProductById(id).defaultImage)
      }
    },
    {
      type: "description",
      data: {
        primary: "The Medesy Kelly scissors feature professional-grade blades in both straight and curved configurations. 160mm length for general surgical cutting.",
        secondary: "Made in Italy from premium surgical-grade stainless steel. Autoclavable and built to last."
      }
    },
    {
      type: "specifications",
      data: {
        title: "Technical Specifications",
        rows: [
          {
            label: "Pattern",
            value: "Kelly"
          },
          {
            label: "Length",
            value: "160mm"
          },
          {
            label: "Material",
            value: "Surgical Stainless Steel"
          },
          {
            label: "Sterilization",
            value: "Autoclavable"
          },
          {
            label: "Origin",
            value: "Italy"
          }
        ]
      }
    },
    {
      type: "info",
      data: {
        manufacturer: "Medesy",
        warranty: "Lifetime against defects",
        packageContents: [
          "Kelly Scissors (selected model)"
        ]
      }
    },
    {
      type: "actions",
      data: {
        addToCart: true,
        customization: false
      }
    }
  ],
  relatedProducts: [802, 803]
};

// Create Goldman-Fox Scissors parent product
const goldmanFoxScissorsVariants = goldmanFoxScissorsIds.map(id => {
  const p = getProductById(id);
  const typeMatch = p.name.match(/(Straight|Curved)/);
  const type = typeMatch ? typeMatch[1] : '';
  return {
    id: p.slug,
    name: `${p.sku.replace('MED-', '')} ${type}`,
    sku: p.sku,
    price: p.basePrice,
    image: p.defaultImage
  };
});

const goldmanFoxScissors = {
  id: 802,
  slug: "goldman-fox-scissors",
  name: "Goldman-Fox Scissors",
  description: "Specialized Goldman-Fox pattern scissors for periodontal procedures",
  category: 24,
  order: 2,
  sku: "MED-351",
  basePrice: 95,
  currency: "AUD",
  hasVariants: true,
  variantType: "model",
  variants: goldmanFoxScissorsVariants,
  defaultImage: "/images/products/medesy/scissors/3518.jpg",
  gallery: goldmanFoxScissorsIds.map(id => getProductById(id).defaultImage),
  contentBlocks: [
    {
      type: "hero",
      data: {
        primaryImage: "/images/products/medesy/scissors/3518.jpg",
        gallery: goldmanFoxScissorsIds.map(id => getProductById(id).defaultImage)
      }
    },
    {
      type: "description",
      data: {
        primary: "The Medesy Goldman-Fox scissors are designed for periodontal procedures with precision blades. Available in straight and curved configurations for optimal access.",
        secondary: "Made in Italy from premium surgical-grade stainless steel. Autoclavable and built to last."
      }
    },
    {
      type: "specifications",
      data: {
        title: "Technical Specifications",
        rows: [
          {
            label: "Pattern",
            value: "Goldman-Fox"
          },
          {
            label: "Material",
            value: "Surgical Stainless Steel"
          },
          {
            label: "Sterilization",
            value: "Autoclavable"
          },
          {
            label: "Origin",
            value: "Italy"
          }
        ]
      }
    },
    {
      type: "info",
      data: {
        manufacturer: "Medesy",
        warranty: "Lifetime against defects",
        packageContents: [
          "Goldman-Fox Scissors (selected model)"
        ]
      }
    },
    {
      type: "actions",
      data: {
        addToCart: true,
        customization: false
      }
    }
  ],
  relatedProducts: [801, 803]
};

// Create Castroviejo Scissors parent product
const castroviejoScissorsVariants = castroviejoScissorsIds.map(id => {
  const p = getProductById(id);
  const typeMatch = p.name.match(/(Straight|Curved)/);
  const type = typeMatch ? typeMatch[1] : '';
  return {
    id: p.slug,
    name: `${p.sku.replace('MED-', '')} ${type}`,
    sku: p.sku,
    price: p.basePrice,
    image: p.defaultImage
  };
});

const castroviejoScissors = {
  id: 803,
  slug: "castroviejo-scissors",
  name: "Castroviejo Scissors",
  description: "Precision Castroviejo pattern micro-scissors for delicate surgical procedures",
  category: 24,
  order: 3,
  sku: "MED-362",
  basePrice: 125,
  currency: "AUD",
  hasVariants: true,
  variantType: "model",
  variants: castroviejoScissorsVariants,
  defaultImage: "/images/products/medesy/scissors/3627.jpg",
  gallery: castroviejoScissorsIds.map(id => getProductById(id).defaultImage),
  contentBlocks: [
    {
      type: "hero",
      data: {
        primaryImage: "/images/products/medesy/scissors/3627.jpg",
        gallery: castroviejoScissorsIds.map(id => getProductById(id).defaultImage)
      }
    },
    {
      type: "description",
      data: {
        primary: "The Medesy Castroviejo scissors provide exceptional precision for microsurgical and delicate procedures. Fine tips for meticulous cutting in both straight and curved designs.",
        secondary: "Made in Italy from premium surgical-grade stainless steel. Autoclavable and built to last."
      }
    },
    {
      type: "specifications",
      data: {
        title: "Technical Specifications",
        rows: [
          {
            label: "Pattern",
            value: "Castroviejo"
          },
          {
            label: "Type",
            value: "Micro-scissors"
          },
          {
            label: "Material",
            value: "Surgical Stainless Steel"
          },
          {
            label: "Sterilization",
            value: "Autoclavable"
          },
          {
            label: "Origin",
            value: "Italy"
          }
        ]
      }
    },
    {
      type: "info",
      data: {
        manufacturer: "Medesy",
        warranty: "Lifetime against defects",
        packageContents: [
          "Castroviejo Scissors (selected model)"
        ]
      }
    },
    {
      type: "actions",
      data: {
        addToCart: true,
        customization: false
      }
    }
  ],
  relatedProducts: [801, 802]
};

// Remove old products and insert new ones
const idsToRemove = [
  ...forceps2400Ids,
  ...forceps2500Ids,
  ...kellyScissorsIds,
  ...goldmanFoxScissorsIds,
  ...castroviejoScissorsIds
];

// Filter out old products
const newProducts = products.filter(p => !idsToRemove.includes(p.id));

// Find insertion points and add new products
const insertAfter505 = newProducts.findIndex(p => p.id === 505);
newProducts.splice(insertAfter505 + 1, 0, forceps2400, forceps2500);

const insertAfter701 = newProducts.findIndex(p => p.id === 701);  
newProducts.splice(insertAfter701, 0, kellyScissors, goldmanFoxScissors, castroviejoScissors);

// Write back to file
fs.writeFileSync(productsPath, JSON.stringify(newProducts, null, 2), 'utf8');

console.log('✅ Product variants fixed successfully!');
console.log(`- Category 22 (Forceps): ${forceps2400Ids.length + forceps2500Ids.length} products → 2 products with variants`);
console.log(`- Category 24 (Scissors): ${kellyScissorsIds.length + goldmanFoxScissorsIds.length + castroviejoScissorsIds.length} products → 3 products with variants`);
