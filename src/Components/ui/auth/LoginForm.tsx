'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Input } from '../Input'
import { PasswordInput } from '../PasswordInput'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Typography } from '../Typography'
import { Mail, X, Check } from 'lucide-react'

export type FieldStatus = 'default' | 'error' | 'success'

export interface LoginFormProps {
  onEmailChange?: (value: string) => void
  onPasswordChange?: (value: string) => void
  onRememberMeChange?: (checked: boolean) => void
  onForgotPasswordClick?: () => void
  onLoginClick?: () => void
  onProviderClick?: () => void
  className?: string
}

/**
 * LoginForm - Login form component with interactive validation
 * Validates email and password fields on blur and submit
 */
export const LoginForm = ({
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onForgotPasswordClick,
  onLoginClick,
  onProviderClick,
  className,
}: LoginFormProps) => {
  // Form values
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Validation states
  const [emailStatus, setEmailStatus] = useState<FieldStatus>('default')
  const [passwordStatus, setPasswordStatus] = useState<FieldStatus>('default')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validation helpers
  const validateEmail = (
    value: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'Wrong E-mail, Please Try Again' }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return { isValid: false, message: 'Wrong E-mail, Please Try Again' }
    }
    return { isValid: true, message: '' }
  }

  const validatePassword = (
    value: string
  ): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return {
        isValid: false,
        message: "Password isn't correct, please try again",
      }
    }
    if (value.length < 8) {
      return {
        isValid: false,
        message: "Password isn't correct, please try again",
      }
    }
    return { isValid: true, message: '' }
  }

  // Handlers
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

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked)
    onRememberMeChange?.(checked)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Validate all fields
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    if (emailValidation.isValid) {
      setEmailStatus('success')
      setEmailErrorMessage('')
    } else {
      setEmailStatus('error')
      setEmailErrorMessage(emailValidation.message)
    }

    if (passwordValidation.isValid) {
      setPasswordStatus('success')
      setPasswordErrorMessage('')
    } else {
      setPasswordStatus('error')
      setPasswordErrorMessage(passwordValidation.message)
    }

    // Only proceed if all fields are valid
    if (emailValidation.isValid && passwordValidation.isValid) {
      onLoginClick?.()
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

  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const emailInputVariant = getInputVariant(emailStatus, email, emailFocused)
  const passwordInputVariant = getInputVariant(
    passwordStatus,
    password,
    passwordFocused
  )

  // Check if form is valid - validate values directly
  const isFormValid = (() => {
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)
    return emailValidation.isValid && passwordValidation.isValid
  })()

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('w-full space-y-2.5', className)}
    >
      {/* Email Field */}
      <div className="w-full space-y-1.5">
        <Input
          type="email"
          placeholder="example@example.com"
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

      {/* Password Field */}
      <div className="w-full space-y-1.5">
        <PasswordInput
          placeholder="Enter Password"
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

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={rememberMe}
            onChange={handleRememberMeChange}
            variant="default"
            size="md"
          />
          <Typography
            variant="bodySmall"
            textColor="secondary"
            className="text-16 font-medium"
          >
            Remember Me
          </Typography>
        </div>
        <Link
          href="/auth/forgot-password"
          className="text-16 font-normal text-gray-600 hover:text-brand-500 transition-colors"
        >
          Forget Password?
        </Link>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full text-white"
      >
        Login
      </Button>

      {/* Provider Link */}
      <div className="flex items-center justify-center pt-2">
        <Typography
          variant="bodySmall"
          textColor="tertiary"
          align="center"
          className="text-14 font-normal"
        >
          Are you providing your services?{' '}
          <button
            type="button"
            onClick={onProviderClick}
            className="font-normal text-gray-800 underline hover:text-brand-500 transition-colors"
          >
            Continue as provider
          </button>
        </Typography>
      </div>
    </form>
  )
}
