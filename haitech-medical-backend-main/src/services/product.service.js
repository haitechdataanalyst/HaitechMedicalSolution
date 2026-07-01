import { productRepository } from '../repositories/index.js';
import { notFoundError, badRequestError } from '../utils/index.js';

// ── Product listing + search ──────────────────────────────────────────────────

export const listProducts = (params = {}) => productRepository.findMany(params);

export const getProduct = async (id) => {
	const product = await productRepository.findById(id);
	if (!product) throw notFoundError('Product not found');
	return product;
};

export const searchProducts = ({ q, page = 1, limit = 20, category, brand } = {}) =>
	productRepository.findMany({ search: q, categoryId: category, brandId: brand, page, limit });

export const listCategories = () => productRepository.findAllCategories();

export const listBrands = () => productRepository.findAllBrands();

export const getProductVariants = async (id) => {
	const product = await productRepository.findById(id);
	if (!product) throw notFoundError('Product not found');

	if (!product.hasVariants) return { product, variants: [] };

	const variants = (product.frameVariants || []).map((v) => ({
		id:              v.id,
		name:            v.name,
		colorCode:       v.colorCode,
		images:          v.images || [],
		additionalPrice: v.additionalPrice || 0,
	}));

	return { product, variants };
};

export const compareProducts = async (ids) => {
	if (!ids || ids.length < 2) throw badRequestError('Provide at least 2 product IDs to compare');
	if (ids.length > 4)         throw badRequestError('Cannot compare more than 4 products at once');

	const productList = await productRepository.findByIds(ids);

	// Verify all IDs were found
	const foundIds = new Set(productList.map((p) => String(p.id)));
	for (const id of ids) {
		if (!foundIds.has(String(id))) throw notFoundError(`Product not found: ${id}`);
	}

	const specKeys = new Set();
	for (const p of productList) {
		const specs = p.contentBlocks?.find((b) => b.type === 'specifications')?.data?.rows || [];
		for (const row of specs) specKeys.add(row.label);
	}

	const compareMatrix = productList.map((p) => {
		const specs = p.contentBlocks?.find((b) => b.type === 'specifications')?.data?.rows || [];
		const specMap = Object.fromEntries(specs.map((r) => [r.label, r.value]));
		return {
			id:           p.id,
			slug:         p.slug,
			name:         p.name,
			brandId:      p.brandId,
			basePrice:    p.basePrice,
			currency:     p.currency,
			defaultImage: p.defaultImage,
			specs:        specMap,
		};
	});

	return { products: compareMatrix, specKeys: [...specKeys] };
};

export const advancedSearch = (params = {}) => productRepository.searchAdvanced(params);

const productService = {
	listProducts,
	getProduct,
	searchProducts,
	listCategories,
	listBrands,
	getProductVariants,
	compareProducts,
	advancedSearch,
};
export default productService;
