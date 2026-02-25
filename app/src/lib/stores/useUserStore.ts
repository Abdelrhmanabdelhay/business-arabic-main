// src/stores/useUserStore.ts
import { User } from '@/types/user.type'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'



interface UserState {
    user: User | null
    token: string | null
    // Actions
    setUser: (user: User) => void
    setToken: (token: string) => void
    updateProfile: (updates: Partial<User>) => void
    logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) =>
        set({ user }),

      setToken: (token) =>
        set({ token }),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),

      logout: () =>
        set({
          user: null,
          token: null
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)