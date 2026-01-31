'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Trash2, Minus, Plus, Package, Calendar, Crown, Gift, Scissors } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'

export type CartItemType = 'Product' | 'Service' | 'Reservation' | 'Membership' | 'GiftCard'

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
  purchasePrice?: number | null
  purchaseDate?: string
  className?: string
  type?: CartItemType
}

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
  const t = useI18nTranslations('cart.cartItem')
  const tTypes = useI18nTranslations('cart.itemTypes')
  const isRTL=useIsRTL()

  const [imageError, setImageError] = useState(false)
  const totalPrice = discountedPrice * quantity
  const TypeIcon = getTypeIcon(type)

  const typeLabel = (() => {
    switch (type) {
      case 'Product':
        return tTypes('product')
      case 'Service':
        return tTypes('service')
      case 'Reservation':
        return tTypes('reservation')
      case 'Membership':
        return tTypes('membership')
      case 'GiftCard':
        return tTypes('giftCard')
      default:
        return tTypes('item')
    }
  })()

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
                alt={title || typeLabel}
                fill
                sizes="80px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-10 font-medium text-center px-1">
                {t('noImage')}
              </span>
            </div>
          )}
        </div>

        {/* Delete Button - Under Image */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(id)
          }}
          className="p-2 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-400"
          aria-label={t('removeItemAria')}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      {/* Middle: Product Details */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Discount Badge - Top Right */}
        {discountPercentage && (
          <span className="absolute top-0 right-0 text-12 font-medium text-green-500">
            {t('discountOff', { percent: discountPercentage })}
          </span>
        )}

        {/* Title */}
        <h3 className={cn("text-14 font-semibold text-gray-900 line-clamp-2 mb-2 ", isRTL ? 'text-right' : 'text-left')}>
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
            {t('getInBy', { date: deliveryDate })}
          </p>
        )}

        {/* Purchase Price and Date */}
        <div className="flex flex-col gap-1 mb-2">
          {purchasePrice !== undefined && purchasePrice !== null && (
            <p className="text-12 text-gray-600">
              <span className="font-medium">{t('purchasePrice')} </span>
              <span>
                {purchasePrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {currency}
              </span>
            </p>
          )}
          {purchaseDate && (
            <p className="text-12 text-gray-600">
              <span className="font-medium">{t('addedOn')} </span>
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

        {/* Bottom: Total Price and Quantity Selector */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Total Price */}
            <div className="text-14 font-semibold text-gray-900">
              <span className="font-normal">{t('totalPrice')} </span>
              <span>
                {totalPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {currency}
              </span>
            </div>

            {/* Quantity Selector */}
            {onQuantityChange && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (quantity > 1) {
                      onQuantityChange(id, -1)
                    }
                  }}
                  disabled={quantity <= 1}
                  className="h-8 w-8 rounded-full border-2 border-gray-300 hover:bg-gray-50 text-gray-600"
                  aria-label={t('decreaseQtyAria')}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-14 font-semibold text-gray-900 w-6 text-center">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuantityChange(id, 1)
                  }}
                  className="h-8 w-8 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-400 text-red-500"
                  aria-label={t('increaseQtyAria')}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          {onBuyNow && (
            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={(e) => {
                  e.stopPropagation()
                  onBuyNow(id)
                }}
                className="!text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500"
              >
                {t('checkout')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
