import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import productService from '../../../../services/productService';

export default function ProductSlider() {
    const sliderRef = useRef(null);

    const [category, setCategory] = useState('signature');
    const [isPaused, setIsPaused] = useState(false);
    const [allProducts, setAllProducts] = useState({
        signature: [],
        tea: [],
        milktea: [],
        milk: [],
        frappe: [],
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';

        if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
            return imagePath;
        }

        if (imagePath.startsWith('/')) {
            return `${API_URL}${imagePath}`;
        }

        return `${API_URL}/${imagePath}`;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await productService.getProducts();
                // Phân loại sản phẩm dựa trên Category Name hoặc ID
                const categorized = {
                    signature: [],
                    tea: [],
                    milktea: [],
                    milk: [],
                    frappe: [],
                };

                // --- BẮT ĐẦU PHÂN LOẠI DỮ LIỆU ---
                // 1. Phân loại Món HOT dựa trên lượt thích (likes) cao nhất
                const sortedByLikes = [...products].sort((a, b) => (b.likes || 0) - (a.likes || 0));
                categorized.signature = sortedByLikes.slice(0, 6);

                // 2. Phân loại theo các danh mục khác
                products.forEach((p) => {
                    const catName = (p.category?.name || p.categorySlug || '').toLowerCase();

                    if (catName.includes('trà sữa')) categorized.milktea.push(p);
                    else if (catName.includes('trà trái cây')) categorized.tea.push(p);
                    else if (catName.includes('matcha') || catName.includes('latte')) categorized.milk.push(p);
                    else if (catName.includes('đá xay')) categorized.frappe.push(p);
                });

                setAllProducts(categorized);
            } catch (error) {
                console.error('Lỗi nạp sản phẩm cho Slider:', error);
            }
        };
        fetchProducts();
    }, []);

    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);

    const CARD_WIDTH = 260;
    const GAP = 40;
    const STEP = CARD_WIDTH + GAP;

    // Use categorized products from state
    const currentProducts = allProducts[category] || [];
    const products = currentProducts.length > 0 ? [...currentProducts, ...currentProducts] : [];

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
                                src={getImageUrl(item.image)}
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

                            <p className="text-orange-500 text-xl font-bold mt-2">
                                {item.basePrice?.toLocaleString()} đ
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
