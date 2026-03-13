import React from 'react';
import Logo from '@/assets/logo.png';

function Footer() {
    return (
        <footer className="flex gap-24">
            <img src={Logo} alt="" className="ml-16 w-56" />

            <div className="flex flex-col ">
                <h3 className="mb-5 text-xl text-orange-500 font-weight-600">Giới thiệu</h3>
                <a className="text-white/80 hover:text-white" href="#">
                    Trang chủ
                </a>
                <a className="text-white/80 hover:text-white" href="#">
                    Menu
                </a>
                <a className="text-white/80 hover:text-white" href="#">
                    Sản phẩm
                </a>
                <a className="text-white/80 hover:text-white" href="#">
                    Vị trí
                </a>
                <a href="/news" className="text-white/80 hover:text-yellow-400 transition">
                    Tin tức
                </a>
            </div>
            <div className="flex flex-col ">
                <h3 className="mb-5 text-xl text-orange-500 font-weight-600">Liên hệ</h3>
                <h3 className="text-white/80">
                    <span className="text-orange-500 font-weight-600">Đặt hàng:</span> 1800 6936
                </h3>
                <h3 className="text-white/80">
                    <span className="text-orange-500 font-weight-600">Email: </span>support.teamongo@ggg.com.vn
                </h3>
            </div>
            <div className="flex flex-col ">
                <h3 className="mb-5 text-xl text-orange-500 font-weight-600">© 2025 THE TEA MONGO</h3>
                <h3 className="text-white/80">
                    <span className="text-orange-500 font-weight-600">Địa chỉ:</span> 12 Nguyễn Văn Bảo, Phường 4, Gò
                    Vấp, Thành phố Hồ Chí Minh.
                </h3>
                <div className="flex gap-4">
                    <span className=" text-orange-500 font-weight-600">Mạng xã hội: </span>
                    <i className="fa-brands fa-facebook-f text-white/80 hover:text-white text-lg cursor-pointer mt-1" />
                    <i className="fa-brands fa-instagram text-white/80 hover:text-white text-lg cursor-pointer mt-1" />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
