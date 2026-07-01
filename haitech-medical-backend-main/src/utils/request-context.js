import { AsyncLocalStorage } from 'node:async_hooks';

const requestContextStorage = new AsyncLocalStorage();

export const runWithRequestContext = (context, callback) => requestContextStorage.run({ ...context }, callback);

export const getRequestContext = () => requestContextStorage.getStore() || {};

export const setRequestContext = (updates = {}) => {
	const store = requestContextStorage.getStore();

	if (!store) {
		return null;
	}

	Object.entries(updates).forEach(([key, value]) => {
		if (value !== undefined) {
			// eslint-disable-next-line security/detect-object-injection
			store[key] = value;
		}
	});

	return store;
};
