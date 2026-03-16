import { useEffect, useRef, useState } from 'react';

export default function FadeIn({ children }) {
    const ref = useRef();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShow(true);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
                show
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
            }`}
        >
            {children}
        </div>
    );
}
