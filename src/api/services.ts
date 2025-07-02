import axios from './instance';

// 用户相关 API
export const userApi = {
  // 获取用户信息
  getProfile: () => axios.get('/user/profile'),
  
  // 更新用户信息
  updateProfile: (data: any) => axios.put('/user/profile', data),
  
  // 修改密码
  changePassword: (data: any) => axios.post('/user/change-password', data),
  
  // 获取用户列表
  getUsers: (params?: any) => axios.get('/api/user', { params }),
  
  // 创建用户
  createUser: (data: any) => axios.post('/users', data),
  
  // 更新用户
  updateUser: (id: string, data: any) => axios.put(`/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id: string) => axios.delete(`/users/${id}`),

  // 登录
  login: (data:any) => axios.post('/api/login', data)
};

// 商品相关 API
export const productApi = {
  // 获取商品列表
  getProducts: (params?: any) => axios.get('/api/product/get', { params }),
  
  // 获取商品详情
  getProduct: (id: string) => axios.get(`/api/product/get/${id}`),
  
  // 创建商品
  createProduct: (data: any) => axios.post('/api/product/create', data),
  
  // 更新商品
  updateProduct: (id: string, data: any) => axios.post(`/api/product/update/${id}`, data),
  
  // 删除商品
  deleteProduct: (id: string) => axios.delete(`/api/product/delete/${id}`),
  
  // 获取商品分类
  getCategories: () => axios.get('/api/category/get'),
  
  // 创建商品分类
  createCategory: (data: any) => axios.post('/api/category/create', data),
};

// 订单相关 API
export const orderApi = {
  // 获取订单列表
  getOrders: (params?: any) => axios.get('/orders', { params }),
  
  // 获取订单详情
  getOrder: (id: string) => axios.get(`/orders/${id}`),
  
  // 更新订单状态
  updateOrderStatus: (id: string, status: string) => 
    axios.patch(`/orders/${id}/status`, { status }),
  
  // 获取订单统计
  getOrderStats: () => axios.get('/orders/stats'),
};

// 客户相关 API
export const customerApi = {
  // 获取客户列表
  getCustomers: (params?: any) => axios.get('/customers', { params }),
  
  // 获取客户详情
  getCustomer: (id: string) => axios.get(`/customers/${id}`),
  
  // 创建客户
  createCustomer: (data: any) => axios.post('/customers', data),
  
  // 更新客户信息
  updateCustomer: (id: string, data: any) => axios.put(`/customers/${id}`, data),
  
  // 删除客户
  deleteCustomer: (id: string) => axios.delete(`/customers/${id}`),
};

// 数据分析 API
export const analyticsApi = {
  // 获取销售统计
  getSalesStats: (params?: any) => axios.get('/analytics/sales', { params }),
  
  // 获取用户统计
  getUserStats: (params?: any) => axios.get('/analytics/users', { params }),
  
  // 获取商品统计
  getProductStats: (params?: any) => axios.get('/analytics/products', { params }),
  
  // 获取订单统计
  getOrderStats: (params?: any) => axios.get('/analytics/orders', { params }),
  
  // 获取仪表盘数据
  getDashboardData: () => axios.get('/analytics/dashboard'),
};

// 系统设置 API
export const settingsApi = {
  // 获取系统设置
  getSettings: () => axios.get('/settings'),
  
  // 更新系统设置
  updateSettings: (data: any) => axios.put('/settings', data),
  
  // 获取系统日志
  getLogs: (params?: any) => axios.get('/settings/logs', { params }),
  
  // 备份数据
  backupData: () => axios.post('/settings/backup'),
  
  // 恢复数据
  restoreData: (data: any) => axios.post('/settings/restore', data),
}; 

export const bannerApi = {
  // 获取横幅列表
  getBanners: (params?: any) => axios.get('/banners', { params }),
  // 創建横幅
  createBanner: (data: any) => axios.post('/banners', data),
  // 更新横幅
  updateBanner: (id: string, data: any) => axios.put(`/banners/${id}`, data),
  // 删除横幅
  deleteBanner: (id: string) => axios.delete(`/banners/${id}`),
  // 获取横幅详情
  getBanner: (id: string) => axios.get(`/banners/${id}`),
}