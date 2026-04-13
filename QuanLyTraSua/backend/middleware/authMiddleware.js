import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ ID trong token (không lấy password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ!' });
    }
  } else {
    res.status(401).json({ message: 'Không có quyền truy cập, thiếu token!' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Bạn không có quyền Admin để thực hiện hành động này!' });
  }
};

export const staff = (req, res, next) => {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'EMPLOYEE')) {
      next();
    } else {
      res.status(403).json({ message: 'Bạn không có quyền truy cập (Dành cho Nhân viên/Quản lý)!' });
    }
};
