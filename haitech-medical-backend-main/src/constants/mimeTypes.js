// Central whitelist of allowed upload types, grouped by category.
// Each entry maps a MIME type to its canonical extension(s).

export const MIME_TYPES = {
	// ── Documents ────────────────────────────────────────────────────────────
	'application/pdf': ['.pdf'],
	'application/msword': ['.doc'],
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],

	// ── Spreadsheets ─────────────────────────────────────────────────────────
	'application/vnd.ms-excel': ['.xls'],
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
	'text/csv': ['.csv'],

	// ── Presentations ────────────────────────────────────────────────────────
	'application/vnd.ms-powerpoint': ['.ppt'],
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],

	// ── Plain text ───────────────────────────────────────────────────────────
	'text/plain': ['.txt'],

	// ── Images ───────────────────────────────────────────────────────────────
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'image/gif': ['.gif'],
	'image/webp': ['.webp'],
	'image/svg+xml': ['.svg'],

	// ── Archives ─────────────────────────────────────────────────────────────
	'application/zip': ['.zip'],
	'application/x-tar': ['.tar'],
	'application/gzip': ['.gz'],
};

// Pre-built category sets — pass one or more of these to the upload factory.
export const FILE_CATEGORIES = {
	IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
	DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
	SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
	PRESENTATIONS: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
	ARCHIVES: ['application/zip', 'application/x-tar', 'application/gzip'],
};
