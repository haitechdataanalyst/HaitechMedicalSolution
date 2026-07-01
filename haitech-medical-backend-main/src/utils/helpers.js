import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/index.js';
import { IN_PHONE_PREFIX_REGEX, NON_DIGIT_REGEX } from '../constants/index.js';

export const catchAsync = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch((err) => {
		logger.error(err);
		next(err);
	});
};

export const resolver = (promise) => promise.then((data) => [null, data]).catch((err) => [err, null]);

export const pick = (object, keys) => {
	return keys.reduce((obj, key) => {
		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
			obj[key] = object[key]; // eslint-disable-line security/detect-object-injection
		}
		return obj;
	}, {});
};

export const removeEmptyKeys = (obj) => {
	return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
};

export const removeDuplicateItems = (array) => Array.from(new Set(array.filter(Boolean)));

export const getCurrentDateTime = () => {
	const now = new Date();

	const pad = (n) => (n < 10 ? '0' + n : n);

	const d = pad(now.getDate());
	const m = pad(now.getMonth() + 1);
	const y = now.getFullYear();

	const h = pad(now.getHours());
	const min = pad(now.getMinutes());
	const s = pad(now.getSeconds());

	const offset = -now.getTimezoneOffset();
	const sign = offset >= 0 ? '+' : '-';
	const tzH = pad(Math.floor(Math.abs(offset) / 60));
	const tzM = pad(Math.abs(offset) % 60);
	const tz = `GMT${sign}${tzH}${tzM}`;

	const date = `${d}-${m}-${y}`;
	const time = `${h}:${min}:${s}`;

	return {
		dd_mm_yyyy: date,
		mm_dd_yyyy: `${m}/${d}/${y}`,
		iso_date: `${y}-${m}-${d}T${h}:${min}:${s}${sign}${tzH}:${tzM}`,
		date_with_time: `${date} ${time}`,
		time_only: time,
		timezone: tz,
		full: `${date} ${time} ${tz}`,
	};
};

export const encryptData = (text, secretKey) => {
	const iv = crypto.randomBytes(16);
	const key = crypto.createHash('sha256').update(secretKey).digest();
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decryptData = (encryptedText, secretKey) => {
	const [ivHex, dataHex] = encryptedText.split(':');
	const iv = Buffer.from(ivHex, 'hex');
	const encrypted = Buffer.from(dataHex, 'hex');
	const key = crypto.createHash('sha256').update(secretKey).digest();
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
	return decrypted.toString('utf8');
};

export const flattenObject = (obj, prefix = '') => {
	const flattened = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			// eslint-disable-next-line security/detect-object-injection
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}_`)); // eslint-disable-line security/detect-object-injection
			} else {
				flattened[`${prefix}${key}`] = obj[key]; // eslint-disable-line security/detect-object-injection
			}
		}
	}
	return flattened;
};

export const generateUniqueId = () => uuidv4();

export const formatContactNumber = (contactNo) => {
	let normalized = contactNo.toString();
	if (normalized.length >= 10) {
		normalized = normalized.replace(IN_PHONE_PREFIX_REGEX, '').replace(NON_DIGIT_REGEX, '');
	}
	return normalized;
};

export const delay = (ms) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

export const withRetries = async (label, task, { attempts = 3, waitMs = 1500, throwOnFail = true } = {}) => {
	let lastError;

	for (let attempt = 1; attempt <= attempts; attempt += 1) {
		try {
			return await task();
		} catch (error) {
			lastError = error;
			logger.warn(`${label} attempt ${attempt}/${attempts} failed: ${error.message}`);

			if (attempt < attempts) {
				await delay(waitMs * attempt);
			}
		}
	}

	if (throwOnFail) {
		throw lastError;
	}

	return null;
};
