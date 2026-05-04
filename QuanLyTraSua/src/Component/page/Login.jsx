import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

// 🔥 THÊM STORE
import useCartStore from '../../store/cartStore';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleError, setGoogleError] = useState('');
    const googleButtonRef = useRef(null);
    const navigate = useNavigate();

    const finishLogin = useCallback(
        async (data) => {
            setUser(data);

            if (data?.token) {
                try {
                    await new Promise((r) => setTimeout(r, 50));
                    await useCartStore.getState().fetchCart();
                } catch (err) {
                    console.warn('⚠️ Cảnh báo fetch cart:', err.message);
                }
            }

            navigate('/');
        },
        [navigate, setUser],
    );

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await authService.login({ email, password });
            await finishLogin(data);
        } catch (err) {
            setError(err.message || 'Email hoặc mật khẩu không đúng!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
            setGoogleError('Thiếu VITE_GOOGLE_CLIENT_ID để bật đăng nhập Google.');
            return undefined;
        }

        const loadScript = () =>
            new Promise((resolve, reject) => {
                if (window.google?.accounts?.id) {
                    resolve();
                    return;
                }

                const existingScript = document.querySelector('script[data-google-identity-services="true"]');

                if (existingScript) {
                    existingScript.addEventListener('load', resolve, { once: true });
                    existingScript.addEventListener('error', reject, { once: true });
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.dataset.googleIdentityServices = 'true';
                script.onload = resolve;
                script.onerror = () => reject(new Error('Không tải được Google Identity Services'));
                document.head.appendChild(script);
            });

        loadScript()
            .then(() => {
                if (!googleButtonRef.current || !window.google?.accounts?.id) return;

                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: async (response) => {
                        const credential = response?.credential;

                        if (!credential) return;

                        setGoogleError('');

                        try {
                            const data = await authService.loginWithGoogle(credential);
                            await finishLogin(data);
                        } catch (err) {
                            setGoogleError(err.message || 'Đăng nhập Google thất bại!');
                        }
                    },
                });

                googleButtonRef.current.innerHTML = '';
                window.google.accounts.id.renderButton(googleButtonRef.current, {
                    theme: 'outline',
                    size: 'large',
                    width: '100%',
                    text: 'continue_with',
                    shape: 'pill',
                });
            })
            .catch((err) => {
                setGoogleError(err.message || 'Không khởi tạo được đăng nhập Google.');
            });
    }, [finishLogin]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px]"></div>

            <div className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="h-20 w-20 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl mb-6">
                        🧋
                    </div>
                    <h2 className="text-3xl font-black text-white text-center uppercase">ĐĂNG NHẬP</h2>
                    <p className="text-white/40 text-sm text-center">Chào mừng bạn quay trở lại!</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && <div className="text-red-400 text-sm">{error}</div>}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl"
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-white/20">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs uppercase tracking-[0.3em]">Hoặc</span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="space-y-3">
                    <div ref={googleButtonRef} className="w-full overflow-hidden rounded-xl bg-white" />

                    {googleError && <div className="text-amber-300 text-sm">{googleError}</div>}
                </div>

                <div className="mt-6 text-center text-white/40 text-sm">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-orange-400">
                        Đăng ký
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
