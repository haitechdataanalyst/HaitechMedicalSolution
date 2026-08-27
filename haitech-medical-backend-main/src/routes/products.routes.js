import { Router } from 'express';
import { listProducts, searchProducts, advancedSearch, listCategories, listBrands, getProduct, getProductVariants, compareProducts } from '../controllers/index.js';
import { validate, overallLimiter } from '../middlewares/index.js';
import {
	listProductsSchema,
	searchProductsSchema,
	advancedSearchSchema,
	productIdSchema,
	compareProductsSchema,
} from '../validations/products.validation.js';

const productsRouter = Router();

productsRouter.use(overallLimiter);

// Static paths must be declared before /:id to avoid Express param collision
productsRouter.get('/search', validate(searchProductsSchema), searchProducts);
productsRouter.get('/search/advanced', validate(advancedSearchSchema), advancedSearch);
productsRouter.get('/categories', listCategories);
productsRouter.get('/brands', listBrands);
productsRouter.get('/compare', validate(compareProductsSchema), compareProducts);
productsRouter.get('/', validate(listProductsSchema), listProducts);

// Parameterised
productsRouter.get('/:id', validate(productIdSchema), getProduct);
productsRouter.get('/:id/variants', validate(productIdSchema), getProductVariants);

export default productsRouter;
