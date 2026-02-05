'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ChevronUp, ExternalLink, FileText } from 'lucide-react'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'
import { DeliveryStatusBadge } from './DeliveryStatusBadge'
import {
  OrderProgressIndicator,
  type OrderStatus,
} from './OrderProgressIndicator'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'
import type { DeliveryStatus } from '@/../client/common/api/gen/ourbride-api'

export interface OrderProduct {
  purchaseId: string
  productId?: string
  serviceId?: string
  title: string
  image: string
  price: number
  quantity: number
}

export interface OrderCardProps {
  orderId: string
  orderDate: string
  status: OrderStatus
  products: OrderProduct[]
  subtotal: number
  taxesAndFees?: number
  deliveryFee: number
  total: number
  arrivalDate?: string
  arrivalTime?: string
  providerName?: string
  providerLogo?: string
  providerId?: number
  paymentStatus?: string
  paymentMethod?: string
  totalPaidAmount?: number
  totalRemainingAmount?: number
  paymentProgressPercentage?: number
  discountAmount?: number
  depositAmount?: number
  itemCount?: number
  deliveryStatus?: DeliveryStatus | string | null
  onCancelOrder?: () => void
  onReorder?: () => void
  onViewDetails?: () => void
  className?: string
}
 
export const OrderCard = ({
  orderId,
  orderDate,
  status,
  products,
  subtotal,
  taxesAndFees = 0,
  deliveryFee,
  total,
  arrivalDate,
  arrivalTime,
  providerName,
  providerLogo,
  providerId,
  paymentStatus,
  paymentMethod,
  totalPaidAmount = 0,
  totalRemainingAmount = 0,
  paymentProgressPercentage = 0,
  discountAmount = 0,
  depositAmount = 0,
  itemCount,
  deliveryStatus,
  onCancelOrder,
  onReorder,
  onViewDetails,
  className,
}: OrderCardProps) => {
  const t = useI18nTranslations('orderCard')
  const tCommon = useI18nTranslations('common')
  const isRTL = useIsRTL()
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [providerLogoError, setProviderLogoError] = useState(false)
  const isCompleted = status === 'delivered' || status === 'cancelled'
  const isInProgress = !isCompleted

  const normalizePaymentStatus = (value?: string) => {
    if (!value) return ''
    const key = value.toLowerCase()
    if (key === 'pending') return t('paymentStatus.pending')
    if (key === 'paid') return t('paymentStatus.paid')
    if (key === 'unpaid') return t('paymentStatus.unpaid')
    if (key === 'failed') return t('paymentStatus.failed')
    if (key === 'processing') return t('paymentStatus.processing')
    return value
  }

  const normalizePaymentMethod = (value?: string) => {
    if (!value) return ''
    const key = value.toLowerCase()
    if (key === 'cash_on_delivery' || key === 'cashondelivery') {
      return t('paymentMethod.cashOnDelivery')
    }
    if (key === 'card') return t('paymentMethod.card')
    if (key === 'wallet') return t('paymentMethod.wallet')
    return value
  }

  const getStatusBadgeType = ():
    | 'completed'
    | 'delivered'
    | 'cancelled'
    | 'inProgress' => {
    if (status === 'delivered') return 'delivered'
    if (status === 'cancelled') return 'cancelled'
    return 'inProgress'
  }

  const getStatusLineColor = () => {
    const base = isRTL ? 'border-r-4' : 'border-l-4'
    if (status === 'delivered') return `${base} border-green-500`
    if (status === 'cancelled') return `${base} border-red-500`
    return `${base} border-yellow-500`
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative',
        getStatusLineColor(),
        className
      )}
    >
      <div dir={isRTL ? 'rtl' : 'ltr'} className={cn('flex flex-col lg:flex-row gap-6', isRTL ? 'text-right' : 'text-left')}>
        {/* Left Section - Order Info and Progress */}
        <div className="flex-1">
          {/* Status Badge - Top Right */}
          <div className={cn('absolute top-6 flex items-center gap-2', isRTL ? 'left-4' : 'right-4')}>
            <StatusBadge status={getStatusBadgeType()} />
            <button
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={
                isSummaryOpen
                  ? t('aria.collapseSummary')
                  : t('aria.expandSummary')
              }
            >
              {isSummaryOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Order Info */}
          <div className={cn('mb-6', isRTL ? 'pl-32' : 'pr-32')}>
            <h3 className="text-18 font-semibold text-gray-900 mb-1">
              {t('header.orderLabel')} #{orderId}
            </h3>
            <p className="text-14 text-gray-600 mb-2">{t('header.placedLabel')}: {orderDate}</p>

            {arrivalDate && (
              <p className="text-14 text-gray-600 mb-2">
                {t('arrival.label')}: {arrivalDate}
                {arrivalTime && ` ${arrivalTime}`}
              </p>
            )}
            
            {/* Delivery Status */}
            {deliveryStatus && (
              <div className="mb-2">
                <DeliveryStatusBadge status={deliveryStatus} />
              </div>
            )}
            
            {isSummaryOpen && (
              <>
                {/* Provider Info */}
                {providerName && (
                  <div className="flex items-center gap-2 mb-2">
                    {providerLogo && (
                      <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                        {providerLogo && providerLogo.trim() !== '' && !providerLogoError ? (
                          <Image
                            src={providerLogo}
                            alt={providerName}
                            fill
                            sizes="24px"
                            className="object-cover"
                            onError={() => setProviderLogoError(true)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-8 font-medium">
                              {tCommon('noImageAvailable')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {providerId ? (
                      <Link
                        href={`/provider/${providerId}`}
                        className="text-14 text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                      >
                        {providerName}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <p className="text-14 text-gray-600">{providerName}</p>
                    )}
                  </div>
                )}

                {/* Item Count */}
                {itemCount !== undefined && (
                  <p className="text-12 text-gray-500">
                    {itemCount} {itemCount === 1 ? t('header.item') : t('header.items')}
                  </p>
                )}
              </>
            )}
          </div>

          {isSummaryOpen && (
            <>
              {/* Progress Indicator */}
              <div className="mb-6">
                <OrderProgressIndicator status={status} />
              </div>

              {/* Payment Status */}
              {paymentStatus && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-12 text-gray-600">{t('payment.status')}:</span>
                    <span className="text-12 font-medium text-gray-900">
                      {normalizePaymentStatus(paymentStatus)}
                    </span>
                  </div>
                  {paymentMethod && (
                    <div className="flex justify-between items-center">
                      <span className="text-12 text-gray-600">{t('payment.method')}:</span>
                      <span className="text-12 text-gray-700">{normalizePaymentMethod(paymentMethod)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Progress */}
              {paymentProgressPercentage > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-12 text-gray-600 mb-1">
                    <span>{t('payment.progress')}</span>
                    <span>{paymentProgressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-500 h-2 rounded-full transition-all"
                      style={{ width: `${paymentProgressPercentage}%` }}
                    />
                  </div>
                  {totalPaidAmount > 0 && (
                    <div className="flex justify-between text-12 text-gray-600 mt-1">
                      <span>{t('payment.paid')}: {totalPaidAmount.toLocaleString()} EGP</span>
                      {totalRemainingAmount > 0 && (
                        <span>{t('payment.remaining')}: {totalRemainingAmount.toLocaleString()} EGP</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                {onViewDetails && (
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={onViewDetails}
                  >
                    <FileText className="h-4 w-4" />
                    {t('actions.viewDetails')}
                  </Button>
                )}
                {isCompleted && onReorder && (
                  <Button
                    variant="brand"
                    size="md"
                    className="w-full text-white"
                    onClick={onReorder}
                  >
                    {t('actions.reorder')}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Section - Order Summary */}
        {isSummaryOpen && (
          <div className="flex-1 lg:max-w-md">
            <>
              <h4 className="text-16 font-semibold text-gray-900 mb-4">
                {t('summary.title')}
              </h4>

              {/* Products List */}
              <div className="space-y-3 mb-4">
                {products.map(product => (
                  <div
                    key={product.purchaseId}
                    className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                      {product.image && product.image.trim() !== '' && product.image !== '/placeholder-product.png' && product.image !== '/images/placeholder-product.png' && !imageErrors.has(product.purchaseId) ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                          onError={() => setImageErrors(prev => new Set(prev).add(product.purchaseId))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-10 font-medium text-center px-1">
                            {tCommon('noImageAvailable')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-14 font-medium text-gray-900 truncate">
                        {product.title}
                      </p>
                      <p className="text-14 text-gray-600">
                        {product.price.toLocaleString()} EGP {t('summary.quantity')} {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-14 text-gray-700">
                  <span>{t('summary.subtotal')}:</span>
                  <span className="font-semibold text-gray-900">
                    {subtotal.toLocaleString()} EGP
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-14 text-green-600">
                    <span>{t('summary.discount')}:</span>
                    <span className="font-semibold">
                      -{discountAmount.toLocaleString()} EGP
                    </span>
                  </div>
                )}
                {taxesAndFees > 0 && (
                  <div className="flex justify-between text-14 text-gray-700">
                    <span>{t('summary.taxesFees')}:</span>
                    <span className="font-semibold text-gray-900">
                      {taxesAndFees.toLocaleString()} EGP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-14 text-gray-700">
                  <span>{t('summary.deliveryFee')}:</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee.toLocaleString()} EGP
                  </span>
                </div>
                {depositAmount > 0 && (
                  <div className="flex justify-between text-14 text-gray-700">
                    <span>{t('summary.deposit')}:</span>
                    <span className="font-semibold text-gray-900">
                      {depositAmount.toLocaleString()} EGP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-16 font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t('summary.total')}:</span>
                  <span>{total.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Cancel Order Button for In Progress Orders */}
              {isInProgress && onCancelOrder && (
                <button
                  onClick={onCancelOrder}
                  className="w-full mt-4 text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors text-center"
                >
                  {t('actions.cancelOrder')}
                </button>
              )}
            </>
          </div>
        )}
      </div>
    </div>
  )
}
