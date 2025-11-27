/**
 * Auth Store
 * 
 * Zustand store for authentication state management.
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 * ```
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string | number;
  email?: string;
  name?: string;
  // Add other user properties
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);

