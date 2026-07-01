import { readFileSync } from 'fs';
import path from 'path';
import { parse } from 'yaml';
import swaggerUi from 'swagger-ui-express';

const specPath = path.resolve('docs/openapi.yaml');
const specFile = readFileSync(specPath, 'utf8');
const swaggerSpec = parse(specFile);

/**
 * Mounts Swagger UI on the given Express app at `/api-docs`.
 *
 * Swagger UI's bundled assets require inline styles and scripts.
 * A dedicated CSP middleware is applied only to the `/api-docs` route
 * so the rest of the app keeps its strict CSP intact.
 *
 * @param {import('express').Express} app
 */
export const setupSwagger = (app) => {
	// Relaxed CSP only for the Swagger UI route
	const swaggerCsp = (_req, res, next) => {
		res.setHeader(
			'Content-Security-Policy',
			"default-src 'self'; " +
				"script-src 'self' 'unsafe-inline'; " +
				"style-src 'self' 'unsafe-inline'; " +
				"img-src 'self' data: https://swagger.io; " +
				"font-src 'self' data:;"
		);
		next();
	};

	app.use('/api-docs', swaggerCsp, swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};

export { swaggerSpec };
