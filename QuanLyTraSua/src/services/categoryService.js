import api from './api';

const categoryService = {
  // Lấy toàn bộ danh mục
  getCategories: async () => {
    return await api.get('/categories');
  },

  // Tạo danh mục mới (Admin)
  createCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  // Cập nhật danh mục (Admin)
  updateCategory: async (id, categoryData) => {
    return await api.put(`/categories/${id}`, categoryData);
  },

  // Xóa danh mục (Admin)
  deleteCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  }
};

export default categoryService;
