import { httpStatus } from '../constants/index.js';
import { cartService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const getCart = catchAsync(async (req, res) => {
	const cart = await cartService.getCart(req.user.id);
	return res.respond(httpStatus.OK, { cart }, 'Cart retrieved');
});

export const addItem = catchAsync(async (req, res) => {
	const item = await cartService.addItem(req.user.id, req.body);
	return res.respond(httpStatus.CREATED, { item }, 'Item added to cart');
});

export const updateItem = catchAsync(async (req, res) => {
	const { quantity } = req.body;
	const item = await cartService.updateItem(req.user.id, req.params.id, Number(quantity));
	return res.respond(httpStatus.OK, { item }, 'Cart item updated');
});

export const removeItem = catchAsync(async (req, res) => {
	await cartService.removeItem(req.user.id, req.params.id);
	return res.respond(httpStatus.OK, null, 'Item removed from cart');
});

export const syncCart = catchAsync(async (req, res) => {
	const cart = await cartService.syncCart(req.user.id, req.body.items ?? []);
	return res.respond(httpStatus.OK, { cart }, 'Cart synced');
});

export const clearCart = catchAsync(async (req, res) => {
	await cartService.clearCart(req.user.id);
	return res.respond(httpStatus.OK, null, 'Cart cleared');
});
