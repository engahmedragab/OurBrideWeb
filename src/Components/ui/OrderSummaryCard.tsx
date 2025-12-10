import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PriceDisplay } from './PriceDisplay'
import { QuantitySelector } from './QuantitySelector'
import { Button } from './Button'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OrderSummaryCardProps {
  totalPrice: number
  currency: string
  quantity: number
  onQuantityChange: (delta: number) => void
  onAddToCart?: () => void
  onBuyNow?: () => void
  deliveryLocation?: string
  fullAddress?: string
  onDeliveryLocationChange?: () => void
  maxQuantity?: number
  disabled?: boolean
  className?: string
}

export const OrderSummaryCard = ({
  totalPrice,
  currency,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  deliveryLocation = 'Giza, 6 Of O...',
  fullAddress,
  onDeliveryLocationChange,
  maxQuantity = 99,
  disabled = false,
  className,
}: OrderSummaryCardProps) => {
  const [isAddressExpanded, setIsAddressExpanded] = useState(false)

  const handleAddressToggle = () => {
    setIsAddressExpanded(!isAddressExpanded)
    if (onDeliveryLocationChange) {
      onDeliveryLocationChange()
    }
  }

  const displayAddress = fullAddress || deliveryLocation
  const truncatedAddress = deliveryLocation

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-6 space-y-4 sticky top-6',
        className
      )}
    >
      {/* Total price */}
      <div className="flex items-center justify-between">
        <span className="text-14 text-gray-900">Total price</span>
        <span className="text-20 font-semibold text-gray-900">
          {totalPrice.toLocaleString()} {currency}
        </span>
      </div>

      {/* Deliver to */}
      <div className="flex items-center justify-between">
        <span className="text-14 text-gray-900">Deliver to</span>
        <button
          onClick={handleAddressToggle}
          className="flex items-center gap-1 text-14 text-brand-500 hover:text-brand-600"
        >
          <span>{isAddressExpanded ? displayAddress : truncatedAddress}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-brand-500 transition-transform duration-200',
              isAddressExpanded && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between">
        <span className="text-14 text-gray-900">Quantity</span>
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          max={maxQuantity}
          disabled={disabled}
          variant="coral"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        {onAddToCart && (
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-2 border-brand-500 bg-white hover:bg-gray-50"
            onClick={onAddToCart}
            disabled={disabled}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5 text-brand-500" />
          </Button>
        )}
        {onBuyNow && (
          <Button
            variant="default"
            size="lg"
            className="flex-1 h-12 rounded-full bg-brand-500 hover:bg-brand-600 !text-white font-normal"
            onClick={onBuyNow}
            disabled={disabled}
          >
            Buy Now
          </Button>
        )}
      </div>
    </div>
  )
}
