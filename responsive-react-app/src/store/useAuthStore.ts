import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  role: string | null;
  setAuth: (token: string, email: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      email: null,
      role: null,
      setAuth: (accessToken, email, role) => {
        localStorage.setItem('accessToken', accessToken);
        set({ accessToken, email, role });
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        set({ accessToken: null, email: null, role: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
