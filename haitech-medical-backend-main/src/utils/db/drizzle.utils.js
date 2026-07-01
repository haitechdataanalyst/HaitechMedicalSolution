import { count, eq, sql } from 'drizzle-orm';
import { db } from '../../config/index.js';
import { notFoundError } from '../errors/error.utils.js';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const RETRYABLE_TRANSACTION_ERROR_CODES = new Set(['40001', '40P01']);

const normalizePositiveInt = (value, fallback) => {
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const wait = (ms) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

/**
 * Applies pagination to a Drizzle query and returns results in the project's
 * standard pagination format.
 *
 * @param {import('drizzle-orm').PgSelect} query - A Drizzle select query (before .execute())
 * @param {import('drizzle-orm').PgTable} table - The table being queried (for COUNT)
 * @param {object} opts
 * @param {number} [opts.page=1]     - 1-based page number
 * @param {number} [opts.pageSize=20] - rows per page
 * @param {import('drizzle-orm').SQL} [opts.where] - optional WHERE clause for accurate total count
 * @returns {Promise<{ data: any[], pagination: { page, pageSize, total, totalPages, offset, limit } }>}
 */
export const paginate = async (query, table, { page = 1, pageSize = 20, where } = {}) => {
	const safePage = normalizePositiveInt(page, DEFAULT_PAGE);
	const requestedPageSize = normalizePositiveInt(pageSize, DEFAULT_PAGE_SIZE);
	const safePageSize = Math.min(requestedPageSize, MAX_PAGE_SIZE);
	const offset = (safePage - 1) * safePageSize;

	const countQuery = where ? db.select({ total: count() }).from(table).where(where) : db.select({ total: count() }).from(table);

	const [data, countRows] = await Promise.all([query.limit(safePageSize).offset(offset), countQuery]);

	const total = countRows[0]?.total ?? 0;

	const totalNum = Number(total);
	return {
		data,
		pagination: {
			page: safePage,
			pageSize: safePageSize,
			total: totalNum,
			totalPages: Math.ceil(totalNum / safePageSize),
			offset,
			limit: safePageSize,
		},
	};
};

/**
 * Wraps a callback in a database transaction.
 *
 * @param {import('drizzle-orm/postgres-js').PostgresJsDatabase} db - Drizzle instance
 * @param {(tx: import('drizzle-orm/postgres-js').PostgresJsDatabase) => Promise<any>} callback
 * @returns {Promise<any>}
 *
 * @example
 * const result = await withTransaction(db, async (tx) => {
 *   await tx.insert(users).values({ ... });
 *   await tx.insert(orders).values({ ... });
 *   return { success: true };
 * });
 */
export const withTransaction = (db, callback) => {
	return db.transaction(callback);
};

/**
 * Runs a transaction and automatically retries deadlock/serialization failures.
 * Useful for high-contention flows such as inventory and payment updates.
 *
 * @param {import('drizzle-orm/postgres-js').PostgresJsDatabase} db
 * @param {(tx: import('drizzle-orm/postgres-js').PostgresJsDatabase) => Promise<any>} callback
 * @param {{maxRetries?: number, baseDelayMs?: number}} [options]
 * @returns {Promise<any>}
 */
export const withRetryableTransaction = async (db, callback, { maxRetries = 3, baseDelayMs = 50 } = {}) => {
	const safeMaxRetries = normalizePositiveInt(maxRetries, 3);
	const safeBaseDelay = Math.max(0, Number(baseDelayMs) || 0);

	for (let attempt = 1; attempt <= safeMaxRetries; attempt += 1) {
		try {
			return await db.transaction(callback);
		} catch (error) {
			const code = String(error?.code || '');
			const canRetry = RETRYABLE_TRANSACTION_ERROR_CODES.has(code) && attempt < safeMaxRetries;

			if (!canRetry) {
				throw error;
			}

			const jitter = Math.floor(Math.random() * 25);
			const delayMs = safeBaseDelay * 2 ** (attempt - 1) + jitter;
			await wait(delayMs);
		}
	}
};

/**
 * Checks if a row exists in a table matching the given column and value.
 *
 * @param {import('drizzle-orm/postgres-js').PostgresJsDatabase} db - Drizzle instance
 * @param {import('drizzle-orm').PgTable} table - Drizzle table reference
 * @param {import('drizzle-orm').PgColumn} column - Column to check
 * @param {any} value - Value to match
 * @returns {Promise<boolean>}
 *
 * @example
 * const emailTaken = await existsIn(db, users, users.email, 'user@example.com');
 */
export const existsIn = async (db, table, column, value) => {
	const result = await db.select({ exists: sql`EXISTS(SELECT 1 FROM ${table} WHERE ${eq(column, value)})`.as('exists') }).from(sql`(SELECT 1) AS _dummy`);
	return result[0]?.exists === true;
};

/**
 * Finds a row by table `id` and throws a standard ApiError when absent.
 *
 * @param {import('drizzle-orm/postgres-js').PostgresJsDatabase} db
 * @param {import('drizzle-orm').PgTable} table
 * @param {string|number} id
 * @param {string} [message]
 * @returns {Promise<any>}
 */
export const findByIdOrFail = async (db, table, id, message = 'Resource not found') => {
	const [record] = await db.select().from(table).where(eq(table.id, id)).limit(1);

	if (!record) {
		throw notFoundError(message);
	}

	return record;
};

/**
 * Inserts records in batches to avoid oversized statements and memory spikes.
 *
 * @param {import('drizzle-orm/postgres-js').PostgresJsDatabase} db
 * @param {import('drizzle-orm').PgTable} table
 * @param {any[]} records
 * @param {{batchSize?: number, returning?: boolean}} [options]
 * @returns {Promise<{insertedCount: number, rows: any[]}>}
 */
export const bulkInsert = async (db, table, records, { batchSize = 100, returning = true } = {}) => {
	if (!Array.isArray(records) || records.length === 0) {
		return { insertedCount: 0, rows: [] };
	}

	const safeBatchSize = normalizePositiveInt(batchSize, 100);
	const rows = [];
	let insertedCount = 0;

	for (let index = 0; index < records.length; index += safeBatchSize) {
		const batch = records.slice(index, index + safeBatchSize);
		const query = db.insert(table).values(batch);

		if (returning) {
			const insertedRows = await query.returning();
			rows.push(...insertedRows);
		} else {
			await query;
		}

		insertedCount += batch.length;
	}

	return { insertedCount, rows };
};
