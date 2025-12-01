import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'
import { OTPInput } from '../OTPInput'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { ChevronLeft, Check } from 'lucide-react'
import forgetIcon from '@/Assets/images/forgetIcon.png'

export type FieldStatus = 'default' | 'error' | 'success'

export interface MobileVerificationFormProps {
  onBackClick?: () => void
  className?: string
  onLoadingChange?: (isLoading: boolean) => void
}

/**
 * MobileVerificationForm - OTP verification form for mobile number
 * Displays OTP input, validation, resend functionality, and loading states
 */
export const MobileVerificationForm = ({
  onBackClick,
  className,
  onLoadingChange,
}: MobileVerificationFormProps) => {
  const router = useRouter()

  // OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', ''])
  const [otpStatus, setOtpStatus] = useState<FieldStatus>('default')
  const [otpErrorMessage, setOtpErrorMessage] = useState('')

  // Resend state
  const [resendState, setResendState] = useState<'idle' | 'countdown' | 'success'>('idle')
  const [resendCountdown, setResendCountdown] = useState(30)

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Track touched
  const [otpTouched, setOtpTouched] = useState(false)

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
  const validateOTP = (value: string[]): { isValid: boolean; message: string } => {
    const otpString = value.join('')
    if (!otpString || otpString.length !== 4) {
      return { isValid: false, message: 'Please enter the 4-digit OTP' }
    }
    if (!/^\d{4}$/.test(otpString)) {
      return { isValid: false, message: 'OTP must contain only numbers' }
    }
    // For demo: accept "1234" as valid, anything else is wrong
    if (otpString !== '1234') {
      return { isValid: false, message: 'Wrong OTP, Please Try Again' }
    }
    return { isValid: true, message: '' }
  }

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

  const handleConfirm = () => {
    setOtpTouched(true)
    const validation = validateOTP(otp)

    if (validation.isValid) {
      setOtpStatus('success')
      setOtpErrorMessage('')
      setIsLoading(true)
      onLoadingChange?.(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        onLoadingChange?.(false)
        // Redirect to planning preferences after successful verification
        router.push('/auth/planning-preferences')
      }, 2000)
    } else {
      setOtpStatus('error')
      setOtpErrorMessage(validation.message)
    }
  }

  const handleResend = () => {
    if (resendState === 'idle') {
      setResendState('countdown')
      setResendCountdown(30)

      // Show success toast after a brief moment
      setTimeout(() => {
        setResendState('success')
        setTimeout(() => {
          setResendState('countdown')
        }, 3000)
      }, 500)
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
  const otpInputVariant = otpStatus === 'error' ? 'error' : otpStatus === 'success' ? 'success' : 'default'

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
        <Typography variant="h6" weight="semibold" textColor="default" className="text-16 sm:text-18">
          Mobile Verification
        </Typography>
      </div>

      {/* Illustration */}
      <div className="flex justify-center py-4">
        <img
          src={typeof forgetIcon === 'string' ? forgetIcon : forgetIcon.src}
          alt="Mobile Verification"
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
        Please enter the 4 numbers OTP We have sent to your phone number
      </Typography>

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

      {/* Footer Link */}
      <div className="flex items-center justify-center">
        <Typography variant="bodySmall" textColor="tertiary" align="center" className="text-12 sm:text-14">
          Are you providing your services?{' '}
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

