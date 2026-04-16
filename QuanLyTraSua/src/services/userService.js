import api from './api';

const userService = {
    // Lấy toàn bộ người dùng (Admin chỉ định)
    getUsers: async () => {
        return await api.get('/users');
    },

    // Cập nhật quyền hạn cho người dùng
    updateUserRole: async (id, role) => {
        return await api.put(`/users/${id}/role`, { role });
    }
};

export default userService;
