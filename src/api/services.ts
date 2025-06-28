import { api } from './instance';

// 用户相关 API
export const userApi = {
  // 获取用户信息
  getProfile: () => api.get('/user/profile'),
  
  // 更新用户信息
  updateProfile: (data: any) => api.put('/user/profile', data),
  
  // 修改密码
  changePassword: (data: any) => api.post('/user/change-password', data),
  
  // 获取用户列表
  getUsers: (params?: any) => api.get('/users', params),
  
  // 创建用户
  createUser: (data: any) => api.post('/users', data),
  
  // 更新用户
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// 商品相关 API
export const productApi = {
  // 获取商品列表
  getProducts: (params?: any) => api.get('/products', params),
  
  // 获取商品详情
  getProduct: (id: string) => api.get(`/products/${id}`),
  
  // 创建商品
  createProduct: (data: any) => api.post('/products', data),
  
  // 更新商品
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  
  // 删除商品
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  
  // 获取商品分类
  getCategories: () => api.get('/products/categories'),
  
  // 创建商品分类
  createCategory: (data: any) => api.post('/products/categories', data),
};

// 订单相关 API
export const orderApi = {
  // 获取订单列表
  getOrders: (params?: any) => api.get('/orders', params),
  
  // 获取订单详情
  getOrder: (id: string) => api.get(`/orders/${id}`),
  
  // 更新订单状态
  updateOrderStatus: (id: string, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
  
  // 获取订单统计
  getOrderStats: () => api.get('/orders/stats'),
};

// 客户相关 API
export const customerApi = {
  // 获取客户列表
  getCustomers: (params?: any) => api.get('/customers', params),
  
  // 获取客户详情
  getCustomer: (id: string) => api.get(`/customers/${id}`),
  
  // 创建客户
  createCustomer: (data: any) => api.post('/customers', data),
  
  // 更新客户信息
  updateCustomer: (id: string, data: any) => api.put(`/customers/${id}`, data),
  
  // 删除客户
  deleteCustomer: (id: string) => api.delete(`/customers/${id}`),
};

// 数据分析 API
export const analyticsApi = {
  // 获取销售统计
  getSalesStats: (params?: any) => api.get('/analytics/sales', params),
  
  // 获取用户统计
  getUserStats: (params?: any) => api.get('/analytics/users', params),
  
  // 获取商品统计
  getProductStats: (params?: any) => api.get('/analytics/products', params),
  
  // 获取订单统计
  getOrderStats: (params?: any) => api.get('/analytics/orders', params),
  
  // 获取仪表盘数据
  getDashboardData: () => api.get('/analytics/dashboard'),
};

// 系统设置 API
export const settingsApi = {
  // 获取系统设置
  getSettings: () => api.get('/settings'),
  
  // 更新系统设置
  updateSettings: (data: any) => api.put('/settings', data),
  
  // 获取系统日志
  getLogs: (params?: any) => api.get('/settings/logs', params),
  
  // 备份数据
  backupData: () => api.post('/settings/backup'),
  
  // 恢复数据
  restoreData: (data: any) => api.post('/settings/restore', data),
}; 