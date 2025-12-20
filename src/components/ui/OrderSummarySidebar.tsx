'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface OrderProduct {
  id: string
  title: string
  image: string
  price: number
  quantity: number
}

export interface OrderSummarySidebarProps {
  products: OrderProduct[]
  subtotal: number
  taxesAndFees?: number
  deliveryFee: number
  total: number
  onCancelOrder?: () => void
  className?: string
}

export const OrderSummarySidebar = ({
  products,
  subtotal,
  taxesAndFees = 0,
  deliveryFee,
  total,
  onCancelOrder,
  className,
}: OrderSummarySidebarProps) => {
  return (
    <aside
      className={cn(
        'w-80 flex-shrink-0 bg-white border-l border-gray-200 p-6 overflow-y-auto',
        className
      )}
    >
      <h2 className="text-20 font-semibold text-gray-900 mb-6">
        Order Summary
      </h2>

      {/* Products List */}
      <div className="space-y-3 mb-6">
        {products.map(product => (
          <div
            key={product.id}
            className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
          >
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-14 font-medium text-gray-900 truncate">
                {product.title}
              </p>
              <p className="text-14 text-gray-600">
                {product.price.toLocaleString()} EGP Qua {product.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
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
        <div className="flex justify-between text-16 font-semibold text-gray-900 pt-3 border-t border-gray-200">
          <span>Total:</span>
          <span>{total.toLocaleString()} EGP</span>
        </div>
      </div>

      {/* Cancel Order Button */}
      {onCancelOrder && (
        <button
          onClick={onCancelOrder}
          className="w-full mt-6 text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors text-center"
        >
          Cancel Order
        </button>
      )}
    </aside>
  )
}
