'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Checkbox } from './Checkbox'
import { Percent, Gem, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CartOrderSummaryProps {
  subtotal: number
  taxesAndFees?: number
  deliveryFee?: number
  total: number
  currency?: string
  onCheckout?: () => void
  className?: string
}

/**
 * CartOrderSummary - Order summary sidebar for cart page with promo code, rewards, and checkout
 */
export const CartOrderSummary = ({
  subtotal,
  taxesAndFees = 0,
  deliveryFee = 0,
  total,
  currency = 'EGP',
  onCheckout,
  className,
}: CartOrderSummaryProps) => {
  const [promoCode, setPromoCode] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleRedeemPromo = () => {
    // TODO: Implement promo code redemption
  }

  const handleRedeemDiamonds = () => {
    // TODO: Implement diamonds redemption
  }

  const handleRedeemGiftsCash = () => {
    // TODO: Implement gifts cash redemption
  }

  return (
    <aside
      className={cn(
        'w-full lg:w-80 flex-shrink-0 bg-gray-50 p-4 sm:p-6 overflow-y-auto lg:sticky lg:top-6 h-fit rounded-xl border border-gray-200',
        className
      )}
    >
      {/* Promo Code */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-brand-500 flex-shrink-0" />
          <Input
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            placeholder="Enter Promo Code"
            className="flex-1"
          />
          <button
            onClick={handleRedeemPromo}
            disabled={!promoCode.trim()}
            className="text-14 font-medium text-brand-500 hover:text-brand-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Redeem
          </button>
        </div>
      </div>

      {/* Rewards */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-brand-500 flex-shrink-0" />
            <span className="text-14 font-medium text-gray-900">
              Diamonds : 250 Points
            </span>
          </div>
          <button
            onClick={handleRedeemDiamonds}
            className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            Redeem
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-brand-500 flex-shrink-0" />
            <span className="text-14 font-medium text-gray-900">
              Gifts Cash : 500 {currency}
            </span>
          </div>
          <button
            onClick={handleRedeemGiftsCash}
            className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            Redeem
          </button>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200 mb-6">
        <div className="flex justify-between text-14 text-gray-700">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">
            {subtotal.toLocaleString()} {currency}
          </span>
        </div>
        {taxesAndFees > 0 && (
          <div className="flex justify-between text-14 text-gray-700">
            <span>Taxes & Fees</span>
            <span className="font-semibold text-gray-900">
              {taxesAndFees.toLocaleString()} {currency}
            </span>
          </div>
        )}
        {deliveryFee > 0 && (
          <div className="flex justify-between text-14 text-gray-700">
            <span>Delivery Fee</span>
            <span className="font-semibold text-gray-900">
              {deliveryFee.toLocaleString()} {currency}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-18 font-semibold text-gray-900">Total</span>
          <div className="text-right">
            <div className="text-18 font-semibold text-gray-900">
              {total.toLocaleString()} {currency}
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-3">
          <Checkbox
            checked={acceptTerms}
            onChange={checked => setAcceptTerms(checked)}
            id="terms-checkbox"
          />
          <label
            htmlFor="terms-checkbox"
            className="text-14 text-gray-700 cursor-pointer"
          >
            I Accept Terms & Conditions
          </label>
        </div>
        <p className="text-12 text-gray-600 leading-relaxed">
          If you are not around when the delivery person arrives, they will
          leave your order at the door. By placing your order, you agree to take
          full responsibility for it once it&apos;s delivered.
        </p>
      </div>

      {/* Checkout Button */}
      <Button
        variant="brand"
        size="lg"
        onClick={onCheckout}
        disabled={!acceptTerms}
        className="w-full text-white"
      >
        Checkout All
      </Button>
    </aside>
  )
}
