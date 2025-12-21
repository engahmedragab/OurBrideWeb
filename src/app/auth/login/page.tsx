'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  AuthTabs,
  AuthDivider,
  LoginForm,
  WelcomeHeader,
} from '@/components/ui/auth/index'
import { SocialMediaButton } from '@/components/ui/SocialMediaButton'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { DownloadApp } from '@/components/common'
import { useAuth } from '@/auth'
import type { ExternalProvidersType } from '@/../client/common/api/gen/ourbride-api'

/**
 * Login Page with authentication integration
 */
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithEmail, loginWithExternalProvider, isLoading, error, clearError } = useAuth()
  const [loginCredentials, setLoginCredentials] = useState<{
    email: string
    password: string
  }>({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)

  const handleEmailChange = useCallback((email: string) => {
    setLoginCredentials(prev => ({ ...prev, email }))
    if (error) clearError()
  }, [error, clearError])

  const handlePasswordChange = useCallback((password: string) => {
    setLoginCredentials(prev => ({ ...prev, password }))
    if (error) clearError()
  }, [error, clearError])

  const handleLogin = useCallback(async () => {
    try {
      clearError()
      await loginWithEmail({
        email: loginCredentials.email,
        password: loginCredentials.password,
      })
      
      // Check if preferences are initialized after successful login
      const { isPreferenceInit } = await import('@/auth/utils/token')
      const preferencesInitialized = isPreferenceInit()
      
      // Get redirect URL from query params or default based on preferences
      let redirectUrl = searchParams.get('redirect') || '/dashboard'
      
      // If preferences are not initialized, redirect to planning preferences
      // (unless user was trying to access a specific page - then let dashboard layout handle it)
      if (!preferencesInitialized) {
        redirectUrl = '/auth/planning-preferences'
      }
      
      // Redirect to the original page, planning preferences, or dashboard
      router.push(redirectUrl)
    } catch (err) {
      // Error is handled by auth context
      console.error('Login failed:', err)
    }
  }, [loginCredentials, loginWithEmail, router, clearError])

  const handleSocialLogin = useCallback(async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      clearError()
      
      // Map provider names to ExternalProvidersType
      // Note: API only supports Google, Facebook, LinkedIn - Apple not in enum
      const providerMap: Record<string, ExternalProvidersType | null> = {
        google: 'Google' as ExternalProvidersType,
        facebook: 'Facebook' as ExternalProvidersType,
        apple: null, // Apple not supported in API enum
      }

      const providerType = providerMap[provider]
      
      if (!providerType) {
        console.warn(`${provider} login is not supported by the API`)
        // TODO: Show user-friendly message
        return
      }

      // TODO: Implement OAuth flow
      // For now, this is a placeholder - you'll need to integrate with your OAuth provider
      // Example: Get access token from OAuth provider, then call loginWithExternalProvider
      console.log(`Social login with ${provider} - OAuth integration needed`)
      
      // Placeholder - replace with actual OAuth implementation
      // const accessToken = await getOAuthToken(provider)
      // await loginWithExternalProvider({
      //   accessToken,
      //   provider: providerType,
      // })
      
      // router.push('/dashboard')
    } catch (err) {
      console.error(`${provider} login failed:`, err)
    }
  }, [loginWithExternalProvider, clearError, router])

  return (
    <>
      <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-2.5">
        {/* Welcome Header */}
        <WelcomeHeader welcomeText="Welcome To OurBride" />

        {/* Tabs */}
        <AuthTabs />

        {/* Social Login */}
        <div className="flex items-center justify-center gap-2">
          <SocialMediaButton
            provider="google"
            onClick={() => handleSocialLogin('google')}
          />
          <SocialMediaButton
            provider="facebook"
            onClick={() => handleSocialLogin('facebook')}
          />
          <SocialMediaButton
            provider="apple"
            onClick={() => handleSocialLogin('apple')}
          />
        </div>

        {/* Divider */}
        <AuthDivider />

        {/* Login Form */}
        <LoginForm
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onRememberMeChange={setRememberMe}
          onForgotPasswordClick={() => router.push('/auth/forgot-password')}
          onLoginClick={handleLogin}
          onProviderClick={() => router.push('/auth/provider-login')}
        />

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Download App Section - Mobile Only */}
        <div className="lg:hidden w-full pt-4">
          <DownloadApp variant="default" />
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay open={isLoading} />
    </>
  )
}
