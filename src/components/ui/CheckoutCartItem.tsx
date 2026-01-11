'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Package, Calendar, Crown, Gift, Scissors, Trash2, Minus, Plus } from 'lucide-react'
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
  onQuantityChange?: (id: string, delta: number) => void
  onRemove?: (id: string) => void
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
 * CheckoutCartItem - Cart item for checkout screen with quantity and delete controls
 */
export const CheckoutCartItem = ({
  id,
  title,
  image,
  originalPrice,
  discountedPrice,
  currency = 'EGP',
  quantity,
  onQuantityChange,
  onRemove,
  deliveryDate,
  discountPercentage,
  purchasePrice,
  purchaseDate,
  className,
  type,
}: CheckoutCartItemProps) => {
  const [imageError, setImageError] = useState(false)
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
    image !== '/placeholder-giftcard.png' &&
    !imageError

  const hasDiscount = originalPrice > discountedPrice

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-4 flex gap-4 relative',
        className
      )}
    >
      {/* Left: Product Image with Delete Button */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="relative w-20 h-20">
          {hasValidImage ? (
            <div className="w-full h-full rounded-lg bg-gray-100 overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                sizes="80px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-10 font-medium text-center px-1">
                No image available
              </span>
            </div>
          )}
        </div>
        {/* Delete Button - Under Image */}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(id)
            }}
            className="p-2 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        )}
      </div>

      {/* Middle: Product Details */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Discount Badge - Top Right */}
        {discountPercentage && (
          <span className="absolute top-0 right-0 text-12 font-medium text-green-500">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Title */}
        <h3 className="text-14 font-semibold text-gray-900 line-clamp-2 mb-2 pr-16">
          {title || typeLabel}
        </h3>

        {/* Price */}
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-14 font-semibold text-gray-900">
            {discountedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
          </span>
          {hasDiscount && (
            <span className="text-14 font-normal text-gray-400 line-through">
              {originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </span>
          )}
        </div>

        {/* Delivery Date */}
        {deliveryDate && (
          <p className="text-12 text-gray-600 mb-2">
            Get In By {deliveryDate}
          </p>
        )}

        {/* Purchase Price and Date */}
        <div className="flex flex-col gap-1 mb-auto">
          {purchasePrice !== undefined && purchasePrice !== null && (
            <p className="text-12 text-gray-600">
              <span className="font-medium">Purchase Price: </span>
              <span>{purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
            </p>
          )}
          {purchaseDate && (
            <p className="text-12 text-gray-600">
              <span className="font-medium">Added on: </span>
              <span>{new Date(purchaseDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}</span>
            </p>
          )}
        </div>

        {/* Bottom: Quantity Selector */}
        {onQuantityChange && (
          <div className="flex items-center gap-2 mt-auto pt-3 ml-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (quantity > 1) {
                  onQuantityChange(id, -1)
                }
              }}
              disabled={quantity <= 1}
              className={cn(
                'h-8 w-8 rounded-full border-2 flex items-center justify-center',
                'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
                'border-gray-300 hover:bg-gray-50 text-gray-600'
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-14 font-semibold text-gray-900 w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onQuantityChange(id, 1)
              }}
              className={cn(
                'h-8 w-8 rounded-full border-2 flex items-center justify-center',
                'transition-colors',
                'border-red-300 hover:bg-red-50 hover:border-red-400 text-red-500'
              )}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

