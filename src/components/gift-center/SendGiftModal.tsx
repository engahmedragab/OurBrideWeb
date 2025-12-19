'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Gift, User, Mail, CreditCard, Wallet } from 'lucide-react'
import { Modal, Button, Input, Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'
import phoneIconSvg from '@/assets/svg/PhoneIcon.svg'

/**
 * Get gift icon color based on coupon amount
 * @param amount - The coupon amount in EGP
 * @returns Tailwind color class for the gift icon
 */
const getGiftIconColor = (amount: number): string => {
  // 500 EGP - Blue
  if (amount === 500) {
    return 'text-blue-500'
  }
  // 1K EGP - Green
  if (amount === 1000) {
    return 'text-green-500'
  }
  // 2K EGP - Red
  if (amount === 2000) {
    return 'text-red-500'
  }
  // 5K EGP - Purple/Lavender
  if (amount === 5000) {
    return 'text-purple-500'
  }
  // 10K EGP - Orange
  if (amount === 10000) {
    return 'text-orange-500'
  }
  // Default - Blue for other amounts
  return 'text-blue-500'
}

/**
 * Format coupon amount for display
 * @param amount - The coupon amount in EGP
 * @returns Formatted string (e.g., "500 egp" or "1K egp")
 */
const formatCouponAmount = (amount: number): string => {
  if (amount >= 1000) {
    const thousands = amount / 1000
    return `${thousands}K egp`
  }
  return `${amount} egp`
}

/**
 * Send Gift Modal Component Props
 */
export interface SendGiftModalProps {
  isOpen: boolean
  onClose: () => void
  couponAmount: number
  onCheckout?: () => void
}

/**
 * Send Gift Modal Component
 * Modal for sending gifts with payment form
 */
export const SendGiftModal = ({
  isOpen,
  onClose,
  couponAmount,
  onCheckout,
}: SendGiftModalProps) => {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [selectedGiftId, setSelectedGiftId] = useState<string>('1')

  const navigateToTermsAndConditions = (
    e: React.MouseEvent<HTMLSpanElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
    setTimeout(() => {
      router.push('/dashboard/settings/terms')
    }, 100)
  }

  // Order items with different amounts to show all color variations
  const orderItems = [
    { id: '1', amount: 500 },
    { id: '2', amount: 1000 },
    { id: '3', amount: 2000 },
    { id: '4', amount: 5000 },
  ]

  // Calculate subtotal from selected item or first item
  const selectedItem = orderItems.find(item => item.id === selectedGiftId) || orderItems[0]
  const subtotal = selectedItem.amount
  const taxes = 20
  const total = subtotal + taxes

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Gift"
      maxWidth="2xl"
      contentClassName="p-0 max-h-[90vh] overflow-y-auto"
      headerClassName="px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3"
      containerClassName="max-h-[100vh] overflow-hidden max-w-[95%] sm:max-w-[90%] md:max-w-[700px] lg:max-w-[1000px] w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-2.5 sm:gap-3 sm:p-3 md:gap-4 md:p-4">
        {/* Left Column - Form */}
        <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
          {/* Your Information */}
          <div>
            <h3 className="text-12 sm:text-14 font-semibold text-gray-900 mb-2">
              Your Informations
            </h3>
            <div className="space-y-2">
              <Input
                placeholder="Full Name"
                prefixIcon={
                  <User className="h-4 w-4 text-gray-400" />
                }
                className="w-full"
                size="sm"
                variant="default"
              />
              <Input
                placeholder="Mobile Number"
                prefixIcon={
                  <img
                    src={
                      typeof phoneIconSvg === 'string'
                        ? phoneIconSvg
                        : phoneIconSvg.src
                    }
                    alt="Phone"
                    className="h-4 w-4 text-gray-400"
                  />
                }
                type="tel"
                className="w-full"
                size="sm"
                variant="default"
              />
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h3 className="text-12 sm:text-14 font-semibold text-gray-900 mb-2">
              Who will receive your gift ?
            </h3>
            <div className="space-y-2">
              <Input
                placeholder="Full Name"
                prefixIcon={
                  <User className="h-4 w-4 text-gray-400" />
                }
                className="w-full"
                size="sm"
                variant="default"
              />
              <Input
                placeholder="E-mail"
                prefixIcon={
                  <Mail className="h-4 w-4 text-gray-400" />
                }
                type="email"
                className="w-full"
                size="sm"
                variant="default"
              />
              <Input
                placeholder="Mobile Number"
                prefixIcon={
                  <img
                    src={
                      typeof phoneIconSvg === 'string'
                        ? phoneIconSvg
                        : phoneIconSvg.src
                    }
                    alt="Phone"
                    className="h-4 w-4"
                  />
                }
                type="tel"
                className="w-full"
                size="sm"
                variant="default"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-12 sm:text-14 font-semibold text-gray-900 mb-2">
              Payment Method
            </h3>
            <div className="flex gap-2">
              <Button
                variant={paymentMethod === 'card' ? 'outlineBrand' : 'outline'}
                size="md"
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  'flex-1 rounded-lg text-10 sm:text-12 font-normal',
                  paymentMethod === 'card'
                    ? '!border-brand-500 !text-gray-900 !bg-white'
                    : '!border-gray-300 !text-gray-600 !bg-white hover:!bg-gray-50 hover:!text-gray-700'
                )}
              >
                Debit / Credit
              </Button>
              <Button
                variant={paymentMethod === 'wallet' ? 'outlineBrand' : 'outline'}
                size="md"
                onClick={() => setPaymentMethod('wallet')}
                className={cn(
                  'flex-1 rounded-lg text-10 sm:text-12 font-normal',
                  paymentMethod === 'wallet'
                    ? '!border-brand-500 !text-gray-900 !bg-white'
                    : '!border-gray-300 !text-gray-600 !bg-white hover:!bg-gray-50 hover:!text-gray-700'
                )}
              >
                Mobile Wallet
              </Button>
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div>
              <h3 className="text-12 sm:text-14 font-semibold text-gray-900 mb-2">
                Card Details
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <Input
                  placeholder="Name On Card"
                  className="w-full"
                  size="sm"
                  variant="default"
                />
                <Input
                  placeholder="Card Number"
                  type="tel"
                  className="w-full"
                  size="sm"
                  variant="default"
                />
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Input
                    placeholder="MM/YY"
                    type="tel"
                    className="w-full"
                    size="sm"
                    variant="default"
                  />
                  <Input
                    placeholder="CVV"
                    type="tel"
                    className="w-full"
                    size="sm"
                    variant="default"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="rounded-xl p-2.5 sm:p-3 md:p-4 space-y-2.5 sm:space-y-3 md:space-y-4">
          <h3 className="text-12 sm:text-14 font-semibold text-gray-900 mb-2">Order Summary</h3>

          {/* Order Items */}
          <div className="space-y-2 sm:space-y-3">
            {orderItems.map((item) => {
              const iconColor = getGiftIconColor(item.amount)
              const formattedAmount = formatCouponAmount(item.amount)
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedGiftId(item.id)}
                  className={cn(
                    'flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-white rounded-xl cursor-pointer transition-all',
                    selectedGiftId === item.id
                      ? 'border-2 border-brand-500'
                      : 'border border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-center flex-shrink-0">
                    <Gift className={cn('h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7', iconColor)} />
                  </div>
                  <span className="text-12 sm:text-14 font-normal text-gray-900 flex-1">
                    {formattedAmount} Coupon
                  </span>
                </div>
              )
            })}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-1.5 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-10 sm:text-12 text-gray-600">Subtotal</span>
              <span className="text-10 sm:text-12 font-semibold text-gray-900">
                {subtotal} EGP
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-10 sm:text-12 text-gray-600">Taxes & Fees</span>
              <span className="text-10 sm:text-12 font-semibold text-gray-900">
                {taxes} EGP
              </span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-gray-200">
              <span className="text-12 sm:text-14 font-semibold text-gray-900">Total</span>
              <span className="text-12 sm:text-14 font-semibold text-gray-900">
                {total} EGP
              </span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-1.5">
            <div className="flex items-start gap-1.5">
              <Checkbox
                checked={acceptTerms}
                onChange={setAcceptTerms}
                variant="brand"
                size="sm"
              />
              <label className="text-10 sm:text-12 text-gray-600 cursor-pointer flex-1">
                I Accept{' '}
                <span
                  onClick={navigateToTermsAndConditions}
                  role="button"
                  tabIndex={0}
                  className="font-semibold text-gray-900 hover:text-brand-500 cursor-pointer transition-colors "
                >
                  Terms & Conditions
                </span>
              </label>
            </div>
            <p className="text-8 sm:text-10 text-gray-500 leading-3 sm:leading-4">
              If you are not around when the delivery person arrives, they will
              leave your order at the door. by placing your order, you agree to
              take full responsibility for it once it&apos;s delivered.
            </p>
          </div>

          {/* Checkout Button */}
          <Button
            variant="brand"
            size="lg"
            className="w-full rounded-full text-12 sm:text-14 font-normal text-white  mb-3"
            disabled={!acceptTerms}
            onClick={() => {
              if (onCheckout) {
                onCheckout()
              }
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </Modal>
  )
}
