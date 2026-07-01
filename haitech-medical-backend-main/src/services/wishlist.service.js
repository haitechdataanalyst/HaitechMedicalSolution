import { wishlistRepository } from '../repositories/index.js';

export const getWishlist = async (userId) => {
	const items = await wishlistRepository.findByUser(userId);
	return { items, count: items.length };
};

export const addItem = async (userId, productId) => {
	return wishlistRepository.add(userId, productId);
};

export const removeItem = async (userId, productId) => {
	await wishlistRepository.remove(userId, productId);
};

export const wishlistService = { getWishlist, addItem, removeItem };
export default wishlistService;
