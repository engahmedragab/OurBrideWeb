'use client'

import { useState } from 'react'
import { MobileVerificationForm } from '@/components/ui/auth/MobileVerificationForm'
import { AuthLayout } from '@/components/ui/auth/AuthLayout'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

/**
 * Mobile Verification Page - OTP verification after signup
 * User enters 4-digit OTP sent to their mobile number
 */
export default function MobileVerificationPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <AuthLayout showWelcomeHeader={false}>
        <MobileVerificationForm
          onBackClick={() => {
            window.history.back()
          }}
          onLoadingChange={setIsLoading}
        />
      </AuthLayout>

      {/* Loading Overlay */}
      <LoadingOverlay
        open={isLoading}
        title="Loading…"
        subtitle="Please wait a moment."
      />
    </>
  )
}
