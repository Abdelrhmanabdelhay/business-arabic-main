// src/stores/useUserStore.ts
import { User } from '@/types/user.type'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'



interface UserState {
    user: User | null
    isAuthenticated: boolean
    token: string | null
    hasHydrated: boolean // 👈 مهم جدا
    // Actions
    setUser: (user: User) => void
    setToken: (token: string) => void
    updateProfile: (updates: Partial<User>) => void
    logout: () => void
        setHasHydrated: (state: boolean) => void

}

let isLoggingOut = false

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,
            hasHydrated: false,

                setUser: (user) =>
                    set((state) => ({
                        user,
                        isAuthenticated: !!state.token
                    })),

            setToken: (token) =>
                set({
                    token,
                    isAuthenticated: !!token
                }),

            updateProfile: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null
                })),

                logout: () => {
                    isLoggingOut = true
                    useUserStore.persist.clearStorage()
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false
                    })
                },
            setHasHydrated: (state) =>
                set({ hasHydrated: state }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),

onRehydrateStorage: () => (state) => {
    if (state) {
        state.setHasHydrated(true)
    }
},
partialize: (state) => {
    if (isLoggingOut) return {} as any 
    return {
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
    }
}
        }
    )
)