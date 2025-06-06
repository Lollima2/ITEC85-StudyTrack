import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  signup: (userData: { name: string; email: string }) => void;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

// Mock user IDs generator
const generateId = () => Math.random().toString(36).substring(2, 15);

// Create the auth store with persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },
      
      signup: (userData: { name: string; email: string }) => {
        const newUser: User = {
          id: generateId(),
          name: userData.name,
          email: userData.email,
          createdAt: new Date(),
        };
        set({ user: newUser, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;