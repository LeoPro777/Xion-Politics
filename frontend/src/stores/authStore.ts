import { create } from 'zustand';
import { AuthState, UserProfile } from '../types';

export const useAuthStore = create<AuthState>((set) => {
  const savedToken = localStorage.getItem('sigo_token');
  const savedUser = localStorage.getItem('sigo_user');

  return {
    token: savedToken,
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: Boolean(savedToken),

    setAuth: (token: string, user: UserProfile) => {
      localStorage.setItem('sigo_token', token);
      localStorage.setItem('sigo_user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('sigo_token');
      localStorage.removeItem('sigo_user');
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});
