/**
 * Helper to get current guide profile ID
 * This is a utility function that can be used outside React components
 * For use inside components, prefer using useAuth hook directly
 */
export const getGuideProfileId = () => {
  // Try to get from localStorage (if stored after onboarding/status check)
  const stored = localStorage.getItem('guideProfileId');
  if (stored) {
    return parseInt(stored);
  }
  
  // Try to get from auth cookie/session
  if (typeof window !== 'undefined') {
    try {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('_OURBRIDE_AUTH_='))
        ?.split('=')[1];
      
      if (authCookie) {
        const authUser = JSON.parse(decodeURIComponent(authCookie));
        if (authUser.guideProfileId) {
          return parseInt(authUser.guideProfileId);
        }
      }
    } catch (error) {
      // Cookie parsing failed, continue to next method
    }
  }
  
  return null;
};

/**
 * Get user ID from auth
 * This is a utility function that can be used outside React components
 * For use inside components, prefer using useAuth hook directly
 */
export const getUserId = () => {
  if (typeof window !== 'undefined') {
    try {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('_OURBRIDE_AUTH_='))
        ?.split('=')[1];
      
      if (authCookie) {
        const authUser = JSON.parse(decodeURIComponent(authCookie));
        return authUser.id || authUser.userId || null;
      }
    } catch (error) {
      // Cookie parsing failed
    }
  }
  
  return null;
};

/**
 * React hook version - use this inside React components
 * Returns { guideProfileId, userId, isAuthenticated }
 */
export const useGuiderAuth = () => {
  // This will be used in components that import useAuth
  // For now, return a hook that can be used
  if (typeof window === 'undefined') {
    return { guideProfileId: null, userId: null, isAuthenticated: false };
  }
  
  try {
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('_OURBRIDE_AUTH_='))
      ?.split('=')[1];
    
    if (authCookie) {
      const authUser = JSON.parse(decodeURIComponent(authCookie));
      return {
        guideProfileId: authUser.guideProfileId ? parseInt(authUser.guideProfileId) : null,
        userId: authUser.id || authUser.userId || null,
        isAuthenticated: true,
        user: authUser,
      };
    }
  } catch (error) {
    // Cookie parsing failed
  }
  
  return { guideProfileId: null, userId: null, isAuthenticated: false };
};

export default {
  getGuideProfileId,
  getUserId,
  useGuiderAuth,
};

