import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { saveBase64Image } from '../middleware/uploadMiddleware.js';

// Tạo JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ĐĂNG KÝ
export const registerUser = async (req, res) => {
    const { username, email, password, fullname, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Email đã tồn tại!' });
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            fullname,
            phone: phone || '',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ĐĂNG NHẬP
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CẬP NHẬT THÔNG TIN CÁ NHÂN
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullname = req.body.fullname || user.fullname;
            user.email = req.body.email || user.email;
            if (Object.prototype.hasOwnProperty.call(req.body, 'phone')) {
                user.phone = req.body.phone || '';
            }

            if (req.body.avatar) {
                if (req.body.avatar.startsWith('data:image')) {
                    const avatarPath = saveBase64Image(req.body.avatar);
                    if (avatarPath) {
                        user.avatar = avatarPath;
                    }
                } else {
                    user.avatar = req.body.avatar;
                }
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                username: updatedUser.username,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
