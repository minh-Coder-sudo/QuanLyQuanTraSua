import { useEffect, useState } from 'react';
import ImgTea from '../../../../assets/ImgOriginSection.png';
import ImgMilk from '../../../../assets/ImgMilk.png';
import { useNavigate } from 'react-router-dom';
const sections = [
    {
        image: ImgTea,
        title: 'Chất lượng khởi nguồn từ những đồi trà tuyển chọn',
        desc: `Những lá trà được tuyển chọn từ vùng trà chất lượng cao,
    kết hợp cùng sữa thơm béo và trân châu dẻo dai, tạo nên
    ly trà sữa đậm vị và đầy cuốn hút. Mỗi ngụm trà là sự
    cân bằng hoàn hảo giữa hương trà thanh mát và vị ngọt dịu,
    mang đến trải nghiệm thưởng thức khó quên.`,
        bg: '#7f9666',
        position: 'object-center'
    },
    {
        image: ImgMilk,
        title: 'Vị béo mịn từ sữa tươi chọn lọc',
        desc: `Sữa tươi chất lượng được lựa chọn kỹ lưỡng
    giúp tạo nên độ béo mịn tự nhiên cho từng ly trà sữa.
    Khi hòa quyện cùng hương trà thanh mát,
    mỗi ngụm đều mang đến cảm giác dịu nhẹ
    và tròn vị khó quên.`,
        bg: '#000000',
        position: 'object-[center_30%]'
    }
];

export default function OriginSlider() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % sections.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % sections.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
    };

    return (
        <div className='relative h-[600px] overflow-hidden'>
            {/* SLIDER */}
            <div
                className='transition-transform duration-1000 ease-in-out'
                style={{
                    transform: `translateY(-${current * 600}px)`
                }}
            >
                {sections.map((item, index) => (
                    <div key={index} className='grid md:grid-cols-2 h-[600px]'>
                        {/* IMAGE */}
                        <div className='w-full h-[600px] overflow-hidden'>
                            <img
                                src={item.image}
                                alt=''
                                className={`w-full h-full object-cover ${item.position}`}
                            />
                        </div>

                        {/* TEXT */}
                        <div
                            className='text-white p-20 flex flex-col justify-center'
                            style={{ background: item.bg }}
                        >
                            <h2 className='text-5xl font-bold mb-6 leading-tight'>
                                {item.title}
                            </h2>

                            <p className='leading-relaxed mb-8 text-lg max-w-xl'>
                                {item.desc}
                            </p>

                            <button
                                onClick={() => navigate('/introduction')}
                                className='border border-white px-8 py-3 w-fit hover:bg-white hover:text-black transition duration-300'
                            >
                                XEM THÊM →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* BUTTON PREV */}
            <button
                onClick={prevSlide}
                className='absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-2xl transition'
            >
                ←
            </button>

            {/* BUTTON NEXT */}
            <button
                onClick={nextSlide}
                className='absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-2xl transition'
            >
                →
            </button>
        </div>
    );
}
