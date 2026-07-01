import { logger, redis } from '../config/index.js';

export async function setRedisData(key, data, ttl = null) {
	try {
		const success = await redis.executeWithRedisCircuitBreaker(
			`set:${key}`,
			async () => {
				const client = redis.getRedisClient();
				const serialized = JSON.stringify(data);

				if (ttl && ttl > 0) {
					await client.setEx(key, ttl, serialized);
				} else {
					await client.set(key, serialized);
				}

				return true;
			},
			false
		);

		return success;
	} catch (error) {
		logger.error(`Redis SET error for key "${key}":`, error);
		return false;
	}
}

export async function getRedisData(key, { throwOnError = false } = {}) {
	try {
		const data = await redis.executeWithRedisCircuitBreaker(
			`get:${key}`,
			async () => {
				const client = redis.getRedisClient();
				return client.get(key);
			},
			null
		);

		if (data === null) {
			return null;
		}

		return JSON.parse(data);
	} catch (error) {
		if (error instanceof SyntaxError) {
			logger.error(`Redis JSON parse error for key "${key}":`, error);
		} else {
			logger.error(`Redis GET error for key "${key}":`, error);
		}

		if (throwOnError) {
			throw error;
		}

		return null;
	}
}

export async function deleteRedisData(key) {
	try {
		const deleted = await redis.executeWithRedisCircuitBreaker(
			`del:${key}`,
			async () => {
				const client = redis.getRedisClient();
				return client.del(key);
			},
			0
		);
		return deleted === 1;
	} catch (error) {
		logger.error(`Redis DEL error for key "${key}":`, error);
		return false;
	}
}

export async function deleteMultipleKeys(keys) {
	try {
		if (!keys || keys.length === 0) {
			return 0;
		}

		const deleted = await redis.executeWithRedisCircuitBreaker(
			'del:multiple',
			async () => {
				const client = redis.getRedisClient();
				return client.del(keys);
			},
			0
		);

		return deleted;
	} catch (error) {
		logger.error(`Redis DELETE MULTIPLE error:`, error);
		return 0;
	}
}

export async function deleteRedisPattern(pattern) {
	try {
		const totalDeleted = await redis.executeWithRedisCircuitBreaker(
			`del:pattern:${pattern}`,
			async () => {
				const client = redis.getRedisClient();
				let cursor = '0';
				let deletedCount = 0;

				do {
					const reply = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
					cursor = reply.cursor;
					const keys = reply.keys || [];

					if (keys.length > 0) {
						const deleted = await client.del(keys);
						deletedCount += deleted || 0;
					}
				} while (cursor !== '0');

				return deletedCount;
			},
			0
		);

		return totalDeleted;
	} catch (error) {
		logger.error(`Redis DELETE PATTERN error for pattern "${pattern}":`, error);
		return 0;
	}
}

export async function existsRedisKey(key) {
	try {
		const exists = await redis.executeWithRedisCircuitBreaker(
			`exists:${key}`,
			async () => {
				const client = redis.getRedisClient();
				return client.exists(key);
			},
			0
		);
		return exists === 1;
	} catch (error) {
		logger.error(`Redis EXISTS error for key "${key}":`, error);
		return false;
	}
}

export async function expireRedisKey(key, ttl) {
	try {
		const result = await redis.executeWithRedisCircuitBreaker(
			`expire:${key}`,
			async () => {
				const client = redis.getRedisClient();
				return client.expire(key, ttl);
			},
			0
		);

		return result === 1;
	} catch (error) {
		logger.error(`Redis EXPIRE error for key "${key}":`, error);
		return false;
	}
}

export async function getTTL(key) {
	try {
		const ttl = await redis.executeWithRedisCircuitBreaker(
			`ttl:${key}`,
			async () => {
				const client = redis.getRedisClient();
				return client.ttl(key);
			},
			-2
		);

		return ttl;
	} catch (error) {
		logger.error(`Redis TTL error for key "${key}":`, error);
		return -2;
	}
}

export async function incrementRedisKey(key, amount = 1) {
	try {
		const result = await redis.executeWithRedisCircuitBreaker(
			`incr:${key}`,
			async () => {
				const client = redis.getRedisClient();
				return client.incrBy(key, amount);
			},
			null
		);

		return result;
	} catch (error) {
		logger.error(`Redis INCREMENT error for key "${key}":`, error);
		return null;
	}
}

export async function decrementRedisKey(key, amount = 1) {
	try {
		const result = await redis.executeWithRedisCircuitBreaker(
			`decr:${key}`,
			async () => {
				const client = redis.getRedisClient();
				return client.decrBy(key, amount);
			},
			null
		);

		return result;
	} catch (error) {
		logger.error(`Redis DECREMENT error for key "${key}":`, error);
		return null;
	}
}

export async function getMultipleKeys(keys) {
	try {
		if (!keys || keys.length === 0) {
			return {};
		}

		const values = await redis.executeWithRedisCircuitBreaker(
			'mget',
			async () => {
				const client = redis.getRedisClient();
				return client.mGet(keys);
			},
			[]
		);

		const result = {};
		keys.forEach((key, index) => {
			// eslint-disable-next-line security/detect-object-injection
			if (values[index] !== null) {
				try {
					// eslint-disable-next-line security/detect-object-injection
					result[key] = JSON.parse(values[index]);
				} catch {
					// eslint-disable-next-line security/detect-object-injection
					result[key] = values[index];
				}
			}
		});

		return result;
	} catch (error) {
		logger.error(`Redis MGET error:`, error);
		return {};
	}
}

export async function setMultipleKeys(dataMap, ttl = null) {
	try {
		return await redis.executeWithRedisCircuitBreaker(
			'mset',
			async () => {
				const client = redis.getRedisClient();
				const pipeline = client.multi();

				Object.entries(dataMap).forEach(([key, value]) => {
					const serialized = JSON.stringify(value);
					if (ttl && ttl > 0) {
						pipeline.setEx(key, ttl, serialized);
					} else {
						pipeline.set(key, serialized);
					}
				});

				await pipeline.exec();
				return true;
			},
			false
		);
	} catch (error) {
		logger.error(`Redis SET MULTIPLE error:`, error);
		return false;
	}
}

export async function flushAllRedis() {
	try {
		const success = await redis.executeWithRedisCircuitBreaker(
			'flushAll',
			async () => {
				const client = redis.getRedisClient();
				await client.flushAll();
				return true;
			},
			false
		);

		if (success) {
			logger.warn('Redis: All data flushed!');
		}

		return success;
	} catch (error) {
		logger.error(`Redis FLUSH ALL error:`, error);
		return false;
	}
}
