import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImgTraSua from '../../../../assets/ImgTraSua.jpg';
import ImgTraSua1 from '../../../../assets/ImgTraSua1.webp';
import ImgTraSua2 from '../../../../assets/ImgTraSua2.jpg';
import ImgTraSua3 from '../../../../assets/ImgTraSua3.avif';
import ImgTraSua4 from '../../../../assets/ImgTraSua4.jpg';
import ImgTraTraiCay from '../../../../assets/ImgTraTraiCay.jpg';
import ImgTraTraiCay1 from '../../../../assets/ImgTraTraiCay1.jpg';
import ImgTraTraiCay2 from '../../../../assets/ImgTraTraiCay2.jpg';
import ImgTraTraiCay3 from '../../../../assets/ImgTraTraiCay3.jpg';
import ImgTraTraiCay4 from '../../../../assets/ImgTraTraiCay4.jpg';
import ImgML from '../../../../assets/ImgML.jpg';
import ImgML1 from '../../../../assets/ImgML1.jpg';
import ImgML2 from '../../../../assets/ImgML2.webp';
import ImgML3 from '../../../../assets/ImgML3.jpg';
import ImgML4 from '../../../../assets/ImgML4.jpg';
import ImgDaXay from '../../../../assets/ImgDaXay.jpg';
import ImgDaXay1 from '../../../../assets/ImgDaXay1.jpg';
import ImgDaXay2 from '../../../../assets/ImgDaXay2.jpg';
import ImgDaXay3 from '../../../../assets/ImgDaXay3.jpg';
import ImgDaXay4 from '../../../../assets/ImgDaXay4.jpg';
import BrownBobaTea from '../../../../assets/BrownBobaTea.png';
import MatchaBoba from '../../../../assets/MatchaBoba.png';
import PastelHuesBoba from '../../../../assets/PastelHuesBoba.png';
import PeachBoba from '../../../../assets/PeachBoba.png';
import StrawberryBoba from '../../../../assets/StraberryBoba.png';
import VibrantBoba from '../../../../assets/VibrantBoba.png';
const menu = {
    signature: [
        {
            name: 'Trà Sữa Trân Châu',
            price: '39,000 đ',
            img: BrownBobaTea,
        },
        {
            name: 'Matcha Boba Latte',
            price: '45,000 đ',
            img: MatchaBoba,
        },
        {
            name: 'Strawberry Boba Milk',
            price: '45,000 đ',
            img: StrawberryBoba,
        },
        {
            name: 'Pastel Milk Tea',
            price: '45,000 đ',
            img: PastelHuesBoba,
        },
    ],

    tea: [
        {
            name: 'Trà Xoài',
            price: '38,000 đ',
            img: ImgTraTraiCay,
        },
        {
            name: 'Trà Đào Cam Sả',
            price: '36,000 đ',
            img: ImgTraTraiCay1,
        },
        {
            name: 'Trà Đào',
            price: '45,000 đ',
            img: ImgTraTraiCay2,
        },
        {
            name: 'Trà Dâu',
            price: '45,000 đ',
            img: ImgTraTraiCay3,
        },
        {
            name: 'Trà Chanh',
            price: '45,000 đ',
            img: ImgTraTraiCay4,
        },
    ],

    milktea: [
        {
            name: 'Classic Boba Milk Tea',
            price: '39,000 đ',
            img: ImgTraSua,
        },
        {
            name: 'Trân Trâu Đường Đen',
            price: '42,000 đ',
            img: ImgTraSua1,
        },
        {
            name: 'Oolong Milk Tea',
            price: '45,000 đ',
            img: ImgTraSua2,
        },
        {
            name: 'Trà Sữa Thái Xanh',
            price: '45,000 đ',
            img: ImgTraSua3,
        },
        {
            name: 'Trà Sữa Khoai Môn',
            price: '45,000 đ',
            img: ImgTraSua4,
        },
    ],

    milk: [
        {
            name: 'Matcha Latte',
            price: '39,000 đ',
            img: ImgML,
        },
        {
            name: 'Matcha Dâu',
            price: '42,000 đ',
            img: ImgML1,
        },
        {
            name: 'Latte Việt Quốc',
            price: '45,000 đ',
            img: ImgML2,
        },
        {
            name: 'Latte Ca Cao',
            price: '45,000 đ',
            img: ImgML3,
        },
        {
            name: 'Latte Khoai Môn',
            price: '45,000 đ',
            img: ImgML4,
        },
    ],

    frappe: [
        {
            name: 'Đá Xay Ca Cao',
            price: '39,000 đ',
            img: ImgDaXay,
        },
        {
            name: 'Đá Xay Socola',
            price: '42,000 đ',
            img: ImgDaXay1,
        },
        {
            name: 'Đá Xay Khoai Môn',
            price: '45,000 đ',
            img: ImgDaXay2,
        },
        {
            name: 'Đá Xay Matcha',
            price: '45,000 đ',
            img: ImgDaXay3,
        },
        {
            name: 'Đá Xay Sữa Chua',
            price: '45,000 đ',
            img: ImgDaXay4,
        },
    ],
};

export default function ProductSlider() {
    const sliderRef = useRef(null);

    const [category, setCategory] = useState('milktea');
    const [isPaused, setIsPaused] = useState(false);

    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);

    const CARD_WIDTH = 260;
    const GAP = 40;
    const STEP = CARD_WIDTH + GAP;

    const products = [...menu[category], ...menu[category], ...menu[category]];

    /* AUTO SLIDE */

    useEffect(() => {
        const slider = sliderRef.current;

        const interval = setInterval(() => {
            if (!slider || isPaused) return;

            slider.scrollBy({
                left: STEP,
                behavior: 'smooth',
            });

            const maxScroll = slider.scrollWidth - slider.clientWidth;

            if (slider.scrollLeft >= maxScroll) {
                slider.scrollLeft = 0;
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [category, isPaused]);

    /* ARROWS */

    const scrollRight = () => {
        sliderRef.current.scrollBy({
            left: STEP,
            behavior: 'smooth',
        });
    };

    const scrollLeft = () => {
        sliderRef.current.scrollBy({
            left: -STEP,
            behavior: 'smooth',
        });
    };

    /* DRAG */

    const mouseDown = (e) => {
        const slider = sliderRef.current;

        setIsDown(true);
        setStartX(e.pageX - slider.offsetLeft);
        setScrollLeftPos(slider.scrollLeft);
    };

    const mouseLeave = () => setIsDown(false);
    const mouseUp = () => setIsDown(false);

    const mouseMove = (e) => {
        if (!isDown) return;

        const slider = sliderRef.current;

        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;

        slider.scrollLeft = scrollLeftPos - walk;
    };

    return (
        <section className="bg-[#f3eee5] py-28 relative">
            {/* TITLE */}

            <div className="text-center mb-10">
                <p className="uppercase tracking-[6px] text-3xl text-black font-bold -mt-5 mb-10">FEATURED DRINK</p>

                <h2 className="text-5xl font-extrabold text-orange-500 mt-20">“TRÀ SỮA” COLLECTION</h2>
            </div>

            {/* CATEGORY */}

            <div className="flex justify-center gap-16 text-3xl text-black font-bold   mb-20">
                <button
                    onClick={() => setCategory('signature')}
                    className={category === 'signature' ? 'border-b-2 border-black pb-1' : ''}
                >
                    THỨC UỐNG HOT
                </button>

                <button
                    onClick={() => setCategory('milktea')}
                    className={category === 'milktea' ? 'border-b-2 border-black pb-1' : ''}
                >
                    TRÀ SỮA
                </button>

                <button
                    onClick={() => setCategory('tea')}
                    className={category === 'tea' ? 'border-b-2 border-black pb-1' : ''}
                >
                    TRÀ TRÁI CÂY
                </button>
                <button
                    onClick={() => setCategory('milk')}
                    className={category === 'milk' ? 'border-b-2 border-black pb-1' : ''}
                >
                    MATCHA / LATTE
                </button>
                <button
                    onClick={() => setCategory('frappe')}
                    className={category === 'frappe' ? 'border-b-2 border-black pb-1' : ''}
                >
                    ĐÁ XAY
                </button>
            </div>

            {/* SLIDER WRAPPER */}

            <div className="relative max-w-[1200px] mx-auto">
                {/* LEFT ARROW */}

                <button
                    onClick={scrollLeft}
                    className="absolute -left-15 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition"
                >
                    <ChevronLeft size={28} strokeWidth={2.5} className="text-black" />
                </button>

                {/* RIGHT ARROW */}

                <button
                    onClick={scrollRight}
                    className="absolute -right-15 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition"
                >
                    <ChevronRight size={28} strokeWidth={2.5} className="text-black" />
                </button>

                {/* SLIDER */}

                <div
                    ref={sliderRef}
                    className="flex gap-10 overflow-hidden cursor-grab select-none"
                    onMouseDown={mouseDown}
                    onMouseLeave={mouseLeave}
                    onMouseUp={mouseUp}
                    onMouseMove={mouseMove}
                >
                    {products.map((item, i) => (
                        <div
                            key={i}
                            className="w-[260px] flex-shrink-0 text-center group relative"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <div className="absolute w-56 h-56 bg-orange-200 rounded-full blur-3xl opacity-40 mx-auto left-0 right-0"></div>

                            <img
                                src={item.img}
                                className="relative w-56 h-56 object-cover mx-auto rounded-full transition duration-500 group-hover:scale-110"
                            />

                            <p className="mt-6 text-gray-500 font-bold">
                                {category === 'signature'
                                    ? 'Thức Uống Hot'
                                    : category === 'milktea'
                                      ? 'Trà Sữa'
                                      : category === 'tea'
                                        ? 'Trà Trái Cây'
                                        : category === 'milk'
                                          ? 'Matcha / Latte'
                                          : 'Đá Xay'}
                            </p>

                            <h3 className="text-xl text-black font-bold">{item.name}</h3>

                            <p className="text-orange-500 text-xl font-bold mt-2">{item.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
