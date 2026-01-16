'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import { WelcomeHeader, AuthErrorDisplay } from '@/components/ui/auth/index'
import { ForgotPasswordForm } from '@/components/ui/auth/ForgotPasswordForm'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useI18nTranslations } from '@/i18n'
import { useToast } from '@/components/ui/Toaster'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const t = useI18nTranslations('auth')
  const toast = useToast()

  const [showLoading, setShowLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // ✅ store "errorKeyOrMsg::id" to guarantee re-trigger even if same error repeats
  const [error, setError] = useState<string | null>(null)

  // ✅ Use a helper to show error for N seconds, then auto-hide
  const showError = useCallback(
    (msgOrKey: string, autoHideMs = 5000) => {
      const stamped = `${msgOrKey}__${Date.now()}`
      setError(stamped)

      // optional: toast (only once per call)
      toast.addToast(msgOrKey, 'error')

      // auto hide
      window.setTimeout(() => {
        setError(current => (current === stamped ? null : current))
      }, autoHideMs)
    },
    [toast]
  )

  // ✅ AuthErrorDisplay should receive the original message/key (without stamp)
  const displayError = error ? error.split('__')[0] : null

  const handleConfirmClick = () => {
    setError(null)
    setShowLoading(true)

    setTimeout(() => {
      const simulateError = false
      setShowLoading(false)

      if (simulateError) {
        // ✅ pass key OR message (your AuthErrorDisplay will translate if it's a key)
        showError('forgotPassword.errors.somethingWentWrong', 5000)
        return
      }

      toast.addToast(
        t('forgotPassword.errors.successToast') ?? '',
        'success'
      )
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

        {/* <AuthErrorDisplay error={displayError} /> */}

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
