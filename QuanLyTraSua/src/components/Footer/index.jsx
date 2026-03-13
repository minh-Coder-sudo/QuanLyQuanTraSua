/*
export default function Footer() {
    return (
        <footer className='bg-[#1e1e1e] text-white pt-20 pb-10'>
            <div className='container mx-auto px-10 grid md:grid-cols-4 gap-12'>
                <div>
                    <h3 className='font-bold mb-6 text-lg'>THE COFFEE HOUSE</h3>
                    <p className='text-gray-400'>
                        Mang đến trải nghiệm cà phê nguyên chất và không gian ấm
                        áp.
                    </p>
                </div>

                <div>
                    <h4 className='font-semibold mb-4'>VỀ CHÚNG TÔI</h4>
                    <ul className='space-y-3 text-gray-400'>
                        <li>Câu chuyện thương hiệu</li>
                        <li>Tuyển dụng</li>
                        <li>Hệ thống cửa hàng</li>
                    </ul>
                </div>

                <div>
                    <h4 className='font-semibold mb-4'>HỖ TRỢ</h4>
                    <ul className='space-y-3 text-gray-400'>
                        <li>Chính sách giao hàng</li>
                        <li>Điều khoản sử dụng</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>

                <div>
                    <h4 className='font-semibold mb-4'>LIÊN HỆ</h4>
                    <p className='text-gray-400'>Hotline: 1900 1234</p>
                    <p className='text-gray-400'>
                        Email: contact@coffeehouse.com
                    </p>
                </div>
            </div>

            <div className='border-t border-gray-700 mt-16 pt-6 text-center text-gray-500 text-sm'>
                © 2026 The Coffee House. All rights reserved.
            </div>
        </footer>
    );
}

*/
import React from 'react';
import Logo from '../../assets/LogoTraSua.png';

function Footer() {
    return (
        <footer className='flex gap-24'>
            <img src={Logo} alt='' className='ml-16 w-56' />

            <div className='flex flex-col '>
                <h3 className='mb-5 text-xl text-orange-500 font-weight-600'>
                    Giới thiệu
                </h3>
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
            </div>
            <div className='flex flex-col '>
                <h3 className='mb-5 text-xl text-orange-500 font-weight-600'>
                    Liên hệ
                </h3>
                <h3 className='text-white/80'>
                    <span className='text-orange-500 font-weight-600'>
                        Đặt hàng:
                    </span>{' '}
                    1800 6936
                </h3>
                <h3 className='text-white/80'>
                    <span className='text-orange-500 font-weight-600'>
                        Email:{' '}
                    </span>
                    support.teamongo@ggg.com.vn
                </h3>
            </div>
            <div className='flex flex-col '>
                <h3 className='mb-5 text-xl text-orange-500 font-weight-600'>
                    © 2025 THE TEA MONGO
                </h3>
                <h3 className='text-white/80'>
                    <span className='text-orange-500 font-weight-600'>
                        Địa chỉ:
                    </span>{' '}
                    12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh.
                </h3>
                <div className='flex gap-4'>
                    <span className=' text-orange-500 font-weight-600'>
                        Mạng xã hội:{' '}
                    </span>
                    <i className='fa-brands fa-facebook-f text-white/80 hover:text-white text-lg cursor-pointer mt-1' />
                    <i className='fa-brands fa-instagram text-white/80 hover:text-white text-lg cursor-pointer mt-1' />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
