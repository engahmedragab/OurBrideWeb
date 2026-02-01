'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from './Button'
import { OTPInput } from './OTPInput'
import affiliatePinSvg from '@/assets/svg/Affiliate-pin.svg'
import modalSuccessSvg from '@/assets/svg/Modal-success.svg'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'

export interface AffiliateOnboardingModalsProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

type Step = 'payment' | 'payment-success' | 'create-pin' | 'confirm-pin' | 'pin-success'

/**
 * AffiliateOnboardingModals Component
 * Multi-step modal flow for affiliate program onboarding
 */
export const AffiliateOnboardingModals = ({
  isOpen,
  onClose,
  onComplete,
}: AffiliateOnboardingModalsProps) => {
  const t = useI18nTranslations('affiliate')
  const isRTL = useIsRTL()
  const [currentStep, setCurrentStep] = useState<Step>('payment')
  const [paymentMethod, setPaymentMethod] = useState<'debit' | 'wallet'>('debit')
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [walletMobileNumber, setWalletMobileNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [mmyy, setMmyy] = useState('')
  const [cvv, setCvv] = useState('')
  const [createPin, setCreatePin] = useState<string[]>(Array(4).fill(''))
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(4).fill(''))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pinError, setPinError] = useState('')

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {}

    {/* Full Name validation */}
    if (!fullName.trim()) {
      newErrors.fullName = t('onboarding.paymentMethod.errors.fullNameRequired')
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = t('onboarding.paymentMethod.errors.fullNameMinLength')
    }

    if (paymentMethod === 'wallet') {
      {/* Wallet mobile number validation */}
      if (!walletMobileNumber.trim()) {
        newErrors.walletMobileNumber = t('onboarding.paymentMethod.errors.mobileNumberRequired')
      } else {
        const phoneRegex = /^[0-9]{10,11}$/
        if (!phoneRegex.test(walletMobileNumber.replace(/\s/g, ''))) {
          newErrors.walletMobileNumber = t('onboarding.paymentMethod.errors.mobileNumberInvalid')
        }
      }
    } else {
      {/* Mobile number validation for debit/credit */}
      if (!mobileNumber.trim()) {
        newErrors.mobileNumber = t('onboarding.paymentMethod.errors.mobileNumberRequired')
      } else {
        const phoneRegex = /^[0-9]{10,11}$/
        if (!phoneRegex.test(mobileNumber.replace(/\s/g, ''))) {
          newErrors.mobileNumber = t('onboarding.paymentMethod.errors.mobileNumberInvalid')
        }
      }

      {/* Card name validation */}
      if (!cardName.trim()) {
        newErrors.cardName = t('onboarding.paymentMethod.errors.cardNameRequired')
      } else if (cardName.trim().length < 2) {
        newErrors.cardName = t('onboarding.paymentMethod.errors.cardNameMinLength')
      }

      {/* Card number validation */}
      if (!cardNumber.trim()) {
        newErrors.cardNumber = t('onboarding.paymentMethod.errors.cardNumberRequired')
      } else {
        const cardRegex = /^[0-9]{13,19}$/
        if (!cardRegex.test(cardNumber.replace(/\s/g, ''))) {
          newErrors.cardNumber = t('onboarding.paymentMethod.errors.cardNumberInvalid')
        }
      }

      {/* Expiry date validation */}
      if (!mmyy.trim()) {
        newErrors.mmyy = t('onboarding.paymentMethod.errors.expiryRequired')
      } else {
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
        if (!expiryRegex.test(mmyy)) {
          newErrors.mmyy = t('onboarding.paymentMethod.errors.expiryInvalid')
        }
      }

      {/* CVV validation */}
      if (!cvv.trim()) {
        newErrors.cvv = t('onboarding.paymentMethod.errors.cvvRequired')
      } else {
        const cvvRegex = /^[0-9]{3,4}$/
        if (!cvvRegex.test(cvv)) {
          newErrors.cvv = t('onboarding.paymentMethod.errors.cvvInvalid')
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePaymentSubmit = () => {
    if (validatePayment()) {
      setCurrentStep('payment-success')
    }
  }

  const handlePaymentSuccess = () => {
    setCurrentStep('create-pin')
  }

  const handleCreatePin = () => {
    {/* Validate PIN */}
    const pinValue = createPin.join('')
    if (pinValue.length !== 4) {
      setPinError(t('onboarding.createPin.error'))
      return
    }
    setPinError('')
    setCurrentStep('confirm-pin')
  }

  const handleConfirmPin = () => {
    {/* Validate PIN confirmation */}
    const pinValue = createPin.join('')
    const confirmPinValue = confirmPin.join('')
    
    if (confirmPinValue.length !== 4) {
      setPinError(t('onboarding.confirmPin.error'))
      return
    }
    
    if (confirmPinValue !== pinValue) {
      setPinError(t('onboarding.confirmPin.mismatch'))
      return
    }
    
    setPinError('')
    setCurrentStep('pin-success')
  }

  const handlePinSuccess = () => {
    if (onComplete) {
      onComplete()
    }
    onClose()
  }

  const handleClose = () => {
    {/* Reset all states */}
    setCurrentStep('payment')
    setPaymentMethod('debit')
    setFullName('')
    setMobileNumber('')
    setWalletMobileNumber('')
    setCardName('')
    setCardNumber('')
    setMmyy('')
    setCvv('')
    setCreatePin(Array(4).fill(''))
    setConfirmPin(Array(4).fill(''))
    setErrors({})
    setPinError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Payment Method Modal */}
        {currentStep === 'payment' && (
          <div className="bg-white rounded-2xl w-full max-w-sm relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              className={cn(
                "absolute top-4 text-gray-400 hover:text-gray-600 transition-colors z-10",
                isRTL ? "left-4" : "right-4"
              )}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h2 className="text-16 font-normal text-gray-900 mb-1">
                {t('onboarding.paymentMethod.title')}
              </h2>
              <p className="text-12 text-gray-500 mb-5">
                {t('onboarding.paymentMethod.subtitle')}
              </p>

              {/* Full Name */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={t('onboarding.paymentMethod.fullName')}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (errors.fullName) {
                      setErrors(prev => ({ ...prev, fullName: '' }))
                    }
                  }}
                  className={cn(
                    "w-full h-11 px-3 rounded-lg border text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white",
                    errors.fullName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-50 focus:border-brand-500"
                  )}
                />
                {errors.fullName && (
                  <p className="text-12 text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Mobile Number - Only show for debit/credit */}
              {paymentMethod === 'debit' && (
                <div className="mb-4">
                  <input
                    type="tel"
                    placeholder={t('onboarding.paymentMethod.mobileNumber')}
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value)
                      if (errors.mobileNumber) {
                        setErrors(prev => ({ ...prev, mobileNumber: '' }))
                      }
                    }}
                    className={cn(
                      "w-full h-11 px-3 rounded-lg border text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white",
                      errors.mobileNumber
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50 focus:border-brand-500"
                    )}
                  />
                  {errors.mobileNumber && (
                    <p className="text-12 text-red-500 mt-1">{errors.mobileNumber}</p>
                  )}
                </div>
              )}

              {/* Payment Type Toggle */}
              <div className="flex gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('debit')
                    setErrors({})
                  }}
                  className={`flex-1 h-11 px-4 rounded-lg border text-13 font-normal transition-all ${
                    paymentMethod === 'debit'
                      ? 'border-brand-500 text-gray-900 bg-white shadow-sm'
                      : 'border-gray-200 text-gray-500 bg-white'
                  }`}
                >
                  {t('onboarding.paymentMethod.debitCredit')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('wallet')
                    setErrors({})
                  }}
                  className={`flex-1 h-11 px-4 rounded-lg border text-13 font-normal transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-brand-500 text-gray-900 bg-white shadow-sm'
                      : 'border-gray-200 text-gray-500 bg-white'
                  }`}
                >
                  {t('onboarding.paymentMethod.mobileWallet')}
                </button>
              </div>

              {/* Conditional Content Based on Payment Method */}
              {paymentMethod === 'wallet' ? (
                <div className="space-y-4 mb-6">
                  <h3 className="text-16 font-medium text-gray-900">
                    {t('onboarding.paymentMethod.walletDetails')}
                  </h3>
                  <div>
                    <input
                      type="tel"
                      placeholder={t('onboarding.paymentMethod.mobileNumber')}
                      value={walletMobileNumber}
                      onChange={(e) => {
                        setWalletMobileNumber(e.target.value)
                        if (errors.walletMobileNumber) {
                          setErrors(prev => ({ ...prev, walletMobileNumber: '' }))
                        }
                      }}
                      className={cn(
                        "w-full h-11 px-3 rounded-lg border text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white",
                        errors.walletMobileNumber
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50 focus:border-brand-500"
                      )}
                    />
                    {errors.walletMobileNumber && (
                      <p className="text-12 text-red-500 mt-1">{errors.walletMobileNumber}</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Card Details */}
                  <p className="text-13 font-medium text-gray-900 mb-3">
                    {t('onboarding.paymentMethod.cardDetails')}
                  </p>

                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder={t('onboarding.paymentMethod.nameOnCard')}
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value)
                        if (errors.cardName) {
                          setErrors(prev => ({ ...prev, cardName: '' }))
                        }
                      }}
                      className={cn(
                        "w-full h-11 px-3 rounded-lg border text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white",
                        errors.cardName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50 focus:border-brand-500"
                      )}
                    />
                    {errors.cardName && (
                      <p className="text-12 text-red-500 mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder={t('onboarding.paymentMethod.cardNumber')}
                      value={cardNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
                        value = value.slice(0, 16)
                        value = value.replace(/(.{4})/g, '$1 ').trim()
                        setCardNumber(value)
                        if (errors.cardNumber) {
                          setErrors(prev => ({ ...prev, cardNumber: '' }))
                        }
                      }}
                      className={cn(
                        "w-full h-11 px-3 rounded-lg border text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white",
                        errors.cardNumber
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50 focus:border-brand-500"
                      )}
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-12 text-red-500 mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="flex gap-2 mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={t('onboarding.paymentMethod.mmYy')}
                        value={mmyy}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4)
                          }
                          setMmyy(value)
                          if (errors.mmyy) {
                            setErrors(prev => ({ ...prev, mmyy: '' }))
                          }
                        }}
                        className={cn(
                          "w-full h-11 px-3 rounded-lg border text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white",
                          errors.mmyy
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50 focus:border-brand-500"
                        )}
                        maxLength={5}
                      />
                      {errors.mmyy && (
                        <p className="text-12 text-red-500 mt-1">{errors.mmyy}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={t('onboarding.paymentMethod.cvv')}
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                          setCvv(value)
                          if (errors.cvv) {
                            setErrors(prev => ({ ...prev, cvv: '' }))
                          }
                        }}
                        className={cn(
                          "w-full h-11 px-3 rounded-lg border text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white",
                          errors.cvv
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50 focus:border-brand-500"
                        )}
                        maxLength={4}
                      />
                      {errors.cvv && (
                        <p className="text-12 text-red-500 mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Button
                variant="brand"
                className="w-full h-11 rounded-full text-14 font-medium text-white"
                onClick={handlePaymentSubmit}
              >
                {t('onboarding.paymentMethod.addPaymentMethod')}
              </Button>
            </div>
          </div>
        )}

        {/* Payment Success Modal */}
        {currentStep === 'payment-success' && (
          <div className="bg-white rounded-2xl w-full max-w-sm relative shadow-xl">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 text-center">
              {/* Success SVG */}
              <div className="flex justify-center mb-6">
                <Image
                  src={modalSuccessSvg}
                  alt="Success"
                  width={120}
                  height={120}
                  className="w-24 h-24"
                />
              </div>

              <h2 className="text-18 font-normal text-gray-900 mb-3">
                {t('onboarding.paymentSuccess.title')}
              </h2>
              <p className="text-14 text-gray-500 mb-6">
                {t('onboarding.paymentSuccess.description')}
              </p>

              <Button
                variant="brand"
                className="w-full text-white h-11 rounded-full"
                onClick={handlePaymentSuccess}
              >
                {t('onboarding.paymentSuccess.nextStep')}
              </Button>
            </div>
          </div>
        )}

        {/* Create PIN Modal */}
        {currentStep === 'create-pin' && (
          <div className="bg-white rounded-2xl w-full max-w-sm relative shadow-xl">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 text-center">
              <p className="text-14 font-medium text-gray-900 mb-6 text-left">
                {t('onboarding.createPin.title')}
              </p>

              <div className="mb-6 flex justify-center">
                <Image
                  src={typeof affiliatePinSvg === 'string' ? affiliatePinSvg : affiliatePinSvg.src}
                  alt={t('onboarding.createPin.alt')}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-contain"
                />
              </div>

              <h2 className="text-18 font-normal text-gray-900 mb-3">
                {t('onboarding.createPin.heading')}
              </h2>
              <p className="text-14 text-gray-500 mb-6">
                {t('onboarding.createPin.description')}
              </p>

              {/* PIN Input */}
              <div className="mb-6">
                <OTPInput
                  length={4}
                  value={createPin}
                  onChange={setCreatePin}
                  variant={pinError ? 'error' : 'default'}
                  errorMessage={pinError}
                />
              </div>

              <Button
                variant="brand"
                className="w-full text-white h-11 rounded-full"
                onClick={handleCreatePin}
              >
                {t('onboarding.createPin.next')}
              </Button>
            </div>
          </div>
        )}

        {/* Confirm PIN Modal */}
        {currentStep === 'confirm-pin' && (
          <div className="bg-white rounded-2xl w-full max-w-sm relative shadow-xl">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 text-center">
              <p className="text-14 font-medium text-gray-900 mb-6 text-left">
                {t('onboarding.confirmPin.title')}
              </p>

              <div className="mb-6 flex justify-center">
                <Image
                  src={typeof affiliatePinSvg === 'string' ? affiliatePinSvg : affiliatePinSvg.src}
                  alt={t('onboarding.confirmPin.alt')}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-contain"
                />
              </div>

              <h2 className="text-18 font-normal text-gray-900 mb-3">
                {t('onboarding.confirmPin.heading')}
              </h2>
              <p className="text-14 text-gray-500 mb-6">
                {t('onboarding.confirmPin.description')}
              </p>

              {/* PIN Input */}
              <div className="mb-6">
                <OTPInput
                  length={4}
                  value={confirmPin}
                  onChange={setConfirmPin}
                  variant={pinError ? 'error' : 'default'}
                  errorMessage={pinError}
                />
              </div>

              <Button
                variant="brand"
                className="w-full text-white h-11 rounded-full"
                onClick={handleConfirmPin}
              >
                {t('onboarding.confirmPin.confirm')}
              </Button>
            </div>
          </div>
        )}

        {/* PIN Success Modal */}
        {currentStep === 'pin-success' && (
          <div className="bg-white rounded-2xl w-full max-w-sm relative shadow-xl">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 text-center">
              {/* Success SVG */}
              <div className="flex justify-center mb-6">
                <Image
                  src={modalSuccessSvg}
                  alt="Success"
                  width={120}
                  height={120}
                  className="w-24 h-24"
                />
              </div>

              <h2 className="text-18 font-normal text-gray-900 mb-3">
                {t('onboarding.pinSuccess.title')}
              </h2>
              <p className="text-14 text-gray-500 mb-6">
                {t('onboarding.pinSuccess.description')}
              </p>

              <Button
                variant="brand"
                className="w-full text-white h-11 rounded-full"
                onClick={handlePinSuccess}
              >
                {t('onboarding.pinSuccess.letsStart')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
