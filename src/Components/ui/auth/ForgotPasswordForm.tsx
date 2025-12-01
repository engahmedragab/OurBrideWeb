'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Input } from '../Input'
import { PasswordInput } from '../PasswordInput'
import { OTPInput } from '../OTPInput'
import { Button } from '../Button'
import { PasswordStrength } from '../PasswordStrength'
import { Typography } from '../Typography'
import { StatusModal } from '../StatusModal'
import { Phone, ChevronLeft } from 'lucide-react'
import forgetIcon from '@/Assets/images/forgetIcon.png'

export type FieldStatus = 'default' | 'error' | 'success'

export interface ForgotPasswordFormProps {
  onBackClick?: () => void
  onConfirmClick?: () => void
  className?: string
}

type Step = 1 | 2 | 3

/**
 * ForgotPasswordForm - Multi-step form for password reset
 * Step 1: Enter mobile number
 * Step 2: Enter 4-digit OTP
 * Step 3: Enter new password + confirm password
 */
export const ForgotPasswordForm = ({
  onBackClick,
  onConfirmClick,
  className,
}: ForgotPasswordFormProps) => {
  const router = useRouter()

  // Step management
  const [step, setStep] = useState<Step>(1)

  // Form values
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState<string[]>(['', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validation states
  const [phoneStatus, setPhoneStatus] = useState<FieldStatus>('default')
  const [otpStatus, setOtpStatus] = useState<FieldStatus>('default')
  const [passwordStatus, setPasswordStatus] = useState<FieldStatus>('default')
  const [confirmPasswordStatus, setConfirmPasswordStatus] =
    useState<FieldStatus>('default')

  // Error messages
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('')
  const [otpErrorMessage, setOtpErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('')

  // Track touched fields
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [otpTouched, setOtpTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Validation helpers
  const validatePhone = (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'Mobile number is required' }
    }
    // Basic phone validation: starts with +20 or 01 and has enough digits
    const phoneRegex = /^(\+20|01)[0-9]{9,}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return { isValid: false, message: 'Please enter a valid mobile number' }
    }
    return { isValid: true, message: '' }
  }

  const validateOTP = (value: string[]): { isValid: boolean; message: string } => {
    const otpString = value.join('')
    if (otpString.length !== 4) {
      return { isValid: false, message: 'Please enter the 4-digit OTP' }
    }
    if (!/^\d{4}$/.test(otpString)) {
      return { isValid: false, message: 'OTP must contain only numbers' }
    }
    return { isValid: true, message: '' }
  }

  const validatePassword = (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'Password is required' }
    }
    if (value.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' }
    }
    return { isValid: true, message: '' }
  }

  const validateConfirmPassword = (
    value: string,
    originalPassword: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'Please confirm your password' }
    }
    if (value !== originalPassword) {
      return { isValid: false, message: "Password Doesn't Match" }
    }
    return { isValid: true, message: '' }
  }

  // Handlers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)

    if (phoneTouched || isSubmitted) {
      const validation = validatePhone(value)
      if (validation.isValid) {
        setPhoneStatus('success')
        setPhoneErrorMessage('')
      } else {
        setPhoneStatus('error')
        setPhoneErrorMessage(validation.message)
      }
    } else if (phoneStatus === 'error') {
      setPhoneStatus('default')
      setPhoneErrorMessage('')
    }
  }

  const handlePhoneBlur = () => {
    setPhoneTouched(true)
    const validation = validatePhone(phone)
    if (validation.isValid) {
      setPhoneStatus('success')
      setPhoneErrorMessage('')
    } else {
      setPhoneStatus('error')
      setPhoneErrorMessage(validation.message)
    }
  }

  const handleOTPChange = (value: string[]) => {
    setOtp(value)

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
    } else if (otpTouched || isSubmitted) {
      const validation = validateOTP(value)
      if (validation.isValid) {
        setOtpStatus('success')
        setOtpErrorMessage('')
      } else {
        setOtpStatus('error')
        setOtpErrorMessage(validation.message)
      }
    } else if (otpStatus === 'error') {
      setOtpStatus('default')
      setOtpErrorMessage('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    if (passwordTouched || isSubmitted) {
      const validation = validatePassword(value)
      if (validation.isValid) {
        setPasswordStatus('success')
        setPasswordErrorMessage('')
      } else {
        setPasswordStatus('error')
        setPasswordErrorMessage(validation.message)
      }
    } else if (passwordStatus === 'error') {
      setPasswordStatus('default')
      setPasswordErrorMessage('')
    }

    // Re-validate confirm password if it's already filled
    if (confirmPassword && confirmPasswordTouched) {
      const confirmValidation = validateConfirmPassword(confirmPassword, value)
      if (confirmValidation.isValid) {
        setConfirmPasswordStatus('success')
        setConfirmPasswordErrorMessage('')
      } else {
        setConfirmPasswordStatus('error')
        setConfirmPasswordErrorMessage(confirmValidation.message)
      }
    }
  }

  const handlePasswordBlur = () => {
    setPasswordTouched(true)
    const validation = validatePassword(password)
    if (validation.isValid) {
      setPasswordStatus('success')
      setPasswordErrorMessage('')
    } else {
      setPasswordStatus('error')
      setPasswordErrorMessage(validation.message)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (confirmPasswordTouched || isSubmitted) {
      const validation = validateConfirmPassword(value, password)
      if (validation.isValid) {
        setConfirmPasswordStatus('success')
        setConfirmPasswordErrorMessage('')
      } else {
        setConfirmPasswordStatus('error')
        setConfirmPasswordErrorMessage(validation.message)
      }
    } else if (confirmPasswordStatus === 'error') {
      setConfirmPasswordStatus('default')
      setConfirmPasswordErrorMessage('')
    }
  }

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true)
    const validation = validateConfirmPassword(confirmPassword, password)
    if (validation.isValid) {
      setConfirmPasswordStatus('success')
      setConfirmPasswordErrorMessage('')
    } else {
      setConfirmPasswordStatus('error')
      setConfirmPasswordErrorMessage(validation.message)
    }
  }

  // Step navigation
  const handleNextStep = () => {
    if (step === 1) {
      const validation = validatePhone(phone)
      if (validation.isValid) {
        setStep(2)
        setIsSubmitted(false)
      } else {
        setIsSubmitted(true)
        setPhoneStatus('error')
        setPhoneErrorMessage(validation.message)
      }
    } else if (step === 2) {
      const validation = validateOTP(otp)
      if (validation.isValid) {
        setStep(3)
        setIsSubmitted(false)
      } else {
        setIsSubmitted(true)
        setOtpStatus('error')
        setOtpErrorMessage(validation.message)
      }
    }
  }

  const handleConfirm = () => {
    setIsSubmitted(true)

    const passwordValidation = validatePassword(password)
    const confirmValidation = validateConfirmPassword(confirmPassword, password)

    if (passwordValidation.isValid && confirmValidation.isValid) {
      setShowSuccessModal(true)
      onConfirmClick?.()
    } else {
      if (!passwordValidation.isValid) {
        setPasswordStatus('error')
        setPasswordErrorMessage(passwordValidation.message)
        setPasswordTouched(true)
      }
      if (!confirmValidation.isValid) {
        setConfirmPasswordStatus('error')
        setConfirmPasswordErrorMessage(confirmValidation.message)
        setConfirmPasswordTouched(true)
      }
    }
  }

  const handleSuccessModalConfirm = () => {
    setShowSuccessModal(false)
    router.push('/auth/login')
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    router.push('/auth/login')
  }

  const handleBack = () => {
    if (step === 1) {
      onBackClick?.() || router.push('/auth/login')
    } else {
      setStep((prev) => (prev - 1) as Step)
      setIsSubmitted(false)
    }
  }

  // Get input variants
  const phoneInputVariant = phoneStatus === 'error' ? 'error' : phoneStatus === 'success' ? 'success' : 'default'
  const otpInputVariant = otpStatus === 'error' ? 'error' : otpStatus === 'success' ? 'success' : 'default'
  const passwordInputVariant = passwordStatus === 'error' ? 'error' : passwordStatus === 'success' ? 'success' : 'default'
  const confirmPasswordInputVariant = confirmPasswordStatus === 'error' ? 'error' : confirmPasswordStatus === 'success' ? 'success' : 'default'

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
          Forget Password
        </Typography>
      </div>

      {/* Step 1: Mobile Number */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Illustration */}
          <div className="flex justify-center py-4">
            <img
              src={typeof forgetIcon === 'string' ? forgetIcon : forgetIcon.src}
              alt="Forget Password"
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
            Please enter your mobile number to send an OTP
          </Typography>

          {/* Phone Input */}
          <div className="w-full space-y-1">
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              variant={phoneInputVariant}
              prefixIcon={<Phone className="h-6 w-6" />}
              errorMessage={phoneErrorMessage}
              showSuccessIcon={phoneStatus === 'success'}
              size="lg"
              className="h-20  px-5 text-16"
            />
          </div>

          {/* Confirm Button */}
          <Button
            type="button"
            variant="brand"
            size="lg"
            className="w-full text-white"
            onClick={handleNextStep}
          >
            Confirm
          </Button>

          {/* Footer Link */}
          <div className="flex items-center justify-center">
            <Typography variant="bodySmall" textColor="tertiary" align="center" className="text-12 sm:text-14">
              Are you providing your services?{' '}
              <button
                type="button"
                className="font-semibold text-gray-800 underline hover:text-brand-500 transition-colors"
              >
                Resend
              </button>
            </Typography>
          </div>
        </div>
      )}

      {/* Step 2: OTP */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Illustration */}
          <div className="flex justify-center py-4">
            <img
              src={typeof forgetIcon === 'string' ? forgetIcon : forgetIcon.src}
              alt="Forget Password"
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
            onClick={handleNextStep}
          >
            Confirm
          </Button>

          {/* Footer Link */}
          <div className="flex items-center justify-center">
            <Typography variant="bodySmall" textColor="tertiary" align="center" className="text-12 sm:text-14">
              Are you providing your services?{' '}
              <button
                type="button"
                className="font-semibold text-gray-800 underline hover:text-brand-500 transition-colors"
              >
                Resend
              </button>
            </Typography>
          </div>
        </div>
      )}

      {/* Step 3: New Password */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Illustration */}
          <div className="flex justify-center py-4">
            <img
              src={typeof forgetIcon === 'string' ? forgetIcon : forgetIcon.src}
              alt="Forget Password"
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
            Please enter your mobile number to send an OTP
          </Typography>

          {/* Password Input */}
          <div className="w-full space-y-1">
            <PasswordInput
              placeholder="Enter New Password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              variant={passwordInputVariant}
              errorMessage={passwordErrorMessage}
              showSuccessIcon={passwordStatus === 'success'}
              size="lg"
            />
          </div>

          {/* Password Strength */}
          {password && (
            <div className="w-full">
              <PasswordStrength password={password} />
            </div>
          )}

          {/* Confirm Password Input */}
          <div className="w-full space-y-1">
            <PasswordInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              variant={confirmPasswordInputVariant}
              errorMessage={confirmPasswordErrorMessage}
              showSuccessIcon={confirmPasswordStatus === 'success'}
              size="lg"
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
              <button
                type="button"
                className="font-semibold text-gray-800 underline hover:text-brand-500 transition-colors"
              >
                Resend
              </button>
            </Typography>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <StatusModal
        open={showSuccessModal}
        title="Password Reset Successful"
        description="Your password has been updated. You can now log in with your new password."
        confirmLabel="Confirm"
        onConfirm={handleSuccessModalConfirm}
        onClose={handleSuccessModalClose}
      />
    </div>
  )
}

