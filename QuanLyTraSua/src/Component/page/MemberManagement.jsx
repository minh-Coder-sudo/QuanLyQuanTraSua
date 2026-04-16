import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import '../../css/Product.css'; // Reusing some table styles if available, or I'll define custom ones

function MemberManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thành viên:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Bạn có chắc muốn đổi quyền của người dùng này sang ${newRole}?`)) return;

        setUpdating(true);
        try {
            await userService.updateUserRole(userId, newRole);
            setMessage(`Cập nhật thành công vai trò thành ${newRole}`);
            fetchUsers(); // Refresh the list
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert('Lỗi khi cập nhật quyền hạn');
        } finally {
            setUpdating(false);
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200';
            case 'EMPLOYEE': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
                        Quản lý thành viên
                    </h1>
                    <p className="text-slate-500 font-medium">Điều chỉnh quyền hạn người dùng hệ thống</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-500 text-white rounded-2xl shadow-lg animate-bounce flex justify-between items-center">
                        <span className="font-bold">{message}</span>
                        <button onClick={() => setMessage('')}>✕</button>
                    </div>
                )}

                <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                    {loading ? (
                        <div className="p-24 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Thành viên</th>
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Email</th>
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Vai trò</th>
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-orange-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xl">
                                                        {u.fullname?.charAt(0) || u.username?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{u.fullname}</p>
                                                        <p className="text-sm text-slate-400">@{u.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-slate-600 font-medium">{u.email}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest ${getRoleBadgeClass(u.role)}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    disabled={updating}
                                                    className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-orange-500 transition-all cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="CLIENT">Khách hàng</option>
                                                    <option value="EMPLOYEE">Nhân viên</option>
                                                    <option value="ADMIN">Quản trị viên</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MemberManagement;
