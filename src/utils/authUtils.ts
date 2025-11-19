import { toast } from 'react-toastify'

/**
 * Manually trigger the authentication modal
 * @param defaultTab - Which tab to show by default ('login' or 'register')
 * @param message - Optional message to display
 */
export function requireAuth(defaultTab = 'login', message) {
  // Show toast notification
  toast.error(message || 'يجب تسجيل الدخول للمتابعة', {
    // Using react-toastify instead of sonner
  })
}

/**
 * Check if user is authenticated
 * @returns boolean indicating authentication status
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false
  
  // Check both localStorage and cookies for the token
  const token = localStorage.getItem('_OURBRIDE_AUTH_TOKEN') || 
                document.cookie.split('; ').find(row => row.startsWith('_OURBRIDE_AUTH_TOKEN='))?.split('=')[1]
  
  // Also check if user session exists in cookies
  const userSession = document.cookie.split('; ').find(row => row.startsWith('_OURBRIDE_AUTH_='))?.split('=')[1]
  
  return !!(token && userSession)
}

/**
 * Get the current auth token
 * @returns string | null - The current auth token or null if not authenticated
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null
  
  return localStorage.getItem('_OURBRIDE_AUTH_TOKEN') || 
         document.cookie.split('; ').find(row => row.startsWith('_OURBRIDE_AUTH_TOKEN='))?.split('=')[1] ||
         null
}

/**
 * Clear all authentication data
 */
export function clearAuthData() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('_OURBRIDE_AUTH_TOKEN')
  localStorage.removeItem('_OURBRIDE_AUTH_REFRESH_TOKEN')
  localStorage.removeItem('_OURBRIDE_AUTH_')
  localStorage.removeItem('guideProfileId')
  
  document.cookie = '_OURBRIDE_AUTH_TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = '_OURBRIDE_AUTH_REFRESH_TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = '_OURBRIDE_AUTH_=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

/**
 * Comprehensive logout function that clears all internal memory and tokens
 * This function should be called when user logs out to ensure complete cleanup
 */
export async function performCompleteLogout() {
  try {
    // Clear all auth-related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('OURBRIDE_AUTH') || key.includes('auth') || key.includes('token') || key.includes('guideProfileId'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Force page reload to clear any remaining memory
    setTimeout(() => {
      window.location.reload();
    }, 100);
    
  } catch (error) {
    // Even if there's an error, still reload the page
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}

export default {
  requireAuth,
  isAuthenticated,
  getAuthToken,
  clearAuthData,
  performCompleteLogout,
}



