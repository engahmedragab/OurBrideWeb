'use client'

import Image from 'next/image'
import {
  Trash2,
  Minus,
  Plus,
  Package,
  Calendar,
  Crown,
  Gift,
  Scissors,
} from 'lucide-react'
import { PriceDisplay } from './PriceDisplay'
import { Button } from './Button'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

export type CartItemType =
  | 'Product'
  | 'Service'
  | 'Reservation'
  | 'Membership'
  | 'GiftCard'

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
  purchasePrice?: number | null // Price from PurchaseResponse (price or totalPrice)
  purchaseDate?: string // Date from PurchaseResponse (creationDate or buyDate)
  className?: string
  type?: CartItemType
}

/**
 * Get icon component for cart item type
 */
const getTypeIcon = (type?: CartItemType) => {
  switch (type) {
    case 'Product':
      return Package
    case 'Service':
      return Scissors
    case 'Reservation':
      return Calendar
    case 'Membership':
      return Crown
    case 'GiftCard':
      return Gift
    default:
      return Package
  }
}

/**
 * Get type label for display
 */
const getTypeLabel = (type?: CartItemType): string => {
  switch (type) {
    case 'Product':
      return 'Product'
    case 'Service':
      return 'Service'
    case 'Reservation':
      return 'Reservation'
    case 'Membership':
      return 'Membership'
    case 'GiftCard':
      return 'Gift Card'
    default:
      return 'Item'
  }
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
  purchasePrice,
  purchaseDate,
  className,
  type,
}: CartItemProps) => {
  const totalPrice = discountedPrice * quantity
  const TypeIcon = getTypeIcon(type)
  const typeLabel = getTypeLabel(type)
  // Check if image is valid (not empty, not a placeholder, and not just a slash)
  const hasValidImage =
    image &&
    image.trim() !== '' &&
    image !== '/' &&
    !image.includes('placeholder') &&
    image !== '/placeholder-product.png' &&
    image !== '/placeholder-service.png' &&
    image !== '/placeholder-membership.png' &&
    image !== '/placeholder-giftcard.png'

  const hasDiscount = originalPrice > discountedPrice

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-4 flex gap-4 relative',
        className
      )}
    >
      {/* Left: Product Image or Icon */}
      <div className="relative flex-shrink-0 w-24 h-24">
        {hasValidImage ? (
          <div className="w-full h-full rounded-lg bg-gray-100 overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
            <TypeIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Middle: Product Details */}
      <div className="flex-1 min-w-0 flex flex-col pr-28">
        {/* Title */}
        <h3 className="text-18 font-semibold text-gray-900 line-clamp-2 mb-2">
          {title || typeLabel}
        </h3>

        {/* Price Per Piece */}
        <div className="mb-1 flex items-center gap-2">
          <span className="text-14 text-gray-600">Price Per Piece</span>
          <PriceDisplay
            original={originalPrice}
            discounted={discountedPrice}
            currency={currency || 'EGP'}
            size="md"
            variant="compact"
            showOriginal={hasDiscount}
          />
        </div>

        {/* Delivery Date */}
        {deliveryDate && (
          <p className="text-14 text-gray-600 mb-2">Get In By {deliveryDate}</p>
        )}

        {/* Purchase Price and Date */}
        <div className="flex flex-col gap-1 mb-3">
          {purchasePrice !== undefined && purchasePrice !== null && (
            <p className="text-14 text-gray-600">
              <span className="font-medium">Purchase Price: </span>
              <PriceDisplay
                discounted={purchasePrice}
                currency={currency || 'EGP'}
                size="sm"
                variant="inline"
                showOriginal={false}
              />
            </p>
          )}
          {purchaseDate && (
            <p className="text-14 text-gray-600">
              <span className="font-medium">Added on: </span>
              <span>
                {new Date(purchaseDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </p>
          )}
        </div>

        {/* Bottom: Total Price */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="text-16 font-semibold text-gray-900">
            <span className="font-normal">Total Price : </span>
            <PriceDisplay
              discounted={totalPrice}
              currency={currency || 'EGP'}
              size="md"
              variant="inline"
              showOriginal={false}
              discountedClassName="font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Right: Remove Button, Discount Badge, Quantity Selector, and Checkout Button */}
      <div className="flex flex-col items-end gap-3">
        {/* Remove Button - Top Right Corner */}
        <button
          onClick={() => onRemove(id)}
          className="p-1 text-red-500 hover:text-red-600 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        {/* Discount Badge - Below Remove Button */}
        {discountPercentage && (
          <span className="text-14 font-medium text-green-500">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(id, -1)}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-16 font-semibold text-gray-900 w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(id, 1)}
            className="w-8 h-8 rounded-full border-2 border-red-500 bg-white text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Checkout Button - Below Quantity Selector */}
        {onBuyNow && (
          <button
            onClick={() => onBuyNow(id)}
            className="px-4 py-2 text-14 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  )
}
