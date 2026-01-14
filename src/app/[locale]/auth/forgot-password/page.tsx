'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { WelcomeHeader, AuthErrorDisplay } from '@/components/ui/auth/index'
import { ForgotPasswordForm } from '@/components/ui/auth/ForgotPasswordForm'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useI18nTranslations } from '@/i18n'
import { useToast } from '@/components/ui/Toaster'

/**
 * Forgot Password Page - Multi-step password reset flow
 * Step 1: Enter mobile number
 * Step 2: Enter 4-digit OTP
 * Step 3: Enter new password + confirm password
 */
export default function ForgotPasswordPage() {
  const router = useRouter()
  const t = useI18nTranslations('auth')
  const toast = useToast()

  const [showLoading, setShowLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // ✅ local error for AuthErrorDisplay
  const [error, setError] = useState<string | null>(null)

  // ✅ prevent duplicate toasts without useRef
  const [lastToastedError, setLastToastedError] = useState<string | null>(null)

  // ✅ Auto-hide AuthErrorDisplay after 5 seconds
  useEffect(() => {
    if (!error) return
    const id = window.setTimeout(() => setError(null), 5000)
    return () => window.clearTimeout(id)
  }, [error])

  // ✅ Toast once per error (no useRef)
  useEffect(() => {
    if (!error) {
      setLastToastedError(null)
      return
    }
    if (error !== lastToastedError) {
      toast.addToast(error, 'error')
      setLastToastedError(error)
    }
  }, [error, lastToastedError, toast])

  const handleConfirmClick = () => {
    // reset previous error
    setError(null)

    // Show loading modal first
    setShowLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Example: toggle this to test error UI
      const simulateError = false

      setShowLoading(false)

      if (simulateError) {
        setError(t('forgotPassword.errors.somethingWentWrong'))
        return
      }

      // Success
      toast.addToast(t('forgotPassword?.successToast') ?? 'Password reset successfully', 'success')
      setShowSuccessModal(true)
    }, 2000)
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    router.push('/auth/login')
  }

  return (
    <>
      <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-2.5">
        <WelcomeHeader welcomeText={t('welcomeHeader.defaultWelcome')} />

   
        <AuthErrorDisplay error={error} />

        <ForgotPasswordForm
          onBackClick={() => router.push('/auth/login')}
          onConfirmClick={handleConfirmClick}
          showSuccessModal={showSuccessModal}
          onSuccessModalClose={handleSuccessModalClose}
        />
      </div>

      <LoadingOverlay open={showLoading} />
    </>
  )
}
