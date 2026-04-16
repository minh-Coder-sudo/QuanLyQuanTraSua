import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, staff, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, staff, updateProduct)
  .delete(protect, staff, deleteProduct);

export default router;
