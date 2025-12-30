'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  X,
  User,
  Phone,
  MapPin,
  Building2,
  FileText,
  CreditCard,
  Wallet,
  DollarSign,
  Ticket,
  Gift,
  Diamond,
  AlertCircle,
} from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Checkbox } from './Checkbox'
import { QuantitySelector } from './QuantitySelector'
import { Modal } from './Modal'
import { PaymentConfirmationModal } from './PaymentConfirmationModal'
import { OrderConfirmationModal } from './OrderConfirmationModal'
import { cn } from '@/lib/utils'

export interface OrderItem {
  id: string
  title: string
  image: string
  originalPrice: number
  discountedPrice: number
  currency: string
  quantity: number
  discountPercentage?: number
  deliveryDate?: string
  maxQuantity?: number
}

export interface OrderCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  items: OrderItem[]
  onCheckout?: (orderData: OrderFormData) => Promise<void> | void
  onTrackOrder?: () => void
  currency?: string
  taxes?: number
  deliveryFee?: number
  className?: string
}

export interface OrderFormData {
  fullName: string
  mobileNumber: string
  location: string
  street: string
  notes: string
  paymentMethod: 'debit-credit' | 'mobile-wallet' | 'cash-on-delivery'
  walletMobileNumber?: string
  cardNumber?: string
  cardExpiry?: string
  cardCVV?: string
  cardholderName?: string
  selectedItems: string[]
  promoCode?: string
  useDiamonds?: boolean
  useGiftsCash?: boolean
  acceptTerms: boolean
}

export const OrderCheckoutModal = ({
  isOpen,
  onClose,
  items: initialItems,
  onCheckout,
  onTrackOrder,
  currency = 'EGP',
  taxes = 120,
  deliveryFee = 90,
  className,
}: OrderCheckoutModalProps) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(initialItems.map(item => item.id))
  )
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    mobileNumber: '',
    location: '',
    street: '',
    notes: '',
    paymentMethod: 'mobile-wallet',
    walletMobileNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardholderName: '',
    selectedItems: [],
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [hasFormData, setHasFormData] = useState(false)
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Track if form has data for close confirmation
  useEffect(() => {
    const hasData = !!(
      formData.fullName ||
      formData.mobileNumber ||
      formData.location ||
      formData.street ||
      formData.notes ||
      formData.walletMobileNumber
    )
    setHasFormData(hasData)
  }, [formData])

  // Update items when initialItems changes
  useEffect(() => {
    setItems(initialItems)
    setSelectedItems(new Set(initialItems.map(item => item.id)))
  }, [initialItems])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        fullName: '',
        mobileNumber: '',
        location: '',
        street: '',
        notes: '',
        paymentMethod: 'mobile-wallet',
        walletMobileNumber: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
        cardholderName: '',
        selectedItems: [],
        acceptTerms: false,
      })
      setErrors({})
      setShowPromoInput(false)
      setPromoCode('')
      setHasFormData(false)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (hasFormData) {
          const confirmed = window.confirm(
            'Are you sure you want to close? Your changes will be lost.'
          )
          if (!confirmed) return
        }
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, hasFormData, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    if (hasFormData) {
      const confirmed = window.confirm(
        'Are you sure you want to close? Your changes will be lost.'
      )
      if (!confirmed) return
    }
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const updateFormData = (
    field: keyof OrderFormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateField = (
    field: keyof OrderFormData,
    value: string | boolean | undefined
  ): string => {
    switch (field) {
      case 'fullName':
        if (!value || (typeof value === 'string' && value.trim().length < 2)) {
          return 'Full name must be at least 2 characters'
        }
        break
      case 'mobileNumber': {
        if (!value) {
          return 'Mobile number is required'
        }
        const phoneRegex = /^[0-9]{10,11}$/
        if (
          typeof value === 'string' &&
          !phoneRegex.test(value.replace(/\s/g, ''))
        ) {
          return 'Please enter a valid mobile number (10-11 digits)'
        }
        break
      }
      case 'location':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          return 'Location must be at least 3 characters'
        }
        break
      case 'street':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          return 'Street/Apartment must be at least 3 characters'
        }
        break
      case 'walletMobileNumber': {
        if (formData.paymentMethod === 'mobile-wallet') {
          if (!value) {
            return 'Wallet mobile number is required'
          }
          const phoneRegex = /^[0-9]{10,11}$/
          if (
            typeof value === 'string' &&
            !phoneRegex.test(value.replace(/\s/g, ''))
          ) {
            return "Wallet isn't valid, please enter valid number"
          }
        }
        break
      }
      case 'cardNumber': {
        if (formData.paymentMethod === 'debit-credit') {
          if (!value) {
            return 'Card number is required'
          }
          const cardRegex = /^[0-9]{13,19}$/
          if (
            typeof value === 'string' &&
            !cardRegex.test(value.replace(/\s/g, ''))
          ) {
            return 'Please enter a valid card number'
          }
        }
        break
      }
      case 'cardExpiry': {
        if (formData.paymentMethod === 'debit-credit') {
          if (!value) {
            return 'Expiry date is required'
          }
          const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
          if (typeof value === 'string' && !expiryRegex.test(value)) {
            return 'Please enter a valid expiry date (MM/YY)'
          }
        }
        break
      }
      case 'cardCVV': {
        if (formData.paymentMethod === 'debit-credit') {
          if (!value) {
            return 'CVV is required'
          }
          const cvvRegex = /^[0-9]{3,4}$/
          if (typeof value === 'string' && !cvvRegex.test(value)) {
            return 'Please enter a valid CVV'
          }
        }
        break
      }
      case 'cardholderName': {
        if (formData.paymentMethod === 'debit-credit') {
          if (
            !value ||
            (typeof value === 'string' && value.trim().length < 2)
          ) {
            return 'Cardholder name is required'
          }
        }
        break
      }
      case 'acceptTerms':
        if (!value) {
          return 'You must accept the terms and conditions'
        }
        break
    }
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate required fields
    const stringFields: (keyof OrderFormData)[] = [
      'fullName',
      'mobileNumber',
      'location',
      'street',
    ]

    stringFields.forEach(field => {
      const value = formData[field]
      if (typeof value === 'string') {
        const error = validateField(field, value)
        if (error) {
          newErrors[field] = error
        }
      }
    })

    // Validate acceptTerms separately
    const acceptTermsError = validateField('acceptTerms', formData.acceptTerms)
    if (acceptTermsError) {
      newErrors.acceptTerms = acceptTermsError
    }

    // Validate wallet mobile number if mobile wallet is selected
    if (formData.paymentMethod === 'mobile-wallet') {
      const walletError = validateField(
        'walletMobileNumber',
        formData.walletMobileNumber
      )
      if (walletError) {
        newErrors.walletMobileNumber = walletError
      }
    }

    // Validate card details if debit/credit is selected
    if (formData.paymentMethod === 'debit-credit') {
      const cardFields: (keyof OrderFormData)[] = [
        'cardNumber',
        'cardExpiry',
        'cardCVV',
        'cardholderName',
      ]
      cardFields.forEach(field => {
        const value = formData[field]
        if (typeof value === 'string') {
          const error = validateField(field, value)
          if (error) {
            newErrors[field] = error
          }
        }
      })
    }

    // Check if at least one item is selected
    if (selectedItems.size === 0) {
      newErrors.items = 'Please select at least one item'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const errorElement =
          document.querySelector(`[name="${firstErrorField}"]`) ||
          document.querySelector(`[aria-invalid="true"]`)
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Close checkout modal first, then show payment confirmation
    onClose()
    // Small delay to ensure checkout modal closes before opening payment confirmation
    setTimeout(() => {
      setShowPaymentConfirmation(true)
    }, 300)
  }

  const handleConfirmPayment = async () => {
    setIsSubmitting(true)
    try {
      const orderData: OrderFormData = {
        ...formData,
        selectedItems: Array.from(selectedItems),
        promoCode: showPromoInput && promoCode ? promoCode : undefined,
      }

      if (onCheckout) {
        await onCheckout(orderData)
      }
      // Close payment confirmation modal first, then show order confirmation
      setShowPaymentConfirmation(false)
      // Small delay to ensure payment modal closes before opening order confirmation
      setTimeout(() => {
        setShowOrderConfirmation(true)
      }, 300)
    } catch (error) {
      // Don't close modals on error - let user fix issues
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const updateItemQuantity = (itemId: string, delta: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(
            1,
            Math.min(item.quantity + delta, item.maxQuantity || 99)
          )
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  // Calculate totals
  const selectedItemsList = items.filter(item => selectedItems.has(item.id))
  const subtotal = selectedItemsList.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  )
  const total = subtotal + taxes + deliveryFee

  // Check if checkout should be disabled
  // Only check for errors that are currently relevant (not cleared ones)
  const hasRelevantErrors =
    Object.keys(errors).length > 0 &&
    Object.values(errors).some(error => error !== '')

  const isCheckoutDisabled =
    selectedItems.size === 0 ||
    !formData.acceptTerms ||
    hasRelevantErrors ||
    isSubmitting

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Order Checkout"
        maxWidth="2xl"
        zIndex={5}
        closeOnOverlayClick={!hasFormData}
        className={className}
        containerClassName="max-h-[90vh] overflow-hidden"
        headerClassName="p-6"
        contentClassName="p-0"
      >
        <form onSubmit={handleSubmit} className="overflow-hidden flex flex-col">
          <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto max-h-[calc(90vh-80px)] bg-white">
            {/* LEFT COLUMN - Form Section */}
            <div className="w-full lg:w-[40%] lg:flex-shrink-0 p-4 md:p-6 pb-6 border-b lg:border-b-0 lg:border-r border-gray-200/30">
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    prefixIcon={User}
                    value={formData.fullName}
                    onChange={e => updateFormData('fullName', e.target.value)}
                    onBlur={() => {
                      const error = validateField('fullName', formData.fullName)
                      if (error)
                        setErrors(prev => ({ ...prev, fullName: error }))
                    }}
                    variant={errors.fullName ? 'error' : 'default'}
                    errorMessage={errors.fullName}
                    className="w-full"
                  />

                  <div className={cn(errors.mobileNumber && 'mb-2')}>
                    <Input
                      type="tel"
                      placeholder="Mobile Number"
                      prefixIcon={Phone}
                      value={formData.mobileNumber}
                      onChange={e =>
                        updateFormData('mobileNumber', e.target.value)
                      }
                      onBlur={() => {
                        const error = validateField(
                          'mobileNumber',
                          formData.mobileNumber
                        )
                        if (error)
                          setErrors(prev => ({ ...prev, mobileNumber: error }))
                      }}
                      variant={errors.mobileNumber ? 'error' : 'default'}
                      errorMessage={errors.mobileNumber}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Delivery Details Section */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-18 font-semibold text-gray-900">
                    Delivery Details
                  </h3>

                  <Input
                    type="text"
                    placeholder="Location"
                    prefixIcon={MapPin}
                    value={formData.location}
                    onChange={e => updateFormData('location', e.target.value)}
                    onBlur={() => {
                      const error = validateField('location', formData.location)
                      if (error)
                        setErrors(prev => ({ ...prev, location: error }))
                    }}
                    variant={errors.location ? 'error' : 'default'}
                    errorMessage={errors.location}
                    className="w-full"
                  />

                  <Input
                    type="text"
                    placeholder="Street / Apartment"
                    prefixIcon={Building2}
                    value={formData.street}
                    onChange={e => updateFormData('street', e.target.value)}
                    onBlur={() => {
                      const error = validateField('street', formData.street)
                      if (error) setErrors(prev => ({ ...prev, street: error }))
                    }}
                    variant={errors.street ? 'error' : 'default'}
                    errorMessage={errors.street}
                    className="w-full"
                  />

                  <div className="relative">
                    <textarea
                      placeholder="Notes to the delivery person..."
                      value={formData.notes}
                      onChange={e => updateFormData('notes', e.target.value)}
                      rows={3}
                      className={cn(
                        'w-full px-4 py-3 pl-12 rounded-md border bg-background text-16',
                        'ring-offset-background transition-colors',
                        'placeholder:text-gray-400 focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-offset-2',
                        'border-gray-300 focus-visible:border-brand-500 focus-visible:ring-brand-500',
                        'resize-none'
                      )}
                    />
                    <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-18 font-semibold text-gray-900">
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(
                      [
                        {
                          value: 'debit-credit',
                          label: 'Debit / Credit',
                          icon: CreditCard,
                        },
                        {
                          value: 'mobile-wallet',
                          label: 'Mobile Wallet',
                          icon: Wallet,
                        },
                        {
                          value: 'cash-on-delivery',
                          label: 'Cash On Delivery',
                          icon: DollarSign,
                        },
                      ] as const
                    ).map(method => {
                      const Icon = method.icon
                      const isSelected = formData.paymentMethod === method.value
                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => {
                            updateFormData('paymentMethod', method.value)
                            if (method.value !== 'mobile-wallet') {
                              updateFormData('walletMobileNumber', '')
                              setErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors.walletMobileNumber
                                return newErrors
                              })
                            }
                            if (method.value !== 'debit-credit') {
                              updateFormData('cardNumber', '')
                              updateFormData('cardExpiry', '')
                              updateFormData('cardCVV', '')
                              updateFormData('cardholderName', '')
                              setErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors.cardNumber
                                delete newErrors.cardExpiry
                                delete newErrors.cardCVV
                                delete newErrors.cardholderName
                                return newErrors
                              })
                            }
                          }}
                          className={cn(
                            'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all',
                            'hover:bg-gray-50',
                            isSelected
                              ? 'border-[#FF8B7A] bg-white'
                              : 'border-gray-300 bg-white'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-5 w-5',
                              isSelected ? 'text-[#FF8B7A]' : 'text-gray-400'
                            )}
                          />
                          <span
                            className={cn(
                              'text-12 font-medium text-center',
                              isSelected
                                ? 'text-[#FF8B7A] font-semibold'
                                : 'text-gray-600'
                            )}
                          >
                            {method.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Wallet Details Section (Conditional) */}
                  {formData.paymentMethod === 'mobile-wallet' && (
                    <div className="space-y-4 pt-4 pb-6">
                      <h3 className="text-18 font-semibold text-gray-900">
                        Wallet Details
                      </h3>
                      <Input
                        type="tel"
                        placeholder="Mobile Number"
                        value={formData.walletMobileNumber}
                        onChange={e =>
                          updateFormData('walletMobileNumber', e.target.value)
                        }
                        onBlur={() => {
                          const error = validateField(
                            'walletMobileNumber',
                            formData.walletMobileNumber
                          )
                          if (error)
                            setErrors(prev => ({
                              ...prev,
                              walletMobileNumber: error,
                            }))
                        }}
                        variant={
                          errors.walletMobileNumber ? 'error' : 'default'
                        }
                        errorMessage={errors.walletMobileNumber}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Card Details Section (Conditional) */}
                  {formData.paymentMethod === 'debit-credit' && (
                    <div className="space-y-4 pt-4 pb-6">
                      <h3 className="text-18 font-semibold text-gray-900">
                        Card Details
                      </h3>
                      <Input
                        type="text"
                        placeholder="Card Number"
                        prefixIcon={CreditCard}
                        value={formData.cardNumber}
                        onChange={e => {
                          // Format card number with spaces every 4 digits
                          let value = e.target.value
                            .replace(/\s/g, '')
                            .replace(/\D/g, '')
                          // Limit to 16 digits
                          value = value.slice(0, 16)
                          // Add spaces every 4 digits
                          value = value.replace(/(.{4})/g, '$1 ').trim()
                          updateFormData('cardNumber', value)
                        }}
                        onBlur={() => {
                          const error = validateField(
                            'cardNumber',
                            formData.cardNumber
                          )
                          if (error)
                            setErrors(prev => ({ ...prev, cardNumber: error }))
                        }}
                        variant={errors.cardNumber ? 'error' : 'default'}
                        errorMessage={errors.cardNumber}
                        className="w-full"
                        maxLength={19}
                      />
                      <Input
                        type="text"
                        placeholder="Cardholder Name"
                        prefixIcon={User}
                        value={formData.cardholderName}
                        onChange={e =>
                          updateFormData('cardholderName', e.target.value)
                        }
                        onBlur={() => {
                          const error = validateField(
                            'cardholderName',
                            formData.cardholderName
                          )
                          if (error)
                            setErrors(prev => ({
                              ...prev,
                              cardholderName: error,
                            }))
                        }}
                        variant={errors.cardholderName ? 'error' : 'default'}
                        errorMessage={errors.cardholderName}
                        className="w-full"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={e => {
                            // Format expiry date as MM/YY
                            let value = e.target.value.replace(/\D/g, '')
                            if (value.length >= 2) {
                              value =
                                value.slice(0, 2) + '/' + value.slice(2, 4)
                            }
                            updateFormData('cardExpiry', value)
                          }}
                          onBlur={() => {
                            const error = validateField(
                              'cardExpiry',
                              formData.cardExpiry
                            )
                            if (error)
                              setErrors(prev => ({
                                ...prev,
                                cardExpiry: error,
                              }))
                          }}
                          variant={errors.cardExpiry ? 'error' : 'default'}
                          errorMessage={errors.cardExpiry}
                          className="w-full"
                          maxLength={5}
                        />
                        <Input
                          type="text"
                          placeholder="CVV"
                          value={formData.cardCVV}
                          onChange={e => {
                            const value = e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 4)
                            updateFormData('cardCVV', value)
                          }}
                          onBlur={() => {
                            const error = validateField(
                              'cardCVV',
                              formData.cardCVV
                            )
                            if (error)
                              setErrors(prev => ({ ...prev, cardCVV: error }))
                          }}
                          variant={errors.cardCVV ? 'error' : 'default'}
                          errorMessage={errors.cardCVV}
                          className="w-full"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Order Summary */}
            <div className="w-full lg:w-[60%] lg:flex-shrink-0 p-4 md:p-6 bg-white">
              <div className="space-y-6">
                {/* Order Summary Header */}
                <h3 className="text-24 font-normal text-gray-900">
                  Order Summary
                </h3>

                {/* Product Items List */}
                <div className="space-y-3 max-h-[250px] md:max-h-[300px] overflow-y-auto">
                  {items.map(item => {
                    const isSelected = selectedItems.has(item.id)
                    const discountPercentage =
                      item.discountPercentage ||
                      item.originalPrice > item.discountedPrice
                        ? Math.round(
                            ((item.originalPrice - item.discountedPrice) /
                              item.originalPrice) *
                              100
                          )
                        : 0

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <div className="pt-1">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleItemSelection(item.id)}
                              variant="brand"
                              size="md"
                            />
                          </div>

                          {/* Product Image */}
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-16 font-semibold text-gray-900 mb-1">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-16 font-normal text-gray-900">
                                {item.discountedPrice.toLocaleString()}{' '}
                                {item.currency}
                              </span>
                              {item.originalPrice > item.discountedPrice && (
                                <>
                                  <span className="text-12 text-gray-400 line-through">
                                    {item.originalPrice.toLocaleString()}{' '}
                                    {item.currency}
                                  </span>
                                  {discountPercentage > 0 && (
                                    <span className="text-12 font-semibold text-gray-500 ml-auto">
                                      {discountPercentage}% OFF
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            {item.deliveryDate && (
                              <p className="text-12 text-gray-500 mb-3">
                                Get it by {item.deliveryDate}
                              </p>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-end">
                              <QuantitySelector
                                quantity={item.quantity}
                                onQuantityChange={delta =>
                                  updateItemQuantity(item.id, delta)
                                }
                                min={1}
                                max={item.maxQuantity || 99}
                                variant="coral"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {errors.items && (
                  <div className="flex items-center gap-2 text-12 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.items}</span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Promo & Rewards Section */}
                <div className="space-y-3">
                  {/* Promo Code */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Ticket className="h-5 w-5 text-[#FF8B7A]" />
                      {showPromoInput ? (
                        <Input
                          type="text"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value)}
                          className="flex-1 max-w-[200px]"
                          size="sm"
                        />
                      ) : (
                        <span className="text-14">Enter Promo Code</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPromoInput(!showPromoInput)}
                      className="text-14 font-semibold text-[#FF8B7A] hover:text-[#FF6B5A]"
                    >
                      Redeem
                    </button>
                  </div>

                  {/* Diamonds */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Diamond className="h-5 w-5 text-[#FF8B7A]" />
                      <span className="text-14">Diamonds : 250 Points</span>
                    </div>
                    <button
                      type="button"
                      className="text-14 font-semibold text-[#FF8B7A] hover:text-[#FF6B5A]"
                    >
                      Redeem
                    </button>
                  </div>

                  {/* Gifts Cash */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Gift className="h-5 w-5 text-[#FF8B7A]" />
                      <span className="text-14">
                        Gifts Cash : 500 {currency}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-14 font-semibold text-[#FF8B7A] hover:text-[#FF6B5A]"
                    >
                      Redeem
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-14 text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {subtotal.toLocaleString()} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-14 text-gray-600">
                    <span>Taxes & Fees</span>
                    <span className="text-gray-900">
                      {taxes.toLocaleString()} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-14 text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-gray-900">
                      {deliveryFee.toLocaleString()} {currency}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-18 font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-20 font-semibold text-gray-900">
                        {total.toLocaleString()} {currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={checked =>
                        updateFormData('acceptTerms', checked)
                      }
                      variant="brand"
                      size="md"
                    />
                    <label className="text-14 text-gray-700 cursor-pointer flex-1">
                      I Accept{' '}
                      <button
                        type="button"
                        className="text-[#FF8B7A] hover:underline"
                        onClick={e => {
                          e.preventDefault()
                          // Open terms modal or page
                        }}
                      >
                        Terms & Conditions
                      </button>
                    </label>
                  </div>
                  <p className="text-12 text-gray-500 pl-8">
                    If you are not around when the delivery person arrives, they
                    will leave your order at the door. By placing your order,
                    you agree to take full responsibility for it once it&apos;s
                    delivered.
                  </p>
                  {errors.acceptTerms && (
                    <p className="text-12 text-red-500 pl-8">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>

                {/* Checkout Button */}
                <div className="pt-4 pb-6">
                  <Button
                    type="submit"
                    variant="default"
                    size="xl"
                    disabled={isCheckoutDisabled}
                    className={cn(
                      'w-full h-14 rounded-lg font-semibold text-white',
                      'bg-[#FF8B7A] hover:bg-[#FF6B5A]',
                      'disabled:bg-gray-400 disabled:cursor-not-allowed',
                      'transition-colors'
                    )}
                  >
                    {isSubmitting ? 'Processing...' : 'Checkout'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showPaymentConfirmation}
        onClose={() => setShowPaymentConfirmation(false)}
        onConfirm={handleConfirmPayment}
        amount={total}
        currency={currency}
        isLoading={isSubmitting}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showOrderConfirmation}
        onClose={() => setShowOrderConfirmation(false)}
        onTrackOrder={() => {
          if (onTrackOrder) {
            onTrackOrder()
          } else {
            // Default behavior - navigate to orders page
            if (typeof window !== 'undefined') {
              window.location.href = '/orders'
            }
          }
        }}
      />
    </>
  )
}
