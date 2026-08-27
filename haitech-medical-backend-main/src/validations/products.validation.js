import Joi from 'joi';

const SORT_VALUES = ['order', 'price_asc', 'price_desc', 'name_asc', 'name_desc'];

// Bounds mirror orders.validation.js's reasoning: cap pagination and free-text
// query length so unvalidated params can no longer flow straight into the
// query builder unbounded.
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LEN = 200;
const MAX_ID_LEN = 200; // products.slug is varchar(200); numeric IDs are far shorter

export const listProductsSchema = {
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(20),
		search: Joi.string().trim().max(MAX_SEARCH_LEN).allow('', null),
		category: Joi.number().integer().positive().allow(null),
		brand: Joi.number().integer().positive().allow(null),
		hasVariants: Joi.boolean().truthy('true').falsy('false'),
		minPrice: Joi.number().min(0).allow(null),
		maxPrice: Joi.number().min(0).allow(null),
		currency: Joi.string().trim().length(3).uppercase().allow('', null),
		sort: Joi.string().valid(...SORT_VALUES),
	}),
};

export const searchProductsSchema = {
	query: Joi.object().keys({
		q: Joi.string().trim().max(MAX_SEARCH_LEN).allow(''),
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(20),
		category: Joi.number().integer().positive().allow(null),
		brand: Joi.number().integer().positive().allow(null),
	}),
};

export const advancedSearchSchema = {
	// advancedSearch intentionally forwards arbitrary extra filter keys to
	// productRepository.searchAdvanced — unknown() is scoped to this schema
	// only, it does not weaken validation on any other route.
	query: Joi.object()
		.keys({
			q: Joi.string().trim().max(MAX_SEARCH_LEN).allow(''),
			sort: Joi.string().valid(...SORT_VALUES),
			page: Joi.number().integer().min(1).default(1),
			limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(20),
		})
		.unknown(true),
};

export const productIdSchema = {
	params: Joi.object().keys({
		// findById() accepts either a numeric product id or a slug — see
		// product.repository.js.
		id: Joi.string().trim().min(1).max(MAX_ID_LEN).required(),
	}),
};

export const compareProductsSchema = {
	query: Joi.object().keys({
		// Comma-separated list of ids; compareProducts() enforces the 2-4 count
		// business rule itself, this just bounds the raw string.
		ids: Joi.string().trim().min(1).max(MAX_SEARCH_LEN).required(),
	}),
};
