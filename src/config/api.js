// API Configuration for Farmers Solutions Frontend

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In development, use local backend
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }
  // In production, use the production API URL
  return process.env.REACT_APP_API_URL || 'https://api.farmsolutionss.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug: Log API base URL on module load (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('[API Config] Base URL:', API_BASE_URL);
}

// API Endpoints
export const API_ENDPOINTS = {
  // Health check
  health: '/health',
  
  // Authentication
  login: '/auth/login',
  logout: '/auth/logout',
  
  // Contact
  contact: '/contact',
  
  // Messages
  messages: '/messages',
  messagesUnreadCount: '/messages/unread-count',
  messageById: (id) => `/messages/${id}`,
  messageMarkRead: (id) => `/messages/${id}/read`,
  messageReply: (id) => `/messages/${id}/reply`,
};

// API Client with fetch
const api = {
  // Helper function to handle response
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        errorMessage = response.statusText || errorMessage;
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }
    
    if (contentType && contentType.includes('application/json')) {
      return {
        ok: true,
        data: await response.json(),
        status: response.status
      };
    }
    
    return {
      ok: true,
      data: await response.text(),
      status: response.status
    };
  },

  // GET request
  async get(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return this.handleResponse(response);
  },

  // POST request
  async post(endpoint, data = {}, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    };

    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, config);
      return this.handleResponse(response);
    } catch (error) {
      // Network errors (CORS, connection refused, etc.)
      console.error(`[API] POST ${url} failed:`, error);
      throw new Error(`Unable to connect to server. Please make sure the backend is running on ${API_BASE_URL}`);
    }
  },

  // PUT request
  async put(endpoint, data = {}, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return this.handleResponse(response);
  },

  // DELETE request
  async delete(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return this.handleResponse(response);
  },
};

export default api;
export { API_BASE_URL };
