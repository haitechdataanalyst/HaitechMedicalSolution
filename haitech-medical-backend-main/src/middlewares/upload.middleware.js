import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer, fileTypeFromFile } from 'file-type';
import { badRequestError, ensureUploadDir } from '../utils/index.js';
import { logger } from '../config/index.js';
import { MIME_TYPES } from '../constants/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Collects all uploaded files from req regardless of how multer attached them.
 * Handles .single()  → req.file
 *          .array()  → req.files  (array)
 *          .fields() → req.files  (object keyed by field name)
 *
 * @param {import('express').Request} req
 * @returns {import('multer').File[]}
 */
export const collectFiles = (req) => {
	if (req.file) return [req.file];
	if (!req.files) return [];
	if (Array.isArray(req.files)) return req.files;
	// fields() shape: { [fieldname]: File[] }
	return Object.values(req.files).flat();
};

/**
 * Validates every uploaded file's true MIME type by inspecting its magic bytes,
 * completely ignoring whatever the client declared in the Content-Type header.
 *
 * Files that fail validation are deleted from disk (if disk storage) before the
 * error is forwarded so we never leave orphaned files around.
 *
 * @param {import('multer').File[]} files
 * @param {Set<string>}             allowedSet
 * @param {'disk'|'memory'}         storageType
 */
export const validateMagicBytes = async (files, allowedSet, storageType) => {
	for (const file of files) {
		let detected;

		if (storageType === 'memory') {
			// buffer is already in memory — cheapest path
			detected = await fileTypeFromBuffer(file.buffer);
		} else {
			// Read magic bytes from the saved file — no need to load the whole thing
			detected = await fileTypeFromFile(file.path);
		}

		if (!detected || !allowedSet.has(detected.mime)) {
			// Clean up the already-saved file so we don't leave junk on disk
			if (storageType === 'disk' && file.path) {
				await fs.unlink(file.path).catch(() => {
					logger.warn(`Failed to delete invalid upload at ${file.path} — manual cleanup may be required`);
				});
			}

			throw badRequestError(
				`File "${file.originalname}" failed content inspection. ` + `Detected: ${detected?.mime ?? 'unknown'}. ` + `Accepted: ${[...allowedSet].join(', ')}`
			);
		}
	}
};

// ─────────────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a multer upload middleware tailored to a specific route's requirements.
 *
 * Security hardening over a naïve multer setup
 * ─────────────────────────────────────────────
 * • Magic-byte inspection (via `file-type`) runs AFTER multer saves the file.
 *   This means we never trust the client-supplied Content-Type header; we read
 *   what the file actually is.  Files that fail are immediately deleted.
 * • Extension is cross-checked against our own MIME whitelist.  An empty /
 *   missing extension is now rejected outright, not silently skipped.
 * • Generated UUIDs for on-disk filenames — original filename never touches FS.
 * • `ensureUploadDir` is resolved once at middleware-creation time (not per
 *   file), eliminating redundant fs.mkdir calls under concurrent load.
 * • `maxTotalSizeBytes` guards against "many small files = giant request" DoS.
 * • Memory-storage path warns loudly when the per-file limit looks risky.
 *
 * External dependency
 * ────────────────────
 * `file-type` >= 19 is pure-ESM.  Your project must use ESM or a bundler that
 * handles it.  Add to package.json:  "file-type": "^19.0.0"
 *
 * NOTE: Pair this with your reverse-proxy / nginx `client_max_body_size` so
 * oversized requests are rejected before they reach Node.js at all.
 *
 * @param {object}   options
 * @param {string[]} options.allowedMimeTypes        - MIME strings from MIME_TYPES
 * @param {number}   [options.maxFileSizeBytes=5MB]  - per-file byte cap
 * @param {number}   [options.maxTotalSizeBytes]     - total request byte cap (optional but recommended)
 * @param {number}   [options.maxFiles=10]           - max files for array/fields uploads
 * @param {string}   [options.destination='']        - sub-folder under uploads/
 * @param {'disk'|'memory'} [options.storage='disk']
 *
 * @returns {{
 *   single: (field: string) => import('express').RequestHandler,
 *   array:  (field: string, maxCount?: number) => import('express').RequestHandler,
 *   fields: (fields: import('multer').Field[]) => import('express').RequestHandler,
 * }}
 *
 * @example
 * // Single image upload
 * const avatarUpload = createUpload({
 *   allowedMimeTypes: FILE_CATEGORIES.IMAGES,
 *   maxFileSizeBytes: 2 * 1024 * 1024,
 * });
 * router.post('/avatar', auth(), avatarUpload.single('avatar'), uploadAvatarController);
 *
 * @example
 * // Multiple documents (up to 5), total request capped at 20 MB
 * const docUpload = createUpload({
 *   allowedMimeTypes: FILE_CATEGORIES.DOCUMENTS,
 *   maxFiles: 5,
 *   maxTotalSizeBytes: 20 * 1024 * 1024,
 *   destination: 'documents',
 * });
 * router.post('/documents', auth(), docUpload.array('files', 5), uploadDocsController);
 */
export const createUpload = ({ allowedMimeTypes, maxFileSizeBytes = 5 * 1024 * 1024, maxTotalSizeBytes, maxFiles = 10, destination = '', storage: storageType = 'disk' }) => {
	// ── Guard: allowedMimeTypes is mandatory ──────────────────────────────────
	if (!allowedMimeTypes?.length) {
		throw new Error('createUpload: allowedMimeTypes must be a non-empty array');
	}

	// ── Guard: memory storage with a large per-file limit is a liability ──────
	const MEMORY_SAFE_LIMIT = 2 * 1024 * 1024; // 2 MB
	if (storageType === 'memory' && maxFileSizeBytes > MEMORY_SAFE_LIMIT) {
		logger.warn(
			`[createUpload] memory storage with maxFileSizeBytes=${(maxFileSizeBytes / (1024 * 1024)).toFixed(1)} MB ` +
				`is risky under concurrent load. Consider disk storage or lowering the limit.`
		);
	}

	const allowedSet = new Set(allowedMimeTypes);

	// ── Storage engine ────────────────────────────────────────────────────────

	let engine;

	if (storageType === 'memory') {
		engine = multer.memoryStorage();
	} else {
		// FIX: resolve the directory ONCE at middleware-creation time.
		// The promise is shared across all requests — no redundant fs.mkdir calls.
		const uploadDirPromise = ensureUploadDir(destination);

		engine = multer.diskStorage({
			destination: async (_req, _file, cb) => {
				try {
					const uploadDir = await uploadDirPromise;
					cb(null, uploadDir);
				} catch (err) {
					cb(err);
				}
			},
			filename: (_req, file, cb) => {
				// Extension derived from our own whitelist, never from the client filename.
				const extensions = MIME_TYPES[file.mimetype];
				const ext = extensions ? extensions[0] : path.extname(file.originalname).toLowerCase();
				cb(null, `${uuidv4()}${ext}`);
			},
		});
	}

	// ── MIME + extension pre-filter (first line of defence) ──────────────────
	// NOTE: This only checks what the client *claims*.  The real validation
	// (magic bytes) happens in the wrap() function after multer saves the file.
	const fileFilter = (_req, file, cb) => {
		// 1. Reject undeclared MIME types immediately
		if (!allowedSet.has(file.mimetype)) {
			return cb(badRequestError(`File type not allowed: ${file.mimetype}. Accepted: ${[...allowedSet].join(', ')}`));
		}

		// 2. Cross-check extension vs MIME whitelist.
		//    FIX: treat a missing extension as a hard rejection, not a silent pass.
		const ext = path.extname(file.originalname).toLowerCase();
		const knownExtensions = MIME_TYPES[file.mimetype];

		if (knownExtensions) {
			if (!ext) {
				return cb(badRequestError(`File "${file.originalname}" has no extension. ` + `Expected one of: ${knownExtensions.join(', ')} for type ${file.mimetype}`));
			}
			if (!knownExtensions.includes(ext)) {
				return cb(badRequestError(`Extension "${ext}" does not match Content-Type "${file.mimetype}". ` + `Expected: ${knownExtensions.join(', ')}`));
			}
		}

		cb(null, true);
	};

	const instance = multer({
		storage: engine,
		fileFilter,
		limits: {
			fileSize: maxFileSizeBytes,
			files: maxFiles,
		},
	});

	// ── Multer error normaliser + magic-byte validation ───────────────────────
	/**
	 * Wraps a multer handler to:
	 *   1. Translate multer's internal error codes into ApiErrors.
	 *   2. Run magic-byte inspection on every successfully uploaded file.
	 *   3. Enforce an optional total-request-size cap.
	 */
	const wrap = (handler) => async (req, res, next) => {
		handler(req, res, async (err) => {
			// ── Step 1: normalise multer errors ──────────────────────────────
			if (err) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					return next(badRequestError(`File too large. Maximum size is ${(maxFileSizeBytes / (1024 * 1024)).toFixed(1)} MB`));
				}
				if (err.code === 'LIMIT_FILE_COUNT') {
					return next(badRequestError(`Too many files. Maximum is ${maxFiles}`));
				}
				if (err.code === 'LIMIT_UNEXPECTED_FILE') {
					return next(badRequestError(`Unexpected field: "${err.field}"`));
				}
				// ApiErrors from fileFilter, or anything else — pass through as-is
				return next(err);
			}

			// ── Step 2: optional total-size guard ────────────────────────────
			// Multer's per-file limit doesn't stop N files × maxFileSizeBytes.
			// This catches that scenario at the application layer.
			if (maxTotalSizeBytes) {
				const files = collectFiles(req);
				const totalSize = files.reduce((sum, f) => sum + f.size, 0);

				if (totalSize > maxTotalSizeBytes) {
					// Clean up already-saved files
					if (storageType === 'disk') {
						await Promise.all(files.map((f) => fs.unlink(f.path).catch(() => {})));
					}
					return next(
						badRequestError(
							`Total upload size ${(totalSize / (1024 * 1024)).toFixed(1)} MB exceeds ` + `the ${(maxTotalSizeBytes / (1024 * 1024)).toFixed(1)} MB limit`
						)
					);
				}
			}

			// ── Step 3: magic-byte inspection (second & real line of defence) ─
			// Runs regardless of what the client declared in Content-Type.
			try {
				const files = collectFiles(req);
				if (files.length > 0) {
					await validateMagicBytes(files, allowedSet, storageType);
				}
			} catch (validationErr) {
				return next(validationErr);
			}

			// All good — hand off to the route handler
			next();
		});
	};

	return {
		/** Single file on `fieldName`. */
		single: (fieldName) => wrap(instance.single(fieldName)),
		/** Up to `maxCount` files on `fieldName`. Defaults to options.maxFiles. */
		array: (fieldName, maxCount = maxFiles) => wrap(instance.array(fieldName, maxCount)),
		/** Mixed fields with individual maxCount constraints. */
		fields: (fields) => wrap(instance.fields(fields)),
	};
};
