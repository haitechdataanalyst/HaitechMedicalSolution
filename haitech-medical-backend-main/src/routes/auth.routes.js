import { Router } from 'express';
import {
	googleSignIn,
	login,
	logout,
	register,
	refreshTokens,
	forgotPassword,
	resetPassword,
	verifyEmail,
	resendVerificationEmail,
} from '../controllers/index.js';
import { validate, csrfProtection, noCache, jsonBody, authLimiter, registerLimiter, auth } from '../middlewares/index.js';
import {
	googleSignInSchema,
	loginSchema,
	registerSchema,
	logout as logoutSchema,
	refreshTokens as refreshTokensSchema,
	forgotPassword as forgotPasswordSchema,
	resetPassword as resetPasswordSchema,
	verifyEmail as verifyEmailSchema,
} from '../validations/auth.validation.js';
import { httpStatus } from '../constants/index.js';

// Phase 4: Supabase is now the sole identity source (auth.middleware.js only
// verifies Supabase-issued tokens). Every route below still issues/consumes
// this backend's OWN legacy JWTs, which auth() no longer accepts — they are
// effectively dead. Left mounted (not deleted) because full legacy-endpoint
// removal was explicitly deferred to a later cleanup pass; see
// [[feedback_architecture_policy]].
const authRouter = Router();

// Apply no-cache to every auth response so credentials are never stored by browsers or proxies.
authRouter.use(noCache);

authRouter.post('/login', authLimiter, jsonBody('10kb'), validate(loginSchema), login);
authRouter.post('/register', registerLimiter, jsonBody('10kb'), validate(registerSchema), register);
authRouter.post('/google/signin', authLimiter, jsonBody('10kb'), validate(googleSignInSchema), googleSignIn);

authRouter.post('/logout', authLimiter, csrfProtection, jsonBody('10kb'), validate(logoutSchema), logout);
authRouter.post('/refresh-token', authLimiter, csrfProtection, jsonBody('10kb'), validate(refreshTokensSchema), refreshTokens);

authRouter.post('/forgot-password', authLimiter, jsonBody('10kb'), validate(forgotPasswordSchema), forgotPassword);
authRouter.post('/reset-password', authLimiter, jsonBody('10kb'), validate(resetPasswordSchema), resetPassword);

authRouter.get('/verify-email', validate(verifyEmailSchema), verifyEmail);
authRouter.post('/resend-verification-email', authLimiter, auth(), resendVerificationEmail);

// CSRF token endpoint — frontend calls this to receive the _csrf cookie
authRouter.get('/csrf-token', csrfProtection, (req, res) => {
	res.respond(httpStatus.OK, null, 'CSRF token initialized');
});

export default authRouter;
