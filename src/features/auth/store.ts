import { create } from 'zustand';
import { authApi } from '../../api/auth.js';

const TOKEN_KEY = 'task-tracker-token';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const useAuthStore = create<AuthState>((set) => {
  const token = getStoredToken();

  return {
    token,
    isAuthenticated: Boolean(token),
    isLoading: false,

    async login(email, password) {
      set({ isLoading: true });

      try {
        const response = await authApi.login({
          email,
          password,
        });

        localStorage.setItem(TOKEN_KEY, response.token);

        set({
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    async register(email, password) {
      set({ isLoading: true });

      try {
        const response = await authApi.register({
          email,
          password,
        });

        localStorage.setItem(TOKEN_KEY, response.token);

        set({
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    logout() {
      localStorage.removeItem(TOKEN_KEY);

      set({
        token: null,
        isAuthenticated: false,
      });
    },
  };
});
