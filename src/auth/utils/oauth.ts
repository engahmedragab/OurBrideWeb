/**
 * OAuth utility functions for Google and Facebook authentication
 */

// OAuth configuration
export const getGoogleClientId = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
}

export const getFacebookAppId = (): string => {
  return process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ''
}

/**
 * Initialize Facebook SDK
 */
export const initFacebookSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Facebook SDK can only be initialized in browser'))
      return
    }

    // Check if SDK is already loaded
    if (window.FB) {
      resolve()
      return
    }

    const appId = getFacebookAppId()
    if (!appId) {
      reject(new Error('Facebook App ID is not configured'))
      return
    }

    // Load Facebook SDK script
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      window.FB?.init({
        appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
      })
      resolve()
    }

    script.onerror = () => {
      reject(new Error('Failed to load Facebook SDK'))
    }

    document.head.appendChild(script)
  })
}

/**
 * Get Facebook login status and access token
 */
export const getFacebookLoginStatus = (): Promise<{
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse?: {
    accessToken: string
    userID: string
    expiresIn: number
  }
}> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.FB) {
      reject(new Error('Facebook SDK not initialized'))
      return
    }

    window.FB.getLoginStatus((response: fb.StatusResponse) => {
      if (response.status === 'connected' && response.authResponse) {
        resolve({
          status: 'connected',
          authResponse: {
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID,
            expiresIn: response.authResponse.expiresIn || 0,
          },
        })
      } else {
        resolve({
          status: response.status === 'not_authorized' ? 'not_authorized' : 'unknown',
        })
      }
    })
  })
}

/**
 * Login with Facebook
 */
export const loginWithFacebook = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.FB) {
      reject(new Error('Facebook SDK not initialized'))
      return
    }

    window.FB.login(
      (response: fb.StatusResponse) => {
        if (response.status === 'connected' && response.authResponse?.accessToken) {
          resolve(response.authResponse.accessToken)
        } else {
          reject(new Error('Facebook login failed or was cancelled'))
        }
      },
      { scope: 'email,public_profile' }
    )
  })
}

/**
 * Logout from Facebook
 */
export const logoutFromFacebook = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.FB) {
      reject(new Error('Facebook SDK not initialized'))
      return
    }

    window.FB.logout((response: fb.StatusResponse) => {
      resolve()
    })
  })
}

// Extend Window interface for Facebook SDK
declare global {
  interface Window {
    FB?: {
      init: (config: {
        appId: string
        cookie?: boolean
        xfbml?: boolean
        version: string
      }) => void
      getLoginStatus: (callback: (response: fb.StatusResponse) => void) => void
      login: (
        callback: (response: fb.StatusResponse) => void,
        options?: { scope?: string }
      ) => void
      logout: (callback: (response: fb.StatusResponse) => void) => void
    }
  }

  namespace fb {
    interface StatusResponse {
      status: 'connected' | 'not_authorized' | 'unknown'
      authResponse?: {
        accessToken: string
        userID: string
        expiresIn?: number
      }
    }
  }
}
