import Joi from 'joi';
import { password, joiInMobile, joiInPinCode } from './custom.validation.js';

export const updateProfileSchema = {
	body: Joi.object()
		.keys({
			firstName: Joi.string().trim().min(1).max(100),
			lastName: Joi.string().trim().min(1).max(100),
			username: Joi.string().trim().min(3).max(50),
			phone: joiInMobile.allow('', null),
		})
		.or('firstName', 'lastName', 'username', 'phone'),
};

export const changePasswordSchema = {
	body: Joi.object().keys({
		currentPassword: Joi.string().max(128).required(),
		newPassword: Joi.string().required().custom(password),
	}),
};

export const createAddressSchema = {
	body: Joi.object().keys({
		fullName: Joi.string().trim().min(1).max(150).required(),
		phone: joiInMobile.required(),
		addressLine1: Joi.string().trim().min(1).max(255).required(),
		addressLine2: Joi.string().trim().max(255).allow('', null),
		landmark: Joi.string().trim().max(255).allow('', null),
		city: Joi.string().trim().min(1).max(100).required(),
		state: Joi.string().trim().min(1).max(100).required(),
		postalCode: joiInPinCode.required(),
		country: Joi.string().trim().min(1).max(100).default('India'),
		addressType: Joi.string().valid('home', 'work', 'other').default('home'),
		isDefault: Joi.boolean().default(false),
	}),
};

export const updateAddressSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
	body: Joi.object()
		.keys({
			fullName: Joi.string().trim().min(1).max(150),
			phone: joiInMobile,
			addressLine1: Joi.string().trim().min(1).max(255),
			addressLine2: Joi.string().trim().max(255).allow('', null),
			landmark: Joi.string().trim().max(255).allow('', null),
			city: Joi.string().trim().min(1).max(100),
			state: Joi.string().trim().min(1).max(100),
			postalCode: joiInPinCode,
			country: Joi.string().trim().min(1).max(100),
			addressType: Joi.string().valid('home', 'work', 'other'),
			isDefault: Joi.boolean(),
		})
		.min(1),
};

export const addressIdSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
};
