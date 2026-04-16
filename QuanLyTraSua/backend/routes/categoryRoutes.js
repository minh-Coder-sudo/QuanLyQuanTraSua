import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, staff, createCategory);

router.route('/:id')
  .put(protect, staff, updateCategory)
  .delete(protect, staff, deleteCategory);

export default router;
