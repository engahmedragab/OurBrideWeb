'use client'

import Image from 'next/image'
import { Package, Calendar, Crown, Gift, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CartItemType } from './CartItem'

export interface CheckoutCartItemProps {
  id: string
  title: string
  image: string
  originalPrice: number
  discountedPrice: number
  currency?: string
  quantity: number
  deliveryDate?: string
  discountPercentage?: number
  purchasePrice?: number | null
  purchaseDate?: string
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
 * CheckoutCartItem - Preview-only cart item for checkout screen
 * Displays item information without any action buttons
 */
export const CheckoutCartItem = ({
  id,
  title,
  image,
  originalPrice,
  discountedPrice,
  currency = 'EGP',
  quantity,
  deliveryDate,
  discountPercentage,
  purchasePrice,
  purchaseDate,
  className,
  type,
}: CheckoutCartItemProps) => {
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
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Title */}
        <h3 className="text-18 font-semibold text-gray-900 line-clamp-2 mb-2">
          {title || typeLabel}
        </h3>

        {/* Price Per Piece */}
        <div className="mb-1">
          <span className="text-14 text-gray-600 mr-2">Price Per Piece</span>
          <span className="text-16 font-normal text-gray-900">
            {discountedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
          </span>
          {hasDiscount && (
            <span className="text-14 font-normal text-gray-400 line-through ml-2">
              {originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </span>
          )}
        </div>

        {/* Delivery Date */}
        {deliveryDate && (
          <p className="text-14 text-gray-600 mb-2">
            Get In By {deliveryDate}
          </p>
        )}

        {/* Purchase Price and Date */}
        <div className="flex flex-col gap-1 mb-3">
          {purchasePrice !== undefined && purchasePrice !== null && (
            <p className="text-14 text-gray-600">
              <span className="font-medium">Purchase Price: </span>
              <span>{purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
            </p>
          )}
          {purchaseDate && (
            <p className="text-14 text-gray-600">
              <span className="font-medium">Added on: </span>
              <span>{new Date(purchaseDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}</span>
            </p>
          )}
        </div>

        {/* Bottom: Total Price */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="text-16 font-semibold text-gray-900">
            <span className="font-normal">Total Price : </span>
            <span>{totalPrice.toLocaleString()} {currency}</span>
          </div>
        </div>
      </div>

      {/* Right: Quantity and Discount Badge (Read-only) */}
      <div className="flex flex-col items-end gap-3">
        {/* Discount Badge */}
        {discountPercentage && (
          <span className="text-14 font-medium text-green-500">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Quantity Display (Read-only) */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-12 text-gray-500">Quantity</span>
          <span className="text-18 font-semibold text-gray-900">
            {quantity}
          </span>
        </div>
      </div>
    </div>
  )
}

