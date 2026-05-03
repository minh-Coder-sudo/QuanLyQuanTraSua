import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const Profile = ({ user, setUser }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: user?.avatar || '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            fullname: user?.fullname || '',
            email: user?.email || '',
            phone: user?.phone || '',
            avatar: user?.avatar || '',
            password: '',
        });
    }, [user]);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const updated = await authService.updateProfile(formData);
            setUser(updated);
            setIsEditing(false);
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            alert(error.message || 'Lỗi khi cập nhật thông tin!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            fullname: user?.fullname || '',
            email: user?.email || '',
            phone: user?.phone || '',
            avatar: user?.avatar || '',
            password: '',
        });
        setIsEditing(false);
    };

    const handleChooseAvatar = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn tệp hình ảnh hợp lệ.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = typeof reader.result === 'string' ? reader.result : '';
            if (result) {
                setFormData((prev) => ({ ...prev, avatar: result }));
            }
        };
        reader.readAsDataURL(file);
    };

    const getAvatarUrl = (avatar) => {
        if (!avatar) return '';
        if (avatar.startsWith('data:image') || avatar.startsWith('http://') || avatar.startsWith('https://')) {
            return avatar;
        }
        if (avatar.startsWith('/uploads')) {
            return `http://localhost:5000${avatar}`;
        }
        return avatar;
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    if (!user) return null;

    const previewAvatar = getAvatarUrl(formData.avatar || user.avatar);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden pt-24">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 transition-all hover:border-white/20">
                {/* Header Icon */}
                <div className="flex justify-center mb-8">
                    <div className="p-4 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                        <span className="text-3xl">☕</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-6 tracking-tight tracking-widest uppercase">
                    Hồ Sơ Cá Nhân
                </h2>

                {/* User Image Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        {previewAvatar ? (
                            <img
                                src={previewAvatar}
                                alt="avatar"
                                className="h-24 w-24 rounded-full object-cover border-4 border-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-300">
                                {getInitials(user.fullname)}
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <button
                                type="button"
                                onClick={handleChooseAvatar}
                                className="mt-3 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-xs font-bold tracking-wide hover:bg-white/20 transition"
                            >
                                CHỌN ẢNH AVATAR
                            </button>
                        </>
                    )}
                    <p className="mt-4 text-xl font-bold text-white">{user.fullname}</p>
                    <span
                        className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            user.role === 'ADMIN'
                                ? 'bg-amber-100 text-amber-700'
                                : user.role === 'EMPLOYEE'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                        {user.role === 'ADMIN'
                            ? 'Quản Lý Cửa Hàng'
                            : user.role === 'EMPLOYEE'
                              ? 'Nhân Viên Cửa Hàng'
                              : 'Thành Viên Vàng'}
                    </span>
                </div>

                {/* Info Grid */}
                <div className="space-y-4 mb-10">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Họ và tên</p>
                        {isEditing ? (
                            <input
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white outline-none focus:border-amber-500"
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                            />
                        ) : (
                            <p className="text-white font-medium">{user.fullname}</p>
                        )}
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                            Email đăng nhập
                        </p>
                        {isEditing ? (
                            <input
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white outline-none focus:border-amber-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        ) : (
                            <p className="text-white font-medium">{user.email}</p>
                        )}
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                            Số điện thoại
                        </p>
                        {isEditing ? (
                            <input
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white outline-none focus:border-amber-500"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Nhập số điện thoại"
                            />
                        ) : (
                            <p className="text-white font-medium">{user.phone || 'Chưa cập nhật'}</p>
                        )}
                    </div>

                    {isEditing && (
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                                Mật khẩu mới (Để trống nếu giữ nguyên)
                            </p>
                            <input
                                type="password"
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white outline-none focus:border-amber-500"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white font-bold text-sm hover:bg-white/20 transition"
                            >
                                HỦY
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setFormData({
                                    fullname: user?.fullname || '',
                                    email: user?.email || '',
                                    phone: user?.phone || '',
                                    avatar: user?.avatar || '',
                                    password: '',
                                });
                                setIsEditing(true);
                            }}
                            className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-bold text-sm hover:bg-white/20 transition active:scale-95 border-dashed"
                        >
                            CHỈNH SỬA HỒ SƠ
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        className="w-full py-4 bg-amber-500 hover:bg-amber-600 rounded-2xl text-white font-black text-sm transition active:scale-95 tracking-[4px] uppercase shadow-lg shadow-amber-500/20"
                    >
                        ĐĂNG XUẤT TÀI KHOẢN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
