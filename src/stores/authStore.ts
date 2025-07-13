import { create } from 'zustand'
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth'

interface AuthUser {
  userId: string
  email: string
  attributes: Record<string, string>
  groups?: string[]
}

interface AuthState {
  auth: {
    user: AuthUser | null
    isLoading: boolean
    isAuthenticated: boolean
    setUser: (user: AuthUser | null) => void
    setLoading: (loading: boolean) => void
    checkAuthStatus: () => Promise<void>
    logout: () => Promise<void>
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  auth: {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    setUser: (user) =>
      set((state) => ({ 
        ...state, 
        auth: { 
          ...state.auth, 
          user, 
          isAuthenticated: !!user 
        } 
      })),
    setLoading: (loading) =>
      set((state) => ({ 
        ...state, 
        auth: { 
          ...state.auth, 
          isLoading: loading 
        } 
      })),
    checkAuthStatus: async () => {
      try {
        set((state) => ({ ...state, auth: { ...state.auth, isLoading: true } }))
        
        const user = await getCurrentUser()
        const session = await fetchAuthSession()
        
        if (user && session.tokens?.accessToken) {
          const cognitoUser: AuthUser = {
            userId: user.userId,
            email: user.signInDetails?.loginId || '',
            attributes: user.attributes || {},
            groups: session.tokens.accessToken.payload['cognito:groups'] as string[] || []
          }
          
          get().auth.setUser(cognitoUser)
        } else {
          get().auth.setUser(null)
        }
      } catch (_error) {
        // Auth check failed - user not authenticated
        get().auth.setUser(null)
      } finally {
        set((state) => ({ ...state, auth: { ...state.auth, isLoading: false } }))
      }
    },
    logout: async () => {
      try {
        await signOut()
        get().auth.reset()
      } catch (_error) {
        // Logout failed - reset state anyway
        get().auth.reset()
      }
    },
    reset: () =>
      set((state) => ({
        ...state,
        auth: { 
          ...state.auth, 
          user: null, 
          isAuthenticated: false,
          isLoading: false
        },
      })),
  },
}))

// export const useAuth = () => useAuthStore((state) => state.auth)
