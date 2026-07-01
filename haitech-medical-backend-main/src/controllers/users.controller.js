import { httpStatus } from '../constants/index.js';
import { userService } from '../services/index.js';
import { addressRepository } from '../repositories/index.js';
import { catchAsync, notFoundError } from '../utils/index.js';

export const getProfile = catchAsync(async (req, res) => {
	const user = await userService.getUserById(req.user.id);
	if (!user) throw notFoundError('User not found');
	return res.respond(httpStatus.OK, { user: userService.buildUserPayload(user) });
});

export const updateProfile = catchAsync(async (req, res) => {
	const user = await userService.updateProfile(req.user.id, req.body);
	return res.respond(httpStatus.OK, { user: userService.buildUserPayload(user) }, 'Profile updated');
});

export const changePassword = catchAsync(async (req, res) => {
	await userService.changePassword(req.user.id, req.body);
	return res.respond(httpStatus.OK, null, 'Password changed. Please sign in again.');
});

export const getAddresses = catchAsync(async (req, res) => {
	const addresses = await addressRepository.findByUserId(req.user.id);
	return res.respond(httpStatus.OK, { addresses });
});

export const createAddress = catchAsync(async (req, res) => {
	const address = await addressRepository.create(req.user.id, req.body);
	return res.respond(httpStatus.CREATED, { address }, 'Address added');
});

export const updateAddress = catchAsync(async (req, res) => {
	const address = await addressRepository.update(req.params.id, req.user.id, req.body);
	if (!address) throw notFoundError('Address not found');
	return res.respond(httpStatus.OK, { address }, 'Address updated');
});

export const deleteAddress = catchAsync(async (req, res) => {
	const deleted = await addressRepository.softDelete(req.params.id, req.user.id);
	if (!deleted) throw notFoundError('Address not found');
	return res.respond(httpStatus.OK, null, 'Address removed');
});

export const setDefaultAddress = catchAsync(async (req, res) => {
	const address = await addressRepository.setDefault(req.params.id, req.user.id);
	if (!address) throw notFoundError('Address not found');
	return res.respond(httpStatus.OK, { address }, 'Default address updated');
});
