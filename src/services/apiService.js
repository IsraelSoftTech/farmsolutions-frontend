import { api, API_ENDPOINTS } from '../config/api';

// Auth Service
export const authService = {
  login: async (username, password) => {
    const response = await api.post(API_ENDPOINTS.login, { username, password });
    if (response.ok && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.register, userData);
    if (response.ok && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Products Service
export const productsService = {
  getAll: async () => {
    return await api.get(API_ENDPOINTS.products);
  },

  getById: async (id) => {
    return await api.get(API_ENDPOINTS.productById(id));
  },

  create: async (productData) => {
    return await api.post(API_ENDPOINTS.products, productData);
  },

  update: async (id, productData) => {
    return await api.put(API_ENDPOINTS.productById(id), productData);
  },

  delete: async (id) => {
    return await api.delete(API_ENDPOINTS.productById(id));
  },
};

// Contact Service
export const contactService = {
  sendMessage: async (contactData) => {
    return await api.post(API_ENDPOINTS.contact, contactData);
  },
};

// Newsletter Service
export const newsletterService = {
  subscribe: async (email) => {
    return await api.post(API_ENDPOINTS.newsletter, { email });
  },
};

// Health Check Service
export const healthService = {
  check: async () => {
    return await api.get(API_ENDPOINTS.health);
  },
};

export default {
  authService,
  productsService,
  contactService,
  newsletterService,
  healthService,
};
