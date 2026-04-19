import React, { useEffect, useMemo, useState } from 'react';
import useCartStore from '../../store/cartStore';
function ProductDetail({ product, onClose }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);

    useEffect(() => {
        if (product?.sizes?.length > 0) {
            setSelectedSize(product.sizes[0]);
        } else {
            setSelectedSize(null);
        }

        setSelectedToppings([]);
        setQuantity(1);
    }, [product]);

    if (!product) return null;

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const formatPrice = (price) => {
        return `${(Number(price) || 0).toLocaleString('vi-VN')}đ`;
    };

    const getImageUrl = (image) => {
        if (!image) return 'https://via.placeholder.com/500x500?text=No+Image';

        if (image.startsWith('http://') || image.startsWith('https://')) {
            return image;
        }

        return `http://localhost:5000${image}`;
    };

    const handleToggleTopping = (topping) => {
        if (!topping?.code) return;

        const isExist = selectedToppings.some(
            (item) => item.code === topping.code
        );

        if (isExist) {
            setSelectedToppings((prev) =>
                prev.filter((item) => item.code !== topping.code)
            );
        } else {
            setSelectedToppings((prev) => [...prev, topping]);
        }
    };

    const toppingTotal = useMemo(() => {
        return selectedToppings.reduce(
            (total, item) => total + (Number(item?.price) || 0),
            0
        );
    }, [selectedToppings]);

    const basePrice = Number(product?.basePrice) || 0;
    const sizeExtra = Number(selectedSize?.extra) || 0;

    const finalUnitPrice = basePrice + sizeExtra + toppingTotal;
    const totalPrice = finalUnitPrice * quantity;

    const imageUrl = getImageUrl(product?.image);
    const addToCart = useCartStore((state) => state.addToCart);
    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'
            onClick={onClose}
        >
            <div
                className='relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className='absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:opacity-80'
                >
                    ✕
                </button>

                <div className='grid grid-cols-1 md:grid-cols-2'>
                    <div className='flex items-center justify-center bg-[#f7f3ee] p-6'>
                        <img
                            src={imageUrl}
                            alt={product?.name || 'product'}
                            className='max-h-[450px] w-full object-contain'
                        />
                    </div>

                    <div className='max-h-[90vh] overflow-y-auto p-8'>
                        <p className='mb-2 text-sm font-semibold uppercase tracking-widest text-[#8b5e3c]'>
                            {product?.category?.name || 'Danh mục sản phẩm'}
                        </p>

                        <h2 className='mb-4 text-3xl font-bold text-gray-900'>
                            {product?.name || 'Tên sản phẩm'}
                        </h2>

                        <p className='mb-4 text-2xl font-bold text-[#c67c4e]'>
                            {formatPrice(finalUnitPrice)}
                        </p>

                        <p className='mb-6 leading-7 text-gray-600'>
                            {product?.description ||
                                'Chưa có mô tả cho sản phẩm này.'}
                        </p>

                        <div className='mb-6'>
                            <h3 className='mb-2 text-sm font-semibold uppercase text-gray-500'>
                                Điểm nổi bật
                            </h3>
                            <ul className='space-y-2 text-gray-700'>
                                <li>
                                    • Nguyên liệu tươi ngon, pha chế mỗi ngày
                                </li>
                                <li>
                                    • Có thể tùy chọn size và topping theo sở
                                    thích
                                </li>
                                <li>
                                    • Hương vị đậm đà, phù hợp để thưởng thức
                                    lạnh
                                </li>
                            </ul>
                        </div>

                        {product?.sizes?.length > 0 && (
                            <div className='mb-6'>
                                <h3 className='mb-3 text-sm font-semibold uppercase text-gray-500'>
                                    Chọn size
                                </h3>

                                <div className='flex flex-wrap gap-3'>
                                    {product.sizes.map((size) => {
                                        const isActive =
                                            selectedSize?.code === size.code;
                                        const extra = Number(size?.extra) || 0;

                                        return (
                                            <button
                                                key={size.code}
                                                onClick={() =>
                                                    setSelectedSize(size)
                                                }
                                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                                    isActive
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {size.label}
                                                {extra > 0
                                                    ? ` (+${formatPrice(extra)})`
                                                    : extra < 0
                                                      ? ` (-${formatPrice(Math.abs(extra))})`
                                                      : ' (+0đ)'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {product?.toppings?.length > 0 && (
                            <div className='mb-6'>
                                <h3 className='mb-3 text-sm font-semibold uppercase text-gray-500'>
                                    Chọn topping
                                </h3>

                                <div className='space-y-3'>
                                    {product.toppings.map((topping) => {
                                        const checked = selectedToppings.some(
                                            (item) => item.code === topping.code
                                        );

                                        return (
                                            <label
                                                key={
                                                    topping._id || topping.code
                                                }
                                                className='flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 hover:bg-gray-50'
                                            >
                                                <div className='flex items-center gap-3'>
                                                    <input
                                                        type='checkbox'
                                                        checked={checked}
                                                        onChange={() =>
                                                            handleToggleTopping(
                                                                topping
                                                            )
                                                        }
                                                        className='h-4 w-4'
                                                    />
                                                    <span className='font-medium text-gray-700'>
                                                        {topping.name}
                                                    </span>
                                                </div>

                                                <span className='text-sm font-semibold text-[#8b5e3c]'>
                                                    +
                                                    {formatPrice(topping.price)}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className='mb-6 flex items-center gap-4'>
                            <span className='font-medium text-gray-700'>
                                Số lượng:
                            </span>

                            <div className='flex items-center overflow-hidden rounded-full border'>
                                <button
                                    onClick={handleDecrease}
                                    className='px-4 py-2 text-lg font-bold hover:bg-gray-100'
                                >
                                    -
                                </button>

                                <span className='min-w-[50px] text-center font-semibold'>
                                    {quantity}
                                </span>

                                <button
                                    onClick={handleIncrease}
                                    className='px-4 py-2 text-lg font-bold hover:bg-gray-100'
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className='mb-6 rounded-2xl bg-[#f7f3ee] p-4'>
                            <h3 className='mb-3 text-sm font-semibold uppercase text-gray-500'>
                                Tóm tắt đơn hàng
                            </h3>

                            <div className='space-y-2 text-sm text-gray-700'>
                                <div className='flex justify-between'>
                                    <span>Giá gốc</span>
                                    <span>{formatPrice(basePrice)}</span>
                                </div>

                                <div className='flex justify-between'>
                                    <span>Phụ thu size</span>
                                    <span>
                                        {sizeExtra > 0
                                            ? `+${formatPrice(sizeExtra)}`
                                            : sizeExtra < 0
                                              ? `-${formatPrice(Math.abs(sizeExtra))}`
                                              : '0đ'}
                                    </span>
                                </div>

                                <div className='flex justify-between'>
                                    <span>Topping</span>
                                    <span>+{formatPrice(toppingTotal)}</span>
                                </div>

                                <div className='flex justify-between'>
                                    <span>Số lượng</span>
                                    <span>x{quantity}</span>
                                </div>

                                <div className='mt-3 flex justify-between border-t pt-3 text-base font-bold text-[#c67c4e]'>
                                    <span>Tổng cộng</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <button
                                onClick={() => {
                                    const cartItem = {
                                        _id: product._id,
                                        name: product.name,
                                        image: product.image,
                                        basePrice: basePrice,
                                        finalPrice: finalUnitPrice,
                                        size: selectedSize,
                                        toppings: selectedToppings,
                                        qty: quantity
                                    };

                                    addToCart(cartItem);

                                    alert('✅ Đã thêm vào giỏ hàng!');
                                }}
                                className='rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-[#8b5e3c]'
                            >
                                Thêm vào giỏ hàng
                            </button>

                            <button
                                onClick={onClose}
                                className='rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100'
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
