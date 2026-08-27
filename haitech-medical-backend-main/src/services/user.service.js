import bcryptjs from 'bcryptjs';
import { userRepository, addressRepository } from '../repositories/index.js';
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

// ── Addresses ─────────────────────────────────────────────────────────────────
// Previously the controller called addressRepository directly (a
// Controller→Repository skip). Moved here so the controller only ever talks
// to services — see [[feedback_architecture_policy]] Phase 8.

export const getAddresses = async (userId) => addressRepository.findByUserId(userId);

export const createAddress = async (userId, data) => addressRepository.create(userId, data);

export const updateAddress = async (id, userId, data) => {
	const address = await addressRepository.update(id, userId, data);
	if (!address) throw notFoundError('Address not found');
	return address;
};

export const deleteAddress = async (id, userId) => {
	const deleted = await addressRepository.softDelete(id, userId);
	if (!deleted) throw notFoundError('Address not found');
};

export const setDefaultAddress = async (id, userId) => {
	const address = await addressRepository.setDefault(id, userId);
	if (!address) throw notFoundError('Address not found');
	return address;
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminListUsers = async ({ page = 1, limit = 20, search } = {}) => {
	const offset = (page - 1) * limit;
	const { rows, total } = await userRepository.findManyAdmin({ search, limit, offset });
	return { users: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

// `adminId` is the admin performing the action, distinct from `userId` (the
// target account being activated/deactivated) — the original inline
// implementation correctly recorded the admin as modifiedBy; kept that here.
export const adminToggleUserStatus = async (adminId, userId) => {
	const user = await userRepository.findById(userId);
	if (!user) throw notFoundError('User not found');

	const updated = await userRepository.updateById(userId, { active: !user.active, modifiedBy: adminId });
	return { id: updated.id, active: updated.active, email: updated.email };
};

const userService = {
	buildUserPayload,
	getUserById,
	updateProfile,
	changePassword,
	getAddresses,
	createAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
	adminListUsers,
	adminToggleUserStatus,
};

export default userService;
