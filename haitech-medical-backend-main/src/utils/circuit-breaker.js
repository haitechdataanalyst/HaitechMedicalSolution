import { logger } from '../config/index.js';

/**
 * Generic circuit breaker factory.
 *
 * Creates an independent breaker instance per external service (Redis, Razorpay,
 * Zoho, SMTP, logistics APIs, etc.). Each instance maintains its own failure
 * counter, state, and cooldown timer — a failing SMTP server won't trip the
 * Razorpay breaker.
 *
 * States:
 *   CLOSED    → all calls pass through normally
 *   OPEN      → calls are rejected immediately, returning the fallback value
 *   HALF_OPEN → one probe call is allowed; success → CLOSED, failure → OPEN
 *
 * @param {object}  options
 * @param {string}  options.name              - Human-readable service name (for logs)
 * @param {number}  [options.failureThreshold=5]  - Consecutive failures before opening
 * @param {number}  [options.cooldownMs=30000]    - How long to stay OPEN before a probe
 * @param {number}  [options.timeoutMs=5000]      - Per-operation timeout in ms
 *
 * @returns {{ execute: Function, getState: Function, reset: Function }}
 *
 * @example
 * import { createCircuitBreaker } from '../utils/circuit-breaker.js';
 *
 * const razorpayBreaker = createCircuitBreaker({
 *   name: 'razorpay',
 *   failureThreshold: 3,
 *   cooldownMs: 15000,
 *   timeoutMs: 8000,
 * });
 *
 * // In your service:
 * const result = await razorpayBreaker.execute(
 *   'createOrder',
 *   () => razorpayClient.orders.create(payload),
 *   null  // fallback value when circuit is open
 * );
 */
export const createCircuitBreaker = ({ name, failureThreshold = 5, cooldownMs = 30000, timeoutMs = 5000 }) => {
	const state = {
		status: 'CLOSED', // CLOSED | OPEN | HALF_OPEN
		failures: 0,
		openedAt: null,
		halfOpenInFlight: false,
	};

	const markClosed = () => {
		if (state.status !== 'CLOSED') {
			logger.info(`Circuit breaker [${name}] closed`);
		}
		state.status = 'CLOSED';
		state.failures = 0;
		state.openedAt = null;
		state.halfOpenInFlight = false;
	};

	const markOpen = (reason) => {
		if (state.status !== 'OPEN') {
			logger.warn(`Circuit breaker [${name}] opened: ${reason}`);
		}
		state.status = 'OPEN';
		state.openedAt = Date.now();
		state.halfOpenInFlight = false;
	};

	const canAttemptProbe = () => {
		if (state.status !== 'OPEN') return false;
		if (Date.now() - (state.openedAt || 0) < cooldownMs) return false;
		if (state.halfOpenInFlight) return false;

		state.status = 'HALF_OPEN';
		state.halfOpenInFlight = true;
		return true;
	};

	const withTimeout = (operation) => {
		return Promise.race([
			operation(),
			new Promise((_, reject) => {
				setTimeout(() => reject(new Error(`[${name}] operation timed out after ${timeoutMs}ms`)), timeoutMs);
			}),
		]);
	};

	/**
	 * Execute an operation through the circuit breaker.
	 *
	 * @param {string}   operationName - Label for logging (e.g. 'createOrder')
	 * @param {Function} operation     - Async function to execute
	 * @param {*}        [fallback=null] - Value returned when circuit is open
	 * @returns {Promise<*>}
	 */
	const execute = async (operationName, operation, fallback = null) => {
		if (state.status === 'OPEN' && !canAttemptProbe()) {
			logger.warn(`Circuit [${name}] open — skipping: ${operationName}`);
			return fallback;
		}

		try {
			const result = await withTimeout(operation);
			markClosed();
			return result;
		} catch (error) {
			state.failures += 1;

			if (state.status === 'HALF_OPEN') {
				markOpen(`half-open probe failed on ${operationName}`);
			} else if (state.failures >= failureThreshold) {
				markOpen(`failure threshold reached on ${operationName}`);
			}

			logger.error(`Circuit [${name}] operation failed: ${operationName}`, { error: error.message });
			return fallback;
		} finally {
			if (state.status === 'HALF_OPEN') {
				state.halfOpenInFlight = false;
			}
		}
	};

	/**
	 * Returns the current breaker state for health checks / monitoring.
	 */
	const getState = () => ({
		name,
		status: state.status,
		failures: state.failures,
		openedForMs: state.openedAt ? Date.now() - state.openedAt : 0,
	});

	/**
	 * Force-reset the breaker to CLOSED (e.g., after a manual service recovery).
	 */
	const reset = () => markClosed();

	return { execute, getState, reset };
};
