import { Router } from 'express';
import {
	getProfile,
	updateProfile,
	changePassword,
	getAddresses,
	createAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
} from '../controllers/index.js';
import { validate, auth, jsonBody, overallLimiter } from '../middlewares/index.js';
import {
	updateProfileSchema,
	changePasswordSchema,
	createAddressSchema,
	updateAddressSchema,
	addressIdSchema,
} from '../validations/users.validation.js';

const usersRouter = Router();

usersRouter.use(overallLimiter, auth());

usersRouter.get('/me', getProfile);
usersRouter.put('/me', jsonBody('10kb'), validate(updateProfileSchema), updateProfile);
usersRouter.put('/me/password', jsonBody('10kb'), validate(changePasswordSchema), changePassword);

usersRouter.get('/me/addresses', getAddresses);
usersRouter.post('/me/addresses', jsonBody('10kb'), validate(createAddressSchema), createAddress);
usersRouter.put('/me/addresses/:id', jsonBody('10kb'), validate(updateAddressSchema), updateAddress);
usersRouter.delete('/me/addresses/:id', validate(addressIdSchema), deleteAddress);
usersRouter.put('/me/addresses/:id/default', validate(addressIdSchema), setDefaultAddress);

export default usersRouter;
