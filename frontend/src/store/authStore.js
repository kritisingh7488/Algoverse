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
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Server unavailable. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      set({ error: errorMessage, isLoading: false });
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
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Server unavailable. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  googleLogin: async (credential, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/google-login', userData);
      const payload = response.data?.data || response.data;
      const { user, token } = payload || {};
      
      if (!token) {
        throw new Error('Invalid Google authentication response from server.');
      }
      
      localStorage.setItem('algoverse_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      let errorMessage = 'Google login failed';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('algoverse_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/auth/me');
      const payload = response.data?.data || response.data;
      const user = payload?.user || payload;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('algoverse_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/user/profile', userData);
      const payload = response.data?.data || response.data;
      const user = payload?.user || payload;
      set({ user, isLoading: false });
      return { success: true };
    } catch (error) {
      let errorMessage = 'Failed to update profile.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  updatePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/user/password', passwordData);
      set({ isLoading: false });
      return { success: true, message: response.data?.message || 'Password updated' };
    } catch (error) {
      let errorMessage = 'Failed to update password.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
}));

// Listen for logout events from other tabs or from axios interceptor
window.addEventListener('auth:logout', () => {
  useAuthStore.getState().logout();
});

export default useAuthStore;
