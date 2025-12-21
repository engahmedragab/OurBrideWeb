// useAuth hook

import { useAuthContext } from '../context/AuthContext'

/**
 * Hook to access authentication state and methods
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, loginWithEmail, logout } = useAuth()
 * 
 * const handleLogin = async () => {
 *   try {
 *     await loginWithEmail({ email: 'user@example.com', password: 'password' })
 *     router.push('/dashboard')
 *   } catch (error) {
 *     console.error('Login failed:', error)
 *   }
 * }
 * ```
 */
export function useAuth() {
  return useAuthContext()
}
