import { env, logger } from '../config/index.js';
import { badRequestError, serviceUnavailableError } from '../utils/index.js';

// ── Token cache for Tracking API ──────────────────────────────────────────────
let _trackingToken = null;
let _trackingTokenExpiry = 0;

const isConfigured = () => Boolean(env.DTDC?.PX_API_KEY && env.DTDC?.CUSTOMER_CODE);

// ── Base URLs (from official DTDC documentation) ──────────────────────────────
// PX API (booking, label, cancel):
//   Staging:    https://demodashboardapi.shipsy.in
//   Production: https://pxapi.dtdc.in
// Label/Cancel Staging also uses: https://alphademodashboardapi.shipsy.io
// Tracking Auth:
//   Staging:    https://dtdcstagingapi.dtdc.com
//   Production: https://blktracksvc.dtdc.com
// Pincode: https://smarttrack-ctbsplus.dtdc.com/ratecalapi/PincodeApiCall

// ── PX API — booking, label, cancel (api-key header auth) ─────────────────────

const pxFetch = async (path, method = 'GET', body = null, isLabelEndpoint = false) => {
	if (!env.DTDC?.PX_API_KEY) throw serviceUnavailableError('DTDC PX API not configured');

	// Label endpoint uses a different staging base (alphademodashboardapi.shipsy.io)
	const baseUrl = isLabelEndpoint ? env.DTDC.LABEL_BASE_URL : env.DTDC.PX_BASE_URL;

	const opts = {
		method,
		headers: {
			'Content-Type': 'application/json',
			'api-key': env.DTDC.PX_API_KEY,
		},
	};
	if (body) opts.body = JSON.stringify(body);

	const url = `${baseUrl}${path}`;
	const res = await fetch(url, opts);

	// Label endpoint returns raw binary — don't try to parse as JSON
	if (path.includes('shippinglabel')) {
		const text = await res.text().catch(() => '');
		if (!res.ok) {
			logger.error({ url, status: res.status }, '[DTDC] Label API error');
			throw badRequestError(`DTDC Label API error: ${res.status}`);
		}
		return text;
	}

	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		logger.error({ url, status: res.status, data }, '[DTDC] PX API error');
		throw badRequestError(data?.message || `DTDC API error: ${res.status}`);
	}
	return data;
};

// ── Tracking API — token-based auth (username + password → x-access-token) ───

const getTrackingToken = async () => {
	if (_trackingToken && Date.now() < _trackingTokenExpiry) return _trackingToken;

	if (!env.DTDC?.TRACKING_USERNAME || !env.DTDC?.TRACKING_PASSWORD) {
		throw serviceUnavailableError('DTDC Tracking API credentials not configured');
	}

	// GET /dtdc-api/api/dtdc/authenticate?username=<u>&password=<p>
	const url = `${env.DTDC.TRACKING_BASE_URL}/dtdc-api/api/dtdc/authenticate?username=${encodeURIComponent(env.DTDC.TRACKING_USERNAME)}&password=${encodeURIComponent(env.DTDC.TRACKING_PASSWORD)}`;

	const res = await fetch(url, { method: 'GET' });
	const data = await res.json().catch(() => ({}));

	if (!res.ok || !data?.token) {
		throw serviceUnavailableError('Failed to obtain DTDC tracking token');
	}

	_trackingToken = data.token;
	// Tokens never expire per docs but we refresh every 23h as a safety measure
	_trackingTokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
	return _trackingToken;
};

const trackingFetch = async (body) => {
	const token = await getTrackingToken();

	const url = `${env.DTDC.TRACKING_BASE_URL}/dtdc-tracking-api/dtdc-api/rest/JSONCnTrk/getTrackDetails`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': token,
		},
		body: JSON.stringify(body),
	});

	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
		if (res.status === 401) {
			// Token revoked — clear cache and retry once
			_trackingToken = null;
			_trackingTokenExpiry = 0;
			const freshToken = await getTrackingToken();
			const retry = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'x-access-token': freshToken },
				body: JSON.stringify(body),
			});
			return retry.json();
		}
		throw badRequestError(data?.message || `DTDC Tracking error: ${res.status}`);
	}
	return data;
};

// ── Pincode API — Bearer token auth ───────────────────────────────────────────
// URL: https://smarttrack-ctbsplus.dtdc.com/ratecalapi/PincodeApiCall
// Body: { orgPincode, desPincode }

const pincodeFetch = async (body) => {
	if (!env.DTDC?.PINCODE_BEARER) throw serviceUnavailableError('DTDC Pincode API not configured');

	const url = env.DTDC.PINCODE_URL;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.DTDC.PINCODE_BEARER}`,
		},
		body: JSON.stringify(body),
	});

	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw badRequestError(data?.message || `DTDC Pincode error: ${res.status}`);
	}
	return data;
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Create a DTDC shipment booking (Order Upload API).
 * Staging:  POST https://demodashboardapi.shipsy.in/api/customer/integration/consignment/softdata
 * Prod:     POST https://pxapi.dtdc.in/api/customer/integration/consignment/softdata
 */
export const createShipment = async ({
	orderId,
	recipientName,
	recipientPhone,
	recipientAddress,
	recipientCity,
	recipientState,
	recipientPincode,
	weightKg = 0.5,
	declaredValue = 0,
	productDescription = 'Medical Equipment',
	length = '20.0',
	width = '15.0',
	height = '10.0',
	invoiceNumber = '',
	invoiceDate = '',
}) => {
	const payload = {
		consignments: [
			{
				customer_code: env.DTDC.CUSTOMER_CODE,
				service_type_id: env.DTDC.SERVICE_TYPE || 'B2C SMART EXPRESS',
				load_type: 'NON-DOCUMENT',
				consignment_type: 'Forward',
				description: productDescription.substring(0, 250),
				dimension_unit: 'cm',
				length: String(length),
				width: String(width),
				height: String(height),
				weight_unit: 'kg',
				weight: String(weightKg),
				declared_value: String(declaredValue),
				num_pieces: '1',
				origin_details: {
					name: env.DTDC.ORIGIN_NAME || 'Haitech Medical',
					phone: env.DTDC.ORIGIN_PHONE || '9999999999',
					address_line_1: env.DTDC.ORIGIN_ADDRESS || 'Haitech Medical Warehouse',
					address_line_2: '',
					pincode: env.DTDC.ORIGIN_PINCODE,
					city: env.DTDC.ORIGIN_CITY || 'Delhi',
					state: env.DTDC.ORIGIN_STATE || 'Delhi',
				},
				destination_details: {
					name: recipientName,
					phone: recipientPhone,
					address_line_1: recipientAddress,
					address_line_2: '',
					pincode: recipientPincode,
					city: recipientCity,
					state: recipientState,
				},
				customer_reference_number: orderId,
				commodity_id: 'Medical Equipment',
				is_risk_surcharge_applicable: 'false',
				invoice_number: invoiceNumber,
				invoice_date: invoiceDate,
			},
		],
	};

	logger.info({ orderId, recipientPincode }, '[DTDC] Creating shipment');
	const data = await pxFetch('/api/customer/integration/consignment/softdata', 'POST', payload);

	const consignment = data?.data?.[0];
	if (!consignment?.success) {
		const reason = consignment?.error_message || consignment?.message || 'Unknown DTDC error';
		throw badRequestError(`DTDC booking failed: ${reason}`);
	}

	return {
		awbNo: consignment.reference_number || null,
		chargeableWeight: consignment.chargeable_weight || null,
		pieces: consignment.pieces || [],
		raw: data,
	};
};

/**
 * Track a DTDC shipment by AWB/consignment number.
 * Staging: POST https://dtdcstagingapi.dtdc.com/dtdc-tracking-api/dtdc-api/rest/JSONCnTrk/getTrackDetails
 */
export const trackShipment = async (awbNo) => {
	logger.info({ awbNo }, '[DTDC] Tracking shipment');
	const data = await trackingFetch({
		trkType: 'cnno',
		strcnno: awbNo,
		addtnlDtl: 'Y',
	});
	return data;
};

/**
 * Check if DTDC delivers between two pincodes (origin → destination).
 * Returns serviceable flag, available services with TAT, and branch info.
 * URL: POST https://smarttrack-ctbsplus.dtdc.com/ratecalapi/PincodeApiCall
 */
export const checkPincodeServiceability = async (destinationPincode, originPincode = null) => {
	const orgPin = originPincode || env.DTDC.ORIGIN_PINCODE || '110001';
	const data = await pincodeFetch({ orgPincode: orgPin, desPincode: destinationPincode });

	const servList = data?.SERV_LIST?.[0] || {};
	const zipcodeResp = data?.ZIPCODE_RESP?.[0] || {};
	const services = data?.SERV_LIST_DTLS || [];

	const serviceable =
		zipcodeResp.SERVFLAG === 'Y' || servList.b2C_SERVICEABLE === 'YES' || servList.COD_Serviceable === 'YES';

	// Find our configured service type TAT
	const ourService = services.find((s) => s.NAME === (env.DTDC.SERVICE_TYPE || 'B2C SMART EXPRESS'));

	return {
		serviceable,
		estimatedDays: ourService?.TAT ? Number(ourService.TAT) : null,
		codAvailable: servList.COD_Serviceable === 'YES' || servList.b2C_COD_Serviceable === 'YES',
		availableServices: services.map((s) => ({ code: s.CODE, name: s.NAME, tat: s.TAT })),
		raw: data,
	};
};

/**
 * Generate a shipping label for an AWB (reference) number.
 * Staging: GET https://alphademodashboardapi.shipsy.io/api/customer/integration/consignment/shippinglabel/stream
 * Prod:    GET https://pxapi.dtdc.in/api/customer/integration/consignment/shippinglabel/stream
 *
 * @param {string} awbNo - reference_number returned from booking
 * @param {string} labelCode - SHIP_LABEL_4X6 | SHIP_LABEL_A4 | SHIP_LABEL_A6 | ROUTE_LABEL_A4 etc.
 * @param {string} labelFormat - 'pdf' | 'base64'
 */
export const generateLabel = async (awbNo, labelCode = 'SHIP_LABEL_4X6', labelFormat = 'base64') => {
	const path = `/api/customer/integration/consignment/shippinglabel/stream?reference_number=${encodeURIComponent(awbNo)}&label_code=${labelCode}&label_format=${labelFormat}`;
	const data = await pxFetch(path, 'GET', null, true);

	if (labelFormat === 'base64') {
		// Response is JSON: { referenceNumber, label }
		try {
			const parsed = typeof data === 'string' ? JSON.parse(data) : data;
			return {
				labelBase64: parsed?.label || null,
				referenceNumber: parsed?.referenceNumber || awbNo,
				raw: parsed,
			};
		} catch {
			return { labelBase64: data, referenceNumber: awbNo, raw: data };
		}
	}

	// PDF — return raw binary buffer/string
	return { labelPdf: data, referenceNumber: awbNo };
};

/**
 * Cancel one or more DTDC consignments by AWB number.
 * Staging: POST https://alphademodashboardapi.shipsy.io/api/customer/integration/consignment/cancel
 * Prod:    POST http://pxapi.dtdc.in/api/customer/integration/consignment/cancel
 */
export const cancelShipment = async (awbNumbers) => {
	const awbs = Array.isArray(awbNumbers) ? awbNumbers : [awbNumbers];
	logger.info({ awbs }, '[DTDC] Cancelling shipments');

	const data = await pxFetch(
		'/api/customer/integration/consignment/cancel',
		'POST',
		{ AWBNo: awbs, customerCode: env.DTDC.CUSTOMER_CODE },
		true
	);

	return {
		success: data?.success ?? false,
		cancelled: data?.successConsignments || [],
		raw: data,
	};
};

export const isReady = () => isConfigured();

const dtdcService = {
	createShipment,
	trackShipment,
	checkPincodeServiceability,
	generateLabel,
	cancelShipment,
	isReady,
};
export default dtdcService;
