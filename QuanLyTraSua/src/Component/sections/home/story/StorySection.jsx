/*
import StoryImages from './StoryImages';

export default function StorySection() {
    return (
        <section className='bg-[#f5f2ea] py-24 text-center'>
            <h2 className='text-5xl font-bold mb-6 text-black '>
                CÂU CHUYỆN “TRÀ SỮA”
            </h2>

            <p className='max-w-3xl mx-auto text-lg leading-relaxed text-black'>
                Chúng tôi tin rằng mỗi ly trà sữa không chỉ là một thức uống, mà
                còn là một khoảnh khắc ngọt ngào trong ngày. Từ những lá trà
                được chọn lọc kỹ lưỡng, sữa béo thơm cùng những loại topping hấp
                dẫn, mỗi ly trà sữa đều được chuẩn bị với sự chăm chút để mang
                đến hương vị trọn vẹn nhất. Hy vọng rằng khi thưởng thức, bạn sẽ
                cảm nhận được niềm vui nhỏ lan tỏa trong từng ngụm trà.
            </p>

            <button className='mt-8 bg-black text-white px-8 py-3 rounded-full hover:opacity-80 transition'>
                KHÁM PHÁ MENU
            </button>

            <StoryImages />
        </section>
    );
}
*/

import { useEffect, useRef, useState } from 'react';
import ImgStorySection from '../../../../assets/ImgStorySection.png';
import ImgStorySection1 from '../../../../assets/ImgStorySection1.png';
import ImgStorySection2 from '../../../../assets/ImgStorySection2.png';
import ImgStorySection3 from '../../../../assets/ImgStorySection3.png';
export default function StorySection() {
    const sectionRef = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section ref={sectionRef} className="bg-white py-32 overflow-hidden relative">
            {/* TEXT */}
            <div className="text-center max-w-3xl mx-auto px-6">
                <svg viewBox="0 0 1400 320" className="mx-auto mb-10">
                    <path id="curve" d="M100,280 Q700,-120 1300,280" fill="transparent" />

                    <text fontSize="110" fontWeight="900" letterSpacing="14" fill="black">
                        <textPath href="#curve" startOffset="50%" textAnchor="middle">
                            CHUYỆN “TRÀ SỮA”
                        </textPath>
                    </text>
                </svg>

<<<<<<< HEAD:QuanLyTraSua/src/Component/sections/home/story/StorySection.jsx
                <p className="text-2xl font-bold  leading-relaxed text-gray-700">
                    Chúng tôi tin rằng mỗi ly trà sữa không chỉ là một thức uống, mà còn là một khoảnh khắc ngọt ngào
                    trong ngày. Từ những lá trà được chọn lọc kỹ lưỡng, sữa béo thơm cùng những loại topping hấp dẫn,
                    mỗi ly trà sữa đều được chuẩn bị với sự chăm chút để mang đến hương vị trọn vẹn nhất. Hy vọng rằng
                    khi thưởng thức, bạn sẽ cảm nhận được niềm vui nhỏ lan tỏa trong từng ngụm trà.
=======
                <p className='text-2xl font-bold leading-relaxed text-gray-700'>
                    Chúng tôi tin rằng mỗi ly trà sữa không chỉ là một thức
                    uống, mà còn là một khoảnh khắc ngọt ngào trong ngày. Từ
                    những lá trà được chọn lọc kỹ lưỡng, sữa béo thơm cùng những
                    loại topping hấp dẫn, mỗi ly trà sữa đều được chuẩn bị với
                    sự chăm chút để mang đến hương vị trọn vẹn nhất. Hy vọng
                    rằng khi thưởng thức, bạn sẽ cảm nhận được niềm vui nhỏ lan
                    tỏa trong từng ngụm trà.
>>>>>>> origin/main:QuanLyTraSua/src/sections/home/story/StorySection.jsx
                </p>

                <button className="mt-10 bg-black text-white px-8 py-3 rounded-full hover:scale-105 transition">
                    KHÁM PHÁ MENU
                </button>
            </div>

            {/* IMAGES */}
            <div className="relative flex justify-center mt-20 h-[600px]">
                <div className="relative">
                    {/* ảnh lớn */}
                    <img
                        src={ImgStorySection}
                        className="w-[700px] h-[600px] rounded-2xl shadow-xl transition-transform duration-1000 ease-out"
                        /*
                        style={{
                            transform: `translateY(${offset * 0.05}px)`
                        }}
                        */
                    />

                    {/* ảnh nhỏ */}
                    <img
                        src={ImgStorySection1}
                        className="absolute top-80 -left-35 w-[190px] h-[260px] rounded-xl shadow-lg transition-transform duration-1000 ease-out"
                        style={{
                            transform: `translateY(${offset * -0.3}px)`,
                        }}
                    />
                    <img
                        src={ImgStorySection2}
                        className="absolute top-150 left-170 w-[190px] h-[260px] rounded-xl shadow-lg transition-transform duration-1000 ease-out"
                        style={{
                            transform: `translateY(${offset * -0.3}px)`,
                        }}
                    />
                    <img
                        src={ImgStorySection3}
                        className="absolute top-90 left-70 w-[190px] h-[260px] rounded-xl shadow-lg transition-transform duration-1000 ease-out"
                        style={{
                            transform: `translateX(${offset * -0.3}px)`,
                        }}
                    />
                    {/* tag */}
                    <div
                        className="absolute -bottom-[260px] left-[200px] text-black bg-[#e7d1c6] px-6 py-6 rounded-full shadow-lg text-lg font-semibold transition-transform duration-1000 ease-out"
                        style={{
                            transform: `translateY(${offset * -0.1}px)`,
                        }}
                    >
                        Trà sữa mỗi ngày
                    </div>
                    <div
                        className="absolute -bottom-[202px] -right-[190px] text-black bg-[#e7d1c6] px-6 py-6 rounded-full shadow-lg text-lg font-semibold transition-transform duration-1000 ease-out"
                        style={{
                            transform: `translateY(${offset * -0.1}px)`,
                        }}
                    >
                        Hương vị thơm ngon
                    </div>
                    {/* hashtag */}
                    <div
                        className="absolute -top-20 -right-5 text-black bg-[#f1e4d6] px-6 py-6 rounded-full shadow-lg text-lg font-semibold transition-transform duration-1000 ease-out"
                        style={{
                            transform: `translateX(${offset * 0.1}px)`,
                        }}
                    >
                        #trasua
                    </div>
                </div>
            </div>
        </section>
    );
}
