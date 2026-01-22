// API Configuration for Farmers Solutions Frontend

// Production API URL - remote server
const PRODUCTION_API_URL = 'https://api.farmsolutionss.com/api';
// Development API URL - local server
const DEVELOPMENT_API_URL = 'http://localhost:5000/api';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check if explicit API URL is set via environment variable
  if (process.env.REACT_APP_API_URL) {
    const explicitUrl = process.env.REACT_APP_API_URL;
    // In production, ensure we never use localhost
    if (process.env.NODE_ENV === 'production' && explicitUrl.includes('localhost')) {
      console.warn('[API Config] WARNING: Localhost URL detected in production! Using production URL instead.');
      return PRODUCTION_API_URL;
    }
    return explicitUrl;
  }
  
  // In development, use local backend
  if (process.env.NODE_ENV === 'development') {
    return DEVELOPMENT_API_URL;
  }
  
  // In production, ALWAYS use the remote production API URL
  // This ensures production builds never accidentally use localhost
  return PRODUCTION_API_URL;
};

const API_BASE_URL = getApiBaseUrl();

// Debug: Log API base URL on module load
if (process.env.NODE_ENV === 'development') {
  console.log('[API Config] Development mode - Base URL:', API_BASE_URL);
} else {
  // In production, log once (won't show in console unless enabled)
  console.log('[API Config] Production mode - Base URL:', API_BASE_URL);
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
