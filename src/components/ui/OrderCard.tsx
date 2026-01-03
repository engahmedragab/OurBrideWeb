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
import type { DeliveryStatus } from '@/../client/common/api/gen/ourbride-api'

export interface OrderProduct {
  id: string
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
  const [isSummaryOpen, setIsSummaryOpen] = useState(true)
  const isCompleted = status === 'delivered' || status === 'cancelled'
  const isInProgress = !isCompleted

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
    if (status === 'delivered') return 'border-l-4 border-green-500'
    if (status === 'cancelled') return 'border-l-4 border-red-500'
    return 'border-l-4 border-yellow-500'
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative',
        getStatusLineColor(),
        className
      )}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Order Info and Progress */}
        <div className="flex-1">
          {/* Status Badge - Top Right */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <StatusBadge status={getStatusBadgeType()} />
            <button
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={
                isSummaryOpen
                  ? 'Collapse order summary'
                  : 'Expand order summary'
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
          <div className="mb-6 pr-32">
            <h3 className="text-18 font-semibold text-gray-900 mb-1">
              Order #{orderId}
            </h3>
            <p className="text-14 text-gray-600 mb-2">Placed: {orderDate}</p>
            
            {/* Delivery Status */}
            {deliveryStatus && (
              <div className="mb-2">
                <DeliveryStatusBadge status={deliveryStatus} />
              </div>
            )}
            
            {/* Provider Info */}
            {providerName && (
              <div className="flex items-center gap-2 mb-2">
                {providerLogo && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={providerLogo}
                      alt={providerName}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
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
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <OrderProgressIndicator status={status} />
          </div>

          {/* Payment Status */}
          {paymentStatus && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-12 text-gray-600">Payment Status:</span>
                <span className="text-12 font-medium text-gray-900">
                  {paymentStatus}
                </span>
              </div>
              {paymentMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-12 text-gray-600">Payment Method:</span>
                  <span className="text-12 text-gray-700">{paymentMethod}</span>
                </div>
              )}
            </div>
          )}

          {/* Payment Progress */}
          {paymentProgressPercentage > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-12 text-gray-600 mb-1">
                <span>Payment Progress</span>
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
                  <span>Paid: {totalPaidAmount.toLocaleString()} EGP</span>
                  {totalRemainingAmount > 0 && (
                    <span>Remaining: {totalRemainingAmount.toLocaleString()} EGP</span>
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
                View Details
              </Button>
            )}
            {isCompleted && onReorder && (
              <Button
                variant="brand"
                size="md"
                className="w-full text-white"
                onClick={onReorder}
              >
                Re-Order
              </Button>
            )}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="flex-1 lg:max-w-md">
          {/* Arrival Info */}
          {arrivalDate && (
            <div className="text-14 text-gray-600 mb-4">
              <p>
                Arrive In : {arrivalDate}
                {arrivalTime && ` ${arrivalTime}`}
              </p>
            </div>
          )}

          {/* Collapsible Order Summary */}
          {isSummaryOpen && (
            <>
              <h4 className="text-16 font-semibold text-gray-900 mb-4">
                Order Summary
              </h4>

              {/* Products List */}
              <div className="space-y-3 mb-4">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                      {product.image && product.image.trim() !== '' && product.image !== '/placeholder-product.png' && product.image !== '/images/placeholder-product.png' ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-10">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-14 font-medium text-gray-900 truncate">
                        {product.title}
                      </p>
                      <p className="text-14 text-gray-600">
                        {product.price.toLocaleString()} EGP Qua{' '}
                        {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-14 text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {subtotal.toLocaleString()} EGP
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-14 text-green-600">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      -{discountAmount.toLocaleString()} EGP
                    </span>
                  </div>
                )}
                {taxesAndFees > 0 && (
                  <div className="flex justify-between text-14 text-gray-700">
                    <span>Taxes & Fees:</span>
                    <span className="font-semibold text-gray-900">
                      {taxesAndFees.toLocaleString()} EGP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-14 text-gray-700">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee.toLocaleString()} EGP
                  </span>
                </div>
                {depositAmount > 0 && (
                  <div className="flex justify-between text-14 text-gray-700">
                    <span>Deposit:</span>
                    <span className="font-semibold text-gray-900">
                      {depositAmount.toLocaleString()} EGP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-16 font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>{total.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Cancel Order Button for In Progress Orders */}
              {isInProgress && onCancelOrder && (
                <button
                  onClick={onCancelOrder}
                  className="w-full mt-4 text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors text-center"
                >
                  Cancel Order
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
