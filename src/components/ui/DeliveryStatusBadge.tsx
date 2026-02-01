'use client'

import { Package, Truck, CheckCircle2, XCircle, RotateCcw, Loader2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n'
import type { DeliveryStatus } from '@/../client/common/api/gen/ourbride-api'

export interface DeliveryStatusBadgeProps {
  status: DeliveryStatus | string | null | undefined
  className?: string
  showIcon?: boolean
}

/**
 * Map DeliveryStatus enum to user-friendly display text
 */
export const getDeliveryStatusLabel = (
  status: DeliveryStatus | string | null | undefined,
  t?: (key: string) => string
): string => {
  if (!status) return t ? t('notSet') : 'Not Set'

  const statusStr = String(status)

  const statusMap: Record<string, string> = {
    Created: t ? t('created') : 'Created',
    ReadyForDelivery: t ? t('readyForDelivery') : 'Ready for Delivery',
    InTransit: t ? t('inTransit') : 'In Transit',
    OutForDelivery: t ? t('outForDelivery') : 'Out for Delivery',
    Delivered: t ? t('delivered') : 'Delivered',
    Failed: t ? t('failed') : 'Failed',
    Returned: t ? t('returned') : 'Returned',
  }

  return statusMap[statusStr] || statusStr
}

/**
 * Get delivery status configuration (colors, icons, etc.)
 */
const getDeliveryStatusConfig = (status: DeliveryStatus | string | null | undefined) => {
  if (!status) {
    return {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      icon: Package,
    }
  }
  
  const statusStr = String(status)
  
  switch (statusStr) {
    case 'Created':
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        icon: Package,
      }
    case 'ReadyForDelivery':
      return {
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        icon: Loader2,
      }
    case 'InTransit':
      return {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        icon: Truck,
      }
    case 'OutForDelivery':
      return {
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-700',
        icon: MapPin,
      }
    case 'Delivered':
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        icon: CheckCircle2,
      }
    case 'Failed':
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        icon: XCircle,
      }
    case 'Returned':
      return {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        icon: RotateCcw,
      }
    default:
      return {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        icon: Package,
      }
  }
}

export const DeliveryStatusBadge = ({ 
  status, 
  className,
  showIcon = true 
}: DeliveryStatusBadgeProps) => {
  const t = useI18nTranslations('deliveryStatus')
  const config = getDeliveryStatusConfig(status)
  const Icon = config.icon
  const label = getDeliveryStatusLabel(status, t)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-14 font-medium',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {showIcon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </div>
  )
}



