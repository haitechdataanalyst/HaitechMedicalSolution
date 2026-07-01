import { Router } from 'express';
import { createShipment, trackShipment, getOrderShipment, getShipmentLabel, cancelShipment, checkPincode } from '../controllers/index.js';
import { validate, auth, jsonBody, overallLimiter } from '../middlewares/index.js';
import { createShipmentSchema, awbParamSchema, orderIdParamSchema, pincodeParamSchema } from '../validations/shipments.validation.js';

const shipmentsRouter = Router();

shipmentsRouter.use(overallLimiter);

// Public — pincode serviceability check (no auth needed)
shipmentsRouter.get('/pincode/:pincode/serviceability', validate(pincodeParamSchema), checkPincode);

// User — track own shipment by AWB
shipmentsRouter.get('/track/:awbNo', auth(), validate(awbParamSchema), trackShipment);

// User — get shipment for their order
shipmentsRouter.get('/orders/:orderId', auth(), validate(orderIdParamSchema), getOrderShipment);

// Admin — create shipment for an order
shipmentsRouter.post('/orders/:orderId', auth('admin'), jsonBody('20kb'), validate(createShipmentSchema), createShipment);

// Admin — get label (query: labelCode=SHIP_LABEL_4X6, labelFormat=base64|pdf)
shipmentsRouter.get('/:awbNo/label', auth('admin'), validate(awbParamSchema), getShipmentLabel);

// Admin — cancel shipment
shipmentsRouter.delete('/:awbNo/cancel', auth('admin'), validate(awbParamSchema), cancelShipment);

export default shipmentsRouter;
