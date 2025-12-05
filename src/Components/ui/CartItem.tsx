'use client'

import { Trash2, Minus, Plus } from 'lucide-react'
import { PriceDisplay } from './PriceDisplay'
import { Button } from './Button'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

export interface CartItemProps {
  id: string
  title: string
  image: string
  originalPrice: number
  discountedPrice: number
  currency?: string
  quantity: number
  onQuantityChange: (id: string, delta: number) => void
  onRemove: (id: string) => void
  onBuyNow?: (id: string) => void
  deliveryDate?: string
  discountPercentage?: number
  className?: string
}

/**
 * CartItem - Displays a single product item in the cart
 */
export const CartItem = ({
  id,
  title,
  image,
  originalPrice,
  discountedPrice,
  currency = 'EGP',
  quantity,
  onQuantityChange,
  onRemove,
  onBuyNow,
  deliveryDate,
  discountPercentage,
  className,
}: CartItemProps) => {
  const totalPrice = discountedPrice * quantity

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4 relative',
        className
      )}
    >
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-20 h-20 rounded-lg object-cover"
        />
      </div>

      {/* Product Details and Bottom Actions */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Section: Title, Price, Delivery */}
        <div className="mb-3">
          <h3 className="text-16 font-semibold text-gray-900 mb-2">{title}</h3>

          {/* Price */}
          <div className="mb-2">
            <PriceDisplay
              original={originalPrice}
              discounted={discountedPrice}
              currency={currency}
              size="sm"
            />
          </div>

          {/* Delivery Date */}
          {deliveryDate && (
            <p className="text-14 text-gray-600">
              Get In By {deliveryDate}
            </p>
          )}
        </div>

        {/* Bottom Section: Quantity Selector, Total Price, and Buy Now */}
        <div className="flex items-center gap-4 mt-auto">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(id, -1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-16 font-semibold text-gray-900 w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(id, 1)}
              className="w-8 h-8 rounded-full bg-brand-500 text-white hover:bg-brand-600 transition-colors flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Total Price */}
          <div className="text-14 text-gray-700">
            Total Price : {totalPrice.toLocaleString()} {currency}
          </div>

          {/* Buy Now Button */}
          {onBuyNow && (
            <Button
              variant="brand"
              size="md"
              onClick={() => onBuyNow(id)}
              className="whitespace-nowrap ml-auto text-white"
            >
              Buy Now
            </Button>
          )}
        </div>
      </div>

      {/* Top Right: Remove Button and Discount Badge */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        {/* Remove Button */}
        <button
          onClick={() => onRemove(id)}
          className="p-1 text-red-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Discount Badge */}
        {discountPercentage && (
          <Badge
            variant="success"
            className="text-10 px-1.5 py-0.5 bg-green-500 text-white border-0"
          >
            {discountPercentage}% OFF
          </Badge>
        )}
      </div>
    </div>
  )
}

