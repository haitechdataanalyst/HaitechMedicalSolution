import { OAuth2Client } from 'google-auth-library';
import { httpStatus } from '../constants/index.js';
import { authService } from '../services/index.js';
import {
	catchAsync, setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshTokenFromCookie,
	badRequestError, serviceUnavailableError,
} from '../utils/index.js';
import { env } from '../config/index.js';

const getGoogleClient = () => {
	if (!env.GOOGLE?.CLIENT_ID) throw serviceUnavailableError('Google OAuth is not configured');
	return new OAuth2Client(env.GOOGLE.CLIENT_ID);
};

export const login = catchAsync(async (req, res) => {
	const { user, accessToken, refreshToken } = await authService.login(req.body);

	setRefreshTokenCookie(res, refreshToken);

	return res.respond(httpStatus.OK, { user, accessToken, refreshToken }, 'Login successful');
});

export const register = catchAsync(async (req, res) => {
	const { user, accessToken, refreshToken } = await authService.register(req.body);

	setRefreshTokenCookie(res, refreshToken);

	return res.respond(httpStatus.CREATED, { user, accessToken, refreshToken }, 'Registration successful');
});

export const googleSignIn = catchAsync(async (req, res) => {
	const { credential } = req.body;

	// Verify the Google ID token server-side — never trust raw client-sent user fields
	const client = getGoogleClient();
	let payload;
	try {
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: env.GOOGLE.CLIENT_ID,
		});
		payload = ticket.getPayload();
	} catch {
		throw badRequestError('Invalid Google credential — verification failed');
	}

	if (!payload?.sub || !payload?.email) {
		throw badRequestError('Incomplete Google profile — email or sub missing');
	}

	const firstName = payload.given_name?.trim() || payload.name?.split(' ')[0]?.trim() || 'Google';
	const lastName = payload.family_name?.trim() || payload.name?.split(' ').slice(1).join(' ')?.trim() || 'User';

	const { user, accessToken, refreshToken } = await authService.googleSignIn({
		googleSub: payload.sub,
		email: payload.email,
		firstName,
		lastName,
	});

	setRefreshTokenCookie(res, refreshToken);

	return res.respond(httpStatus.OK, { user, accessToken, refreshToken }, 'Google sign-in successful');
});

export const logout = catchAsync(async (req, res) => {
	const token = req.body?.refreshToken || getRefreshTokenFromCookie(req);

	await authService.logout(token);

	clearRefreshTokenCookie(res);

	return res.respond(httpStatus.OK, null, 'Logged out successfully');
});

export const refreshTokens = catchAsync(async (req, res) => {
	const token = req.body?.refreshToken || getRefreshTokenFromCookie(req);
	const { accessToken, refreshToken } = await authService.refreshTokens(token);

	setRefreshTokenCookie(res, refreshToken);

	return res.respond(httpStatus.OK, { accessToken, refreshToken }, 'Token refreshed');
});

export const forgotPassword = catchAsync(async (req, res) => {
	await authService.forgotPassword(req.body);
	return res.respond(httpStatus.OK, null, 'If that email is registered, a reset link has been sent');
});

export const resetPassword = catchAsync(async (req, res) => {
	await authService.resetPassword(req.body);
	return res.respond(httpStatus.OK, null, 'Password reset successful. Please sign in with your new password.');
});

export const verifyEmail = catchAsync(async (req, res) => {
	await authService.verifyEmail(req.query);
	return res.respond(httpStatus.OK, null, 'Email verified successfully');
});

export const resendVerificationEmail = catchAsync(async (req, res) => {
	await authService.resendVerificationEmail(req.user.id);
	return res.respond(httpStatus.OK, null, 'Verification email sent');
});
