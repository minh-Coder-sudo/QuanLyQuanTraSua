import express from 'express';
import { getStatsSummary, getRevenueChart } from '../controllers/statsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, admin, getStatsSummary);
router.get('/revenue-chart', protect, admin, getRevenueChart);

export default router;
