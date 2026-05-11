import express from 'express';
import { createOrder, getOrders, updateOrderStatus, getMyOrders } from '../controllers/orderController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔥 CREATE order - protégé
router.route('/').post(protect, createOrder);

// 🔥 GET all orders - chỉ STAFF/ADMIN
router.route('/').get(protect, staff, getOrders);

// 🔥 UPDATE status - chỉ STAFF/ADMIN
router.route('/:id/status').put(protect, staff, updateOrderStatus);

// 🔥 GET my orders - user chỉ xem được đơn của họ
router.get('/my-orders/:userId', protect, getMyOrders);

export default router;
