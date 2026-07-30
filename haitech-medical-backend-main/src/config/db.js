import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import config from './config.js';
import { DrizzleLogger } from '../utils/db/query-logger.js';
import { environments } from '../constants/index.js';
import logger from './logger.js';
import * as schema from '../schema/index.js';

const pgClient = postgres({
	host: config.POSTGRES.HOST,
	port: config.POSTGRES.PORT,
	database: config.POSTGRES.DB,
	user: config.POSTGRES.USER,
	password: config.POSTGRES.PASS,
	// Hosted providers (e.g. Supabase) require SSL; local Postgres doesn't.
	ssl: config.POSTGRES.SSL ? 'require' : false,
	// Connection pool configuration
	max: 20, // Maximum pool size
	idle_timeout: 30, // Close idle connections after 30 seconds
	connect_timeout: 10, // Connection timeout in seconds
	// Transform column names from snake_case to camelCase
	transform: {
		undefined: null, // Transform undefined to null in queries
	},
	// Error handling
	onnotice: (notice) => {
		if (config.ENV !== environments.PROD) {
			logger.debug(`PostgreSQL Notice: ${notice.message}`);
		}
	},
});

// Drizzle ORM instance — use this for all schema-driven queries.
// The raw pgClient is still available via the default export for edge cases.
export const db = drizzle(pgClient, {
	schema,
	logger: config.ENV !== environments.PROD ? new DrizzleLogger() : false,
});

// Close database connections gracefully
export const closeDB = async () => {
	await pgClient.end({ timeout: 5 });
	logger.info('Database connections closed.');
};

// Health check function
export const checkDBHealth = async () => {
	try {
		const result = await pgClient`SELECT 1 as health`;
		return result.length === 1 && result[0].health === 1;
	} catch (error) {
		logger.error('Database health check failed:', error);
		return false;
	}
};

export default pgClient;
