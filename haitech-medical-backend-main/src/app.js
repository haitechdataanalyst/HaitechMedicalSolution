import express from 'express';
import helmet from 'helmet';
import { xss } from 'express-xss-sanitizer';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { httpErrorHandler, httpSuccessHandler, logger } from './config/index.js';
import {
	responseFormatter,
	errorConverter,
	errorHandler,
	requestContextInit,
	payloadLogger,
	corsMiddleware,
	requestTimeout,
	gracefulShutdownGuard,
	overallLimiter,
	requestId,
} from './middlewares/index.js';
import appRouter from './routes/index.js';
import { notFoundError } from './utils/index.js';
import { setupSwagger } from './docs/swagger.js';

const app = express();

// Trust first proxy (Nginx, ALB, Cloudflare) — required for correct req.ip, rate limiting, HTTPS detection
app.set('trust proxy', 1);

app.use(requestId);
app.use(requestContextInit);
app.use(httpSuccessHandler);
app.use(httpErrorHandler);
app.use(responseFormatter);

app.use(
	helmet({
		// --- Cross-Origin-Opener-Policy ---
		// Must be unsafe-none so that Google OAuth popup can postMessage back to the opener.
		// Same-origin (the Helmet default) breaks the Google sign-in flow.
		crossOriginOpenerPolicy: { policy: 'unsafe-none' },
		// --- Content-Security-Policy ---
		// Controls which resources the browser is allowed to load for your page.
		// Prevents XSS by blocking inline scripts/styles and restricting sources.
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"], // Only allow resources from your own domain
				scriptSrc: ["'self'"], // Only allow scripts from your own domain
				styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (needed for some UI libs)
				imgSrc: ["'self'", 'data:', 'https:'], // Allow images from self, data URIs, and HTTPS
				fontSrc: ["'self'", 'https:', 'data:'], // Allow fonts from self and HTTPS CDNs
				connectSrc: ["'self'"], // AJAX/fetch/WebSocket only to your own domain
				objectSrc: ["'none'"], // Block <object>, <embed>, <applet> entirely
				frameSrc: ["'none'"], // Block <iframe> embeds
				baseUri: ["'self'"], // Prevent <base> tag hijacking
				formAction: ["'self'"], // Forms can only submit to your own domain
			},
		},
		// --- Referrer-Policy ---
		// Controls how much URL info is sent when navigating away from your site.
		// 'strict-origin-when-cross-origin': sends full URL for same-origin, only origin for cross-origin
		referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
		// --- Permissions-Policy ---
		// Controls which browser features/APIs your site can use.
		// Disabling unused features reduces attack surface.
		permissionsPolicy: {
			features: {
				camera: ["'none'"], // Block camera access
				microphone: ["'none'"], // Block microphone access
				geolocation: ["'none'"], // Block location access
				payment: ["'self'"], // Allow Payment Request API (ecommerce needs this)
			},
		},
		// --- X-Content-Type-Options: nosniff ---
		// Prevents browser from MIME-sniffing a response away from declared Content-Type.
		// Stops attacks where a malicious file is disguised (e.g., .jpg that's actually .js).
		noSniff: true,
		// --- X-Frame-Options: DENY ---
		// Prevents your site from being embedded in an iframe (clickjacking prevention).
		frameguard: { action: 'deny' },
		// --- Strict-Transport-Security ---
		// Forces browsers to use HTTPS for all future requests to your domain.
		// maxAge: 1 year (minimum), includeSubDomains: cover subdomains, preload: submit to HSTS preload list.
		hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(
	express.json({
		limit: '1mb',
		// Preserve raw body buffer for webhook signature verification (Razorpay, Stripe, etc.).
		// Only stored on routes that need it — matched by path prefix to avoid wasting memory on
		// every request. Add your webhook paths to the condition below.
		verify: (req, res, buf) => {
			if (req.originalUrl.startsWith('/api/') && req.originalUrl.includes('/webhooks')) {
				req.rawBody = buf;
			}
		},
	})
);
app.use(cookieParser());

app.use(xss());
app.use(compression({ threshold: 1024 }));

app.use(express.static(path.resolve('public')));

app.use(corsMiddleware);

setupSwagger(app);

app.use(overallLimiter);

app.use(payloadLogger);

app.use(gracefulShutdownGuard);
app.use(requestTimeout);

app.use(appRouter);

app.use((req, res, next) => {
	logger.warn(`API not found on ${req.method} : ${req.originalUrl}`);
	next(notFoundError('API not found'));
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
