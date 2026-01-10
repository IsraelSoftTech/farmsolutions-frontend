// API Configuration
// Support both old REACT_APP_API_VERSION and new REACT_APP_API_PREFIX
const getApiPrefix = () => {
  if (process.env.REACT_APP_API_PREFIX) {
    return process.env.REACT_APP_API_PREFIX;
  }
  // Backward compatibility: if API_VERSION is set, use it
  if (process.env.REACT_APP_API_VERSION) {
    return `/${process.env.REACT_APP_API_VERSION}`;
  }
  // Default to /api to match backend
  return '/api';
};

const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  apiPrefix: getApiPrefix(),
  timeout: 30000, // 30 seconds
};

// Construct full API URL
const getApiUrl = (endpoint = '') => {
  const baseUrl = API_CONFIG.baseURL.replace(/\/$/, ''); // Remove trailing slash
  const apiPrefix = API_CONFIG.apiPrefix;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // If endpoint already starts with /api, don't add it again
  if (path.startsWith('/api')) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}${apiPrefix}${path}`;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  health: '/api/health',
  
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/api/auth/logout',
  refreshToken: '/api/auth/refresh',
  
  // Products
  products: '/api/products',
  productById: (id) => `/api/products/${id}`,
  
  // Contact
  contact: '/api/contact',
  
  // Newsletter
  newsletter: '/api/newsletter',
  
  // File Upload
  upload: '/api/upload',
};

// API Helper Functions
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {},
    timeout: API_CONFIG.timeout,
  };

  // Only set Content-Type if not FormData and not already set
  if (!(options.body instanceof FormData) && !options.headers?.['Content-Type']) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }

  // Add authentication token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return {
        ok: response.ok,
        status: response.status,
        data: text,
      };
    }

    const data = await response.json();

    // If backend returns success: false, we should handle it as an error
    if (!response.ok || (data && data.success === false)) {
      const errorMessage = data?.error || data?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    // Re-throw with more context
    throw error;
  }
};

// Convenience methods
export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => {
    // Check if data is FormData
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body,
      headers: {
        ...options.headers,
        ...headers,
      },
    });
  },
  put: (endpoint, data, options = {}) => {
    // Check if data is FormData
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    
    return apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body,
      headers: {
        ...options.headers,
        ...headers,
      },
    });
  },
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
  patch: (endpoint, data, options = {}) => {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    
    return apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body,
      headers: {
        ...options.headers,
        ...headers,
      },
    });
  },
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  apiRequest,
  api,
  getApiUrl,
};
