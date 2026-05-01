import express from 'express';
import { createOrder, getOrders, updateOrderStatus, getMyOrders } from '../controllers/orderController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, staff, getOrders);

router.route('/:id/status')
  .put(protect, staff, updateOrderStatus);

router.get('/my-orders/:userId', protect, getMyOrders);

export default router;
