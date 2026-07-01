import { checkDBHealth, redis } from '../config/index.js';

// ── Cached dependency health check ───────────────────────────────────────────
// Shared across all health endpoints. Caches the result in memory for a short
// TTL so rapid-fire probe calls (K8s sends them every 5–10s) don't hammer
// Redis and PostgreSQL with redundant pings.

const HEALTH_CACHE_TTL_MS = 5000; // 5 seconds
let healthCache = { data: null, expiresAt: 0 };

export const checkDependencies = async () => {
	const now = Date.now();
	if (healthCache.data && now < healthCache.expiresAt) {
		return healthCache.data;
	}

	const [redisHealthy, dbHealthy] = await Promise.all([redis.pingRedis(), checkDBHealth()]);
	const result = {
		redisHealthy,
		dbHealthy,
		allHealthy: redisHealthy && dbHealthy,
		redisCircuitState: redis.getRedisCircuitState(),
	};
	const data = { data: result, expiresAt: now + HEALTH_CACHE_TTL_MS };
	if (healthCache) {
		healthCache = data;
	}
	return result;
};
