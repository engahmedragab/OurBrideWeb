'use client'

import { useState, useCallback, useEffect } from 'react'
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
import { useI18nTranslations } from '@/i18n'

import { useToast } from '@/components/ui/Toaster'
import { LoadingSpinner } from '@/components/ui'

export default function SignupPage() {
  const router = useRouter()
  const t = useI18nTranslations('auth')
  const toast = useToast()

  const { signupFull, loginWithExternalProvider, isLoading, error, clearError } =
    useAuth()

  const [showTermsModal, setShowTermsModal] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [signupCredentials, setSignupCredentials] = useState({
    fullName: '',
    gender: undefined as 'male' | 'female' | undefined,
    email: '',
    mobileNumber: '',
    password: '',
  })

  // ✅ Auto-hide AuthErrorDisplay after 5s
  useEffect(() => {
    if (!error) return
    const id = window.setTimeout(() => clearError(), 5000)
    return () => window.clearTimeout(id)
  }, [error, clearError])

  // ✅ Toast مرة واحدة لكل error (بدون useRef)
  const [lastToastedError, setLastToastedError] = useState<string | null>(null)

  useEffect(() => {
    if (!error) {
      setLastToastedError(null)
      return
    }
    if (error === lastToastedError) return

   
    setLastToastedError(error)
  }, [error, lastToastedError, toast])

  const mapGenderToApi = (gender: 'male' | 'female' | undefined): Gender => {
    if (gender === 'male') return 'Male' as Gender
    if (gender === 'female') return 'Female' as Gender
    return 'Unknown' as Gender
  }

  const handleSignup = useCallback(async () => {
    try {
      clearError()
      if (!acceptedTerms) return

      const authData = await signupFull({
        fullName: signupCredentials.fullName,
        gender: mapGenderToApi(signupCredentials.gender),
        email: signupCredentials.email,
        mobileNumber: signupCredentials.mobileNumber,
        password: signupCredentials.password,
        userType: UserType.Bride,
      })

      if (authData.accessToken) router.push('/dashboard')
      else {
        localStorage.setItem('pending_phone_number', signupCredentials.mobileNumber)
        router.push('/auth/mobile-verification')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Signup failed'
      toast.addToast(msg, 'error')
      console.error('Signup failed:', err)
    }
  }, [acceptedTerms, clearError, router, signupCredentials, signupFull, toast])

  const handleSocialSignup = useCallback(
    async (provider: 'google' | 'facebook') => {
      try {
        clearError()

        const providerMap: Record<string, ExternalProvidersType | null> = {
          google: 'Google' as ExternalProvidersType,
          facebook: 'Facebook' as ExternalProvidersType,
        }

        const providerType = providerMap[provider]
        if (!providerType) {
          toast.addToast(`${provider} signup is not supported`, 'error')
          return
        }

        console.log(`Social signup with ${provider} - OAuth integration needed`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Signup failed'
        toast.addToast(msg, 'error')
        console.error(`${provider} signup failed:`, err)
      }
    },
    [clearError, toast]
  )

  return (
    <>
      <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-2.5">
        <WelcomeHeader welcomeText={t('welcomeHeader.defaultWelcome')} />
        <AuthTabs />

        <div className="flex items-center justify-center gap-2">
          <SocialMediaButton provider="google" onClick={() => handleSocialSignup('google')} />
          <SocialMediaButton provider="facebook" onClick={() => handleSocialSignup('facebook')} />
        </div>

        <AuthDivider />

        <AuthErrorDisplay error={error} />

        <SignupForm
          onFullNameChange={fullName => {
            setSignupCredentials(p => ({ ...p, fullName }))
            if (error) clearError()
          }}
          onGenderChange={gender => {
            setSignupCredentials(p => ({ ...p, gender }))
            if (error) clearError()
          }}
          onEmailChange={email => {
            setSignupCredentials(p => ({ ...p, email }))
            if (error) clearError()
          }}
          onMobileChange={mobileNumber => {
            setSignupCredentials(p => ({ ...p, mobileNumber }))
            if (error) clearError()
          }}
          onPasswordChange={password => {
            setSignupCredentials(p => ({ ...p, password }))
            if (error) clearError()
          }}
          onAcceptedTermsChange={setAcceptedTerms}
          onTermsClick={() => setShowTermsModal(true)}
          onSignupClick={handleSignup}
          onProviderClick={() => router.push('/auth/provider-signup')}
        />

        <div className="lg:hidden w-full pt-4">
          <DownloadApp variant="default" />
        </div>
      </div>

      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setAcceptedTerms(true)
          setShowTermsModal(false)
        }}
      />

     
    </>
  )
}
