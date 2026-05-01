import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                // Lấy User từ localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) return;

                const res = await api.get(`/orders/my-orders/${user._id}`);
                setOrders(res);
            } catch (error) {
                console.error('Lỗi tải đơn hàng cá nhân:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    const statusMap = {
        'COMPLETED': { label: 'Thành công', class: 'bg-emerald-100 text-emerald-700' },
        'PAID': { label: 'Đã thanh toán', class: 'bg-blue-100 text-blue-700' },
        'PENDING': { label: 'Chờ xử lý', class: 'bg-amber-100 text-amber-700' },
        'COD': { label: 'Giao hàng (COD)', class: 'bg-purple-100 text-purple-700' },
        'CANCELLED': { label: 'Đã hủy', class: 'bg-red-100 text-red-700' }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h1>
                        <p className="text-gray-500 text-sm">Theo dõi trạng thái các đơn hàng bạn đã đặt</p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl p-20 text-center shadow-sm">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-4"></div>
                        <p className="text-gray-400">Đang tải lịch sử đơn hàng...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-20 text-center shadow-sm">
                        <div className="text-6xl mb-4">🧾</div>
                        <p className="text-gray-400">Bạn chưa có đơn hàng nào.</p>
                        <a href="/menu" className="mt-4 inline-block text-amber-600 font-bold hover:underline">Đặt món ngay!</a>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-xl">
                                                ☕
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Mã đơn hàng</p>
                                                <p className="font-mono text-sm text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusMap[order.status]?.class || 'bg-gray-100'}`}>
                                                {statusMap[order.status]?.label || order.status}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-2">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-amber-600 border border-gray-100">
                                                        {item.qty || item.quantity}x
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                        <p className="text-[10px] text-gray-400">Size: {item.size?.code || item.selectedSize?.code || 'M'}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">
                                                    {((item.price || item.priceAtPurchase || 0) * (item.qty || item.quantity)).toLocaleString()}đ
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-400">Hình thức thanh toán</p>
                                            <p className="text-sm font-medium text-gray-700">
                                                {order.paymentMethod === 'PAYOS' ? '💳 QR Code (PayOS)' : '💸 Tiền mặt (COD)'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Tổng thanh toán</p>
                                            <p className="text-xl font-black text-amber-600">
                                                {(order.total || order.totalPrice || 0).toLocaleString()}đ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
