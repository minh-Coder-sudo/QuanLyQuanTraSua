import { useEffect, useRef, useState } from 'react';

export default function StoryImages() {
    const sectionRef = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const rect = sectionRef.current.getBoundingClientRect();

            // khoảng cách section so với viewport
            const distance = rect.top;

            setOffset(distance);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            ref={sectionRef}
            className='relative flex justify-center items-center mt-20 h-[600px]'
        >
            {/* ảnh lớn */}
            <img
                src='https://images.unsplash.com/photo-1521017432531-fbd92d768814'
                className='w-[450px] rounded-2xl shadow-xl transition-transform duration-500 ease-out'
                style={{
                    transform: `translateY(${offset * 0.1}px)`
                }}
            />

            {/* ảnh nhỏ */}
            <img
                src='https://images.unsplash.com/photo-1509042239860-f550ce710b93'
                className='absolute left-10 top-10 w-[180px] rounded-xl shadow-lg transition-transform duration-500 ease-out'
                style={{
                    transform: `translateY(${offset * -0.12}px)`
                }}
            />
        </div>
    );
}
