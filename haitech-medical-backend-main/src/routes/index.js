import { Router } from 'express';
import authRouter from './auth.routes.js';
import usersRouter from './users.routes.js';
import ordersRouter from './orders.routes.js';
import paymentsRouter from './payments.routes.js';
import cartRouter from './cart.routes.js';
import wishlistRouter from './wishlist.routes.js';
import productsRouter from './products.routes.js';
import shipmentsRouter from './shipments.routes.js';
import reviewsRouter from './reviews.routes.js';
import notificationsRouter from './notifications.routes.js';
import couponsRouter from './coupons.routes.js';
import dashboardRouter from './dashboard.routes.js';
import adminRouter from './admin.routes.js';
import returnsRouter from './returns.routes.js';
import inventoryRouter from './inventory.routes.js';
import { env } from '../config/index.js';
import { catchAsync, getMemorySnapshot } from '../utils/index.js';
import { checkDependencies } from '../services/index.js';
import { apiKeyAuth } from '../middlewares/index.js';

const appRouter = Router();
const apiRouter = Router();

apiRouter.use(apiKeyAuth);

const routers = {
	'/auth': authRouter,
	'/users': usersRouter,
	'/orders': ordersRouter,
	'/payments': paymentsRouter,
	'/cart': cartRouter,
	'/wishlist': wishlistRouter,
	'/products': productsRouter,
	'/shipments': shipmentsRouter,
	'/reviews': reviewsRouter,
	'/notifications': notificationsRouter,
	'/coupons': couponsRouter,
	'/dashboard': dashboardRouter,
	'/admin': adminRouter,
	'/returns': returnsRouter,
	'/inventory': inventoryRouter,
};

Object.entries(routers).forEach(([path, router]) => {
	apiRouter.use(path, router);
});

// Versioned deep health — includes dep status, versions, and memory snapshot.
apiRouter.get(
	'/health',
	catchAsync(async (req, res) => {
		const { allHealthy, dbHealthy, redisHealthy, redisCircuitState } = await checkDependencies();
		return res.respond(allHealthy ? 200 : 503, {
			status: allHealthy ? 'healthy' : 'degraded',
			version: env.API_VERSION,
			nodeVersion: process.version,
			uptime: process.uptime(),
			memory: getMemorySnapshot(),
			dependencies: {
				database: { status: dbHealthy ? 'healthy' : 'unhealthy' },
				redis: { status: redisHealthy ? 'healthy' : 'unhealthy', circuitBreaker: redisCircuitState },
			},
		});
	})
);

appRouter.use(`/api/${env.API_VERSION}`, apiRouter);

// ── Root-level health probes ─────────────────────────────────────────────────

appRouter.get('/health/live', (req, res) => {
	return res.respond(200, {
		status: 'alive',
		uptime: process.uptime(),
		memory: getMemorySnapshot(),
	});
});

appRouter.get(
	'/health/ready',
	catchAsync(async (req, res) => {
		const { allHealthy, dbHealthy, redisHealthy, redisCircuitState } = await checkDependencies();
		return res.respond(allHealthy ? 200 : 503, {
			status: allHealthy ? 'ready' : 'not ready',
			version: env.API_VERSION,
			nodeVersion: process.version,
			uptime: process.uptime(),
			memory: getMemorySnapshot(),
			dependencies: {
				database: { status: dbHealthy ? 'healthy' : 'unhealthy' },
				redis: { status: redisHealthy ? 'healthy' : 'unhealthy', circuitBreaker: redisCircuitState },
			},
		});
	})
);

appRouter.get('/api/versions', (req, res) => {
	return res.respond(200, { supported: [env.API_VERSION], default: env.API_VERSION });
});

export default appRouter;
