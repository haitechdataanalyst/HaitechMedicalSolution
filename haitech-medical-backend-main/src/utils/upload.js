import fs from 'fs/promises';
import path from 'path';

// Base directory for all locally stored uploads (relative to project root).
export const UPLOAD_BASE_DIR = path.resolve('uploads');

/**
 * Ensures that a sub-directory under the uploads base exists.
 * Called once per upload destination at middleware setup time — not per request.
 *
 * @param {string} subDir - e.g. 'avatars', 'documents'
 * @returns {string} absolute path that is guaranteed to exist
 */
export const ensureUploadDir = async (subDir = '') => {
	const dir = subDir ? path.join(UPLOAD_BASE_DIR, subDir) : UPLOAD_BASE_DIR;
	// Path is constructed from a hardcoded base directory — not from user input.
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	await fs.mkdir(dir, { recursive: true });
	return dir;
};

/**
 * Stub integration point for cloud storage (S3, GCS, Azure Blob, etc.).
 *
 * To enable cloud uploads:
 *   1. Install your SDK (e.g. @aws-sdk/client-s3).
 *   2. Replace the body of this function with your SDK upload call.
 *   3. Return the public/signed URL of the uploaded file.
 *   4. Optionally delete the local temp file after a successful upload.
 *
 * @param {Express.Multer.File} file - the file object from multer
 * @param {string} [folder]          - destination folder/prefix in the bucket
 * @returns {Promise<{url: string, key: string}>}
 */
export const uploadToCloud = async (file, _folder = '') => {
	// ── Example S3 integration (uncomment and fill in when ready) ────────────
	// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
	// const s3 = new S3Client({ region: env.AWS_REGION });
	// const key = `${folder}/${file.filename}`;
	// await s3.send(new PutObjectCommand({
	//   Bucket: env.S3_BUCKET,
	//   Key: key,
	//   Body: fs.createReadStream(file.path),
	//   ContentType: file.mimetype,
	// }));
	// return { url: `https://${env.S3_BUCKET}.s3.amazonaws.com/${key}`, key };

	throw new Error('Cloud storage is not configured. Implement uploadToCloud() in src/utils/upload.js.');
};
