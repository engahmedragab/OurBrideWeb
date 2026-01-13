'use client'

import { useState, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import {
  AuthTabs,
  AuthDivider,
  SignupForm,
  TermsAndConditionsModal,
  WelcomeHeader,
  AuthErrorDisplay,
} from '@/components/ui/auth/index'
import { SocialMediaButton } from '@/components/ui/SocialMediaButton'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { DownloadApp } from '@/components/common'
import { useAuth } from '@/auth'
import { Gender, UserType } from '@/../client/common/api/gen/ourbride-api'
import type { ExternalProvidersType } from '@/../client/common/api/gen/ourbride-api'

/**
 * Signup Page with authentication integration
 */
export default function SignupPage() {
  const router = useRouter()
  const { signupFull, loginWithExternalProvider, isLoading, error, clearError } = useAuth()
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [signupCredentials, setSignupCredentials] = useState<{
    fullName: string
    gender: 'male' | 'female' | undefined
    email: string
    mobileNumber: string
    password: string
  }>({
    fullName: '',
    gender: undefined,
    email: '',
    mobileNumber: '',
    password: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Map form gender to API Gender enum
  const mapGenderToApi = (gender: 'male' | 'female' | undefined): Gender => {
    if (gender === 'male') return 'Male' as Gender
    if (gender === 'female') return 'Female' as Gender
    return 'Unknown' as Gender
  }

  const handleFullNameChange = useCallback((fullName: string) => {
    setSignupCredentials(prev => ({ ...prev, fullName }))
    if (error) clearError()
  }, [error, clearError])

  const handleGenderChange = useCallback((gender: 'male' | 'female') => {
    setSignupCredentials(prev => ({ ...prev, gender }))
    if (error) clearError()
  }, [error, clearError])

  const handleEmailChange = useCallback((email: string) => {
    setSignupCredentials(prev => ({ ...prev, email }))
    if (error) clearError()
  }, [error, clearError])

  const handleMobileChange = useCallback((mobileNumber: string) => {
    setSignupCredentials(prev => ({ ...prev, mobileNumber }))
    if (error) clearError()
  }, [error, clearError])

  const handlePasswordChange = useCallback((password: string) => {
    setSignupCredentials(prev => ({ ...prev, password }))
    if (error) clearError()
  }, [error, clearError])

  const handleSignup = useCallback(async () => {
    try {
      clearError()

      if (!acceptedTerms) {
        // Terms not accepted - this should be handled by the form validation
        return
      }

      const authData = await signupFull({
        fullName: signupCredentials.fullName,
        gender: mapGenderToApi(signupCredentials.gender),
        email: signupCredentials.email,
        mobileNumber: signupCredentials.mobileNumber,
        password: signupCredentials.password,
        userType: UserType.Bride, // Default user type, can be made configurable
      })

      // If we got tokens, user is logged in - redirect to dashboard
      if (authData.accessToken) {
        router.push('/dashboard')
      } else {
        // Registration successful but verification required
        // Store phone number for mobile verification page
        if (typeof window !== 'undefined') {
          localStorage.setItem('pending_phone_number', signupCredentials.mobileNumber)
          // You can also store country code if you have it
        }
        router.push('/auth/mobile-verification')
      }
    } catch (err) {
      // Error is handled by auth context
      console.error('Signup failed:', err)
    }
  }, [signupCredentials, acceptedTerms, signupFull, router, clearError])

  const handleSocialSignup = useCallback(async (provider: 'google' | 'facebook') => {
    try {
      clearError()

      const providerMap: Record<string, ExternalProvidersType | null> = {
        google: 'Google' as ExternalProvidersType,
        facebook: 'Facebook' as ExternalProvidersType,
      }

      const providerType = providerMap[provider]

      if (!providerType) {
        console.warn(`${provider} signup is not supported by the API`)
        return
      }

      // TODO: Implement OAuth flow for signup
      console.log(`Social signup with ${provider} - OAuth integration needed`)
    } catch (err) {
      console.error(`${provider} signup failed:`, err)
    }
  }, [loginWithExternalProvider, clearError])

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
            onClick={() => handleSocialSignup('google')}
          />
          <SocialMediaButton
            provider="facebook"
            onClick={() => handleSocialSignup('facebook')}
          />

        </div>

        {/* Divider */}
        <AuthDivider />

        {/* Signup Form */}
        <SignupForm
          onFullNameChange={handleFullNameChange}
          onGenderChange={handleGenderChange}
          onEmailChange={handleEmailChange}
          onMobileChange={handleMobileChange}
          onPasswordChange={handlePasswordChange}
          onAcceptedTermsChange={setAcceptedTerms}
          onTermsClick={() => setShowTermsModal(true)}
          onSignupClick={handleSignup}
          onProviderClick={() => router.push('/auth/provider-signup')}
        />

        {/* Error Message */}
        <AuthErrorDisplay error={error} />

        {/* Download App Section - Mobile Only */}
        <div className="lg:hidden w-full pt-4">
          <DownloadApp variant="default" />
        </div>
      </div>

      {/* Terms Modal */}
      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {/* TODO: Handle terms acceptance */ }}
      />

      {/* Loading Overlay */}
      <LoadingOverlay open={isLoading} />
    </>
  )
}
