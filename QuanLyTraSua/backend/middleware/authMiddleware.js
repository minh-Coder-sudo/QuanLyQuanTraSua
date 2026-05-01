import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        // 🔥 CHECK HEADER
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            // ❗ FIX QUAN TRỌNG
            if (!user) {
                return res.status(401).json({
                    message: 'User không tồn tại hoặc đã bị xoá'
                });
            }

            req.user = user;
            next();
        } else {
            return res.status(401).json({
                message: 'Thiếu token'
            });
        }
    } catch (error) {
        console.error('❌ AUTH ERROR:', error);
        return res.status(401).json({
            message: 'Token không hợp lệ'
        });
    }
};

// ================= ADMIN =================
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({
            message: 'Bạn không có quyền Admin!'
        });
    }
};

// ================= STAFF =================
export const staff = (req, res, next) => {
    if (
        req.user &&
        (req.user.role === 'ADMIN' || req.user.role === 'EMPLOYEE')
    ) {
        next();
    } else {
        res.status(403).json({
            message: 'Không có quyền truy cập!'
        });
    }
};
