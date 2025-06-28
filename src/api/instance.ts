// 简化的 API 封装，使用 fetch API
const API_BASE_URL = 'http://localhost:3000/api';

// 获取认证 token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// 创建请求头
const createHeaders = (customHeaders?: Record<string, string>) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  };
  
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// 处理响应
const handleResponse = async (response: Response) => {
  if (response.ok) {
    return response.json();
  }
  
  // 处理 401 未授权
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
};

// API 请求方法
export const api = {
  // GET 请求
  get: async (url: string, headers?: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: createHeaders(headers)
    });
    return handleResponse(response);
  },
  
  // POST 请求
  post: async (url: string, data?: any, headers?: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: createHeaders(headers),
      body: data ? JSON.stringify(data) : undefined
    });
    return handleResponse(response);
  },
  
  // PUT 请求
  put: async (url: string, data?: any, headers?: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: createHeaders(headers),
      body: data ? JSON.stringify(data) : undefined
    });
    return handleResponse(response);
  },
  
  // DELETE 请求
  delete: async (url: string, headers?: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: createHeaders(headers)
    });
    return handleResponse(response);
  },
  
  // PATCH 请求
  patch: async (url: string, data?: any, headers?: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: createHeaders(headers),
      body: data ? JSON.stringify(data) : undefined
    });
    return handleResponse(response);
  }
}; 