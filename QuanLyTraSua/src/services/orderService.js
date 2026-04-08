import api from './api';

const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default orderService;
