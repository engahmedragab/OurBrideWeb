'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileVerificationForm } from '@/components/ui/auth/MobileVerificationForm'
import { AuthLayout } from '@/components/ui/auth/AuthLayout'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

/**
 * Mobile Verification Page - OTP verification after signup
 * User enters 4-digit OTP sent to their mobile number
 */
export default function MobileVerificationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [countryCode, setCountryCode] = useState<number | undefined>()

  // Get phone number from localStorage (set during signup)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPhone = localStorage.getItem('pending_phone_number')
      const storedCountryCode = localStorage.getItem('pending_country_code')

      if (storedPhone) {
        setPhoneNumber(storedPhone)
      }

      if (storedCountryCode) {
        setCountryCode(parseInt(storedCountryCode, 10))
      }

      // If no phone number found, redirect back to signup
      if (!storedPhone) {
        router.push('/auth/signup')
      }
    }
  }, [router])

  return (
    <>
      <AuthLayout showWelcomeHeader={false}>
        <MobileVerificationForm
          phoneNumber={phoneNumber}
          countryCode={countryCode}
          onBackClick={() => {
            router.push('/auth/signup')
          }}
          onLoadingChange={setIsLoading}
          onVerifySuccess={() => {
            router.push('/auth/planning-preferences')
          }}
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
