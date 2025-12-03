'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  WelcomeHeader,
} from '@/components/ui/auth/index'
import { ForgotPasswordForm } from '@/components/ui/auth/ForgotPasswordForm'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

/**
 * Forgot Password Page - Multi-step password reset flow
 * Step 1: Enter mobile number
 * Step 2: Enter 4-digit OTP
 * Step 3: Enter new password + confirm password
 */
export default function ForgotPasswordPage() {
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleConfirmClick = () => {
    // Show loading modal first
    setShowLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Hide loading and show success modal
      setShowLoading(false)
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
        {/* Welcome Header */}
        <WelcomeHeader welcomeText="Welcome To OurBride" />

        {/* Forgot Password Form */}
        <ForgotPasswordForm
          onBackClick={() => router.push('/auth/login')}
          onConfirmClick={handleConfirmClick}
          showSuccessModal={showSuccessModal}
          onSuccessModalClose={handleSuccessModalClose}
        />
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay open={showLoading} />
    </>
  )
}

