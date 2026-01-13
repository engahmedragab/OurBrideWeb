'use client'

import { AlertCircle, X } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'
import type { OrderStatus } from './OrderProgressIndicator'

export interface OrderListItemProps {
  orderId: string
  orderDate: string
  status: OrderStatus
  arrivalDate?: string
  total: number
  isEven?: boolean
  onCancelOrder?: () => void
  onViewDetails?: () => void
  className?: string
}

const getStatusBadgeType = (
  status: OrderStatus
): 'completed' | 'delivered' | 'cancelled' | 'inProgress' => {
  if (status === 'delivered') return 'delivered'
  if (status === 'cancelled') return 'cancelled'
  return 'inProgress'
}

const getStatusLabel = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    preparing: 'In Progress',
    onTheWay: 'Out For Delivery',
    received: 'Out For Delivery',
    delivered: 'Completed',
    cancelled: 'Canceled',
  }
  return statusMap[status] || 'In Progress'
}

export const OrderListItem = ({
  orderId,
  orderDate,
  status,
  arrivalDate,
  total,
  isEven = false,
  onCancelOrder,
  onViewDetails,
  className,
}: OrderListItemProps) => {
  const statusBadgeType = getStatusBadgeType(status)
  const statusLabel = getStatusLabel(status)
  const isInProgress = status !== 'delivered' && status !== 'cancelled'

  return (
    <div
      className={cn(
        'flex items-center border-b border-gray-100',
        isEven ? 'bg-gray-50' : 'bg-gray-25',
        className
      )}
    >
      {/* Order Number Column */}
      <div className="flex flex-[1_0_0] h-[120px] items-center px-5 py-0 border-l-4 border-green-500">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-16 font-normal text-gray-900 whitespace-nowrap">
              Order #{orderId}
            </span>
            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="flex items-center gap-1 rounded-md transition-colors hover:opacity-80"
                aria-label="View order details"
              >
                <AlertCircle className="h-4 w-4 text-gray-300" />
                <span className="text-12 font-medium text-gray-300">Details</span>
              </button>
            )}
          </div>
          <span className="text-14 font-normal text-gray-500 whitespace-nowrap">
            Placed : {orderDate}
          </span>
        </div>
      </div>

      {/* Arrive in Column */}
      <div className="flex flex-[1_0_0] h-[120px] items-center justify-center px-2.5 py-2.5 border-l border-gray-100">
        <span className="text-16 font-normal text-gray-900 whitespace-nowrap">
          {arrivalDate || 'N/A'}
        </span>
      </div>

      {/* Paid Column */}
      <div className="flex flex-[1_0_0] h-[120px] items-center justify-center px-2.5 py-2.5 border-l border-gray-100">
        <span className="text-16 font-normal text-gray-900 whitespace-nowrap">
          {total.toLocaleString()} EGP
        </span>
      </div>

      {/* Status Column */}
      <div className="flex flex-[1_0_0] h-[120px] items-center px-5 py-2.5 border-l border-gray-100">
        <div className="flex flex-[1_0_0] items-center gap-2">
          {isInProgress && onCancelOrder && (
            <button
              onClick={onCancelOrder}
              className="flex items-center gap-2 rounded-md transition-colors hover:opacity-80"
              aria-label="Cancel order"
            >
              <X className="h-[18px] w-[18px] text-red-500" />
              <span className="text-16 font-medium text-red-500">Cancel</span>
            </button>
          )}
          <StatusBadge
            status={statusBadgeType}
            label={statusLabel}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
