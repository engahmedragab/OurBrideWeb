'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { getGoogleClientId } from '@/auth/utils/oauth'

interface Props {
  children: React.ReactNode
}

/**
 * Google OAuth Provider wrapper
 * Provides Google OAuth context to child components
 */
export function GoogleOAuthProviderWrapper({ children }: Props) {
  const clientId = getGoogleClientId()

  if (!clientId) {
    console.warn('Google Client ID is not configured. Google login will not work.')
    return <>{children}</>
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
}
