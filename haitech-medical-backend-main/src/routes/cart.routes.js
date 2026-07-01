import { Router } from 'express';
import { getCart, addItem, updateItem, removeItem, syncCart, clearCart } from '../controllers/index.js';
import { auth, jsonBody, overallLimiter } from '../middlewares/index.js';

const cartRouter = Router();

cartRouter.use(overallLimiter);
cartRouter.use(auth());

cartRouter.get('/', getCart);
cartRouter.post('/items', jsonBody('50kb'), addItem);
cartRouter.put('/items/:id', jsonBody('20kb'), updateItem);
cartRouter.delete('/items/:id', removeItem);
cartRouter.post('/sync', jsonBody('200kb'), syncCart);
cartRouter.delete('/', clearCart);

export default cartRouter;
