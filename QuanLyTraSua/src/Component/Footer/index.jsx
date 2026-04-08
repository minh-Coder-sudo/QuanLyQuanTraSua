import React from 'react';
import Logo from '@/assets/logo.png';

function Footer() {
    return (
        <footer className="flex flex-col md:flex-row gap-12 md:gap-24 bg-black py-6 px-10 md:px-20 border-t border-white/5">
            <img src={Logo} alt="" className="ml-16 w-72 h-auto object-contain" />

            <div className="flex flex-col mt-4">
                <h3 className="mb-6 text-2xl text-orange-500 font-bold uppercase tracking-widest">Giới thiệu</h3>
                <div className="flex flex-row flex-wrap gap-x-12 gap-y-4">
                    <a className="text-white/80 hover:text-orange-500 text-xl transition" href="#">
                        Trang chủ
                    </a>
                    <a className="text-white/80 hover:text-orange-500 text-xl transition" href="#">
                        Menu
                    </a>
                    <a className="text-white/80 hover:text-orange-500 text-xl transition" href="#">
                        Sản phẩm
                    </a>
                    <a className="text-white/80 hover:text-orange-500 text-xl transition" href="#">
                        Vị trí
                    </a>
                    <a href="/news" className="text-white/80 hover:text-orange-500 text-xl transition">
                        Tin tức
                    </a>
                </div>
            </div>
            <div className="flex flex-col mt-4 space-y-4">
                <h3 className="mb-6 text-2xl text-orange-500 font-bold uppercase tracking-widest">Liên hệ</h3>
                <h3 className="text-white/80 text-xl">
                    <span className="text-orange-500 font-bold">Đặt hàng:</span> 1800 6936
                </h3>
                <h3 className="text-white/80 text-xl">
                    <span className="text-orange-500 font-bold">Email: </span>support.teamongo@ggg.com.vn
                </h3>
            </div>
            <div className="flex flex-col mt-4 space-y-4">
                <h3 className="mb-6 text-2xl text-orange-500 font-bold uppercase tracking-widest">© 2025 THE TEA MONGO</h3>
                <h3 className="text-white/80 text-xl leading-relaxed">
                    <span className="text-orange-500 font-bold">Địa chỉ:</span> 12 Nguyễn Văn Bảo, Phường 4, Gò
                    Vấp, Thành phố Hồ Chí Minh.
                </h3>
                <div className="flex gap-8 mt-6">
                    <span className=" text-orange-500 font-bold text-xl">Mạng xã hội: </span>
                    <i className="fa-brands fa-facebook-f text-white/80 hover:text-white text-3xl cursor-pointer" />
                    <i className="fa-brands fa-instagram text-white/80 hover:text-white text-3xl cursor-pointer" />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
