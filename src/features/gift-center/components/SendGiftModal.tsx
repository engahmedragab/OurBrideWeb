'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Gift, User, Mail } from 'lucide-react'
import { Modal, Button, Input, Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'
import phoneIconSvg from '@/assets/svg/PhoneIcon.svg'

/**
 * Send Gift Modal Component Props
 */
export interface SendGiftModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Send Gift Modal Component
 * Modal for sending gifts with payment form and order summary
 */
export const SendGiftModal = ({ open, onClose }: SendGiftModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [selectedGiftId, setSelectedGiftId] = useState<string>('1')

  const orderItems = [
    { id: '1', amount: 500 },
    { id: '2', amount: 500 },
    { id: '3', amount: 500 },
    { id: '4', amount: 500 },
  ]

  const subtotal = 500
  const taxes = 20
  const total = subtotal + taxes

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      maxWidth="2xl"
      showCloseButton={true}
      contentClassName="p-0 overflow-visible"
      headerClassName="px-4 sm:px-6 pt-4 sm:pt-6 pb-0 border-b-0"
      containerClassName="overflow-visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Left Column - Form */}
        <div className="space-y-4 sm:space-y-6">
          {/* Title */}
          <h2 className="text-16 sm:text-18 font-semibold text-gray-900">
            Send Gift
          </h2>

          {/* Your Information */}
          <div>
            <h3 className="text-12 sm:text-14 font-semibold text-gray-900 mb-2 sm:mb-3">
              Your Informations
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <Input
                placeholder="Full Name"
                prefixIcon={<User className="h-4 w-4 text-gray-400" />}
                className="w-full"
                size="sm"
                variant="default"
              />
              <Input
                placeholder="Mobile Number"
                prefixIcon={
                  <Image
                    src={
                      typeof phoneIconSvg === 'string'
                        ? phoneIconSvg
                        : phoneIconSvg.src
                    }
                    alt="Phone"
                    width={16}
                    height={16}
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

          {/* Recipient Information */}
          <div>
            <h3 className="text-12 sm:text-14 font-semibold text-gray-900 mb-2 sm:mb-3">
              Who will receive your gift ?
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <Input
                placeholder="Full Name"
                prefixIcon={<User className="h-4 w-4 text-gray-400" />}
                className="w-full"
                size="sm"
                variant="default"
              />
              <Input
                placeholder="E-mail"
                prefixIcon={<Mail className="h-4 w-4 text-gray-400" />}
                type="email"
                className="w-full"
                size="sm"
                variant="default"
              />
              <Input
                placeholder="Mobile Number"
                prefixIcon={
                  <Image
                    src={
                      typeof phoneIconSvg === 'string'
                        ? phoneIconSvg
                        : phoneIconSvg.src
                    }
                    alt="Phone"
                    width={16}
                    height={16}
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
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant={paymentMethod === 'card' ? 'outlineBrand' : 'outline'}
                size="md"
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  'flex-1 rounded-lg text-10 sm:text-12 font-normal',
                  paymentMethod === 'card'
                    ? '!border-brand-500 !text-gray-900 !bg-white'
                    : '!border-gray-300 !text-gray-600 !bg-white hover:!bg-gray-50'
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
                    : '!border-gray-300 !text-gray-600 !bg-white hover:!bg-gray-50'
                )}
              >
                Mobile Wallet
              </Button>
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div>
              <h3 className="text-12 sm:text-14 font-semibold text-gray-900 mb-2 sm:mb-3">
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
        <div className="rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h3 className="text-12 sm:text-14 font-semibold text-gray-900">
            Order Summary
          </h3>

          {/* Order Items */}
          <div className="space-y-2 sm:space-y-3">
            {orderItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedGiftId(item.id)}
                className={cn(
                  'flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl cursor-pointer transition-all',
                  selectedGiftId === item.id
                    ? 'border-2 border-brand-500'
                    : 'border border-gray-300'
                )}
              >
                <div className="flex items-center justify-center flex-shrink-0">
                  <Gift className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
                </div>
                <span className="text-12 sm:text-14 font-normal text-gray-900 flex-1">
                  {item.amount} egp Coupon
                </span>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-1.5 sm:space-y-2 pt-2 sm:pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-10 sm:text-12 text-gray-600">Subtotal</span>
              <span className="text-10 sm:text-12 font-semibold text-gray-900">
                {subtotal} EGP
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-10 sm:text-12 text-gray-600">
                Taxes & Fees
              </span>
              <span className="text-10 sm:text-12 font-semibold text-gray-900">
                {taxes} EGP
              </span>
            </div>
            <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-gray-200">
              <span className="text-12 sm:text-14 font-semibold text-gray-900">
                Total
              </span>
              <span className="text-12 sm:text-14 font-semibold text-gray-900">
                {total} EGP
              </span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Checkbox
                checked={acceptTerms}
                onChange={setAcceptTerms}
                variant="brand"
                size="sm"
              />
              <label className="text-10 sm:text-12 text-gray-600 cursor-pointer flex-1">
                I Accept{' '}
                <span className="font-semibold text-gray-900">
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
            size="md"
            className="w-full rounded-full text-12 sm:text-14 font-semibold"
            onClick={() => {
              // Placeholder for checkout logic
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </Modal>
  )
}

