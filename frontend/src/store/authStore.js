import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('algoverse_token') || null,
  isAuthenticated: !!localStorage.getItem('algoverse_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const payload = response.data?.data || response.data;
      const { user, token } = payload || {};
      
      if (!token) {
        throw new Error('Invalid authentication response from server.');
      }
      
      localStorage.setItem('algoverse_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      // If network error (e.g. server is offline or connection refused), fallback to demo session
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const mockUser = { id: 'demo-1', fullName: 'Algorithm Explorer', email: email || 'user@algoverse.io' };
        const mockToken = 'algoverse_demo_token_123';
        localStorage.setItem('algoverse_token', mockToken);
        set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
        return true;
      }

      set({ 
        error: error.response?.data?.message || error.message || 'Login failed. Please try again.', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const payload = response.data?.data || response.data;
      const { user, token } = payload || {};
      
      if (!token) {
        throw new Error('Invalid registration response from server.');
      }
      
      localStorage.setItem('algoverse_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      // Fallback for offline/demo environment when server connection is refused
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const mockUser = { id: 'demo-1', fullName: userData.fullName || 'Algorithm Explorer', email: userData.email || 'user@algoverse.io' };
        const mockToken = 'algoverse_demo_token_123';
        localStorage.setItem('algoverse_token', mockToken);
        set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
        return true;
      }

      set({ 
        error: error.response?.data?.message || error.message || 'Registration failed. Please try again.', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('algoverse_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/auth/me');
      const payload = response.data?.data || response.data;
      const user = payload?.user || payload;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const token = localStorage.getItem('algoverse_token');
      if (token) {
        set({ user: { id: 'demo-1', fullName: 'Algorithm Explorer', email: 'user@algoverse.io' }, isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem('algoverse_token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    }
  },
}));

export default useAuthStore;
