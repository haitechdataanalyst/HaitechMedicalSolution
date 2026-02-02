// Script to transform products.json to use new frameVariants structure
// Run with: node scripts/transform-products.js

const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');
const framesPath = path.join(__dirname, '../data/frames.json');

// Read current data
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const framesData = JSON.parse(fs.readFileSync(framesPath, 'utf8'));

// Create a map of frame names to IDs
const frameNameToId = {};
framesData.frames.forEach(frame => {
  frameNameToId[frame.name.toLowerCase()] = frame.id;
});

// Create a map of color names to IDs for each frame
const colorNameToId = {};
framesData.frames.forEach(frame => {
  colorNameToId[frame.id] = {};
  frame.colors.forEach(color => {
    // Map various name formats to color ID
    colorNameToId[frame.id][color.name.toLowerCase()] = color.id;
  });
});

// Function to normalize color name to ID
function normalizeColorId(colorName, frameId) {
  const normalized = colorName.toLowerCase()
    .replace(/ and /g, '-')
    .replace(/\s+/g, '-');
  
  // Try exact match first
  if (colorNameToId[frameId] && colorNameToId[frameId][colorName.toLowerCase()]) {
    return colorNameToId[frameId][colorName.toLowerCase()];
  }
  
  // Return a slug version
  return normalized;
}

// Function to normalize frame name to ID
function normalizeFrameId(frameName) {
  return frameNameToId[frameName.toLowerCase()] || frameName.toLowerCase();
}

// Transform products
const transformedProducts = products.map(product => {
  // Only transform products with variantType: "frame-color"
  if (product.variantType !== 'frame-color' || !product.variants || product.variants.length === 0) {
    return product;
  }

  // Extract unique frames from variants
  const frames = new Set();
  const images = {};

  product.variants.forEach(variant => {
    if (variant.frameStyle) {
      const frameId = normalizeFrameId(variant.frameStyle);
      frames.add(frameId);

      // Build the image key
      if (variant.color && variant.image) {
        const colorId = normalizeColorId(variant.color, frameId);
        const imageKey = `${frameId}-${colorId}`;
        images[imageKey] = variant.image;
      }
    }
  });

  // Create the new frameVariants structure
  const frameVariants = {
    availableFrames: Array.from(frames),
    images: images
  };

  // Create the new product structure
  const newProduct = {
    ...product,
    frameVariants: frameVariants
  };

  // Remove old variants array for frame-color products
  delete newProduct.variants;

  return newProduct;
});

// Write the transformed products
fs.writeFileSync(productsPath, JSON.stringify(transformedProducts, null, 2));

console.log('Products transformed successfully!');
console.log(`Transformed ${products.filter(p => p.variantType === 'frame-color').length} frame-color products`);
