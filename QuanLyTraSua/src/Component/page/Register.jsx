import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setLoading(false);
            return setError('Mật khẩu xác nhận không khớp!');
        }

        try {
            await authService.register({
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password,
                username: formData.email.split('@')[0],
            });
            alert('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi đăng ký!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden mt-5">
            {/* Background Decor */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px]"></div>

            <div className="w-full max-w-xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="h-20 w-20 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl shadow-orange-600/20 mb-6 transform hover:-rotate-6 transition duration-300">
                        ✍️
                    </div>
                    <h2 className="text-3xl font-black text-white text-center tracking-tight mb-2 uppercase">
                        ĐĂNG KÝ MỚI
                    </h2>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] text-center">
                        Gia nhập cộng đồng TeaMango!
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {error && (
                        <div className="col-span-1 md:col-span-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-2xl flex items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                            Họ và tên
                        </label>
                        <input
                            name="fullname"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                            Địa chỉ Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="example@mail.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                            Mật khẩu
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                            Xác nhận
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="col-span-1 md:col-span-2 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-600/30 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 mt-4"
                        disabled={loading}
                    >
                        {loading ? 'Đang tạo tài khoản...' : 'TẠO TÀI KHOẢN NGAY'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-white/40 text-sm">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-amber-500 font-bold hover:underline">
                            ĐĂNG NHẬP
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
