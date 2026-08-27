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

			// express-xss-sanitizer's xss() middleware redefines req.query (and
			// sometimes req.params) as a non-writable property. Since this app
			// runs as ES modules (implicit strict mode), a plain `req.query = ...`
			// assignment throws a TypeError instead of silently failing — which
			// previously meant ANY route with a query Joi schema 500'd as soon as
			// validation actually needed to write back a coerced/defaulted value.
			// Object.defineProperty bypasses the writable flag (the property is
			// still configurable) without assuming which of these req properties
			// xss() has frozen.
			const assign = (key, val) => {
				if (val === undefined) return;
				Object.defineProperty(req, key, { value: val, writable: true, enumerable: true, configurable: true });
			};
			assign('params', value.params);
			assign('query', value.query);
			assign('body', value.body);
			assign('fields', value.fields);
			assign('files', value.files);

			return next();
		} catch (err) {
			logger.error('Validation middleware error:', { error: err.message, stack: err.stack });
			return next(internalError('Validation error occurred'));
		}
	};
};
