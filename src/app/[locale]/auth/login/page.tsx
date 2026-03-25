'use client'

import { useState, useCallback, Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import {
  AuthTabs,
  AuthDivider,
  LoginForm,
  WelcomeHeader,
  AuthErrorDisplay,
} from '@/components/ui/auth/index'
import { SocialMediaButton } from '@/components/ui/SocialMediaButton'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { DownloadApp } from '@/components/common'
import { useAuth } from '@/auth'
import type { ExternalProvidersType } from '@/../client/common/api/gen/ourbride-api'
import { useI18nTranslations } from '@/i18n'

import {  useToast } from '@/components/ui/Toaster'
import { LoadingSpinner } from '@/components/ui'


/**
 * Login Form Component that uses search params
 */
function LoginFormContent() {
  const router = useRouter()
  const t = useI18nTranslations('auth')
  const tCommon = useI18nTranslations('common')
  const toast = useToast()
  const searchParams = useSearchParams()
  const { loginWithEmail, loginWithPhone, isLoading, error, clearError } = useAuth()
  const [loginCredentials, setLoginCredentials] = useState<{
    identifier: string
    password: string
  }>({ identifier: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)

  // Prevent duplicate toast spam on rerenders for same error
  const lastToastedErrorRef = useRef<string | null>(null)

  const handleIdentifierChange = useCallback((identifier: string) => {
    setLoginCredentials(prev => ({ ...prev, identifier }))
    if (error) clearError()
  }, [error, clearError])

  const showErrorToast = useCallback(
    (message: string) => {
      if (!message) return
      if (lastToastedErrorRef.current === message) return
      lastToastedErrorRef.current = message
      toast.addToast(message, 'error')
    },
    [toast]
  )

  // Whenever auth context sets an error, show it as a toast (once)
  useEffect(() => {
    if (!error) {
      lastToastedErrorRef.current = null
      return
    }
    showErrorToast(error)
  }, [error, showErrorToast])

  const handlePasswordChange = useCallback(
    (password: string) => {
      setLoginCredentials(prev => ({ ...prev, password }))
      if (error) clearError()
    },
    [error, clearError]
  )

  const handleLogin = useCallback(async () => {
    try {
      clearError()
      const { identifier, password } = loginCredentials
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)

      if (isEmail) {
        await loginWithEmail({
          email: identifier,
          password: password,
        })
      } else {
        await loginWithPhone({
          phoneNumber: identifier,
          password: password,
        })
      }

      // After login, get planning preference init status from backend and update local user
      const { getPlanningPreferenceInit } = await import('@/services/profile/profileApi')
      const { setPreferenceInit, isPreferenceInit } = await import('@/auth/utils/token')

      const backendPreferenceInit = await getPlanningPreferenceInit()
      setPreferenceInit(backendPreferenceInit)

      const preferencesInitialized = isPreferenceInit()

      let redirectUrl = searchParams?.get('redirect') || '/dashboard'
      if (!preferencesInitialized) {
        redirectUrl = '/auth/planning-preferences'
      }

      router.push(redirectUrl)
    } catch (err) {
      // If auth context already sets `error`, the effect above will toast it.
      // But if it doesn't, we toast a fallback message here.
      const message =
        err instanceof Error
          ? err.message
          : tCommon?.('somethingWentWrong') || 'Login failed'

      showErrorToast(message)
    }
  }, [
    loginCredentials,
    loginWithEmail,
    loginWithPhone,
    router,
    searchParams,
    clearError,
    showErrorToast,
    tCommon,
  ])

  const handleSocialLogin = useCallback(
    async (provider: 'google' | 'facebook') => {
      try {
        clearError()

        const providerMap: Record<string, ExternalProvidersType | null> = {
          google: 'Google' as ExternalProvidersType,
          facebook: 'Facebook' as ExternalProvidersType,
          apple: null,
        }

        const providerType = providerMap[provider]
        if (!providerType) {
          showErrorToast(`${provider} login is not supported`)
          return
        }

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed'
        showErrorToast(message)
      }
    },
    [clearError, showErrorToast]
  )
  useEffect(() => {
    if (!error) return
    const t = window.setTimeout(() => clearError(), 3000)
    return () => window.clearTimeout(t)
  }, [error, clearError])
  return (
    <>
      <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-2.5">
        {/* Welcome Header */}
        <WelcomeHeader welcomeText={t('welcomeHeader.defaultWelcome')} />

        {/* Tabs */}
        <AuthTabs />

        {/* Social Login */}
        <div className="flex items-center justify-center gap-2">
          <SocialMediaButton provider="google" onClick={() => handleSocialLogin('google')} />
          <SocialMediaButton
            provider="facebook"
            onClick={() => handleSocialLogin('facebook')}
          />
        </div>

        {/* Divider */}
        <AuthDivider />

        {/* ✅ Better placement: error directly before the form (high visibility) */}
        <AuthErrorDisplay error={error} />

        {/* Login Form */}
        <LoginForm
          onIdentifierChange={handleIdentifierChange}
          onPasswordChange={handlePasswordChange}
          onRememberMeChange={setRememberMe}
          onForgotPasswordClick={() => router.push('/auth/forgot-password')}
          onLoginClick={handleLogin}
          onProviderClick={() => router.push('/auth/provider-login')}
        />

        {/* Download App Section - Mobile Only */}
        <div className="lg:hidden w-full pt-4">
          <DownloadApp variant="default" />
        </div>
      </div>

    
      
    </>
  )
}

/**
 * Login Page with authentication integration
 */
export default function LoginPage() {
  const t = useI18nTranslations('auth')
  const tCommon = useI18nTranslations('common')

  return (
    <>
      {/* ✅ Toast host should be mounted once at page root */}
   

      <Suspense
        fallback={
          <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-2">
            <WelcomeHeader welcomeText={t('welcomeHeader.defaultWelcome')} />
            <AuthTabs />
            <LoadingSpinner
            size='xl'
            fullScreen={true}
              open={true}
              text={`${tCommon('loading')} ${tCommon('pleaseWait')}`}
            
            />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </>
  )
}
