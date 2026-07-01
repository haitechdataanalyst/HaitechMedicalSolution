import { Router } from 'express';
import { createReview, getProductReviews, getPendingReviews, approveReview, deleteReview } from '../controllers/index.js';
import { validate, auth, jsonBody, overallLimiter } from '../middlewares/index.js';
import { createReviewSchema, reviewIdSchema, productReviewsSchema, approveReviewSchema } from '../validations/reviews.validation.js';

const reviewsRouter = Router();

reviewsRouter.use(overallLimiter);

// Public — get approved reviews for a product
reviewsRouter.get('/products/:productId', validate(productReviewsSchema), getProductReviews);

// Auth — create review
reviewsRouter.post('/', auth(), jsonBody('10kb'), validate(createReviewSchema), createReview);

// Auth — delete own review (or admin deletes any)
reviewsRouter.delete('/:id', auth(), validate(reviewIdSchema), deleteReview);

// Admin
reviewsRouter.get('/pending', auth('admin'), getPendingReviews);
reviewsRouter.put('/:id/approve', auth('admin'), jsonBody('5kb'), validate(approveReviewSchema), approveReview);

export default reviewsRouter;
