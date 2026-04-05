import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.login({ email, password });
      setUser(data);
      alert('Chào mừng bạn quay trở lại!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-20 w-20 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl shadow-orange-600/20 mb-6 transform hover:rotate-6 transition duration-300">
            🧋
          </div>
          <h2 className="text-3xl font-black text-white text-center tracking-tight mb-2 uppercase">ĐĂNG NHẬP</h2>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] text-center">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-2xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">Email đăng nhập</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30 group-focus-within:text-amber-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">Mật khẩu bảo mật</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30 group-focus-within:text-amber-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none focus:border-amber-500 focus:bg-white/10 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-600/30 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100 mt-4"
            disabled={loading}
          >
            {loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP NGAY'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-white/40 text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-amber-500 font-bold hover:underline">
              ĐĂNG KÝ TẠI ĐÂY
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;