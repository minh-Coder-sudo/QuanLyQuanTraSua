import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import CartIcon from '../../Component/ui/CartIcon';

export default function Header({ user, setUser }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(user);

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const getAvatarUrl = (avatar) => {
        if (!avatar) return null;

        if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
            return avatar;
        }

        return `http://localhost:5000${avatar}`;
    };

    return (
        <header className="headerpage fixed inset-x-0 top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <NavLink to="/" className="shrink-0">
                    <img src={logo} alt="TeaMango" className="h-16 w-auto" />
                </NavLink>

                {/* Menu */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wide">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `inline-block text-sm font-semibold uppercase tracking-wide transition
     ${isActive ? 'text-white border-b-2 border-yellow-400 pb-1' : 'text-white/80 hover:text-white'}`
                        }
                    >
                        Trang chủ
                    </NavLink>

                    <NavLink
                        to="/menu"
                        className={({ isActive }) =>
                            `inline-block text-sm font-semibold uppercase tracking-wide transition
     ${isActive ? 'text-white border-b-2 border-yellow-400 pb-1' : 'text-white/80 hover:text-white'}`
                        }
                    >
                        Menu
                    </NavLink>

                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            `inline-block text-sm font-semibold uppercase tracking-wide transition
     ${isActive ? 'text-white border-b-2 border-yellow-400 pb-1' : 'text-white/80 hover:text-white'}`
                        }
                    >
                        Sản phẩm
                    </NavLink>

                    <NavLink
                        to="/location"
                        className={({ isActive }) =>
                            `inline-block text-sm font-semibold uppercase tracking-wide transition
     ${isActive ? 'text-white border-b-2 border-yellow-400 pb-1' : 'text-white/80 hover:text-white'}`
                        }
                    >
                        Vị trí
                    </NavLink>

                    <NavLink
                        to="/news"
                        className={({ isActive }) =>
                            `inline-block text-sm font-semibold uppercase tracking-wide transition
     ${isActive ? 'text-white border-b-2 border-yellow-400 pb-1' : 'text-white/80 hover:text-white'}`
                        }
                    >
                        Tin tức
                    </NavLink>

                    <NavLink
                        to="/introduction"
                        className={({ isActive }) =>
                            `inline-block text-sm font-semibold uppercase tracking-wide transition
     ${isActive ? 'text-white border-b-2 border-yellow-400 pb-1' : 'text-white/80 hover:text-white'}`
                        }
                    >
                        Câu chuyện
                    </NavLink>
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <CartIcon />
                    <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="h-5 w-auto rounded-sm" />

                    {/* ===== AUTH ===== */}
                    {!currentUser ? (
                        <div className="hidden md:flex items-center gap-3">
                            <NavLink
                                to="/login"
                                className="text-white/80 hover:text-white text-sm font-semibold transition hover:-translate-y-0.5"
                            >
                                Đăng nhập
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition transform hover:scale-105"
                            >
                                Đăng ký
                            </NavLink>
                        </div>
                    ) : (
                        <div className="relative group flex items-center gap-3 cursor-pointer">
                            <div className="hidden md:block text-right">
                                <p className="text-xs text-white/60 mb-0">Xin chào,</p>
                                <p className="text-sm font-bold text-white leading-tight">{currentUser.fullname}</p>
                            </div>

                            {getAvatarUrl(currentUser.avatar) ? (
                                <img
                                    src={getAvatarUrl(currentUser.avatar)}
                                    alt="avatar"
                                    className="h-10 w-10 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:rotate-12 transition"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold border-2 border-white/20 shadow-lg group-hover:rotate-12 transition">
                                    {getInitials(currentUser.fullname)}
                                </div>
                            )}

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full pt-4 w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Tài khoản
                                        </p>
                                    </div>

                                    <NavLink
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Hồ sơ của tôi
                                    </NavLink>

                                    <NavLink
                                        to="/my-orders"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition border-t border-gray-50"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        Đơn hàng của tôi
                                    </NavLink>

                                    {(currentUser.role === 'ADMIN' || currentUser.role === 'EMPLOYEE') && (
                                        <NavLink
                                            to="/admin/products"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition border-t border-gray-50"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                            Quản lý cửa hàng
                                        </NavLink>
                                    )}

                                    {currentUser.role === 'ADMIN' && (
                                        <NavLink
                                            to="/admin/members"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition border-t border-gray-50"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                />
                                            </svg>
                                            Quản lý thành viên
                                        </NavLink>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-50"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile menu */}
                    <button className="md:hidden text-white text-xl">
                        <i className="fa-solid fa-bars" />
                    </button>
                </div>
            </div>
        </header>
    );
}
