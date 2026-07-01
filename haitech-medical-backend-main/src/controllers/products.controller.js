import { httpStatus } from '../constants/index.js';
import { productService } from '../services/index.js';
import { catchAsync, badRequestError } from '../utils/index.js';

export const listProducts = catchAsync(async (req, res) => {
	const { search, category, brand, hasVariants, minPrice, maxPrice, currency, sort, page = 1, limit = 20 } = req.query;
	const result = await productService.listProducts({
		search, categoryId: category, brandId: brand,
		hasVariants, minPrice, maxPrice, currency, sort,
		page: Number(page), limit: Number(limit),
	});
	return res.respond(httpStatus.OK, result);
});

export const searchProducts = catchAsync(async (req, res) => {
	const { q = '', page = 1, limit = 20, category, brand } = req.query;
	const result = await productService.searchProducts({
		q, category, brand,
		page: Number(page), limit: Number(limit),
	});
	return res.respond(httpStatus.OK, result);
});

export const advancedSearch = catchAsync(async (req, res) => {
	const { q = '', sort = 'relevance', page = 1, limit = 20, ...filterRest } = req.query;
	const result = await productService.advancedSearch({
		q, sort,
		page: Number(page), limit: Number(limit),
		filters: filterRest,
	});
	return res.respond(httpStatus.OK, result);
});

export const listCategories = catchAsync(async (req, res) => {
	const categories = await productService.listCategories();
	return res.respond(httpStatus.OK, { categories });
});

export const listBrands = catchAsync(async (req, res) => {
	const brands = await productService.listBrands();
	return res.respond(httpStatus.OK, { brands });
});

export const getProduct = catchAsync(async (req, res) => {
	const product = await productService.getProduct(req.params.id);
	return res.respond(httpStatus.OK, { product });
});

export const getProductVariants = catchAsync(async (req, res) => {
	const result = await productService.getProductVariants(req.params.id);
	return res.respond(httpStatus.OK, result);
});

export const compareProducts = catchAsync(async (req, res) => {
	const ids = req.query.ids;
	if (!ids) throw badRequestError('Provide ids query parameter (comma-separated)');
	const idList = Array.isArray(ids) ? ids : String(ids).split(',');
	const result = await productService.compareProducts(idList);
	return res.respond(httpStatus.OK, result);
});
