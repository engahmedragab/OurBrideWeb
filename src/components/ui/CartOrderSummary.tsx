'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Checkbox } from './Checkbox'
import { Percent, Gem, Gift, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriceCalculationResponse } from '@/types/responses/price-calculation-response'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'

export interface CartOrderSummaryProps {
  subtotal: number
  taxesAndFees?: number
  deliveryFee?: number
  total: number
  currency?: string
  onCheckout?: () => void
  className?: string
  priceCalculation?: PriceCalculationResponse | null
  couponCode?: string // Optional coupon code from cart response
}

/**
 * CartOrderSummary - Order summary sidebar for cart page with coupon code, rewards, and checkout
 */
export const CartOrderSummary = ({
  subtotal,
  taxesAndFees = 0,
  deliveryFee = 0,
  total,
  currency = 'EGP',
  onCheckout,
  className,
  priceCalculation,
  couponCode: couponCodeProp,
}: CartOrderSummaryProps) => {
  const t = useI18nTranslations('cart.orderSummary')
  const tActions = useI18nTranslations('cart.actions')
  const tBreakdown = useI18nTranslations('cart.orderSummary.breakdown')
  const tRewards = useI18nTranslations('cart.orderSummary.rewards')
  const tPromo = useI18nTranslations('cart.orderSummary.promo')
  const tDeposit = useI18nTranslations('cart.orderSummary.deposit')
  const tTerms = useI18nTranslations('cart.orderSummary.terms')
  const isRTL=useIsRTL()

  // Use priceCalculation data if available, otherwise use props
  const finalSubtotal = priceCalculation?.subtotal ?? subtotal
  const finalTax = priceCalculation?.tax ?? taxesAndFees
  const finalShipping = priceCalculation?.shippingCost ?? deliveryFee
  const finalTotal = priceCalculation?.total ?? total
  // Get coupon code from priceCalculation first, then from prop, then from cartSummary if available
  const appliedCouponCode = priceCalculation?.couponCode ?? couponCodeProp ?? ''
  const walletAmount = priceCalculation?.walletAmount ?? 0
  const giftCardAmount = priceCalculation?.giftCardAmount ?? 0
  const appliedGiftCardCodes = priceCalculation?.appliedGiftCardCodes ?? []

  // Discounts
  const discount = priceCalculation?.discount ?? 0
  const couponDiscount = priceCalculation?.couponDiscount ?? 0
  const membershipDiscount = priceCalculation?.membershipDiscount ?? 0
  const cashCardAmount = priceCalculation?.cashCardAmount ?? 0

  // Deposit info
  const depositAmount = priceCalculation?.depositAmount ?? 0
  const depositPaid = priceCalculation?.depositPaid ?? 0
  const depositRemaining = priceCalculation?.depositRemaining ?? 0

  const [couponCode, setCouponCode] = useState(appliedCouponCode)
  const [acceptTerms, setAcceptTerms] = useState(false)
  

  const handleRedeemCoupon = () => {
    // TODO: Implement coupon code redemption
  }

  const handleRedeemDiamonds = () => {
    // TODO: Implement diamonds redemption
  }

  const handleRedeemGiftsCash = () => {
    // TODO: Implement gifts cash redemption
  }

  const handleRemoveCoupon = () => {
    // TODO: Implement coupon removal
    setCouponCode('')
  }

  return (
    <aside
      className={cn(
        'w-full bg-white lg:w-80 flex-shrink-0  p-4 sm:p-6 overflow-y-auto lg:sticky lg:top-6 h-fit rounded-xl border border-gray-200',
        className
      )}
    >
      {/* Coupon Code */}
      <div dir={isRTL?'rtl':'ltr'} className="mb-6 pb-6 space-y-3">
        {appliedCouponCode ? (
          <div className="flex items-center justify-between gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Percent className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-14 font-medium text-green-800 truncate">
                {appliedCouponCode}
              </span>
              {couponDiscount > 0 && (
                <span className="text-12 text-green-600">
                  (-{couponDiscount.toLocaleString()} {currency})
                </span>
              )}
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-1 text-brand-500 hover:text-brand-600 transition-colors flex-shrink-0"
              aria-label={tPromo('removeCouponAria')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div  className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                placeholder={tPromo('placeholder')}
                className={cn(
                  'w-full bg-transparent focus:outline-none focus:border-gray-300',
                  'py-1 text-14 text-gray-900 placeholder:text-gray-300 placeholder:text-14',
                  'pl-10 border border-t-0 border-x-0 border-b border-gray-200 rounded-none',
                   isRTL ? 'pr-10  text-right' : 'pl-10  text-left'
                )}
              />
              <Percent  className={cn(
            'h-6 w-6 text-brand-500 absolute top-1/2 -translate-y-1/2 pointer-events-none',
          
           isRTL ? 'right-2' : 'left-2'
          )} />
              <button
                onClick={handleRedeemCoupon}
                disabled={!couponCode.trim()}
                className={cn(
                  'absolute  top-1/2 -translate-y-1/2',
                  '!text-14 font-medium text-brand-500 hover:text-brand-600',
                  'disabled:text-gray-400 disabled:cursor-not-allowed transition-colors',
                    isRTL ? 'left-2' : 'right-2'
                )}
                type="button"
              >
                {tActions('redeem')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rewards */}
      {(walletAmount > 0 || giftCardAmount > 0) && (
        <div className="mb-6 space-y-3">
          {walletAmount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span className="text-14 font-medium text-gray-900">
                  {tRewards('diamonds', { points: walletAmount.toLocaleString() })}
                </span>
              </div>
              <button
                onClick={handleRedeemDiamonds}
                className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
              >
                {tActions('redeem')}
              </button>
            </div>
          )}

          {giftCardAmount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span className="text-14 font-medium text-gray-900">
                  {tRewards('giftsCash', {
                    amount: giftCardAmount.toLocaleString(),
                    currency,
                  })}
                </span>
              </div>
              <button
                onClick={handleRedeemGiftsCash}
                className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
              >
                {tActions('redeem')}
              </button>
            </div>
          )}

          {appliedGiftCardCodes.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-12 text-gray-600 mb-1">
                {tRewards('appliedGiftCards')}
              </p>
              <div className="flex flex-wrap gap-1">
                {appliedGiftCardCodes.map((code, index) => (
                  <span
                    key={index}
                    className="text-12 px-2 py-1 bg-gray-100 text-gray-700 rounded"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200 mb-6">
        <div className="flex justify-between text-14 text-gray-700">
          <span>{tBreakdown('subtotal')}</span>
          <span className="font-semibold text-gray-900">
            {finalSubtotal.toLocaleString()} {currency}
          </span>
        </div>

        {/* Discounts */}
        {discount > 0 && (
          <div className="flex justify-between text-14 text-green-600">
            <span>{tBreakdown('discount')}</span>
            <span className="font-semibold">
              -{discount.toLocaleString()} {currency}
            </span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between text-14 text-green-600">
            <span>{tBreakdown('couponDiscount')}</span>
            <span className="font-semibold">
              -{couponDiscount.toLocaleString()} {currency}
            </span>
          </div>
        )}

        {membershipDiscount > 0 && (
          <div className="flex justify-between text-14 text-green-600">
            <span>{tBreakdown('membershipDiscount')}</span>
            <span className="font-semibold">
              -{membershipDiscount.toLocaleString()} {currency}
            </span>
          </div>
        )}

        {walletAmount > 0 && (
          <div className="flex justify-between text-14 text-green-600">
            <span>{tBreakdown('walletCredit')}</span>
            <span className="font-semibold">
              -{walletAmount.toLocaleString()} {currency}
            </span>
          </div>
        )}

        {giftCardAmount > 0 && (
          <div className="flex justify-between text-14 text-green-600">
            <span>{tBreakdown('giftCard')}</span>
            <span className="font-semibold">
              -{giftCardAmount.toLocaleString()} {currency}
            </span>
          </div>
        )}

        {cashCardAmount > 0 && (
          <div className="flex justify-between text-14 text-green-600">
            <span>{tBreakdown('cashCard')}</span>
            <span className="font-semibold">
              -{cashCardAmount.toLocaleString()} {currency}
            </span>
          </div>
        )}

        {finalTax > 0 && (
          <div className="flex justify-between text-14 text-gray-700">
            <span>{tBreakdown('taxesFees')}</span>
            <span className="font-semibold text-gray-900">
              {finalTax.toLocaleString()} {currency}
            </span>
          </div>
        )}

        {finalShipping > 0 && (
          <div className="flex justify-between text-14 text-gray-700">
            <span>{tBreakdown('deliveryFee')}</span>
            <span className="font-semibold text-gray-900">
              {finalShipping.toLocaleString()} {currency}
            </span>
          </div>
        )}

        {/* Deposit Information */}
        {depositAmount > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-14 text-gray-700 mb-1">
              <span>{tDeposit('depositAmount')}</span>
              <span className="font-semibold text-gray-900">
                {depositAmount.toLocaleString()} {currency}
              </span>
            </div>

            {depositPaid > 0 && (
              <div className="flex justify-between text-12 text-gray-600">
                <span>{tDeposit('depositPaid')}</span>
                <span>
                  {depositPaid.toLocaleString()} {currency}
                </span>
              </div>
            )}

            {depositRemaining > 0 && (
              <div className="flex justify-between text-12 text-gray-600">
                <span>{tDeposit('depositRemaining')}</span>
                <span>
                  {depositRemaining.toLocaleString()} {currency}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-18 font-semibold text-gray-900">
            {tBreakdown('total')}
          </span>
          <div className="text-right">
            <div className="text-18 font-semibold text-gray-900">
              {finalTotal.toLocaleString()} {currency}
            </div>
          </div>
        </div>
      </div>

      {/* Applied Coupon Code - Display under summary section */}
      {appliedCouponCode && (
         <div className="pt-4 pb-4 border-t border-gray-200">
          <div className={cn("flex items-center justify-center gap-2 px-2 py-2 bg-green-50 border border-green-200 rounded-lg",
          isRTL?'flex-row-reverse':'flex row'
        )}>
            <Percent className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-14 font-medium text-green-800">
              #{appliedCouponCode||500}
            </span>
            <div className="flex items-center gap-1 ml-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-14 font-medium text-green-600">
                {tPromo('redeemed')}
              </span>
            </div>
          </div>
        </div>
      )}

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
            {tTerms('accept')}
          </label>
        </div>
        <p className="text-12 text-gray-600 leading-relaxed">{tTerms('note')}</p>
      </div>

      {/* Checkout Button - Desktop only */}
      <Button
        variant="brand"
        size="lg"
        onClick={onCheckout}
        disabled={!acceptTerms}
        className="flex w-full text-white"
      >
        {tActions('checkoutAll')}
      </Button>
    </aside>
  )
}
