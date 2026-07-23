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
      // Mock API call for UI preview
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = { id: '1', fullName: 'Test User', email };
      const mockToken = 'mock_token_123';
      
      localStorage.setItem('algoverse_token', mockToken);
      set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: 'Login failed. Please try again.', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call for UI preview
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = { id: '1', fullName: userData.fullName, email: userData.email };
      const mockToken = 'mock_token_123';
      
      localStorage.setItem('algoverse_token', mockToken);
      set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: 'Registration failed. Please try again.', 
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
      const { user } = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('algoverse_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
