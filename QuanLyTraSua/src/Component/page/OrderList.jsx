import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [updating, setUpdating] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Lỗi tải đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await orderService.updateStatus(orderId, newStatus);
            alert('✅ Cập nhật trạng thái thành công');
            fetchOrders();
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            alert('❌ Lỗi cập nhật trạng thái');
        } finally {
            setUpdating(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

    const statusMap = {
        COMPLETED: { label: 'Đã hoàn thành', class: 'bg-emerald-100 text-emerald-700 border border-emerald-300' },
        PENDING: { label: 'Đang xử lý', class: 'bg-amber-100 text-amber-700 border border-amber-300' },
        CANCELLED: { label: 'Đã hủy', class: 'bg-red-100 text-red-700 border border-red-300' },
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-800 text-lg">Lịch sử đơn hàng</h2>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                    <option value="PENDING">Đang xử lý</option>
                    <option value="CANCELLED">Đã hủy</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="px-6 py-4">Mã đơn</th>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4">Chi tiết món</th>
                                <th className="px-6 py-4">Tổng tiền</th>
                                <th className="px-6 py-4">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20 text-gray-400 animate-pulse">
                                        Đang tải lịch sử...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20 text-gray-400">
                                        Chưa có đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition capitalize">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                            #{order._id.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            <br />
                                            <span className="text-[10px] text-gray-400 cursor-default opacity-60">
                                                {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="space-y-1">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="text-xs">
                                                        <span className="font-bold text-gray-800">
                                                            {item.quantity || 1}x
                                                        </span>{' '}
                                                        {item.name}
                                                        <span className="text-gray-400">
                                                            {' '}
                                                            ({item.selectedSize?.code || item.size?.code || 'M'})
                                                        </span>
                                                    </div>
                                                )) || <span className="text-gray-400 text-xs">Không có chi tiết</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-amber-600">
                                            {(order.total || order.totalPrice || 0).toLocaleString()}đ
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                                        statusMap[order.status]?.class
                                                    }`}
                                                >
                                                    {statusMap[order.status]?.label}
                                                </span>

                                                {order.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'COMPLETED')}
                                                        disabled={updating === order._id}
                                                        className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50 transition"
                                                    >
                                                        {updating === order._id ? '...' : '✓'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
