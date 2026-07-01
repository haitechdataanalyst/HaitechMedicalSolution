import { httpStatus } from '../constants/index.js';
import { shipmentService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const createShipment = catchAsync(async (req, res) => {
	const shipment = await shipmentService.createShipmentForOrder(req.user.id, req.params.orderId, req.body);
	return res.respond(httpStatus.CREATED, { shipment }, 'Shipment created');
});

export const trackShipment = catchAsync(async (req, res) => {
	const result = await shipmentService.trackShipmentByAwb(req.params.awbNo);
	return res.respond(httpStatus.OK, result);
});

export const getOrderShipment = catchAsync(async (req, res) => {
	const result = await shipmentService.getShipmentByOrder(req.params.orderId);
	return res.respond(httpStatus.OK, result);
});

export const getShipmentLabel = catchAsync(async (req, res) => {
	const { labelCode = 'SHIP_LABEL_4X6', labelFormat = 'base64' } = req.query;
	const result = await shipmentService.getLabelForShipment(req.params.awbNo, labelCode, labelFormat);
	return res.respond(httpStatus.OK, result);
});

export const cancelShipment = catchAsync(async (req, res) => {
	const result = await shipmentService.cancelShipmentByAwb(req.params.awbNo);
	return res.respond(httpStatus.OK, result, 'Shipment cancelled');
});

export const checkPincode = catchAsync(async (req, res) => {
	const { pincode } = req.params;
	const { originPincode } = req.query;
	const result = await shipmentService.checkPincodeServiceability(pincode, originPincode);
	return res.respond(httpStatus.OK, result);
});
