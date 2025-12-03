'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  OrderProgressIndicator,
  type OrderStatus,
} from './OrderProgressIndicator'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'

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
  onCancelOrder?: () => void
  onReorder?: () => void
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
  onCancelOrder,
  onReorder,
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

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative',
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
            <p className="text-14 text-gray-600">Placed : {orderDate}</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <OrderProgressIndicator status={status} />
          </div>

          {/* Re-Order Button for Completed/Cancelled Orders */}
          {isCompleted && onReorder && (
            <div className="mt-4">
              <Button
                variant="brand"
                size="md"
                className="w-full text-white"
                onClick={onReorder}
              >
                Re-Order
              </Button>
            </div>
          )}
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
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                    />
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
