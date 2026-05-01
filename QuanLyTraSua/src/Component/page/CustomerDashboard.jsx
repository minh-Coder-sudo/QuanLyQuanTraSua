import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import authService from '../../services/auth';

export default function CustomerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        completedOrders: 0,
    });
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrders();
            // Filter orders for current user
            const userOrders = data.filter((order) => order.user && order.user._id === currentUser?._id);

            setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

            // Calculate stats
            const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
            const pendingOrders = userOrders.filter((o) => o.status === 'PENDING').length;
            const completedOrders = userOrders.filter((o) => o.status === 'COMPLETED').length;

            setStats({
                totalOrders: userOrders.length,
                totalSpent,
                pendingOrders,
                completedOrders,
            });
        } catch (error) {
            console.error('L\u1ed7i t\u1ea3i \u0111\u01a1n h\u00e0ng:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Ch\u1edd x\u1eed l\u00fd' },
            COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ho\u00e0n th\u00e0nh' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: '\u0110\u00e3 h\u1ee7y' },
            PAID: { bg: 'bg-blue-100', text: 'text-blue-800', label: '\u0110\u00e3 thanh to\u00e1n' },
            COD: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'COD' },
        };
        const config = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-400 animate-pulse">\u0110ang t\u1ea3i d\u1eef li\u1ec7u...</div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">\u1ee8ng d\u1ee5ng c\u1ees nh\u00e2n</h1>
                <p className="text-gray-600">
                    Xin ch\u00e0o, {currentUser?.fullname || 'Kh\u00e1ch h\u00e0ng'}! \u0110\u00e2y l\u00e0 th\u00f4ng
                    tin ch\u1ee7 y\u1ebfu c\u1ee7a b\u1ea1n.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="\u0110\u01a1n h\u00e0ng" value={stats.totalOrders} icon="📦" color="bg-blue-500" />
                <StatCard
                    title="T\u1ed5ng chi ti\u00eau"
                    value={`${stats.totalSpent.toLocaleString()}đ`}
                    icon="💰"
                    color="bg-green-500"
                />
                <StatCard
                    title="Ch\u1edd x\u1eed l\u00fd"
                    value={stats.pendingOrders}
                    icon="⏳"
                    color="bg-yellow-500"
                />
                <StatCard title="Ho\u00e0n th\u00e0nh" value={stats.completedOrders} icon="✅" color="bg-emerald-500" />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        📋 L\u1ecbch s\u1eed \u0111\u01a1n h\u00e0ng
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    {orders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <span className="text-4xl block mb-2">🛍️</span>
                            <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                        Mã đơn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                        Ngày
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                        Số lượng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                        Tổng cộng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                        Phương thức
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-800">
                                            #{order.orderCode || order._id?.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                            {order.items?.length || 0} sản phẩm
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-amber-600">
                                            {(order.totalPrice || 0).toLocaleString()}đ
                                        </td>
                                        <td className="px-6 py-4 text-sm">{getStatusBadge(order.status)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.paymentMethod === 'CASH'
                                                ? 'Tiền mặt'
                                                : order.paymentMethod === 'PAYOS'
                                                  ? 'PayOS'
                                                  : 'COD'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Recent Order Details */}
            {orders.length > 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {orders.slice(0, 2).map((order) => (
                        <div key={order._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">
                                    Đơn hàng #{order.orderCode || order._id?.slice(-6)}
                                </h3>
                                {getStatusBadge(order.status)}
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>
                                    <strong>Ngày:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}
                                </p>
                                <p>
                                    <strong>Địa chỉ:</strong> {order.address?.address || 'N/A'}
                                </p>
                                <p>
                                    <strong>Phương thức:</strong> {order.paymentMethod || 'COD'}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="font-bold text-amber-600">
                                        Tổng: {(order.totalPrice || 0).toLocaleString()}đ
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div
            className={`${color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
                <div className="text-4xl opacity-80">{icon}</div>
            </div>
        </div>
    );
}
