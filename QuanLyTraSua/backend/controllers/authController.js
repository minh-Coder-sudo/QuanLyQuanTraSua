import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import process from 'process';
import { saveBase64Image } from '../middleware/uploadMiddleware.js';

const forgotPasswordCodes = new Map();

const buildForgotPasswordKey = (username, contact) =>
    `${String(username || '')
        .trim()
        .toLowerCase()}::${String(contact || '')
        .trim()
        .toLowerCase()}`;

const createForgotPasswordCode = () => crypto.randomInt(100000, 1000000).toString();

const buildUserResponse = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    authProvider: user.authProvider || 'local',
    googleId: user.googleId || '',
    token: generateToken(user._id),
});

const generateUniqueUsername = async (email, fallbackName = 'user') => {
    const baseName =
        String(email || fallbackName)
            .split('@')[0]
            .replace(/[^a-zA-Z0-9_]/g, '')
            .toLowerCase() || 'user';

    for (let attempt = 0; attempt < 10; attempt += 1) {
        const suffix = attempt === 0 ? '' : crypto.randomBytes(2).toString('hex');
        const candidate = `${baseName}${suffix}`.slice(0, 24);
        const existing = await User.findOne({ username: candidate });

        if (!existing) {
            return candidate;
        }
    }

    return `${baseName}${Date.now().toString(36)}`.slice(0, 24);
};

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
            authProvider: 'local',
        });

        if (user) {
            res.status(201).json(buildUserResponse(user));
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
            res.json(buildUserResponse(user));
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

            res.json(buildUserResponse(updatedUser));
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const googleAuthUser = async (req, res) => {
    const { credential } = req.body;

    try {
        if (!credential) {
            return res.status(400).json({ message: 'Thiếu credential Google!' });
        }

        const googleClientId = process.env.GOOGLE_CLIENT_ID;

        if (!googleClientId) {
            return res.status(500).json({ message: 'Thiếu GOOGLE_CLIENT_ID trên server!' });
        }

        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
        );

        if (!response.ok) {
            return res.status(401).json({ message: 'Google token không hợp lệ!' });
        }

        const payload = await response.json();

        if (payload.aud !== googleClientId) {
            return res.status(401).json({ message: 'Google client không khớp!' });
        }

        if (String(payload.email_verified) !== 'true') {
            return res.status(401).json({ message: 'Email Google chưa được xác thực!' });
        }

        const email = String(payload.email || '')
            .trim()
            .toLowerCase();
        const googleId = String(payload.sub || '').trim();

        if (!email || !googleId) {
            return res.status(400).json({ message: 'Thiếu thông tin tài khoản Google!' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const randomPassword = crypto.randomBytes(24).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, salt);
            const username = await generateUniqueUsername(email, payload.name);

            user = await User.create({
                username,
                email,
                password: hashedPassword,
                fullname: payload.name || username,
                phone: '',
                avatar: payload.picture || '',
                authProvider: 'google',
                googleId,
            });
        } else {
            user.authProvider = user.authProvider || 'local';
            user.googleId = googleId;

            if (!user.avatar && payload.picture) {
                user.avatar = payload.picture;
            }

            if (!user.fullname && payload.name) {
                user.fullname = payload.name;
            }

            await user.save();
        }

        return res.json(buildUserResponse(user));
    } catch (error) {
        console.error('❌ GOOGLE AUTH ERROR:', error);
        return res.status(500).json({ message: 'Đăng nhập Google thất bại' });
    }
};

export const forgotPasswordRequest = async (req, res) => {
    const { username, contact } = req.body;

    try {
        if (!username || !contact) {
            return res.status(400).json({ message: 'Vui lòng nhập username và email hoặc số điện thoại!' });
        }

        const user = await User.findOne({
            username: username.trim(),
            $or: [{ email: contact.trim() }, { phone: contact.trim() }],
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản phù hợp!' });
        }

        const code = createForgotPasswordCode();
        const key = buildForgotPasswordKey(username, contact);

        forgotPasswordCodes.set(key, {
            code,
            userId: String(user._id),
            expiresAt: Date.now() + 10 * 60 * 1000,
        });

        return res.json({
            message: `Mã xác thực của bạn là ${code}. Mã có hiệu lực trong 10 phút.`,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const verifyForgotPasswordCode = async (req, res) => {
    const { username, contact, code } = req.body;

    try {
        if (!username || !contact || !code) {
            return res.status(400).json({ message: 'Thiếu thông tin xác thực!' });
        }

        const key = buildForgotPasswordKey(username, contact);
        const stored = forgotPasswordCodes.get(key);

        if (!stored) {
            return res.status(400).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn!' });
        }

        if (stored.expiresAt < Date.now()) {
            forgotPasswordCodes.delete(key);
            return res.status(400).json({ message: 'Mã xác thực đã hết hạn!' });
        }

        if (stored.code !== String(code).trim()) {
            return res.status(400).json({ message: 'Mã xác thực không chính xác!' });
        }

        return res.json({ message: 'Xác thực mã thành công.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const resetPasswordWithCode = async (req, res) => {
    const { username, contact, code, newPassword, confirmPassword } = req.body;

    try {
        if (!username || !contact || !code || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Thiếu thông tin đặt lại mật khẩu!' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp!' });
        }

        const key = buildForgotPasswordKey(username, contact);
        const stored = forgotPasswordCodes.get(key);

        if (!stored) {
            return res.status(400).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn!' });
        }

        if (stored.expiresAt < Date.now()) {
            forgotPasswordCodes.delete(key);
            return res.status(400).json({ message: 'Mã xác thực đã hết hạn!' });
        }

        if (stored.code !== String(code).trim()) {
            return res.status(400).json({ message: 'Mã xác thực không chính xác!' });
        }

        const user = await User.findById(stored.userId);

        if (!user) {
            forgotPasswordCodes.delete(key);
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        forgotPasswordCodes.delete(key);

        return res.json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
