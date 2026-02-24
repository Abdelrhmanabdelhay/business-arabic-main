// src/stores/useUserStore.ts
import { User } from '@/types/user.type'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'



interface UserState {
    user: User | null
    isAuthenticated: boolean
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
            isAuthenticated: false,
            token: null,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: true
                }),

            setToken: (token) =>
                set({
                    token,
                    isAuthenticated: !!token
                }),

            updateProfile: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null
                })),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)