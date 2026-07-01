import redis from 'redis';
import config from './config.js';
import logger from './logger.js';
import { createCircuitBreaker } from '../utils/circuit-breaker.js';

let client;
let isConnected = false;
let isConnecting = false;
let connectionPromise = null;
let hasEverConnected = false; // true once first connection succeeds

const breaker = createCircuitBreaker({
	name: 'redis',
	failureThreshold: config.REDIS.CIRCUIT_BREAKER.FAILURE_THRESHOLD,
	cooldownMs: config.REDIS.CIRCUIT_BREAKER.COOLDOWN_MS,
	timeoutMs: config.REDIS.CIRCUIT_BREAKER.TIMEOUT_MS,
});

export const connectToRedis = async () => {
	if (isConnecting) return connectionPromise;
	if (isConnected && client) return client;

	isConnecting = true;
	connectionPromise = (async () => {
		try {
			client = redis.createClient({
				socket: {
					host: config.REDIS.HOST,
					port: config.REDIS.PORT,
					reconnectStrategy: (retries) => {
						// On the very first startup, fail immediately so the server
						// can start in degraded mode without waiting 20+ seconds.
						// After a successful connection is established, allow reconnects.
						if (!hasEverConnected) return false;
						if (retries > 10) {
							logger.error('Redis max reconnection attempts reached');
							return false;
						}
						const delay = Math.min(retries * 1000, 3000);
						logger.warn(`Redis reconnecting in ${delay}ms (attempt ${retries})`);
						return delay;
					},
					connectTimeout: 10000,
					tls: config.REDIS.TLS,
				},
				password: config.REDIS.PASS,
			});

			client.on('connect', () => logger.info(`⚡ Connected To Redis Running at PORT : ${config.REDIS.PORT}`));
			client.on('error', (err) => {
				logger.error(`Error Connecting To Redis`, err);
			});
			client.on('reconnecting', () => logger.warn('Redis reconnecting...'));
			client.on('end', () => logger.info('Redis Connection Closed!'));

			await client.connect();
			isConnected = true;
			hasEverConnected = true;
			breaker.reset();
			return client;
		} catch (error) {
			logger.error('Failed to connect to Redis:', error);
			isConnected = false;
			throw new Error('REDIS Connection failure', {
				cause: error,
			});
		} finally {
			isConnecting = false;
		}
	})();

	return connectionPromise;
};

export const getRedisClient = () => {
	if (!client || !isConnected) {
		throw new Error('Redis client is not connected');
	}
	return client;
};

export const executeWithRedisCircuitBreaker = (operationName, operation, fallback = null) => {
	return breaker.execute(operationName, operation, fallback);
};

export const getRedisCircuitState = () => breaker.getState();

export const isRedisConnected = () => {
	return isConnected && client !== null;
};

export const disconnectRedis = async () => {
	if (client) {
		await client.quit();
		isConnected = false;
		if (client) client = null;
	}
};

export const pingRedis = async () => {
	try {
		const pong = await executeWithRedisCircuitBreaker('ping', async () => getRedisClient().ping(), null);
		return pong === 'PONG';
	} catch (error) {
		logger.error('Redis ping failed:', error);
		return false;
	}
};
