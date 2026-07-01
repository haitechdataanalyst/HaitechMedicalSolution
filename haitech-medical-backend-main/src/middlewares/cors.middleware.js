import cors from 'cors';
import { env } from '../config/index.js';

export const corsMiddleware = cors({
	origin: env.ORIGINS,
	credentials: true,
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key', 'Idempotency-Key', 'X-CSRF-Token', 'X-Request-Id'],
});
