import app from './src/app.js';
import { env, redis, logger, closeDB, checkDBHealth } from './src/config/index.js';
import { withRetries } from './src/utils/index.js';

let server;
let isShuttingDown = false;

const startServer = async () => {
	try {
		// Redis is optional for startup: if unavailable, continue in degraded mode.
		await withRetries('Redis connection', () => redis.connectToRedis(), {
			attempts: 3,
			waitMs: 1000,
			throwOnFail: false,
		});

		if (!redis.isRedisConnected()) {
			logger.warn('Starting server in degraded mode: Redis unavailable, cache-backed features may be slower');
		}

		// PostgreSQL is mandatory, so fail startup after retries if unavailable.
		const dbHealthy = await withRetries('PostgreSQL health check', () => checkDBHealth(), {
			attempts: 5,
			waitMs: 1500,
			throwOnFail: true,
		});

		if (!dbHealthy) {
			throw new Error('PostgreSQL connection failed');
		}
		logger.info('⚡ Connected to PostgreSQL');

		// Start HTTP server
		server = app.listen(env.PORT, () => {
			logger.info(`⚡ Server is up and running on port : ${env.PORT}`);
		});
	} catch (error) {
		logger.error('Failed to start server:', error);
		process.exit(1);
	}
};

const shutDownServer = async (signal) => {
	// Prevent multiple shutdown attempts
	if (isShuttingDown) {
		logger.warn(`Shutdown already in progress, ignoring ${signal}`);
		return;
	}

	isShuttingDown = true;
	logger.info(`${signal} received, shutting down gracefully`);

	// Force shutdown after 10 seconds
	const forceShutdownTimer = setTimeout(() => {
		logger.error('Forced shutdown after timeout');
		process.exit(1);
	}, 10000);

	try {
		// Signal app to reject new requests
		app.set('isShuttingDown', true);

		// Stop accepting new connections
		if (server) {
			await new Promise((resolve, reject) => {
				server.close((err) => {
					if (err) {
						logger.error('Error closing HTTP server:', err);
						reject(err);
					} else {
						logger.info('HTTP server closed');
						resolve();
					}
				});
			});
		}

		// Close database connections
		await closeDB();

		// Disconnect from Redis
		await redis.disconnectRedis();
		logger.info('Redis disconnected');

		// Clear the force shutdown timer
		clearTimeout(forceShutdownTimer);

		logger.info('Graceful shutdown completed');
		process.exit(0);
	} catch (error) {
		logger.error('Error during shutdown:', error);
		clearTimeout(forceShutdownTimer);
		process.exit(1);
	}
};

const unExpectedErrorHandler = (error) => {
	logger.error('Unexpected error occurred:', error);

	// If server hasn't started yet, just exit
	if (!server) {
		logger.error('Server not initialized, exiting immediately');
		process.exit(1);
	}

	// Otherwise attempt graceful shutdown
	shutDownServer('UNEXPECTED_ERROR');
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	logger.error('Uncaught Exception:', error);
	unExpectedErrorHandler(error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
	unExpectedErrorHandler(reason);
});

// Handle termination signals
process.on('SIGTERM', () => shutDownServer('SIGTERM'));
process.on('SIGINT', () => shutDownServer('SIGINT'));

logger.info('⚡ Starting server on port : ' + env.PORT);
// Start the server
startServer();
