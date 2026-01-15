'use client'

import { useCallback, useState } from 'react'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { StatusModal } from '@/components/ui/StatusModal'
import { Link } from '@/i18n/navigation'
import { useI18nTranslations } from '@/i18n'

type FieldStatus = 'default' | 'error' | 'success'

export default function ChangePasswordPage() {
  const t = useI18nTranslations('changePassword')
  const tauth = useI18nTranslations('auth') // لو محتاج "Forget Password?" من auth
  const tCommon = useI18nTranslations('common')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validation states
  const [currentPasswordStatus, setCurrentPasswordStatus] =
    useState<FieldStatus>('default')
  const [newPasswordStatus, setNewPasswordStatus] =
    useState<FieldStatus>('default')
  const [confirmPasswordStatus, setConfirmPasswordStatus] =
    useState<FieldStatus>('default')

  // Error messages
  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  // Track touched fields
  const [currentPasswordTouched, setCurrentPasswordTouched] = useState(false)
  const [newPasswordTouched, setNewPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Focus states
  const [currentPasswordFocused, setCurrentPasswordFocused] = useState(false)
  const [newPasswordFocused, setNewPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  // ✅ Reset once (used in modal confirm/close)
  const resetForm = useCallback(() => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')

    setCurrentPasswordStatus('default')
    setNewPasswordStatus('default')
    setConfirmPasswordStatus('default')

    setCurrentPasswordError('')
    setNewPasswordError('')
    setConfirmPasswordError('')

    setCurrentPasswordTouched(false)
    setNewPasswordTouched(false)
    setConfirmPasswordTouched(false)

    setIsSubmitted(false)
  }, [])

  // Validation helpers (كلها مترجمة)
  const validateCurrentPassword = (value: string) => {
    if (!value.trim()) {
      return { isValid: false, message: t('errors.currentInvalid') }
    }
    // Demo rule (بدون API): أقل من 6 اعتبره غلط
    if (value.length < 6) {
      return { isValid: false, message: t('errors.currentInvalid') }
    }
    return { isValid: true, message: '' }
  }

  const validateNewPassword = (value: string) => {
    if (!value.trim()) {
      return { isValid: false, message: t('errors.newRequired') }
    }
    if (value.length < 8) {
      return { isValid: false, message: t('errors.newMin') }
    }
    return { isValid: true, message: '' }
  }

  const validateConfirmPassword = (value: string, originalPassword: string) => {
    if (!value.trim()) {
      return { isValid: false, message: t('errors.confirmRequired') }
    }
    if (value !== originalPassword) {
      return { isValid: false, message: t('errors.notMatch') }
    }
    return { isValid: true, message: '' }
  }

  // Map field status to PasswordInput variants
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

  const currentPasswordVariant = getInputVariant(
    currentPasswordStatus,
    currentPassword,
    currentPasswordFocused
  )
  const newPasswordVariant = getInputVariant(
    newPasswordStatus,
    newPassword,
    newPasswordFocused
  )
  const confirmPasswordVariant = getInputVariant(
    confirmPasswordStatus,
    confirmPassword,
    confirmPasswordFocused
  )

  // Handlers
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentPassword(value)

    if (currentPasswordTouched || isSubmitted) {
      const v = validateCurrentPassword(value)
      setCurrentPasswordStatus(v.isValid ? 'success' : 'error')
      setCurrentPasswordError(v.message)
    } else if (currentPasswordStatus === 'error') {
      setCurrentPasswordStatus('default')
      setCurrentPasswordError('')
    }
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)

    if (newPasswordTouched || isSubmitted) {
      const v = validateNewPassword(value)
      setNewPasswordStatus(v.isValid ? 'success' : 'error')
      setNewPasswordError(v.message)
    } else if (newPasswordStatus === 'error') {
      setNewPasswordStatus('default')
      setNewPasswordError('')
    }

    // re-validate confirm if needed
    if (confirmPassword && (confirmPasswordTouched || isSubmitted)) {
      const cv = validateConfirmPassword(confirmPassword, value)
      setConfirmPasswordStatus(cv.isValid ? 'success' : 'error')
      setConfirmPasswordError(cv.message)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (confirmPasswordTouched || isSubmitted) {
      const v = validateConfirmPassword(value, newPassword)
      setConfirmPasswordStatus(v.isValid ? 'success' : 'error')
      setConfirmPasswordError(v.message)
    } else if (confirmPasswordStatus === 'error') {
      setConfirmPasswordStatus('default')
      setConfirmPasswordError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    const v1 = validateCurrentPassword(currentPassword)
    const v2 = validateNewPassword(newPassword)
    const v3 = validateConfirmPassword(confirmPassword, newPassword)

    setCurrentPasswordStatus(v1.isValid ? 'success' : 'error')
    setCurrentPasswordError(v1.message)

    setNewPasswordStatus(v2.isValid ? 'success' : 'error')
    setNewPasswordError(v2.message)

    setConfirmPasswordStatus(v3.isValid ? 'success' : 'error')
    setConfirmPasswordError(v3.message)

    if (v1.isValid && v2.isValid && v3.isValid) {
      setShowSuccessModal(true)
    }
  }

  return (
    <>
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-normal text-gray-900">{t('title')}</h1>

          <button
            type="submit"
            form="change-password-form"
            className="text-16 font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            {t('saveChanges')}
          </button>
        </div>

        {/* Main Panel */}
        <form
          id="change-password-form"
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          {/* Current Password */}
          <div className="mb-10 border border-gray-200 rounded-xl p-4">
            <label className="block text-14 font-normal text-gray-900 mb-2">
              {t('currentPassword')}
            </label>

            <PasswordInput
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              onFocus={() => setCurrentPasswordFocused(true)}
              onBlur={() => {
                setCurrentPasswordFocused(false)
                setCurrentPasswordTouched(true)
                const v = validateCurrentPassword(currentPassword)
                setCurrentPasswordStatus(v.isValid ? 'success' : 'error')
                setCurrentPasswordError(v.message)
              }}
              variant={currentPasswordVariant}
              errorMessage={currentPasswordError}
              showSuccessIcon={currentPasswordStatus === 'success'}
              placeholder={t('enterPassword')}
            />

            <div className="mt-2 flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-14 font-medium hover:text-brand-600 transition-colors"
              >
                {tauth('loginForm.forgotPasswordLink')}
              </Link>
            </div>
          </div>

          {/* New + Confirm */}
          <div className="mb-10 border border-gray-200 rounded-xl p-4">
            <div className="mb-6">
              <label className="block text-14 font-normal text-gray-900 mb-2">
                {t('newPassword')}
              </label>

              <PasswordInput
                value={newPassword}
                onChange={handleNewPasswordChange}
                onFocus={() => setNewPasswordFocused(true)}
                onBlur={() => {
                  setNewPasswordFocused(false)
                  setNewPasswordTouched(true)
                  const v = validateNewPassword(newPassword)
                  setNewPasswordStatus(v.isValid ? 'success' : 'error')
                  setNewPasswordError(v.message)
                }}
                variant={newPasswordVariant}
                errorMessage={newPasswordError}
                showSuccessIcon={newPasswordStatus === 'success'}
                placeholder={t('enterNewPassword')}
              />

              {newPassword && (
                <PasswordStrength password={newPassword} className="mt-2" />
              )}
            </div>

            <div>
              <label className="block text-14 font-normal text-gray-900 mb-2">
                {t('confirmNewPassword')}
              </label>

              <PasswordInput
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => {
                  setConfirmPasswordFocused(false)
                  setConfirmPasswordTouched(true)
                  const v = validateConfirmPassword(confirmPassword, newPassword)
                  setConfirmPasswordStatus(v.isValid ? 'success' : 'error')
                  setConfirmPasswordError(v.message)
                }}
                variant={confirmPasswordVariant}
                errorMessage={confirmPasswordError}
                showSuccessIcon={confirmPasswordStatus === 'success'}
                placeholder={t('confirmNewPasswordPlaceholder')}
              />
            </div>
          </div>
        </form>
      </div>

      <StatusModal
        open={showSuccessModal}
        title={t('success.title')}
        description={t('success.description')}
        confirmLabel={tCommon('confirm')}
        onConfirm={() => {
          setShowSuccessModal(false)
          resetForm()
        }}
        onClose={() => {
          setShowSuccessModal(false)
          resetForm()
        }}
      />
    </>
  )
}
