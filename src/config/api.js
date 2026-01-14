// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_PREFIX = process.env.REACT_APP_API_PREFIX || '/api';

// Base API URL
const BASE_URL = `${API_URL}${API_PREFIX}`;

// API Endpoints
export const API_ENDPOINTS = {
  health: `${BASE_URL}/health`,
  contact: `${BASE_URL}/contact`,
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  logout: `${BASE_URL}/auth/logout`,
  products: `${BASE_URL}/products`,
  productById: (id) => `${BASE_URL}/products/${id}`,
  newsletter: `${BASE_URL}/newsletter`,
};

// API helper function
const api = {
  get: async (url, options = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('API GET Error:', error);
      return {
        ok: false,
        status: 0,
        data: { error: 'Network error. Please check your connection.' },
      };
    }
  },

  post: async (url, body, options = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });

      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('API POST Error:', error);
      return {
        ok: false,
        status: 0,
        data: { error: 'Network error. Please check your connection.' },
      };
    }
  },

  put: async (url, body, options = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });

      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('API PUT Error:', error);
      return {
        ok: false,
        status: 0,
        data: { error: 'Network error. Please check your connection.' },
      };
    }
  },

  delete: async (url, options = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('API DELETE Error:', error);
      return {
        ok: false,
        status: 0,
        data: { error: 'Network error. Please check your connection.' },
      };
    }
  },
};

export { api, BASE_URL, API_URL, API_PREFIX };
export default api;
