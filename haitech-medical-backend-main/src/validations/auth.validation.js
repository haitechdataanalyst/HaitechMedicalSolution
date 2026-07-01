import Joi from 'joi';
import { password, joiInMobile } from './custom.validation.js';

export const registerSchema = {
	body: Joi.object().keys({
		firstName: Joi.string().trim().min(1).max(100).required(),
		lastName: Joi.string().trim().min(1).max(100).required(),
		username: Joi.string().trim().min(3).max(50).required(),
		email: Joi.string().email().max(254).required(),
		password: Joi.string().required().custom(password),
		phone: joiInMobile.required(),
	}),
};

export const loginSchema = {
	body: Joi.object().keys({
		email: Joi.string().email().max(254).required(),
		password: Joi.string().max(128).required(),
	}),
};

export const googleSignInSchema = {
	body: Joi.object().keys({
		// Raw Google ID token sent from the frontend; the backend verifies it
		// server-side via the Google token endpoint. JWTs are compact but we
		// cap at 4096 chars to prevent log-flooding with oversized tokens.
		credential: Joi.string().trim().min(1).max(4096).required(),
	}),
};

export const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().min(1).max(2048).required(),
	}),
};

export const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().min(1).max(2048).required(),
	}),
};

export const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string().email().max(254).required(),
	}),
};

export const resetPassword = {
	body: Joi.object().keys({
		password: Joi.string().required().custom(password),
		// Reset token is a signed JWT or opaque token — cap generously.
		token: Joi.string().min(1).max(2048).required(),
	}),
};

export const verifyEmail = {
	query: Joi.object().keys({
		token: Joi.string().min(1).max(2048).required(),
	}),
};
