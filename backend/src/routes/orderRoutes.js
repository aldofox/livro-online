import express from 'express';

import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, orderController.create);
router.get('/my-orders', authMiddleware, orderController.myOrders );
router.get( '/:id', authMiddleware, orderController.findById );

export default router;