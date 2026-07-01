import { httpStatus } from '../constants/index.js';
import { wishlistService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const getWishlist = catchAsync(async (req, res) => {
	const data = await wishlistService.getWishlist(req.user.id);
	return res.respond(httpStatus.OK, data, 'Wishlist retrieved');
});

export const addWishlistItem = catchAsync(async (req, res) => {
	const item = await wishlistService.addItem(req.user.id, req.body.productId);
	return res.respond(httpStatus.CREATED, { item }, 'Added to wishlist');
});

export const removeWishlistItem = catchAsync(async (req, res) => {
	await wishlistService.removeItem(req.user.id, req.params.productId);
	return res.respond(httpStatus.OK, null, 'Removed from wishlist');
});
