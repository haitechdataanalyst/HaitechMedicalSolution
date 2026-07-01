import { Router } from 'express';
import { getWishlist, addWishlistItem, removeWishlistItem } from '../controllers/index.js';
import { auth, jsonBody, overallLimiter } from '../middlewares/index.js';

const wishlistRouter = Router();

wishlistRouter.use(overallLimiter);
wishlistRouter.use(auth());

wishlistRouter.get('/', getWishlist);
wishlistRouter.post('/', jsonBody('10kb'), addWishlistItem);
wishlistRouter.delete('/:productId', removeWishlistItem);

export default wishlistRouter;
