import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

// 🔥 THÊM 2 STORE
import useCartStore from '../../store/cartStore';
import useAddressStore from '../../store/addressStore';

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

            // 🔥 set user
            setUser(data);

            // 🔥 LOAD CART + ADDRESS
            await useCartStore.getState().fetchCart();
            await useAddressStore.getState().fetchAddress();

            alert('Chào mừng bạn quay trở lại!');
            navigate('/');
        } catch (err) {
            setError(err.message || 'Email hoặc mật khẩu không đúng!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden'>
            <div className='absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[150px]'></div>
            <div className='absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px]'></div>

            <div className='w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative z-10'>
                <div className='flex flex-col items-center mb-10'>
                    <div className='h-20 w-20 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl mb-6'>
                        🧋
                    </div>
                    <h2 className='text-3xl font-black text-white text-center uppercase'>
                        ĐĂNG NHẬP
                    </h2>
                    <p className='text-white/40 text-sm text-center'>
                        Chào mừng bạn quay trở lại!
                    </p>
                </div>

                <form onSubmit={handleLogin} className='space-y-6'>
                    {error && (
                        <div className='text-red-400 text-sm'>{error}</div>
                    )}

                    <input
                        type='email'
                        placeholder='Email'
                        className='w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type='password'
                        placeholder='Mật khẩu'
                        className='w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-3 bg-orange-500 text-white font-bold rounded-xl'
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className='mt-6 text-center text-white/40 text-sm'>
                    Chưa có tài khoản?{' '}
                    <Link to='/register' className='text-orange-400'>
                        Đăng ký
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
