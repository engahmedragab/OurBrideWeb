'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Input } from '../Input'
import { PasswordInput } from '../PasswordInput'
import { OTPInput } from '../OTPInput'
import { Button } from '../Button'
import { PasswordStrength } from '../PasswordStrength'
import { Typography } from '../Typography'
import { StatusModal } from '../StatusModal'
import { AuthErrorDisplay } from './AuthErrorDisplay'
import { ChevronLeft, ChevronRight, Phone, Smartphone } from 'lucide-react'
import forgetIcon from '@/assets/images/forgetIcon.png'
import { useAuth } from '@/auth'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export type FieldStatus = 'default' | 'error' | 'success'

export interface ForgotPasswordFormProps {
  onBackClick?: () => void
  onConfirmClick?: () => void
  showSuccessModal?: boolean
  onSuccessModalClose?: () => void
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
  showSuccessModal: externalShowSuccessModal,
  onSuccessModalClose,
  className,
}: ForgotPasswordFormProps) => {
  const t = useI18nTranslations('auth')
  const tc = useI18nTranslations('common')
  const isRTL = useIsRTL()
  const router = useRouter()
  const { sendPhoneOTP, verifyPhoneOTP, isLoading, error, clearError } = useAuth()

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

  // Focus states
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [internalShowSuccessModal, setInternalShowSuccessModal] =
    useState(false)

  // Use external modal state if provided, otherwise use internal state
  const showSuccessModal =
    externalShowSuccessModal !== undefined
      ? externalShowSuccessModal
      : internalShowSuccessModal

  // Validation helpers
  const validatePhone = (
    value: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: t('forgotPassword.phoneRequired') }
    }
    // Basic phone validation: starts with +20 or 01 and has enough digits
    const phoneRegex = /^(\+20|01)[0-9]{9,}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return { isValid: false, message: t('forgotPassword.phoneInvalid') }
    }
    return { isValid: true, message: '' }
  }

  const validateOTP = (
    value: string[]
  ): { isValid: boolean; message: string } => {
    const otpString = value.join('')
    if (otpString.length !== 4) {
      return { isValid: false, message: t('forgotPassword.otpErrorLength') }
    }
    if (!/^\d{4}$/.test(otpString)) {
      return { isValid: false, message: t('forgotPassword.otpErrorNumbers') }
    }
    return { isValid: true, message: '' }
  }

  const validatePassword = (
    value: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: t('forgotPassword.passwordRequired') }
    }
    if (value.length < 8) {
      return {
        isValid: false,
        message: t('forgotPassword.passwordMin'),
      }
    }
    return { isValid: true, message: '' }
  }

  const validateConfirmPassword = (
    value: string,
    originalPassword: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: t('forgotPassword.confirmPasswordRequired') }
    }
    if (value !== originalPassword) {
      return { isValid: false, message: t('forgotPassword.passwordNotMatch') }
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

  const handlePhoneFocus = () => {
    setPhoneFocused(true)
  }

  const handlePhoneBlur = () => {
    setPhoneFocused(false)
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

  const handlePasswordFocus = () => {
    setPasswordFocused(true)
  }

  const handlePasswordBlur = () => {
    setPasswordFocused(false)
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

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleConfirmPasswordFocus = () => {
    setConfirmPasswordFocused(true)
  }

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordFocused(false)
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
  const handleNextStep = async () => {
    if (step === 1) {
      const validation = validatePhone(phone)
      if (validation.isValid) {
        try {
          clearError()
          await sendPhoneOTP({
            phoneNumber: phone,
          })
          setStep(2)
          setIsSubmitted(false)
          // Clear any previous errors when moving to next step
          setPhoneStatus('default')
          setPhoneErrorMessage('')
        } catch (err) {
          // Error is handled by auth context and displayed via AuthErrorDisplay
          setPhoneStatus('error')
          const errorMsg = err instanceof Error ? err.message : (error || t('forgotPassword.sendOtpFailed'))
          setPhoneErrorMessage(errorMsg)
        }
      } else {
        setIsSubmitted(true)
        setPhoneStatus('error')
        setPhoneErrorMessage(validation.message)
      }
    } else if (step === 2) {
      const validation = validateOTP(otp)
      if (validation.isValid) {
        try {
          clearError()
          const otpCode = parseInt(otp.join(''), 10)
          await verifyPhoneOTP({
            phoneNumber: phone,
            code: otpCode,
          })
          setStep(3)
          setIsSubmitted(false)
          // Clear any previous errors when moving to next step
          setOtpStatus('default')
          setOtpErrorMessage('')
        } catch (err) {
          // Error is handled by auth context and displayed via AuthErrorDisplay
          setOtpStatus('error')
          const errorMsg = err instanceof Error ? err.message : (error || t('forgotPassword.invalidOtp'))
          setOtpErrorMessage(errorMsg)
        }
      } else {
        setIsSubmitted(true)
        setOtpStatus('error')
        setOtpErrorMessage(validation.message)
      }
    }
  }

  const handleConfirm = async () => {
    setIsSubmitted(true)

    const passwordValidation = validatePassword(password)
    const confirmValidation = validateConfirmPassword(confirmPassword, password)

    if (passwordValidation.isValid && confirmValidation.isValid) {
      try {
        clearError()
        // TODO: Replace with actual password reset API call when available
        // For now, call the callback which may handle the API call
        // await resetPassword({ phoneNumber: phone, newPassword: password })
        onConfirmClick?.()
      } catch (err) {
        // Error is handled by auth context and displayed via AuthErrorDisplay
        setPasswordStatus('error')
        const errorMsg = err instanceof Error ? err.message : (error || t('forgotPassword.resetFailed'))
        setPasswordErrorMessage(errorMsg)
      }
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
    if (onSuccessModalClose) {
      onSuccessModalClose()
    } else {
      setInternalShowSuccessModal(false)
      router.push('/auth/login')
    }
  }

  const handleSuccessModalClose = () => {
    if (onSuccessModalClose) {
      onSuccessModalClose()
    } else {
      setInternalShowSuccessModal(false)
      router.push('/auth/login')
    }
  }

  const handleBack = () => {
    if (step === 1) {
      if (onBackClick) {
        onBackClick()
      } else {
        router.push('/auth/login')
      }
    } else {
      setStep(prev => (prev - 1) as Step)
      setIsSubmitted(false)
    }
  }

  // Map field status to Input/PasswordInput variants
  const getInputVariant = (
    status: FieldStatus,
    value: string,
    isFocused: boolean
  ): 'default' | 'error' | 'success' | 'focused' | 'fill' => {
    if (status === 'error') return 'error'
    if (status === 'success') return 'success'
    if (isFocused) return 'focused'
    if (value && value.length > 0) return 'fill'
    return 'default'
  }

  // Get input variants
  const phoneInputVariant = getInputVariant(phoneStatus, phone, phoneFocused)
  const otpInputVariant =
    otpStatus === 'error'
      ? 'error'
      : otpStatus === 'success'
        ? 'success'
        : 'default'
  const passwordInputVariant = getInputVariant(
    passwordStatus,
    password,
    passwordFocused
  )
  const confirmPasswordInputVariant = getInputVariant(
    confirmPasswordStatus,
    confirmPassword,
    confirmPasswordFocused
  )

  return (
    <div className={cn('w-full space-y-2.5 sm:space-y-3', className)}>
      {/* Header with Back Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
        <Typography
          variant="h6"
          weight="semibold"
          textColor="default"
          className="text-16 sm:text-18"
        >
          {t('forgotPassword.title')}
        </Typography>
      </div>

      {/* Step 1: Mobile Number */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Illustration */}
          <div className="flex justify-center py-4">
            <Image
              src={typeof forgetIcon === 'string' ? forgetIcon : forgetIcon.src}
              alt="Forget Password"
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
            {t('forgotPassword.instructionStep1')}
          </Typography>

          {/* Error Message */}
          <AuthErrorDisplay error={error} />

          {/* Phone Input */}
          <div className="w-full space-y-1">
            <Input
              type="tel"
              dir={isRTL ? 'rtl' : 'ltr'}
              placeholder={t('forgotPassword.phonePlaceholder')}
              value={phone}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              onBlur={handlePhoneBlur}
              variant={phoneInputVariant}
              prefixIcon={<Smartphone className="h-5 w-5" />}
              errorMessage={phoneErrorMessage}
              showSuccessIcon={phoneStatus === 'success'}
              size="lg"
              className="h-20  px-5 text-14"
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
            {tc('confirm')}
          </Button>

          {/* Footer Link */}
          <div className="flex items-center justify-center">
            <Typography
              variant="bodySmall"
              textColor="tertiary"
              align="center"
              className="text-12 sm:text-14"
            >
             {t('forgotPassword.resendTextPrefix')}{' '}
              <button
                type="button"
                className="font-semibold text-gray-800 underline hover:text-brand-500 transition-colors"
              >
                {t('forgotPassword.resendButton')}
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
            <Image
              src={typeof forgetIcon === 'string' ? forgetIcon : forgetIcon.src}
              alt="Forget Password"
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
            {t('forgotPassword.instructionStep2')}
          </Typography>

          {/* Error Message */}
          <AuthErrorDisplay error={error} />

          {/* OTP Input */}
          <div className="w-full space-y-1 flex justify-center" dir={isRTL ? 'ltr' : 'ltr' }>
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
            {tc('confirm')}
          </Button>

          {/* Footer Link */}
          <div className="flex items-center justify-center">
            <Typography
              variant="bodySmall"
              textColor="tertiary"
              align="center"
              className="text-12 sm:text-14"
            >
             {t('forgotPassword.resendTextPrefix')}{' '}
              <button
                type="button"
                className="font-semibold text-gray-800 underline hover:text-brand-500 transition-colors"
              >
                {t('forgotPassword.resendButton')}
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
            <Image
              src={typeof forgetIcon === 'string' ? forgetIcon : forgetIcon.src}
              alt="Forget Password"
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
            {t('forgotPassword.instructionStep3')}
          </Typography>

          {/* Error Message */}
          <AuthErrorDisplay error={error} />

          {/* Password Input */}
          <div className="w-full space-y-1">
            <PasswordInput
              placeholder={t('forgotPassword.newPasswordPlaceholder')}
              value={password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
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
              placeholder={t('forgotPassword.confirmNewPasswordPlaceholder')}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onFocus={handleConfirmPasswordFocus}
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
            {tc('confirm')}
          </Button>

          {/* Footer Link */}
          <div className="flex items-center justify-center">
            <Typography
              variant="bodySmall"
              textColor="tertiary"
              align="center"
              className="text-12 sm:text-14"
            >
              {t('forgotPassword.resendTextPrefix')}{' '}
              <button
                type="button"
                className="font-semibold text-gray-800 underline hover:text-brand-500 transition-colors"
              >
                {t('forgotPassword.resendButton')}
              </button>
            </Typography>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <StatusModal
        open={showSuccessModal}
        title={t('forgotPassword.successModal.title')}
        description={t('forgotPassword.successModal.description')}
        confirmLabel={t('forgotPassword.successModal.confirmLabel')}
        onConfirm={handleSuccessModalConfirm}
        onClose={handleSuccessModalClose}
      />
    </div>
  )
}
