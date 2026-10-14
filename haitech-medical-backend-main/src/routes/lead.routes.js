import { Router } from 'express';
import { createLead, markEmailSent } from '../controllers/index.js';
import { validate, jsonBody, overallLimiter } from '../middlewares/index.js';
import { createLeadSchema, markEmailSentSchema } from '../validations/lead.validation.js';

const leadRouter = Router();

// Public — no auth (leads come from anonymous site visitors). overallLimiter
// is a coarse per-IP DoS shield; the DB-backed email+IP rate limit in
// lead.service.js is the actual business-rule limiter.
leadRouter.use(overallLimiter);

leadRouter.post('/', jsonBody('20kb'), validate(createLeadSchema), createLead);
leadRouter.patch('/:id/email-sent', validate(markEmailSentSchema), markEmailSent);

export default leadRouter;
