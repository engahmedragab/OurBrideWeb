'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { OTPInput } from '../OTPInput'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { ChevronLeft, Check } from 'lucide-react'
import forgetIcon from '@/assets/images/forgetIcon.png'
import { useAuth } from '@/auth'
import Image from 'next/image'

export type FieldStatus = 'default' | 'error' | 'success'

export interface MobileVerificationFormProps {
  phoneNumber?: string
  countryCode?: number
  onBackClick?: () => void
  className?: string
  onLoadingChange?: (isLoading: boolean) => void
  onVerifySuccess?: () => void
}

/**
 * MobileVerificationForm - OTP verification form for mobile number
 * Displays OTP input, validation, resend functionality, and loading states
 */
export const MobileVerificationForm = ({
  phoneNumber: propPhoneNumber,
  countryCode: propCountryCode,
  onBackClick,
  className,
  onLoadingChange,
  onVerifySuccess,
}: MobileVerificationFormProps) => {
  const router = useRouter()
  const { sendPhoneOTP, verifyPhoneOTP, isLoading, error, clearError } = useAuth()

  // Get phone number from props, localStorage, or signup flow
  const getPhoneNumber = (): string => {
    if (propPhoneNumber) return propPhoneNumber
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pending_phone_number') || ''
    }
    return ''
  }

  const getCountryCode = (): number | undefined => {
    if (propCountryCode) return propCountryCode
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pending_country_code')
      return stored ? parseInt(stored, 10) : undefined
    }
    return undefined
  }

  const [phoneNumber] = useState(getPhoneNumber())
  const [countryCode] = useState(getCountryCode())

  // OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', ''])
  const [otpStatus, setOtpStatus] = useState<FieldStatus>('default')
  const [otpErrorMessage, setOtpErrorMessage] = useState('')

  // Resend state
  const [resendState, setResendState] = useState<
    'idle' | 'countdown' | 'success'
  >('idle')
  const [resendCountdown, setResendCountdown] = useState(30)

  // Track touched
  const [, setOtpTouched] = useState(false)

  // Track if OTP has been sent to prevent duplicate calls
  const otpSentRef = useRef(false)

  // Update loading state when auth loading changes
  useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading, onLoadingChange])

  // Countdown timer for resend
  useEffect(() => {
    if (resendState === 'countdown' && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (resendState === 'countdown' && resendCountdown === 0) {
      setResendState('idle')
      setResendCountdown(30)
    }
  }, [resendState, resendCountdown])

  // Validation helpers
  const validateOTP = (
    value: string[]
  ): { isValid: boolean; message: string } => {
    const otpString = value.join('')
    if (!otpString || otpString.length !== 4) {
      return { isValid: false, message: 'Please enter the 4-digit OTP' }
    }
    if (!/^\d{4}$/.test(otpString)) {
      return { isValid: false, message: 'OTP must contain only numbers' }
    }
    return { isValid: true, message: '' }
  }

  // Send OTP code
  const handleSendOTP = useCallback(async () => {
    if (!phoneNumber) {
      setOtpErrorMessage('Phone number is required')
      return
    }

    // Prevent duplicate calls - if already sent, return (unless explicitly resending)
    if (otpSentRef.current) {
      return
    }

    // Mark as sent immediately to prevent duplicate calls (before async operation)
    otpSentRef.current = true

    try {
      clearError()
      await sendPhoneOTP({
        phoneNumber,
        countryCode,
      })
      setResendState('countdown')
      setResendCountdown(30)
    } catch {
      // On error, allow retry by resetting the ref
      otpSentRef.current = false
      setOtpErrorMessage(error || 'Failed to send OTP. Please try again.')
    }
  }, [phoneNumber, countryCode, sendPhoneOTP, clearError, error])

  // Send OTP on component mount if phone number is available (only once)
  useEffect(() => {
    if (phoneNumber && !otpSentRef.current) {
      handleSendOTP()
    }
    // handleSendOTP is memoized with useCallback and all dependencies
    // We intentionally only want this to run once when phoneNumber is available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber])

  // Handlers
  const handleOTPChange = (value: string[]) => {
    setOtp(value)

    // Clear error when user starts typing
    if (otpStatus === 'error') {
      setOtpStatus('default')
      setOtpErrorMessage('')
    }

    // Auto-validate when all 4 digits are entered
    if (value.join('').length === 4) {
      setOtpTouched(true)
      const validation = validateOTP(value)
      if (validation.isValid) {
        setOtpStatus('success')
        setOtpErrorMessage('')
      } else {
        setOtpStatus('error')
        setOtpErrorMessage(validation.message)
      }
    }
  }

  const handleConfirm = async () => {
    setOtpTouched(true)
    const validation = validateOTP(otp)

    if (!validation.isValid) {
      setOtpStatus('error')
      setOtpErrorMessage(validation.message)
      return
    }

    if (!phoneNumber) {
      setOtpStatus('error')
      setOtpErrorMessage('Phone number is required')
      return
    }

    try {
      clearError()
      setOtpStatus('default')
      setOtpErrorMessage('')

      const otpCode = parseInt(otp.join(''), 10)
      await verifyPhoneOTP({
        phoneNumber,
        countryCode,
        code: otpCode,
      })

      // Clear pending phone number from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pending_phone_number')
        localStorage.removeItem('pending_country_code')
      }

      setOtpStatus('success')
      
      // Always redirect to planning preferences after successful verification
      if (onVerifySuccess) {
        onVerifySuccess()
      } else {
        router.push('/auth/planning-preferences')
      }
    } catch {
      setOtpStatus('error')
      setOtpErrorMessage(error || 'Invalid OTP code. Please try again.')
    }
  }

  const handleResend = async () => {
    if (resendState === 'idle' && phoneNumber) {
      try {
        clearError()
        // Reset the ref to allow resend
        otpSentRef.current = false
        await handleSendOTP()
        // Show success toast
        setTimeout(() => {
          setResendState('success')
          setTimeout(() => {
            setResendState('countdown')
          }, 3000)
        }, 500)
      } catch {
        // Error handled in handleSendOTP
      }
    }
  }

  const handleBack = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      router.push('/auth/signup')
    }
  }

  // Get input variant
  const otpInputVariant =
    otpStatus === 'error'
      ? 'error'
      : otpStatus === 'success'
        ? 'success'
        : 'default'

  return (
    <div className={cn('w-full space-y-2.5 sm:space-y-3', className)}>
      {/* Header with Back Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <Typography
          variant="h6"
          weight="semibold"
          textColor="default"
          className="text-16 sm:text-18"
        >
          Mobile Verification
        </Typography>
      </div>

      {/* Illustration */}
      <div className="flex justify-center py-4">
        <Image
          src={typeof forgetIcon === 'string' ? forgetIcon : forgetIcon.src}
          alt="Mobile Verification"
          width={128}
          height={128}
          className="h-32 w-auto"
        />
      </div>

      {/* Instruction Text */}
      <Typography
        variant="body"
        textColor="muted"
        align="center"
        className="text-14 sm:text-14 text-gray-400 font-regular"
      >
        Please enter the 4 numbers OTP We have sent to{' '}
        {phoneNumber ? (
          <span className="font-semibold text-gray-600">{phoneNumber}</span>
        ) : (
          'your phone number'
        )}
      </Typography>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* OTP Input */}
      <div className="w-full space-y-1 flex justify-center">
        <OTPInput
          length={4}
          value={otp}
          onChange={handleOTPChange}
          variant={otpInputVariant}
          errorMessage={otpErrorMessage}
        />
      </div>

      {/* Confirm Button */}
      <Button
        type="button"
        variant="brand"
        size="lg"
        className="w-full text-white"
        onClick={handleConfirm}
      >
        Confirm
      </Button>

      {/* Resend OTP */}
      <div className="flex items-center justify-center">
        <Typography
          variant="bodySmall"
          textColor="tertiary"
          align="center"
          className="text-12 sm:text-14"
        >
          Didn&apos;t receive the code?{' '}
          {resendState === 'countdown' ? (
            <span className="text-gray-400">
              Resend After {resendCountdown} Sec
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-gray-800 underline hover:text-brand-500 transition-colors"
            >
              Resend
            </button>
          )}
        </Typography>
      </div>

      {/* Success Toast - Resend Success */}
      {resendState === 'success' && (
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-12 font-medium text-green-700">
              Otp Resent Successfully
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
