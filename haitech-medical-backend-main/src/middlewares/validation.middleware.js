import Joi from 'joi';
import { pick, badRequestError, internalError } from '../utils/index.js';
import { DOUBLE_QUOTE_REGEX } from '../constants/index.js';
import { logger } from '../config/index.js';

const SCHEMA_KEYS = ['params', 'query', 'body', 'fields', 'files'];

export const validate = (schema) => {
	// All of this runs ONCE at route registration time
	const validSchema = pick(schema, SCHEMA_KEYS);
	const requestKeys = Object.keys(validSchema);
	const compiled = Joi.compile(validSchema).prefs({
		errors: { label: 'key' },
		abortEarly: false,
		allowUnknown: false,
		stripUnknown: false,
	});

	// This runs on every request — now it's just validate + assign
	return (req, res, next) => {
		try {
			const { value, error } = compiled.validate(pick(req, requestKeys));

			if (error) {
				const errorMessage = error.details.map((d) => d.message.replace(DOUBLE_QUOTE_REGEX, '')).join(', ');
				return next(badRequestError(errorMessage));
			}

			if (value.params) req.params = value.params;
			if (value.query) req.query = value.query;
			if (value.body) req.body = value.body;
			if (value.fields) req.fields = value.fields;
			if (value.files) req.files = value.files;

			return next();
		} catch (err) {
			logger.error('Validation middleware error:', { error: err.message, stack: err.stack });
			return next(internalError('Validation error occurred'));
		}
	};
};
