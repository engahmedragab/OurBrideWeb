import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../Input'
import { PasswordInput } from '../PasswordInput'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { GenderSelector } from '../GenderSelector'
import { PasswordStrength } from '../PasswordStrength'
import { Typography } from '../Typography'
import { Mail, User, Phone, X, Check } from 'lucide-react'

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
  const validateFullName = (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'Full name is required' }
    }
    return { isValid: true, message: '' }
  }

  const validateEmail = (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'E-mail is required' }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return { isValid: false, message: 'Please enter a valid email address' }
    }
    return { isValid: true, message: '' }
  }

  const validateMobile = (value: string): { isValid: boolean; message: string } => {
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

  const handleFullNameBlur = () => {
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

  const handleEmailBlur = () => {
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

  const handleMobileBlur = () => {
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
      setGenderErrorMessage('Please select your gender')
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
      setTermsErrorMessage('You must accept Terms & Conditions')
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
    status: FieldStatus
  ): 'default' | 'error' | 'success' => {
    if (status === 'error') return 'error'
    if (status === 'success') return 'success'
    return 'default'
  }

  const fullNameInputVariant = getInputVariant(fullNameStatus)
  const emailInputVariant = getInputVariant(emailStatus)
  const mobileInputVariant = getInputVariant(mobileStatus)
  const passwordInputVariant = getInputVariant(passwordStatus)
  const confirmPasswordInputVariant = getInputVariant(confirmPasswordStatus)

  // Check if form is valid - validate values directly
  const isFormValid = (() => {
    const fullNameValidation = validateFullName(fullName)
    const emailValidation = validateEmail(email)
    const mobileValidation = validateMobile(mobileNumber)
    const passwordValidation = validatePassword(password)
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword, password)
    
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
    <form onSubmit={handleSubmit} className={cn('w-full space-y-2.5 sm:space-y-3', className)}>
      {/* Full Name Field */}
      <div className="w-full space-y-1">
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={handleFullNameChange}
          onBlur={handleFullNameBlur}
          variant={fullNameInputVariant}
          prefixIcon={User}
          errorMessage={fullNameErrorMessage}
          showSuccessIcon={fullNameStatus === 'success'}
          size="lg"
        />
      </div>

      {/* Gender Selector */}
      <div className="w-full space-y-1">
        <GenderSelector
          value={gender}
          onChange={handleGenderChange}
          className="w-full"
        />
        {genderErrorMessage && (
          <div className="mt-1 flex items-center gap-1 text-12 text-error-500">
            <X className="h-3 w-3 flex-shrink-0" />
            <span>{genderErrorMessage}</span>
          </div>
        )}
      </div>

      {/* Email Field */}
      <div className="w-full space-y-1">
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          variant={emailInputVariant}
          prefixIcon={Mail}
          errorMessage={emailErrorMessage}
          showSuccessIcon={emailStatus === 'success'}
          size="lg"
        />
      </div>

      {/* Mobile Number Field */}
      <div className="w-full space-y-1">
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={handleMobileChange}
          onBlur={handleMobileBlur}
          variant={mobileInputVariant}
          prefixIcon={Phone}
          errorMessage={mobileErrorMessage}
          showSuccessIcon={mobileStatus === 'success'}
          size="lg"
        />
      </div>

      {/* Password Field */}
      <div className="w-full space-y-2">
        <PasswordInput
          placeholder="Enter Password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          variant={passwordInputVariant}
          errorMessage={passwordErrorMessage}
          showSuccessIcon={passwordStatus === 'success'}
          size="lg"
        />
        {password && <PasswordStrength password={password} />}
      </div>

      {/* Confirm Password Field */}
      <div className="w-full space-y-1">
        <PasswordInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={handleConfirmPasswordBlur}
          variant={confirmPasswordInputVariant}
          errorMessage={confirmPasswordErrorMessage}
          showSuccessIcon={confirmPasswordStatus === 'success'}
          size="lg"
        />
      </div>

      {/* Terms & Conditions */}
      <div className="w-full space-y-1">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={acceptedTerms}
            onChange={handleAcceptedTermsChange}
            variant={termsErrorMessage ? 'error' : 'default'}
            size="md"
          />
          <Typography variant="bodySmall" textColor="secondary" className="text-12 sm:text-14">
            I Accepted{' '}
            <button
              type="button"
              onClick={onTermsClick}
              className="font-semibold text-brand-500 hover:text-brand-600 underline transition-colors"
            >
              Terms & Conditions
            </button>
          </Typography>
        </div>
        {termsErrorMessage && (
          <div className="ml-7 flex items-center gap-1 text-11 sm:text-12 text-error-500">
            <X className="h-3 w-3 flex-shrink-0" />
            <span>{termsErrorMessage}</span>
          </div>
        )}
      </div>

      {/* Signup Button */}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full text-white"
      >
        SignUp
      </Button>

      {/* Provider Link */}
      <div className="flex items-center justify-center">
        <Typography variant="bodySmall" textColor="tertiary" align="center" className="text-12 sm:text-14">
          Are you providing your services?{' '}
          <button
            type="button"
            onClick={onProviderClick}
            className="font-semibold text-gray-800 underline hover:text-brand-500 transition-colors"
          >
            Continue as provider
          </button>
        </Typography>
      </div>
    </form>
  )
}
