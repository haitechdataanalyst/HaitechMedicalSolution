import { Router } from 'express';
import { listProducts, searchProducts, advancedSearch, listCategories, listBrands, getProduct, getProductVariants, compareProducts } from '../controllers/index.js';
import { overallLimiter } from '../middlewares/index.js';

const productsRouter = Router();

productsRouter.use(overallLimiter);

// Static paths must be declared before /:id to avoid Express param collision
productsRouter.get('/search', searchProducts);
productsRouter.get('/search/advanced', advancedSearch);
productsRouter.get('/categories', listCategories);
productsRouter.get('/brands', listBrands);
productsRouter.get('/compare', compareProducts);
productsRouter.get('/', listProducts);

// Parameterised
productsRouter.get('/:id', getProduct);
productsRouter.get('/:id/variants', getProductVariants);

export default productsRouter;
