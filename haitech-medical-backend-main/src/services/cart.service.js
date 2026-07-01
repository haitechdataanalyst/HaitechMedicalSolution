import { cartRepository } from '../repositories/index.js';
import { notFoundError } from '../utils/index.js';

export const getCart = async (userId) => {
	return cartRepository.getWithItems(userId);
};

export const addItem = async (userId, item) => {
	const cart = await cartRepository.getOrCreate(userId);
	return cartRepository.upsertItem(cart.id, item);
};

export const updateItem = async (userId, itemId, quantity) => {
	const cart = await cartRepository.getOrCreate(userId);
	const result = await cartRepository.setItemQuantity(cart.id, itemId, quantity);
	if (quantity > 0 && !result) throw notFoundError('Cart item not found');
	return result;
};

export const removeItem = async (userId, itemId) => {
	const cart = await cartRepository.getOrCreate(userId);
	await cartRepository.deleteItem(cart.id, itemId);
};

export const syncCart = async (userId, items) => {
	const cart = await cartRepository.getOrCreate(userId);
	await cartRepository.mergeItems(cart.id, items);
	return cartRepository.getWithItems(userId);
};

export const clearCart = async (userId) => {
	const cart = await cartRepository.getOrCreate(userId);
	await cartRepository.clearItems(cart.id);
};

export const cartService = { getCart, addItem, updateItem, removeItem, syncCart, clearCart };
export default cartService;
