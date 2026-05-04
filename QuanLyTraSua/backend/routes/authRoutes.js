import express from 'express';
import {
    registerUser,
    authUser,
    googleAuthUser,
    updateUserProfile,
    forgotPasswordRequest,
    verifyForgotPasswordCode,
    resetPasswordWithCode,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuthUser);
router.post('/forgot-password', forgotPasswordRequest);
router.post('/forgot-password/verify-code', verifyForgotPasswordCode);
router.post('/forgot-password/reset', resetPasswordWithCode);
router.route('/profile').put(protect, updateUserProfile);

export default router;
