import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(getOrders);

router.route('/:id/status').put(protect, staff, updateOrderStatus);

export default router;
