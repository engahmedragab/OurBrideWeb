'use client'

import { useState } from 'react'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { StatusModal } from '@/components/ui/StatusModal'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type FieldStatus = 'default' | 'error' | 'success'

/**
 * Change Password Page - Interactive Form with Validation (No API Logic)
 * Form validates and shows errors/success modal without API calls
 */
export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validation states
  const [currentPasswordStatus, setCurrentPasswordStatus] = useState<FieldStatus>('default')
  const [newPasswordStatus, setNewPasswordStatus] = useState<FieldStatus>('default')
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState<FieldStatus>('default')

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

  // Validation helpers
  const validateCurrentPassword = (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: "Password isn't correct, please try again" }
    }
    // Simulate validation - in real app, this would check against current password
    // For demo: accept any password with length >= 6
    if (value.length < 6) {
      return { isValid: false, message: "Password isn't correct, please try again" }
    }
    return { isValid: true, message: '' }
  }

  const validateNewPassword = (value: string): { isValid: boolean; message: string } => {
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
      return { isValid: false, message: "Password doesn't match, please try again" }
    }
    return { isValid: true, message: '' }
  }

  // Handlers
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentPassword(value)

    if (currentPasswordTouched || isSubmitted) {
      const validation = validateCurrentPassword(value)
      if (validation.isValid) {
        setCurrentPasswordStatus('success')
        setCurrentPasswordError('')
      } else {
        setCurrentPasswordStatus('error')
        setCurrentPasswordError(validation.message)
      }
    } else if (currentPasswordStatus === 'error') {
      setCurrentPasswordStatus('default')
      setCurrentPasswordError('')
    }
  }

  const handleCurrentPasswordBlur = () => {
    setCurrentPasswordTouched(true)
    const validation = validateCurrentPassword(currentPassword)
    if (validation.isValid) {
      setCurrentPasswordStatus('success')
      setCurrentPasswordError('')
    } else {
      setCurrentPasswordStatus('error')
      setCurrentPasswordError(validation.message)
    }
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)

    if (newPasswordTouched || isSubmitted) {
      const validation = validateNewPassword(value)
      if (validation.isValid) {
        setNewPasswordStatus('success')
        setNewPasswordError('')
      } else {
        setNewPasswordStatus('error')
        setNewPasswordError(validation.message)
      }
    } else if (newPasswordStatus === 'error') {
      setNewPasswordStatus('default')
      setNewPasswordError('')
    }

    // Re-validate confirm password if it's already filled
    if (confirmPassword && (confirmPasswordTouched || isSubmitted)) {
      const confirmValidation = validateConfirmPassword(confirmPassword, value)
      if (confirmValidation.isValid) {
        setConfirmPasswordStatus('success')
        setConfirmPasswordError('')
      } else {
        setConfirmPasswordStatus('error')
        setConfirmPasswordError(confirmValidation.message)
      }
    }
  }

  const handleNewPasswordBlur = () => {
    setNewPasswordTouched(true)
    const validation = validateNewPassword(newPassword)
    if (validation.isValid) {
      setNewPasswordStatus('success')
      setNewPasswordError('')
    } else {
      setNewPasswordStatus('error')
      setNewPasswordError(validation.message)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (confirmPasswordTouched || isSubmitted) {
      const validation = validateConfirmPassword(value, newPassword)
      if (validation.isValid) {
        setConfirmPasswordStatus('success')
        setConfirmPasswordError('')
      } else {
        setConfirmPasswordStatus('error')
        setConfirmPasswordError(validation.message)
      }
    } else if (confirmPasswordStatus === 'error') {
      setConfirmPasswordStatus('default')
      setConfirmPasswordError('')
    }
  }

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true)
    const validation = validateConfirmPassword(confirmPassword, newPassword)
    if (validation.isValid) {
      setConfirmPasswordStatus('success')
      setConfirmPasswordError('')
    } else {
      setConfirmPasswordStatus('error')
      setConfirmPasswordError(validation.message)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Validate all fields
    const currentPasswordValidation = validateCurrentPassword(currentPassword)
    const newPasswordValidation = validateNewPassword(newPassword)
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword, newPassword)

    // Update statuses
    if (currentPasswordValidation.isValid) {
      setCurrentPasswordStatus('success')
      setCurrentPasswordError('')
    } else {
      setCurrentPasswordStatus('error')
      setCurrentPasswordError(currentPasswordValidation.message)
    }

    if (newPasswordValidation.isValid) {
      setNewPasswordStatus('success')
      setNewPasswordError('')
    } else {
      setNewPasswordStatus('error')
      setNewPasswordError(newPasswordValidation.message)
    }

    if (confirmPasswordValidation.isValid) {
      setConfirmPasswordStatus('success')
      setConfirmPasswordError('')
    } else {
      setConfirmPasswordStatus('error')
      setConfirmPasswordError(confirmPasswordValidation.message)
    }

    // If all valid, show success modal
    if (
      currentPasswordValidation.isValid &&
      newPasswordValidation.isValid &&
      confirmPasswordValidation.isValid
    ) {
      // Simulate successful password change
      setShowSuccessModal(true)
    }
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

  const [currentPasswordFocused, setCurrentPasswordFocused] = useState(false)
  const [newPasswordFocused, setNewPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  const currentPasswordVariant = getInputVariant(
    currentPasswordStatus,
    currentPassword,
    currentPasswordFocused
  )
  const newPasswordVariant = getInputVariant(newPasswordStatus, newPassword, newPasswordFocused)
  const confirmPasswordVariant = getInputVariant(
    confirmPasswordStatus,
    confirmPassword,
    confirmPasswordFocused
  )

  return (
    <>
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-normal text-gray-900">Change Password</h1>
          <button
            type="submit"
            form="change-password-form"
            className="text-16 font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            Save Changes
          </button>
        </div>

        {/* Main Panel */}
        <form
          id="change-password-form"
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          {/* Current Password Field */}
          <div className="mb-10 border border-gray-200 rounded-xl p-4">
            <label className="block text-14 font-normal text-gray-900 mb-2">
              Current Password
            </label>
            <PasswordInput
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              onFocus={() => setCurrentPasswordFocused(true)}
              onBlur={() => {
                setCurrentPasswordFocused(false)
                handleCurrentPasswordBlur()
              }}
              variant={currentPasswordVariant}
              errorMessage={currentPasswordError}
              showSuccessIcon={currentPasswordStatus === 'success'}
              placeholder="Enter Password"
            />
            <div className="mt-2 flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-14 font-medium  hover:text-brand-600 transition-colors"
              >
                Forget Password?
              </Link>
            </div>
          </div>
  <div className="mb-10 border border-gray-200 rounded-xl p-4">  <div className="mb-6">
            <label className="block text-14 font-normal text-gray-900 mb-2">
              New Password
            </label>
            <PasswordInput
              value={newPassword}
              onChange={handleNewPasswordChange}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => {
                setNewPasswordFocused(false)
                handleNewPasswordBlur()
              }}
              variant={newPasswordVariant}
              errorMessage={newPasswordError}
              showSuccessIcon={newPasswordStatus === 'success'}
              placeholder="Enter New Password"
            />
            {newPassword && <PasswordStrength password={newPassword} className="mt-2" />}
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label className="block text-14 font-normal text-gray-900 mb-2">
              Confirm New Password
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => {
                setConfirmPasswordFocused(false)
                handleConfirmPasswordBlur()
              }}
              variant={confirmPasswordVariant}
              errorMessage={confirmPasswordError}
              showSuccessIcon={confirmPasswordStatus === 'success'}
              placeholder="Confirm New Password"
            />
          </div></div>
          {/* New Password Field */}
        
        </form>
      </div>

      {/* Success Modal */}
      <StatusModal
        open={showSuccessModal}
        title="Your Password has been changed"
        description="Your Password has been changed. You can now login with the new password"
        confirmLabel="Close"
        onConfirm={() => {
          setShowSuccessModal(false)
          // Reset form after closing modal
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
        }}
        onClose={() => {
          setShowSuccessModal(false)
          // Reset form after closing modal
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
        }}
      />
    </>
  )
}
