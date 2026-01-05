'use client'

import Image from 'next/image'
import { Trash2, Minus, Plus, Package, Calendar, Crown, Gift, Scissors } from 'lucide-react'
import { PriceDisplay } from './PriceDisplay'
import { cn } from '@/lib/utils'

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
    <div className={cn('bg-white border border-gray-200 rounded-xl p-4', className)}>
      {/* ===== Top content (image + details + right controls on md+) ===== */}
      <div className="flex gap-4">
        {/* Left: Image / Icon */}
        <div className="relative flex-shrink-0 w-24 h-24">
          {hasValidImage ? (
            <div className="w-full h-full  bg-gray-100 overflow-hidden ">
              <Image src={image} alt={title || typeLabel} fill sizes="96px" className="object-cover rounded-xl" />
            </div>
          ) : (
            <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
              <TypeIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Middle: Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-18 font-semibold text-gray-900 line-clamp-2 mb-2">
            {title || typeLabel}
          </h3>

          {/* Price Per Piece */}
          <div className="mb-1 flex items-center gap-2">
            <span className="text-14 text-gray-600">Price Per Piece</span>
            <PriceDisplay
              original={originalPrice}
              discounted={discountedPrice}
              currency={currency as any}
              size="md"
              variant="compact"
              showOriginal={hasDiscount}
            />
          </div>

          {/* Delivery Date */}
          {deliveryDate && (
            <p className="text-14 text-gray-600 mb-2">
              Get In By {deliveryDate}
            </p>
          )}

          {/* Purchase Price and Date */}
          <div className="flex flex-col gap-1">
            {purchasePrice !== undefined && purchasePrice !== null && (
              <div className="text-14 text-gray-600 flex items-center gap-2">
                <p className="font-medium">Purchase Price: </p>
                <PriceDisplay
                  discounted={purchasePrice}
                  currency={currency as any}
                  size="sm"
                  variant="inline"
                  showOriginal={false}
                />
              </div>
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
        </div>

        {/* Right controls: md+ ONLY (زي الديسكتوب) */}
        <div className="hidden md:flex flex-col items-end justify-between gap-3 shrink-0">
          <button
            onClick={() => onRemove(id)}
            className="p-1 text-brand-500 hover:text-brand-600 transition-colors"
            aria-label="Remove item"
            type="button"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          {discountPercentage ? (
            <span className="text-14 font-medium text-green-500">{discountPercentage}% OFF</span>
          ) : null}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(id, -1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label="Decrease quantity"
              type="button"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="text-16 font-semibold text-gray-900 w-8 text-center">
              {quantity}
            </span>

            <button
              onClick={() => onQuantityChange(id, 1)}
              className="w-8 h-8 rounded-full border-2 border-brand-500 bg-white text-brand-500 hover:bg-brand-500 hover:!text-white transition-colors flex items-center justify-center"
              aria-label="Increase quantity"
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Mobile controls: Trash left + Stepper right (زي الصورة) */}
      <div className="mt-2 flex items-center justify-between md:hidden">
        <button
          onClick={() => onRemove(id)}
          className="p-1 text-brand-500 hover:text-brand-600 transition-colors"
          aria-label="Remove item"
          type="button"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(id, -1)}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Decrease quantity"
            type="button"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="text-16 font-semibold text-gray-900 w-8 text-center">
            {quantity}
          </span>

          <button
            onClick={() => onQuantityChange(id, 1)}
            className="w-8 h-8 rounded-full border-2 border-brand-500 bg-white text-brand-500 hover:bg-brand-50 transition-colors flex items-center justify-center"
            aria-label="Increase quantity"
            type="button"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ===== Bottom row: Total + Checkout ===== */}
      <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-16 font-semibold text-gray-900 flex items-center gap-2">
          <p className="font-normal">Total Price : </p>
          <PriceDisplay
            discounted={totalPrice}
            currency={currency as any}
            size="md"
            variant="inline"
            showOriginal={false}
            discountedClassName="font-semibold"
          />
        </div>

        {onBuyNow && (
          <button
            onClick={() => onBuyNow(id)}
            className={cn(
              'h-10 px-10 rounded-full border border-brand-500 !text-brand-500',
              'text-14 font-medium hover:bg-brand-500 hover:!text-white transition-colors',
              'w-full md:w-auto'
            )}
            type="button"
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  )
}
