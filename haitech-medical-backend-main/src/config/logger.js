/* eslint-disable security/detect-object-injection */
import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { getRequestContext } from '../utils/request-context.js';
import config from './config.js';
import { environments } from '../constants/index.js';

const reservedKeys = new Set(['level', 'message', 'timestamp', 'stack', 'env', 'requestId', 'userId', 'method', 'path']);

// Custom format to inject request context into log entries
const injectRequestContext = format((info) => {
	const context = getRequestContext();

	['requestId', 'userId', 'method', 'path'].forEach((field) => {
		if (info[field] === undefined && context[field] !== undefined) {
			info[field] = context[field];
		}
	});

	return info;
});

const buildConsoleContext = (info) => {
	const parts = [];

	if (info.requestId) {
		parts.push(`requestId=${info.requestId}`);
	}

	if (info.userId) {
		parts.push(`userId=${info.userId}`);
	}

	if (info.method && info.path) {
		parts.push(`${info.method} ${info.path}`);
	}

	return parts.length ? `[${parts.join(' | ')}] ` : '';
};

const buildConsoleMeta = (info) => {
	const meta = Object.entries(info).reduce((accumulator, [key, value]) => {
		if (!reservedKeys.has(key)) {
			accumulator[key] = value;
		}

		return accumulator;
	}, {});

	return Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
};

const transport = new transports.DailyRotateFile({
	filename: 'logs/%DATE%.log', // logs/2025-09-06.log
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d', // keep logs for 14 days
});

// Custom error formatter to include stack trace if available
const errorStackFormat = format((info) => {
	if (info instanceof Error) {
		return Object.assign({}, info, {
			message: info.message,
			stack: info.stack,
		});
	}
	return info;
});

const logger = winston.createLogger({
	level: 'info',
	defaultMeta: { env: config.ENV || environments.DEV },
	format: format.combine(injectRequestContext(), errorStackFormat(), format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }), format.json()),
	transports: [
		// Console for dev
		new transports.Console({
			format: format.combine(
				format.colorize(),
				injectRequestContext(),
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
				format.printf(
					(info) => `${info.timestamp} ${info.level}: ${buildConsoleContext(info)}${info.message}${buildConsoleMeta(info)}${info.stack ? `\nStack: ${info.stack}` : ''}`
				)
			),
		}),
		transport,
	],
});

export default logger;
