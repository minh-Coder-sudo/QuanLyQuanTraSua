import { useEffect, useState } from 'react';
import ImgViTri from '../../../../assets/ImgViTri.png';
import { useNavigate } from 'react-router-dom';

export default function StoreFinder() {
    const [offset, setOffset] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className='bg-[#f3eee5] py-32 relative overflow-hidden'>
            {/* PARALLAX IMAGE */}

            <img
                src={ImgViTri}
                className='absolute -bottom-[750px] left-[90%] w-[130px] h-[130px] rounded-xl shadow-lg transition-transform duration-3000 ease-out'
                style={{
                    transform: `translateY(${offset * -0.3}px)`
                }}
            />

            <div className='max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center px-6'>
                {/* LEFT TEXT */}

                <div>
                    <h2 className='text-6xl font-bold text-black mb-6'>
                        Tìm cửa hàng gần bạn
                    </h2>

                    <p className='text-lg text-gray-700 leading-relaxed max-w-lg'>
                        Dù bạn ở đâu, ly trà sữa yêu thích vẫn luôn ở gần. Hãy
                        ghé một cửa hàng gần bạn để thưởng thức những ly trà sữa
                        thơm ngon, topping hấp dẫn và tận hưởng những khoảnh
                        khắc ngọt ngào trong ngày.
                    </p>
                </div>

                {/* RIGHT FORM */}

                <div className='flex flex-col gap-6'>
                    <select className='border-2 border-orange-500 px-8 py-4 rounded-full text-orange-500 font-semibold text-lg outline-none'>
                        <option>Chọn Thành phố</option>
                        <option>Hồ Chí Minh</option>
                        <option>Hà Nội</option>
                        <option>Cần Thơ</option>
                    </select>

                    <select className='border-2 border-orange-500 px-8 py-4 rounded-full text-orange-500 font-semibold text-lg outline-none'>
                        <option>Chọn Quận/Huyện</option>
                    </select>

                    <button
                        onClick={() => navigate('/location')}
                        className='text-left font-bold text-black text-lg flex items-center gap-3 mt-4 hover:gap-5 transition-all'
                    >
                        <span className='underline underline-offset-4'>
                            XEM DANH SÁCH CỬA HÀNG
                        </span>

                        <span className='text-2xl'>→</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
