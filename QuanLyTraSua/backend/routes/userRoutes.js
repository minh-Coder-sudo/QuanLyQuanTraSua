import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;
