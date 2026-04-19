import { useLocation, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

export default function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const clearCart = useCartStore((state) => state.clearCart);

    const params = new URLSearchParams(location.search);
    const amount = params.get('amount');

    return (
        <div className='min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center px-4'>
            <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn'>
                {/* ICON */}
                <div className='text-6xl mb-4'></div>

                {/* TITLE */}
                <h1 className='text-3xl font-bold text-green-600 mb-3'>
                    Thanh toán thành công!
                </h1>

                {/* DESC */}
                <p className='text-gray-500 mb-6'>Cảm ơn bạn đã đặt hàng 💖</p>

                {/* AMOUNT */}
                <div className='bg-green-50 border border-green-200 rounded-xl p-4 mb-6'>
                    <p className='text-sm text-gray-500 mb-1'>
                        Số tiền thanh toán
                    </p>
                    <p className='text-2xl font-bold text-green-600'>
                        {Number(amount || 0).toLocaleString()}đ
                    </p>
                </div>

                {/* BUTTONS */}
                <div className='flex flex-col gap-3'>
                    <button
                        onClick={() => {
                            clearCart();
                            navigate('/');
                        }}
                        className='bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition shadow-md'
                    >
                        🏠 Về trang chủ
                    </button>

                    <button
                        onClick={() => navigate('/cart')}
                        className='bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition'
                    >
                        🛒 Xem lại giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
}
