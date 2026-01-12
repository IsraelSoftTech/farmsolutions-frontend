// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/api/auth/logout',
  
  // Products endpoints
  products: '/api/products',
  productById: (id) => `/api/products/${id}`,
  
  // Contact endpoints
  contact: '/api/contact',
  
  // Newsletter endpoints
  newsletter: '/api/newsletter',
  
  // Health check
  health: '/api/health',
};

// API helper function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data: data,
      error: !response.ok ? data.error || data.message : null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error.message || 'Network error',
    };
  }
};

// API object with common HTTP methods
export const api = {
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'GET',
    });
  },
  
  post: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  },
  
  put: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  },
  
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
  
  patch: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });
  },
};

export default api;
