import React from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export default function Header({ user, setUser }) {
    return (
        <header className="headerpage fixed inset-x-0 top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link to="/" className="shrink-0">
                    <img src={logo} alt="TeaMango" className="h-16 w-auto" />
                </Link>

                {/* Menu */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wide">
                    <Link
                        to="/Home"
                        className="nav-header hover:scale-110 transition-transform inline-block text-white/80 hover:text-white"
                    >
                        Trang chủ
                    </Link>

                    <Link
                        to="/menu"
                        className="nav-header hover:scale-110 transition-transform inline-block text-white/80 hover:text-white"
                    >
                        Menu
                    </Link>

                    <Link
                        to="/products"
                        className="nav-header hover:scale-110 transition-transform inline-block text-white/80 hover:text-white"
                    >
                        Sản phẩm
                    </Link>

                    <Link
                        to="/location"
                        className="nav-header hover:scale-110 transition-transform inline-block text-white/80 hover:text-white"
                    >
                        Vị trí
                    </Link>

                    <Link
                        to="/news"
                        className="nav-header hover:scale-110 transition-transform inline-block text-white/80 hover:text-white"
                    >
                        Tin tức
                    </Link>
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-4 relative">
                    <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="h-5 w-auto rounded-sm" />

                    <i className="fa-brands fa-facebook-f nav-header hover:scale-110 transition-transform text-white/80 hover:text-white text-lg cursor-pointer" />
                    <i className="fa-brands fa-instagram nav-header hover:scale-110 transition-transform text-white/80 hover:text-white text-lg cursor-pointer" />

                    {/* ===== AUTH ===== */}
                    {!user ? (
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="text-white/80 hover:text-white text-sm font-semibold">
                                Đăng nhập
                            </Link>

                            <Link
                                to="/register"
                                className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    ) : (
                        <div className="relative group">
                            <img
                                src={user.avatar}
                                alt="avatar"
                                className="h-10 w-10 rounded-full cursor-pointer border border-white/30"
                            />

                            {/* Dropdown */}
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition">
                                <Link className="block px-4 py-2 hover:bg-gray-100" to="/profile">
                                    Hồ sơ
                                </Link>
                                <button
                                    onClick={() => setUser(null)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Đăng xuất
                                </button>
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
