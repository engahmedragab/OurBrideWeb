'use client'

import { useState } from 'react'
import { Gift, User, Mail, Phone, CreditCard, Wallet } from 'lucide-react'
import { Modal, Button, Input, Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'

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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const orderItems = [
    { id: '1', amount: couponAmount },
    { id: '2', amount: couponAmount },
    { id: '3', amount: couponAmount },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.amount, 0)
  const taxes = 20
  const total = subtotal + taxes

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Gift"
      maxWidth="2xl"
      contentClassName="p-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Left Column - Form */}
        <div className="space-y-4 sm:space-y-6">
          {/* Your Information */}
          <div>
            <h3 className="text-14 sm:text-16 font-semibold text-gray-900 mb-3 sm:mb-4">
              Your Informations
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <Input
                placeholder="Full Name"
                prefixIcon={User}
                className="w-full"
              />
              <Input
                placeholder="Mobile Number"
                prefixIcon={Phone}
                type="tel"
                className="w-full"
              />
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h3 className="text-14 sm:text-16 font-semibold text-gray-900 mb-3 sm:mb-4">
              Who will receive your gift?
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <Input
                placeholder="Full Name"
                prefixIcon={User}
                className="w-full"
              />
              <Input
                placeholder="E-mail"
                prefixIcon={Mail}
                type="email"
                className="w-full"
              />
              <Input
                placeholder="Mobile Number"
                prefixIcon={Phone}
                type="tel"
                className="w-full"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-14 sm:text-16 font-semibold text-gray-900 mb-3 sm:mb-4">
              Payment Method
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant={paymentMethod === 'card' ? 'brand' : 'outlineBrand'}
                size="sm"
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  'flex-1 rounded-full',
                  paymentMethod === 'card'
                    ? ''
                    : 'text-brand-500 hover:text-brand-600'
                )}
              >
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Debit / Credit
              </Button>
              <Button
                variant={paymentMethod === 'wallet' ? 'brand' : 'outlineBrand'}
                size="sm"
                onClick={() => setPaymentMethod('wallet')}
                className={cn(
                  'flex-1 rounded-full',
                  paymentMethod === 'wallet'
                    ? ''
                    : 'text-brand-500 hover:text-brand-600'
                )}
              >
                <Wallet className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Mobile Wallet
              </Button>
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div>
              <h3 className="text-14 sm:text-16 font-semibold text-gray-900 mb-3 sm:mb-4">
                Card Details
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <Input placeholder="Name On Card" className="w-full" />
                <Input placeholder="Card Number" type="tel" className="w-full" />
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Input placeholder="MM/YY" type="tel" className="w-full" />
                  <Input placeholder="CVV" type="tel" className="w-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h3 className="text-14 sm:text-16 font-semibold text-gray-900">Order Summary</h3>

          {/* Order Items */}
          <div className="space-y-3 sm:space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl ${
                  index === 0 ? 'border-2 border-brand-500' : 'border border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center flex-shrink-0">
                  <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                </div>
                <span className="text-14 sm:text-16 font-normal text-gray-900 flex-1">
                  {item.amount} egp Coupon
                </span>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-12 sm:text-14 text-gray-600">Subtotal</span>
              <span className="text-12 sm:text-14 font-semibold text-gray-900">
                {subtotal} EGP
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-12 sm:text-14 text-gray-600">Taxes & Fees</span>
              <span className="text-12 sm:text-14 font-semibold text-gray-900">
                {taxes} EGP
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-14 sm:text-16 font-semibold text-gray-900">Total</span>
              <span className="text-14 sm:text-16 font-semibold text-gray-900">
                {total} EGP
              </span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <Checkbox
                checked={acceptTerms}
                onChange={setAcceptTerms}
                variant="brand"
                size="sm"
              />
              <label className="text-10 sm:text-12 text-gray-600 cursor-pointer">
                I Accept Terms & Conditions
              </label>
            </div>
            <p className="text-9 sm:text-10 text-gray-500">
              If you are not around when the delivery person arrives, they will
              leave your order at the door. By placing your order, you agree to
              take full responsibility for it once it&apos;s delivered.
            </p>
          </div>

          {/* Checkout Button */}
          <Button
            variant="brand"
            size="md"
            className="w-full rounded-full"
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

