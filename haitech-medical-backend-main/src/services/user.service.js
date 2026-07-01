import bcryptjs from 'bcryptjs';
import { userRepository } from '../repositories/index.js';
import * as tokenService from './token.service.js';
import { notFoundError, conflictError, unauthorizedError, badRequestError } from '../utils/index.js';

export const buildUserPayload = (user) => ({
	id: user.id,
	firstName: user.firstName,
	lastName: user.lastName,
	username: user.username,
	email: user.email,
	phone: user.phone,
	roles: user.roles || [],
	role: user.role,
	emailVerified: user.emailVerified,
	phoneVerified: user.phoneVerified,
	authProvider: user.authProvider,
	active: user.active,
	createdAt: user.createdAt,
	modifiedAt: user.modifiedAt,
});

export const getUserById = async (userId) => {
	if (!userId) return null;
	return userRepository.findById(userId);
};

export const updateProfile = async (userId, { firstName, lastName, phone, username }) => {
	const user = await userRepository.findById(userId);
	if (!user) throw notFoundError('User not found');

	if (username) {
		const normalized = username.trim().toLowerCase();
		if (normalized !== user.username) {
			const existing = await userRepository.findByUsername(normalized);
			if (existing) throw conflictError('Username already taken');
		}
	}

	const updates = { modifiedBy: userId };
	if (firstName) updates.firstName = firstName.trim();
	if (lastName) updates.lastName = lastName.trim();
	if (phone !== undefined) updates.phone = phone?.trim() || null;
	if (username) updates.username = username.trim().toLowerCase();

	await userRepository.updateById(userId, updates);
	return userRepository.findById(userId);
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
	const user = await userRepository.findById(userId);
	if (!user) throw notFoundError('User not found');

	if (!user.passwordHash) {
		throw badRequestError('No password is set for this account');
	}

	const isValid = await bcryptjs.compare(currentPassword, user.passwordHash);
	if (!isValid) throw unauthorizedError('Current password is incorrect');

	const newHash = await bcryptjs.hash(newPassword, 10);

	await userRepository.updateDetailsByUserId(userId, {
		passwordHash: newHash,
		oldPasswordHash: user.passwordHash,
		modifiedBy: userId,
	});

	// Force re-login on all devices
	await tokenService.revokeAllUserTokens(userId);
};

const userService = { buildUserPayload, getUserById, updateProfile, changePassword };

export default userService;
