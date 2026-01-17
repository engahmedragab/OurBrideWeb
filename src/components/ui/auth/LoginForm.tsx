'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Input } from '../Input'
import { PasswordInput } from '../PasswordInput'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Typography } from '../Typography'
import { Mail } from 'lucide-react'
import { useI18nTranslations } from '@/i18n'


export type FieldStatus = 'default' | 'error' | 'success'

export interface LoginFormProps {
  onIdentifierChange?: (value: string) => void
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
  onIdentifierChange,
  onPasswordChange,
  onRememberMeChange,
  onForgotPasswordClick,
  onLoginClick,
  onProviderClick,
  className,
}: LoginFormProps) => {
  const t = useI18nTranslations('auth')

  // Form values
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // UI states
  const [identifierFocused, setIdentifierFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  // Validation states
  const [identifierStatus, setIdentifierStatus] =
    useState<FieldStatus>('default')
  const [passwordStatus, setPasswordStatus] = useState<FieldStatus>('default')
  const [identifierErrorMessage, setIdentifierErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [identifierTouched, setIdentifierTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validation helpers
  const validateIdentifier = (
    value: string
  ): { isValid: boolean; message: string } => {
    const msg = t('loginForm.errors.wrongEmail')
    if (!value.trim()) {
      return {
        isValid: false,
        message: msg,
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[0-9]{10,15}$/
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      return {
        isValid: false,
        message: msg,
      }
    }
    return { isValid: true, message: '' }
  }

  const validatePassword = (value: string): { isValid: boolean; message: string } => {
    const msg = t('loginForm.errors.wrongPassword')
    if (!value.trim()) return { isValid: false, message: msg }
    if (value.length < 7) return { isValid: false, message: msg }
    return { isValid: true, message: '' }
  }

  // Handlers
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setIdentifier(value)
    onIdentifierChange?.(value)

    // Validate in real-time if field was touched
    if (identifierTouched || isSubmitted) {
      const validation = validateIdentifier(value)
      if (validation.isValid) {
        setIdentifierStatus('success')
        setIdentifierErrorMessage('')
      } else {
        setIdentifierStatus('error')
        setIdentifierErrorMessage(validation.message)
      }
    } else if (identifierStatus === 'error') {
      setIdentifierStatus('default')
      setIdentifierErrorMessage('')
    }
  }

  const handleIdentifierFocus = () => {
    setIdentifierFocused(true)
  }

  const handleIdentifierBlur = () => {
    setIdentifierFocused(false)
    setIdentifierTouched(true)
    const validation = validateIdentifier(identifier)
    if (validation.isValid) {
      setIdentifierStatus('success')
      setIdentifierErrorMessage('')
    } else {
      setIdentifierStatus('error')
      setIdentifierErrorMessage(validation.message)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    onPasswordChange?.(value)

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

  const handlePasswordFocus = () => setPasswordFocused(true)

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

  const handleForgotPasswordClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onForgotPasswordClick) return
    e.preventDefault()
    onForgotPasswordClick()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Validate all fields
    const identifierValidation = validateIdentifier(identifier)
    const passwordValidation = validatePassword(password)

    if (identifierValidation.isValid) {
      setIdentifierStatus('success')
      setIdentifierErrorMessage('')
    } else {
      setIdentifierStatus('error')
      setIdentifierErrorMessage(identifierValidation.message)
    }

    if (passwordValidation.isValid) {
      setPasswordStatus('success')
      setPasswordErrorMessage('')
    } else {
      setPasswordStatus('error')
      setPasswordErrorMessage(passwordValidation.message)
    }

    // Only proceed if all fields are valid
    if (identifierValidation.isValid && passwordValidation.isValid) {
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

  const identifierInputVariant = getInputVariant(
    identifierStatus,
    identifier,
    identifierFocused
  )
  const passwordInputVariant = getInputVariant(
    passwordStatus,
    password,
    passwordFocused
  )

  return (
    <form onSubmit={handleSubmit} className={cn('w-full space-y-2.5', className)}>
      {/* Identifier Field (Email or Phone) */}
      <div className="w-full space-y-1.5">
        <Input
          type="text"
          placeholder={t('loginForm.emailPlaceholder')}
          value={identifier}
          onChange={handleIdentifierChange}
          onFocus={handleIdentifierFocus}
          onBlur={handleIdentifierBlur}
          variant={identifierInputVariant}
          prefixIcon={Mail}
          errorMessage={identifierErrorMessage}
          showSuccessIcon={identifierStatus === 'success'}
          size="lg"
        />
      </div>

      {/* Password Field */}
      <div className="w-full space-y-1.5">
        <PasswordInput
          placeholder={t('loginForm.passwordPlaceholder')}
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
      <div className="flex items-center justify-between !mt-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={rememberMe}
            onChange={handleRememberMeChange}
            variant="default"
            size="sm"
          />
          <Typography
            variant="bodySmall"
            textColor="secondary"
            className="text-14 font-normal"
          >
            {t('loginForm.rememberMe')}
          </Typography>
        </div>

        <Link
          href="/auth/forgot-password"
          onClick={handleForgotPasswordClick}
          className="text-14 font-normal text-gray-600 hover:text-brand-500 transition-colors "
        >
          {t('loginForm.forgotPasswordLink')}
        </Link>
      </div>

      {/* Login Button */}
      <Button type="submit" variant="brand" size="lg" className="w-full text-white">
        {t('loginForm.loginButton')}
      </Button>

      {/* Provider Link */}
      <div className="flex items-center justify-center pt-2">
        <Typography
          variant="bodySmall"
          textColor="tertiary"
          align="center"
          className="text-14 font-normal"
        >
          {t('loginForm.providerTextPrefix')}{' '}
          <button
            type="button"
            onClick={onProviderClick}
            className="font-normal text-gray-800 underline hover:text-brand-500 transition-colors"
          >
            {t('loginForm.providerAction')}
          </button>
        </Typography>
      </div>
    </form>
  )
}
