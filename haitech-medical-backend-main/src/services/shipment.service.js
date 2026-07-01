import { shipmentRepository, orderRepository } from '../repositories/index.js';
import * as dtdcService from './dtdc.service.js';
import { notFoundError, badRequestError } from '../utils/index.js';
import { env } from '../config/index.js';

export const createShipmentForOrder = async (adminId, orderId, params = {}) => {
	const order = await orderRepository.findById(orderId);
	if (!order) throw notFoundError('Order not found');

	if (!['confirmed', 'processing'].includes(order.status)) {
		throw badRequestError('Order must be confirmed or processing before creating a shipment');
	}

	const existing = await shipmentRepository.findByOrderId(orderId);
	if (existing && existing.awbNo) {
		throw badRequestError('Shipment already exists for this order');
	}

	const {
		recipientName,
		recipientPhone,
		recipientAddress,
		recipientCity,
		recipientState,
		recipientPincode,
		weightKg = 0.5,
		declaredValue,
		productDescription,
		length,
		width,
		height,
		invoiceNumber,
		invoiceDate,
	} = params;

	let awbNo = null;
	let chargeableWeight = null;

	if (dtdcService.isReady()) {
		const result = await dtdcService.createShipment({
			orderId,
			recipientName,
			recipientPhone,
			recipientAddress,
			recipientCity,
			recipientState,
			recipientPincode,
			weightKg,
			declaredValue: declaredValue ?? order.total,
			productDescription,
			length,
			width,
			height,
			invoiceNumber,
			invoiceDate,
		});
		awbNo = result.awbNo;
		chargeableWeight = result.chargeableWeight;
	}

	const shipment = await shipmentRepository.create(orderId, {
		awbNo,
		carrier: 'DTDC',
		status: awbNo ? 'booked' : 'pending',
		originPincode: env.DTDC?.ORIGIN_PINCODE || null,
		destinationPincode: recipientPincode || null,
		chargeableWeight,
	});

	return shipment;
};

export const trackShipmentByAwb = async (awbNo) => {
	const shipment = await shipmentRepository.findByAwbNo(awbNo);
	if (!shipment) throw notFoundError('Shipment not found');

	let trackingData = null;

	if (dtdcService.isReady()) {
		trackingData = await dtdcService.trackShipment(awbNo);
		await shipmentRepository.updateTrackingEvents(shipment.id, trackingData);
	} else if (shipment.trackingEvents) {
		try { trackingData = JSON.parse(shipment.trackingEvents); } catch { /* ignore */ }
	}

	return { shipment, tracking: trackingData };
};

export const getShipmentByOrder = async (orderId) => {
	const shipment = await shipmentRepository.findByOrderId(orderId);
	if (!shipment) throw notFoundError('No shipment found for this order');

	let tracking = null;
	if (shipment.trackingEvents) {
		try { tracking = JSON.parse(shipment.trackingEvents); } catch { /* ignore */ }
	}

	return { shipment, tracking };
};

export const getLabelForShipment = async (awbNo, labelCode = 'SHIP_LABEL_4X6', labelFormat = 'base64') => {
	if (!dtdcService.isReady()) throw badRequestError('DTDC not configured — label unavailable');
	return dtdcService.generateLabel(awbNo, labelCode, labelFormat);
};

export const cancelShipmentByAwb = async (awbNo) => {
	const shipment = await shipmentRepository.findByAwbNo(awbNo);
	if (!shipment) throw notFoundError('Shipment not found');

	if (!dtdcService.isReady()) throw badRequestError('DTDC not configured — cancellation unavailable');

	const result = await dtdcService.cancelShipment(awbNo);

	if (result.success) {
		await shipmentRepository.updateStatus(shipment.id, 'cancelled');
	}

	return result;
};

export const checkPincodeServiceability = async (destinationPincode, originPincode = null) => {
	if (!dtdcService.isReady()) {
		return { serviceable: true, estimatedDays: null, note: 'DTDC not configured — assuming serviceable' };
	}
	return dtdcService.checkPincodeServiceability(destinationPincode, originPincode);
};

const shipmentService = {
	createShipmentForOrder,
	trackShipmentByAwb,
	getShipmentByOrder,
	getLabelForShipment,
	cancelShipmentByAwb,
	checkPincodeServiceability,
};
export default shipmentService;
