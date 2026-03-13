import React from 'react';
import logo from '../../assets/LogoTraSua.png';

export default function Header() {
    return (
        <header className='fixed inset-x-0 top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6'>
                {/* Logo */}
                <a href='/' className='shrink-0'>
                    <img src={logo} alt='TeaMango' className='h-16 w-auto' />
                </a>

                {/* Menu */}
                <nav className='hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wide'>
                    <a className='text-white/80 hover:text-white' href='#'>
                        Trang chủ
                    </a>
                    <a className='text-white/80 hover:text-white' href='#'>
                        Menu
                    </a>
                    <a className='text-white/80 hover:text-white' href='#'>
                        Sản phẩm
                    </a>
                    <a className='text-white/80 hover:text-white' href='#'>
                        Vị trí
                    </a>
                    <a className='text-white/80 hover:text-white' href='#'>
                        Tin tức
                    </a>
                </nav>

                {/* Icons */}
                <div className='flex items-center gap-4'>
                    <img
                        src='https://flagcdn.com/w40/vn.png'
                        alt='VN'
                        className='h-5 w-auto rounded-sm'
                    />
                    <i className='fa-brands fa-facebook-f text-white/80 hover:text-white text-lg cursor-pointer' />
                    <i className='fa-brands fa-instagram text-white/80 hover:text-white text-lg cursor-pointer' />
                    <button className='md:hidden text-white/80 hover:text-white text-xl'>
                        <i className='fa-solid fa-bars' />
                    </button>
                </div>
            </div>
        </header>
    );
}
