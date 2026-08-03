import axios from 'axios';

// Try to use VITE_API_URL first, then VITE_BACKEND_URL (appending /api/v1 if needed), then fallback to localhost
const apiBase = import.meta.env.VITE_API_URL || 
  (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1` : 'http://localhost:5000/api/v1');

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

// Request Interceptor: Add Bearer token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('algoverse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('algoverse_token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
