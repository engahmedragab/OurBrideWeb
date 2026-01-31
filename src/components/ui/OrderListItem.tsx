'use client'

import { X } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'
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

const getStatusLabel = (status: OrderStatus, t: (key: string) => string): string => {
  const statusMap: Record<OrderStatus, string> = {
    preparing: t('status.inProgress'),
    onTheWay: t('status.outForDelivery'),
    received: t('status.outForDelivery'),
    delivered: t('status.completed'),
    cancelled: t('status.cancelled'),
  }
  return statusMap[status] || t('status.inProgress')
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
  const t = useI18nTranslations('orderListItem')
  const tCommon = useI18nTranslations('common')
  const isRTL = useIsRTL()
  const statusBadgeType = getStatusBadgeType(status)
  const statusLabel = getStatusLabel(status, t)
  const isInProgress = status !== 'delivered' && status !== 'cancelled'
  const firstColumnBorder = isRTL ? 'border-r-4' : 'border-l-4'
  const dividerBorder = isRTL ? 'border-r' : 'border-l'

  return (
    <div
      className={cn(
        'flex items-center border-b border-gray-100 cursor-pointer hover:bg-gray-100',
        isEven ? 'bg-gray-50' : 'bg-gray-25',
        className
      )}
      onClick={onViewDetails}
    >
      {/* Order Number Column */}
      <div className={cn('flex flex-[1_0_0] h-[120px] items-center justify-center px-5 py-0 border-green-500', firstColumnBorder)}>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2.5">
            <span className="text-16 font-normal text-gray-900 whitespace-nowrap">
              {t('orderLabel')} #{orderId}
            </span>
          </div>
          <span className="text-14 font-normal text-gray-500 whitespace-nowrap">
            {t('placedLabel')}: {orderDate}
          </span>
        </div>
      </div>

      {/* Arrive in Column */}
      <div className={cn('flex flex-[1_0_0] h-[120px] items-center justify-center px-2.5 py-2.5 border-gray-100', dividerBorder)}>
        <span className="text-16 font-normal text-gray-900 whitespace-nowrap">
          {arrivalDate || tCommon('notAvailable')}
        </span>
      </div>

      {/* Paid Column */}
      <div className={cn('flex flex-[1_0_0] h-[120px] items-center justify-center px-2.5 py-2.5 border-gray-100', dividerBorder)}>
        <span className="text-16 font-normal text-gray-900 whitespace-nowrap">
          {total.toLocaleString()} EGP
        </span>
      </div>

      {/* Status Column */}
      <div className={cn('flex flex-[1_0_0] h-[120px] items-center justify-center px-5 py-2.5 border-gray-100', dividerBorder)}>
        <div className="flex items-center gap-2 justify-center">
          {isInProgress && onCancelOrder && (
            <button
              onClick={e => {
                e.stopPropagation() // Prevent row click when cancel is clicked
                onCancelOrder()
              }}
              className="flex items-center gap-2 rounded-md transition-colors hover:opacity-80"
              aria-label={t('actions.cancelAria')}
            >
              <X className="h-[18px] w-[18px] text-red-500" />
              <span className="text-16 font-medium text-red-500">{t('actions.cancel')}</span>
            </button>
          )}
          <StatusBadge
            status={statusBadgeType}
            label={statusLabel}
            className="w-fit"
          />
        </div>
      </div>
    </div>
  )
}
