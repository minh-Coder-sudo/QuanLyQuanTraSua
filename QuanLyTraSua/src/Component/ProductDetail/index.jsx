import React, { useEffect, useMemo, useState } from 'react';

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
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };

    const handleToggleTopping = (topping) => {
        const isExist = selectedToppings.some((item) => item.code === topping.code);

        if (isExist) {
            setSelectedToppings(selectedToppings.filter((item) => item.code !== topping.code));
        } else {
            setSelectedToppings([...selectedToppings, topping]);
        }
    };

    const toppingTotal = useMemo(() => {
        return selectedToppings.reduce((total, item) => total + item.price, 0);
    }, [selectedToppings]);

    const sizeExtra = selectedSize?.extra || 0;

    const finalUnitPrice = product.price + sizeExtra + toppingTotal;
    const totalPrice = finalUnitPrice * quantity;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:opacity-80"
                >
                    ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex items-center justify-center bg-[#f7f3ee] p-6">
                        <img src={product.image} alt={product.name} className="max-h-[450px] w-full object-contain" />
                    </div>

                    <div className="max-h-[90vh] overflow-y-auto p-8">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#8b5e3c]">
                            {product.category}
                        </p>

                        <h2 className="mb-4 text-3xl font-bold text-gray-900">{product.name}</h2>

                        <p className="mb-4 text-2xl font-bold text-[#c67c4e]">{formatPrice(finalUnitPrice)}</p>

                        <p className="mb-6 leading-7 text-gray-600">{product.description}</p>

                        <div className="mb-6">
                            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Điểm nổi bật</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Nguyên liệu tươi ngon, pha chế mỗi ngày</li>
                                <li>• Vị trà đậm, sữa béo hài hòa</li>
                                <li>• Phù hợp uống lạnh, thêm topping tùy chọn</li>
                            </ul>
                        </div>

                        {/* SIZE */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">Chọn size</h3>

                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => {
                                        const isActive = selectedSize?.code === size.code;

                                        return (
                                            <button
                                                key={size.code}
                                                onClick={() => setSelectedSize(size)}
                                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                                    isActive
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {size.label}
                                                {size.extra > 0 ? ` (+${formatPrice(size.extra)})` : ' (+0đ)'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TOPPING */}
                        {product.toppings && product.toppings.length > 0 && (
                            <div className="mb-6">
                                <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">Chọn topping</h3>

                                <div className="space-y-3">
                                    {product.toppings.map((topping) => {
                                        const checked = selectedToppings.some((item) => item.code === topping.code);

                                        return (
                                            <label
                                                key={topping.code}
                                                className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => handleToggleTopping(topping)}
                                                        className="h-4 w-4"
                                                    />
                                                    <span className="font-medium text-gray-700">{topping.name}</span>
                                                </div>

                                                <span className="text-sm font-semibold text-[#8b5e3c]">
                                                    +{formatPrice(topping.price)}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* QUANTITY */}
                        <div className="mb-6 flex items-center gap-4">
                            <span className="font-medium text-gray-700">Số lượng:</span>

                            <div className="flex items-center overflow-hidden rounded-full border">
                                <button
                                    onClick={handleDecrease}
                                    className="px-4 py-2 text-lg font-bold hover:bg-gray-100"
                                >
                                    -
                                </button>

                                <span className="min-w-[50px] text-center font-semibold">{quantity}</span>

                                <button
                                    onClick={handleIncrease}
                                    className="px-4 py-2 text-lg font-bold hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* PRICE SUMMARY */}
                        <div className="mb-6 rounded-2xl bg-[#f7f3ee] p-4">
                            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">Tóm tắt đơn hàng</h3>

                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Giá gốc</span>
                                    <span>{formatPrice(product.price)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Phụ thu size</span>
                                    <span>+{formatPrice(sizeExtra)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Topping</span>
                                    <span>+{formatPrice(toppingTotal)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Số lượng</span>
                                    <span>x{quantity}</span>
                                </div>

                                <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold text-[#c67c4e]">
                                    <span>Tổng cộng</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button className="rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-[#8b5e3c]">
                                Thêm vào giỏ hàng
                            </button>

                            <button
                                onClick={onClose}
                                className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
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
