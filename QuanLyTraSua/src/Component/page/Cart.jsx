import { useState } from 'react';
import useCartStore from '../../store/cartStore';
import api from '../../services/api';
import CheckoutModal from '../../Component/page/CheckoutModal';

export default function Cart() {
    const { cart, removeFromCart, clearCart } = useCartStore();

    const [showModal, setShowModal] = useState(false);
    const [paymentType, setPaymentType] = useState(null);

    // 🔥 TOTAL CHUẨN
    const total = cart.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.qty || 1);
    }, 0);

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-28 pb-10'>
            <div className='max-w-4xl mx-auto bg-white/90 backdrop-blur p-6 rounded-3xl shadow-2xl border border-gray-100'>
                {/* TITLE */}
                <h1 className='text-3xl font-bold mb-6 text-orange-500 flex items-center gap-2'>
                    🛒 Giỏ hàng của bạn
                </h1>

                {/* EMPTY */}
                {cart.length === 0 && (
                    <p className='text-gray-400 text-center py-10'>
                        Chưa có sản phẩm
                    </p>
                )}

                {/* LIST */}
                <div className='space-y-4'>
                    {cart.map((item, idx) => {
                        const price = item.price || 0;
                        const qty = item.qty || 1;

                        return (
                            <div
                                key={`${item._id}-${idx}`}
                                className='flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-xl transition-all duration-300 border'
                            >
                                {/* LEFT */}
                                <div className='flex items-center gap-4 w-1/2'>
                                    <img
                                        src={
                                            item.image
                                                ? item.image.startsWith('http')
                                                    ? item.image
                                                    : `http://localhost:5000${item.image}`
                                                : 'https://via.placeholder.com/80'
                                        }
                                        alt={item.name}
                                        className='w-16 h-16 object-cover rounded-xl border'
                                    />

                                    <div>
                                        <p className='font-semibold text-lg text-gray-800'>
                                            {item.name}
                                        </p>

                                        {/* SIZE */}
                                        <p className='text-sm text-gray-500'>
                                            Size:{' '}
                                            {item.size?.label || 'Mặc định'}
                                        </p>

                                        {/* TOPPING */}
                                        <p className='text-sm text-gray-500'>
                                            {item.toppings?.length > 0
                                                ? item.toppings
                                                      .map((t) => t.name)
                                                      .join(', ')
                                                : 'Không topping'}
                                        </p>
                                    </div>
                                </div>

                                {/* PRICE */}
                                <div className='text-right'>
                                    <p className='text-sm text-gray-500'>
                                        {qty} x {price.toLocaleString()}đ
                                    </p>
                                    <p className='font-bold text-orange-500 text-lg'>
                                        {(price * qty).toLocaleString()}đ
                                    </p>
                                </div>

                                {/* DELETE */}
                                <button
                                    onClick={() => removeFromCart(idx)}
                                    className='text-red-400 hover:text-red-600 text-xl transition'
                                >
                                    ✖
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* TOTAL */}
                {cart.length > 0 && (
                    <>
                        <div className='flex justify-between items-center mt-8 pt-6 border-t border-gray-200'>
                            <h2 className='text-xl font-semibold text-gray-700'>
                                Tổng tiền
                            </h2>

                            <span className='text-2xl font-bold text-orange-500'>
                                {total.toLocaleString()}đ
                            </span>
                        </div>

                        {/* BUTTON */}
                        <div className='flex gap-4 mt-6'>
                            {/* COD */}
                            <button
                                onClick={() => {
                                    setPaymentType('COD');
                                    setShowModal(true);
                                }}
                                className='flex-1 bg-gray-900 text-white py-3 rounded-2xl hover:scale-105 hover:bg-black transition-all duration-200 shadow-md'
                            >
                                🚚 Thanh toán khi nhận hàng
                            </button>

                            {/* PAYOS */}
                            <button
                                onClick={() => {
                                    setPaymentType('PAYOS');
                                    setShowModal(true);
                                }}
                                className='flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-2xl hover:scale-105 transition-all duration-200 shadow-lg'
                            >
                                🚚 Thanh toán QR PayOS
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <CheckoutModal
                    onClose={() => setShowModal(false)}
                    onSubmit={async (address) => {
                        if (!address) return alert('Chọn địa chỉ');

                        try {
                            // ================= COD =================
                            if (paymentType === 'COD') {
                                await api.post('/payment/checkout', {
                                    cart, // 🔥 FULL DATA
                                    address,
                                    user: JSON.parse(localStorage.getItem('user'))?._id // 🔥 THÊM ID USER
                                });

                                alert('✅ Đặt hàng COD thành công');
                                clearCart();
                                setShowModal(false);
                            }

                            // ================= PAYOS =================
                            if (paymentType === 'PAYOS') {
                                const res = await api.post('/payment/payos', {
                                    cart,
                                    user: JSON.parse(localStorage.getItem('user'))?._id, // 🔥 THÊM ID USER
                                    address: {
                                        name: address.name || 'Test',
                                        phone: address.phone || '0123456789',
                                        address: address.address || 'Trà Vinh' // 🔥 FIX CHÍNH
                                    }
                                });

                                window.location.href = res.checkoutUrl;
                            }
                        } catch (err) {
                            console.error('❌ CHECKOUT ERROR:', err);
                            alert('❌ Có lỗi xảy ra!');
                        }
                    }}
                />
            )}
        </div>
    );
}
