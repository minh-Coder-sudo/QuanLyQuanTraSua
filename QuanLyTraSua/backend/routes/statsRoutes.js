import express from 'express';
import { getStatsSummary, getRevenueChart } from '../controllers/statsController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, staff, getStatsSummary);
router.get('/revenue-chart', protect, staff, getRevenueChart);

export default router;
