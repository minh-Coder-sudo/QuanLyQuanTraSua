import express from 'express';
import {
    getUsers,
    updateUserRole,
    getCart,
    addToCart,
    clearCart,
    getAddress,
    addAddress,
    removeItemFromCart // 🔥 THÊM
} from '../controllers/userController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ================= ADMIN =================
router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);

// ================= CART =================
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.delete('/cart', protect, clearCart);

// 🔥 API XOÁ 1 SẢN PHẨM (QUAN TRỌNG)
router.delete('/cart/:id', protect, removeItemFromCart);

// ================= ADDRESS =================
router.get('/address', protect, getAddress);
router.post('/address', protect, addAddress);

export default router;
