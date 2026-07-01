import { Router } from 'express';
import { listItems, getItem, syncInventory, handleWebhook } from '../controllers/inventory.controller.js';
import { auth, overallLimiter, writeLimiter } from '../middlewares/index.js';

const inventoryRouter = Router();

// Public: anyone can browse inventory
inventoryRouter.get('/items', overallLimiter, listItems);
inventoryRouter.get('/items/:itemId', overallLimiter, getItem);

// Admin: force a cache-bust sync from Zoho
inventoryRouter.post('/sync', writeLimiter, auth('admin'), syncInventory);

// Webhook: Zoho calls this when inventory changes — no auth, Zoho handles it from their side
inventoryRouter.post('/webhook', writeLimiter, handleWebhook);

export default inventoryRouter;
