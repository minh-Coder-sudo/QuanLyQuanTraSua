import api from './api';

const productService = {
  // Lấy toàn bộ sản phẩm (có hỗ trợ filter)
  getProducts: async (filters = {}) => {
    const { category, search } = filters;
    let url = '/products?';
    if (category) url += `category=${category}&`;
    if (search) url += `search=${search}`;
    
    return await api.get(url);
  },

  // Lấy chi tiết 1 sản phẩm
  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  // Tạo sản phẩm mới (Admin)
  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  // Cập nhật sản phẩm (Admin)
  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  // Xóa sản phẩm (Admin)
  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  }
};

export default productService;
