import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Tạo JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const isEmail = (value = '') => /.+\@.+\..+/.test(value);
const normalizePhone = (value = '') => value.replace(/[^\d+]/g, '');
const stripWrappingQuotes = (value = '') =>
    String(value)
        .replace(/^['\"]|['\"]$/g, '')
        .trim();

const findUserByUsernameAndContact = async ({ username, contact }) => {
    const cleanedContact = String(contact || '').trim();
    const usernameTrimmed = String(username || '').trim();

    const identifierQuery = isEmail(cleanedContact)
        ? { email: cleanedContact.toLowerCase() }
        : { phone: normalizePhone(cleanedContact) };

    return User.findOne({
        username: usernameTrimmed,
        ...identifierQuery,
    });
};

const sendForgotPasswordEmail = async ({ to, username, code }) => {
    const emailUser = stripWrappingQuotes(process.env.EMAIL_USER || '');
    const emailFrom = stripWrappingQuotes(process.env.EMAIL_FROM || emailUser);
    const emailPass = stripWrappingQuotes(process.env.EMAIL_PASS || '').replace(/\s+/g, '');

    if (!emailUser || !emailPass) {
        throw new Error('Thiếu cấu hình EMAIL_USER hoặc EMAIL_PASS trong file .env');
    }

    if (emailPass.length < 16) {
        const configError = new Error('EMAIL_PASS chưa hợp lệ. Vui lòng dùng Gmail App Password 16 ký tự.');
        configError.code = 'EMAIL_APP_PASSWORD_INVALID';
        throw configError;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    const mailOptions = {
        from: emailFrom,
        to,
        subject: 'Xác thực quên mật khẩu - Tea Mango',
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2>Xác thực quên mật khẩu</h2>
        <p>Xin chào <strong>${username}</strong>,</p>
        <p>Bạn vừa yêu cầu xác thực quên mật khẩu. Mã xác thực của bạn là:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #d97706;">${code}</p>
        <p>Mã có hiệu lực trong 10 phút.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

// ĐĂNG KÝ
export const registerUser = async (req, res) => {
    const { username, email, password, fullname } = req.body;

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
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
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

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
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

// YÊU CẦU QUÊN MẬT KHẨU
export const forgotPasswordRequest = async (req, res) => {
    const { username, contact } = req.body;

    if (!username || !contact) {
        return res.status(400).json({ message: 'Vui lòng nhập username và email hoặc số điện thoại.' });
    }

    try {
        const user = await findUserByUsernameAndContact({ username, contact });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản khớp với thông tin đã nhập.' });
        }

        if (!user.email) {
            return res.status(400).json({ message: 'Tài khoản chưa có email để nhận mã xác thực.' });
        }

        const verificationCode = `${Math.floor(100000 + Math.random() * 900000)}`;
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        user.forgotPasswordCode = verificationCode;
        user.forgotPasswordCodeExpires = expiresAt;
        await user.save();

        await sendForgotPasswordEmail({
            to: user.email,
            username: user.username,
            code: verificationCode,
        });

        return res.json({
            message: `Đã gửi mã xác thực đến email ${user.email}.`,
        });
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535 || error.code === 'EMAIL_APP_PASSWORD_INVALID') {
            return res.status(400).json({
                message: 'Thông tin Gmail SMTP chưa hợp lệ. Hãy dùng Gmail App Password 16 ký tự cho EMAIL_PASS.',
            });
        }

        return res.status(500).json({ message: error.message || 'Không thể gửi email xác thực.' });
    }
};

// XÁC THỰC MÃ QUÊN MẬT KHẨU
export const verifyForgotPasswordCode = async (req, res) => {
    const { username, contact, code } = req.body;

    if (!username || !contact || !code) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ username, email/sđt và mã xác thực.' });
    }

    try {
        const user = await findUserByUsernameAndContact({ username, contact });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản khớp với thông tin đã nhập.' });
        }

        const isCodeValid = String(code).trim() === user.forgotPasswordCode;
        const isExpired = !user.forgotPasswordCodeExpires || user.forgotPasswordCodeExpires < new Date();

        if (!isCodeValid || isExpired) {
            return res.status(400).json({ message: 'Mã xác thực không đúng hoặc đã hết hạn.' });
        }

        return res.json({ message: 'Xác thực mã thành công.' });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Không thể xác thực mã.' });
    }
};

// ĐẶT LẠI MẬT KHẨU BẰNG MÃ XÁC THỰC
export const resetPasswordWithCode = async (req, res) => {
    const { username, contact, code, newPassword, confirmPassword } = req.body;

    if (!username || !contact || !code || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin đổi mật khẩu.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp.' });
    }

    try {
        const user = await findUserByUsernameAndContact({ username, contact });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản khớp với thông tin đã nhập.' });
        }

        const isCodeValid = String(code).trim() === user.forgotPasswordCode;
        const isExpired = !user.forgotPasswordCodeExpires || user.forgotPasswordCodeExpires < new Date();

        if (!isCodeValid || isExpired) {
            return res.status(400).json({ message: 'Mã xác thực không đúng hoặc đã hết hạn.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.forgotPasswordCode = '';
        user.forgotPasswordCodeExpires = null;
        await user.save();

        return res.json({ message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Không thể đổi mật khẩu.' });
    }
};
