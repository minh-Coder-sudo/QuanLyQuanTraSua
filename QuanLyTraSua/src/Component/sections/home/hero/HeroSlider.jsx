import { useEffect, useState } from 'react';
import ImgHero from '../../../../assets/ImgHero.png';
import ImgHero1 from '../../../../assets/ImgHero1.png';
import ImgHero2 from '../../../../assets/ImgHero2.png';

const slides = [
    {
        image: ImgHero,
        sub: 'NGỌT NGÀO VỊ',
        title: 'TRÀ SỮA'
    },
    {
        image: ImgHero1,
        sub: '',
        title: 'KHUYẾN MÃI'
    },
    {
        image: ImgHero2,
        sub: '',
        title: ''
    }
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='relative h-[90vh] w-full overflow-hidden bg-black'>
            {/* SLIDE WRAPPER */}

            <div
                className='flex h-full transition-transform duration-1000 ease-in-out'
                style={{
                    transform: `translateX(-${current * 100}%)`
                }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className='w-full h-full flex-shrink-0 flex items-center justify-center relative'
                    >
                        {/* IMAGE */}

                        <img
                            src={slide.image}
                            alt='Hero'
                            className='absolute w-full h-full object-contain '
                        />

                        {/* TEXT */}

                        <div className='absolute text-center'>
                            {slide.sub && (
                                <h2 className='text-yellow-400 tracking-[8px] text-2xl mb-4'>
                                    {slide.sub}
                                </h2>
                            )}

                            {slide.title && (
                                <h1 className='text-yellow-400 text-[120px] md:text-[160px] lg:text-[180px] font-extrabold leading-none'>
                                    {slide.title}
                                </h1>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* DOTS */}

            <div className='absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-3'>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition ${
                            index === current
                                ? 'bg-yellow-400 scale-125'
                                : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>

            {/* WAVE BOTTOM */}

            <div className='absolute bottom-0 left-0 w-full overflow-hidden leading-none'>
                <svg
                    viewBox='0 0 1440 120'
                    className='w-full h-[120px]'
                    preserveAspectRatio='none'
                >
                    <path
                        d='M0,60 C240,120 480,0 720,40 C960,80 1200,120 1440,60 L1440,120 L0,120 Z'
                        fill='#e5e0d5'
                    />
                </svg>
            </div>
        </div>
    );
}
