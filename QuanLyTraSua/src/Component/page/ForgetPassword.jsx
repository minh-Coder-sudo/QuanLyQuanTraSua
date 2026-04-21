import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth';

const ForgetPassword = () => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [contact, setContact] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendCode = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const data = await authService.forgotPassword({
                username: username.trim(),
                contact: contact.trim(),
            });
            setMessage(data.message || 'Đã gửi email xác thực thành công.');
            setStep(2);
        } catch (err) {
            setError(err.message || 'Không thể gửi email xác thực.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const data = await authService.verifyForgotPasswordCode({
                username: username.trim(),
                contact: contact.trim(),
                code: code.trim(),
            });
            setMessage(data.message || 'Xác thực mã thành công.');
            setStep(3);
        } catch (err) {
            setError(err.message || 'Mã xác thực không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const data = await authService.resetPasswordWithCode({
                username: username.trim(),
                contact: contact.trim(),
                code: code.trim(),
                newPassword,
                confirmPassword,
            });

            setMessage(data.message || 'Đổi mật khẩu thành công.');
            setStep(1);
            setCode('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message || 'Không thể đổi mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px]"></div>

            <div className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="h-20 w-20 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl shadow-orange-600/20 mb-6">
                        🔐
                    </div>
                    <h2 className="text-3xl font-black text-white text-center tracking-tight mb-2 uppercase">
                        QUÊN MẬT KHẨU
                    </h2>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-[0.12em] text-center">
                        {step === 1 && 'Nhập username và email hoặc số điện thoại'}
                        {step === 2 && 'Nhập mã xác thực đã gửi qua email'}
                        {step === 3 && 'Nhập mật khẩu mới để hoàn tất'}
                    </p>
                </div>

                <div className="mb-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <span className={`${step >= 1 ? 'text-amber-400' : 'text-white/30'}`}>1. Gửi mã</span>
                    <span className="text-white/20">-</span>
                    <span className={`${step >= 2 ? 'text-amber-400' : 'text-white/30'}`}>2. Xác thực mã</span>
                    <span className="text-white/20">-</span>
                    <span className={`${step >= 3 ? 'text-amber-400' : 'text-white/30'}`}>3. Đổi mật khẩu</span>
                </div>

                <form
                    onSubmit={step === 1 ? handleSendCode : step === 2 ? handleVerifyCode : handleResetPassword}
                    className="space-y-6"
                >
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-2xl">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-2xl">
                            {message}
                        </div>
                    )}

                    {step === 1 && (
                        <>
                            <div className="space-y-2">
                                <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập username"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                                    Email hoặc SĐT
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập email hoặc số điện thoại"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="space-y-2">
                            <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                                Mã xác thực
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập mã 6 số"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-white/50">
                                Username và email/sđt đã được khóa để đảm bảo đúng tài khoản.
                            </p>
                        </div>
                    )}

                    {step === 3 && (
                        <>
                            <div className="space-y-2">
                                <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    placeholder="Tối thiểu 6 ký tự"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-600/30 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100"
                        disabled={loading}
                    >
                        {loading && step === 1 && 'Đang gửi...'}
                        {loading && step === 2 && 'Đang xác thực...'}
                        {loading && step === 3 && 'Đang đổi mật khẩu...'}
                        {!loading && step === 1 && 'GỬI EMAIL XÁC THỰC'}
                        {!loading && step === 2 && 'XÁC THỰC MÃ'}
                        {!loading && step === 3 && 'ĐỔI MẬT KHẨU'}
                    </button>

                    {step > 1 && (
                        <button
                            type="button"
                            className="w-full py-3 border border-white/15 rounded-2xl text-white/80 text-sm font-semibold hover:bg-white/5 transition"
                            onClick={() => {
                                setError('');
                                setMessage('');
                                setStep(step - 1);
                            }}
                            disabled={loading}
                        >
                            Quay lại bước trước
                        </button>
                    )}
                </form>

                <div className="mt-8 text-center text-sm text-white/50">
                    <Link to="/login" className="text-amber-500 font-semibold hover:underline">
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
