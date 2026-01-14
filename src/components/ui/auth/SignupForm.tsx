'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../Input'
import { PasswordInput } from '../PasswordInput'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '../Checkbox'
import { GenderSelector } from '../GenderSelector'
import { PasswordStrength } from '../PasswordStrength'
import { Typography } from '@/components/ui/Typography'
import { Mail, User, X, Check, Phone } from 'lucide-react'
import { useI18nTranslations } from '@/i18n'

export type FieldStatus = 'default' | 'error' | 'success'

export interface SignupFormProps {
  onFullNameChange?: (value: string) => void
  onGenderChange?: (value: 'male' | 'female') => void
  onEmailChange?: (value: string) => void
  onMobileChange?: (value: string) => void
  onPasswordChange?: (value: string) => void
  onConfirmPasswordChange?: (value: string) => void
  onAcceptedTermsChange?: (checked: boolean) => void
  onTermsClick?: () => void
  onSignupClick?: () => void
  onProviderClick?: () => void
  className?: string
}

/**
 * SignupForm - Signup form component with interactive validation
 * Validates all fields on blur and submit
 */
export const SignupForm = ({
  onFullNameChange,
  onGenderChange,
  onEmailChange,
  onMobileChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAcceptedTermsChange,
  onTermsClick,
  onSignupClick,
  onProviderClick,
  className,
}: SignupFormProps) => {
  const t = useI18nTranslations('auth.signupForm')
  const tCommon = useI18nTranslations('common')
  // Form values
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | undefined>()
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Validation states
  const [fullNameStatus, setFullNameStatus] = useState<FieldStatus>('default')
  const [emailStatus, setEmailStatus] = useState<FieldStatus>('default')
  const [mobileStatus, setMobileStatus] = useState<FieldStatus>('default')
  const [passwordStatus, setPasswordStatus] = useState<FieldStatus>('default')
  const [confirmPasswordStatus, setConfirmPasswordStatus] =
    useState<FieldStatus>('default')

  // Error messages
  const [fullNameErrorMessage, setFullNameErrorMessage] = useState('')
  const [genderErrorMessage, setGenderErrorMessage] = useState('')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('')
  const [termsErrorMessage, setTermsErrorMessage] = useState('')

  // Track touched fields for real-time validation
  const [fullNameTouched, setFullNameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [mobileTouched, setMobileTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validation helpers
  const validateFullName = (
    value: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: t('errors.fullNameRequired') }
    }
    return { isValid: true, message: '' }
  }

  const validateEmail = (
    value: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: t('errors.emailRequired') }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return { isValid: false, message: t('errors.emailInvalid') }
    }
    return { isValid: true, message: '' }
  }

  const validateMobile = (
    value: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: t('errors.mobileRequired') }
    }
    // Basic phone validation: starts with +20 or 01 and has enough digits
    const phoneRegex = /^(\+20|01)[0-9]{9,}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return { isValid: false, message: t('errors.mobileInvalid') }
    }
    return { isValid: true, message: '' }
  }

  const validatePassword = (
    value: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: t('errors.passwordRequired') }
    }
    if (value.length < 8) {
      return {
        isValid: false,
        message: t('errors.passwordMin'),
      }
    }
    return { isValid: true, message: '' }
  }

  const validateConfirmPassword = (
    value: string,
    originalPassword: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: t('errors.confirmPasswordRequired') }
    }
    if (value !== originalPassword) {
      return { isValid: false, message: t('errors.passwordNotMatch') }
    }
    return { isValid: true, message: '' }
  }

  // Handlers
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)
    onFullNameChange?.(value)

    // Validate in real-time if field was touched
    if (fullNameTouched || isSubmitted) {
      const validation = validateFullName(value)
      if (validation.isValid) {
        setFullNameStatus('success')
        setFullNameErrorMessage('')
      } else {
        setFullNameStatus('error')
        setFullNameErrorMessage(validation.message)
      }
    } else if (fullNameStatus === 'error') {
      setFullNameStatus('default')
      setFullNameErrorMessage('')
    }
  }

  const handleFullNameFocus = () => {
    setFullNameFocused(true)
  }

  const handleFullNameBlur = () => {
    setFullNameFocused(false)
    setFullNameTouched(true)
    const validation = validateFullName(fullName)
    if (validation.isValid) {
      setFullNameStatus('success')
      setFullNameErrorMessage('')
    } else {
      setFullNameStatus('error')
      setFullNameErrorMessage(validation.message)
    }
  }

  const handleGenderChange = (value: 'male' | 'female') => {
    setGender(value)
    onGenderChange?.(value)
    setGenderErrorMessage('')
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    onEmailChange?.(value)

    // Validate in real-time if field was touched
    if (emailTouched || isSubmitted) {
      const validation = validateEmail(value)
      if (validation.isValid) {
        setEmailStatus('success')
        setEmailErrorMessage('')
      } else {
        setEmailStatus('error')
        setEmailErrorMessage(validation.message)
      }
    } else if (emailStatus === 'error') {
      setEmailStatus('default')
      setEmailErrorMessage('')
    }
  }

  const handleEmailFocus = () => {
    setEmailFocused(true)
  }

  const handleEmailBlur = () => {
    setEmailFocused(false)
    setEmailTouched(true)
    const validation = validateEmail(email)
    if (validation.isValid) {
      setEmailStatus('success')
      setEmailErrorMessage('')
    } else {
      setEmailStatus('error')
      setEmailErrorMessage(validation.message)
    }
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMobileNumber(value)
    onMobileChange?.(value)

    // Validate in real-time if field was touched
    if (mobileTouched || isSubmitted) {
      const validation = validateMobile(value)
      if (validation.isValid) {
        setMobileStatus('success')
        setMobileErrorMessage('')
      } else {
        setMobileStatus('error')
        setMobileErrorMessage(validation.message)
      }
    } else if (mobileStatus === 'error') {
      setMobileStatus('default')
      setMobileErrorMessage('')
    }
  }

  const handleMobileFocus = () => {
    setMobileFocused(true)
  }

  const handleMobileBlur = () => {
    setMobileFocused(false)
    setMobileTouched(true)
    const validation = validateMobile(mobileNumber)
    if (validation.isValid) {
      setMobileStatus('success')
      setMobileErrorMessage('')
    } else {
      setMobileStatus('error')
      setMobileErrorMessage(validation.message)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    onPasswordChange?.(value)

    // Validate in real-time if field was touched
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
    if (confirmPassword && (confirmPasswordTouched || isSubmitted)) {
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
    onConfirmPasswordChange?.(value)

    // Validate in real-time if field was touched
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

  const handleAcceptedTermsChange = (checked: boolean) => {
    setAcceptedTerms(checked)
    onAcceptedTermsChange?.(checked)
    if (checked) {
      setTermsErrorMessage('')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Validate all fields
    const fullNameValidation = validateFullName(fullName)
    const emailValidation = validateEmail(email)
    const mobileValidation = validateMobile(mobileNumber)
    const passwordValidation = validatePassword(password)
    const confirmPasswordValidation = validateConfirmPassword(
      confirmPassword,
      password
    )

    // Update statuses
    if (fullNameValidation.isValid) {
      setFullNameStatus('success')
      setFullNameErrorMessage('')
    } else {
      setFullNameStatus('error')
      setFullNameErrorMessage(fullNameValidation.message)
    }

    if (!gender) {
      setGenderErrorMessage(t('errors.genderRequired'))
    } else {
      setGenderErrorMessage('')
    }

    if (emailValidation.isValid) {
      setEmailStatus('success')
      setEmailErrorMessage('')
    } else {
      setEmailStatus('error')
      setEmailErrorMessage(emailValidation.message)
    }

    if (mobileValidation.isValid) {
      setMobileStatus('success')
      setMobileErrorMessage('')
    } else {
      setMobileStatus('error')
      setMobileErrorMessage(mobileValidation.message)
    }

    if (passwordValidation.isValid) {
      setPasswordStatus('success')
      setPasswordErrorMessage('')
    } else {
      setPasswordStatus('error')
      setPasswordErrorMessage(passwordValidation.message)
    }

    if (confirmPasswordValidation.isValid) {
      setConfirmPasswordStatus('success')
      setConfirmPasswordErrorMessage('')
    } else {
      setConfirmPasswordStatus('error')
      setConfirmPasswordErrorMessage(confirmPasswordValidation.message)
    }

    if (!acceptedTerms) {
        setTermsErrorMessage(t('errors.termsErrorRequired'))
    } else {
      setTermsErrorMessage('')
    }

    // Only proceed if all fields are valid
    if (
      fullNameValidation.isValid &&
      gender &&
      emailValidation.isValid &&
      mobileValidation.isValid &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid &&
      acceptedTerms
    ) {
      onSignupClick?.()
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

  const [fullNameFocused, setFullNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [mobileFocused, setMobileFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  const fullNameInputVariant = getInputVariant(
    fullNameStatus,
    fullName,
    fullNameFocused
  )
  const emailInputVariant = getInputVariant(emailStatus, email, emailFocused)
  const mobileInputVariant = getInputVariant(
    mobileStatus,
    mobileNumber,
    mobileFocused
  )
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

  // Check if form is valid - validate values directly
  const isFormValid = (() => {
    const fullNameValidation = validateFullName(fullName)
    const emailValidation = validateEmail(email)
    const mobileValidation = validateMobile(mobileNumber)
    const passwordValidation = validatePassword(password)
    const confirmPasswordValidation = validateConfirmPassword(
      confirmPassword,
      password
    )

    return (
      fullNameValidation.isValid &&
      gender !== undefined &&
      emailValidation.isValid &&
      mobileValidation.isValid &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid &&
      acceptedTerms
    )
  })()

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('w-full space-y-2.5', className)}
    >
      {/* Full Name Field */}
      <div className="w-full space-y-1.5">
        <Input
          type="text"
          placeholder={t('fullNamePlaceholder')}
          value={fullName}
          onChange={handleFullNameChange}
          onFocus={handleFullNameFocus}
          onBlur={handleFullNameBlur}
          variant={fullNameInputVariant}
          prefixIcon={User}
          errorMessage={fullNameErrorMessage}
          showSuccessIcon={fullNameStatus === 'success'}
          size="lg"
        />
      </div>

      {/* Gender Selector */}
      <div className="w-full space-y-1.5">
        <GenderSelector
          value={gender}
          onChange={handleGenderChange}
          className="w-full"
        />
        {genderErrorMessage && (
          <div className="mt-2 flex items-center gap-2 text-14 font-normal leading-4 text-red-500">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500 flex-shrink-0">
              <X className="h-2.5 w-2.5 text-red-500" />
            </div>
            <span>{genderErrorMessage}</span>
          </div>
        )}
      </div>

      {/* Email Field */}
      <div className="w-full space-y-1.5">
        <Input
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={handleEmailChange}
          onFocus={handleEmailFocus}
          onBlur={handleEmailBlur}
          variant={emailInputVariant}
          prefixIcon={Mail}
          errorMessage={emailErrorMessage}
          showSuccessIcon={emailStatus === 'success'}
          size="lg"
        />
      </div>

      {/* Mobile Number Field */}
      <div className="w-full space-y-1.5">
        <Input
          type="tel"
          placeholder={t('mobilePlaceholder')}
          value={mobileNumber}
          onChange={handleMobileChange}
          onFocus={handleMobileFocus}
          onBlur={handleMobileBlur}
          variant={mobileInputVariant}
          prefixIcon={<Phone className="h-6 w-6" />}
          errorMessage={mobileErrorMessage}
          showSuccessIcon={mobileStatus === 'success'}
          size="lg"
        />
      </div>

      {/* Password Field */}
      <div className="w-full space-y-1.5">
        <PasswordInput
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={handlePasswordChange}
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
          variant={passwordInputVariant}
          errorMessage={passwordErrorMessage}
          showSuccessIcon={passwordStatus === 'success'}
          size="lg"
        />
        {password && <PasswordStrength password={password} />}
      </div>

      {/* Confirm Password Field */}
      <div className="w-full space-y-1.5">
        <PasswordInput
          placeholder={t('confirmPasswordPlaceholder')}
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

      {/* Terms & Conditions */}
      <div className="w-full">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={acceptedTerms}
            onChange={handleAcceptedTermsChange}
            variant="default"
            size="md"
          />
          <Typography
            variant="bodySmall"
            textColor="secondary"
            className="text-14 font-normal"
          >
            {t('terms.labelPrefix')} {' '}
            <button
              type="button"
              onClick={onTermsClick}
              className="font-medium text-brand-500 hover:text-brand-600 underline transition-colors"
            >
              {t('terms.linkLabel')}
            </button>
          </Typography>
        </div>
      </div>

      {/* Signup Button */}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full text-white"
      >
        {t('button.signup')}
      </Button>

      {/* Provider Link */}
      <div className="flex items-center justify-center pt-2">
        <Typography
          variant="bodySmall"
          textColor="tertiary"
          align="center"
          className="text-14 font-normal"
        >
          {t('provider.text')} {' '}
          <button
            type="button"
            onClick={onProviderClick}
            className="font-normal text-gray-800 underline hover:text-brand-500 transition-colors"
          >
            {t('provider.action')}
          </button>
        </Typography>
      </div>
    </form>
  )
}
