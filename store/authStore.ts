import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loginWithProvider: (provider: 'google' | 'apple') => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          if (email === "user@example.com" && password === "password") {
            const user: User = {
              id: 'user1',
              email,
              displayName: 'Demo User',
              createdAt: new Date().toISOString(),
            };
            set({ user, isLoading: false });
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Login failed", isLoading: false });
        }
      },

      register: async (email, password, displayName) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: 'user' + Date.now(),
            email,
            displayName,
            createdAt: new Date().toISOString(),
          };
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Registration failed", isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, error: null });
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Password reset failed", isLoading: false });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Profile update failed", isLoading: false });
        }
      },

      loginWithProvider: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: `${provider}_user_${Date.now()}`,
            email: `${provider}user@example.com`,
            displayName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
            photoURL: 'https://ui-avatars.com/api/?name=User&background=random',
            createdAt: new Date().toISOString(),
          };
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : `${provider} login failed`, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
