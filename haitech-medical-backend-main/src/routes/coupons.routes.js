import { Router } from 'express';
import { validateCoupon, listCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/index.js';
import { validate, auth, jsonBody, overallLimiter } from '../middlewares/index.js';
import { validateCouponSchema, createCouponSchema, couponIdSchema } from '../validations/coupons.validation.js';

const couponsRouter = Router();

couponsRouter.use(overallLimiter);

// Any logged-in user can validate a coupon before checkout
couponsRouter.post('/validate', auth(), jsonBody('5kb'), validate(validateCouponSchema), validateCoupon);

// Admin
couponsRouter.get('/', auth('admin'), listCoupons);
couponsRouter.post('/', auth('admin'), jsonBody('10kb'), validate(createCouponSchema), createCoupon);
couponsRouter.put('/:id', auth('admin'), jsonBody('10kb'), validate(couponIdSchema), updateCoupon);
couponsRouter.delete('/:id', auth('admin'), validate(couponIdSchema), deleteCoupon);

export default couponsRouter;
