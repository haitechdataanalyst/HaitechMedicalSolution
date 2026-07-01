import morgan from 'morgan';
import logger from './logger.js';
import env from './config.js';
import { environments } from '../constants/index.js';

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIP = () => (env.ENV === environments.PROD ? ':remote-addr - ' : '');
const successFormat = `${getIP()} :method :url :status :res[content-length] - :response-time ms`;
const errorFormat = `${getIP()} :method :url :status :res[content-length] - :response-time ms - message :message`;

// Custom format for success responses
export const httpSuccessHandler = morgan(successFormat, {
	skip: (req, res) => res.statusCode >= 400, // only log 2xx and 3xx
	stream: {
		write: (message) =>
			logger.info(message.trim(), {
				service: 'http',
				status: 'success',
			}),
	},
});

// Custom format for error responses
export const httpErrorHandler = morgan(errorFormat, {
	skip: (req, res) => res.statusCode < 400, // only log 4xx and 5xx
	stream: {
		write: (message) =>
			logger.error(message.trim(), {
				service: 'http',
				status: 'error',
			}),
	},
});
