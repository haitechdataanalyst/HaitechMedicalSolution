/**
 * Returns a snapshot of current process memory usage.
 * Useful for health endpoints, monitoring, and diagnostics.
 *
 * @returns {{ heapUsed: number, heapTotal: number, rss: number }}
 */
export const getMemorySnapshot = () => {
	const mem = process.memoryUsage();
	return { heapUsed: mem.heapUsed, heapTotal: mem.heapTotal, rss: mem.rss };
};
