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
  onDeliveryLocationChange,
  maxQuantity = 99,
  disabled = false,
  className,
}: OrderSummaryCardProps) => {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-6 space-y-6 sticky top-6',
        className
      )}
    >
      {/* Order Summary */}
      <div className="space-y-3">
        <div>
          <span className="text-14 text-gray-600">Total price</span>
          <div className="text-24 font-semibold text-gray-900 mt-1">
            {totalPrice.toLocaleString()} {currency}
          </div>
        </div>
        <div>
          <span className="text-14 text-gray-600">Deliver to</span>
          <button
            onClick={onDeliveryLocationChange}
            className="flex items-center justify-between w-full mt-1 text-14 text-brand-500 hover:text-brand-600"
          >
            <span>{deliveryLocation}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <span className="text-14 text-gray-600 block mb-2">Quantity</span>
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          max={maxQuantity}
          disabled={disabled}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        {onAddToCart && (
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-300"
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
            className="flex-1 h-12 rounded-lg bg-brand-500 hover:bg-brand-600 !text-white font-semibold"
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

