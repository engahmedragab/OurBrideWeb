'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'
import orderPreparingSvg from '@/assets/svg/order-preparing.svg'
import orderOnTheWaySvg from '@/assets/svg/order-ontheway.svg'
import orderReceivedSvg from '@/assets/svg/order-received.svg'
import orderCompleteSvg from '@/assets/svg/order-compelete.svg'
import orderCancelledSvg from '@/assets/svg/order-canceld.svg'

export type OrderStatus =
  | 'preparing'
  | 'onTheWay'
  | 'received'
  | 'delivered'
  | 'cancelled'

export interface OrderProgressIndicatorProps {
  status: OrderStatus
  className?: string
}

export const OrderProgressIndicator = ({
  status,
  className,
}: OrderProgressIndicatorProps) => {
  const t = useI18nTranslations('orderProgress')
  const isRTL = useIsRTL()
  const statusConfig = {
    preparing: {
      title: t('status.preparing.title'),
      description: t('status.preparing.description'),
      progressStep: 0,
    },
    onTheWay: {
      title: t('status.onTheWay.title'),
      description: t('status.onTheWay.description'),
      progressStep: 1,
    },
    received: {
      title: t('status.received.title'),
      description: t('status.received.description'),
      progressStep: 2,
    },
    delivered: {
      title: t('status.delivered.title'),
      description: t('status.delivered.description'),
      progressStep: 2,
    },
    cancelled: {
      title: t('status.cancelled.title'),
      description: t('status.cancelled.description'),
      progressStep: -1,
    },
  }
  const steps = [
    { label: t('steps.preparing'), key: 'preparing' },
    { label: t('steps.onTheWay'), key: 'onTheWay' },
    { label: t('steps.received'), key: 'received' },
  ]
  const config = statusConfig[status]

  // Don't show progress bar for cancelled or delivered (completed) orders
  const showProgressBar = status !== 'cancelled' && status !== 'delivered'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={cn('flex flex-col items-center gap-4', className)}>
      {/* Illustration */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {status === 'preparing' && (
          <Image
            src={
              typeof orderPreparingSvg === 'string'
                ? orderPreparingSvg
                : orderPreparingSvg.src
            }
            alt={t('alt.preparing')}
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        )}

        {status === 'onTheWay' && (
          <Image
            src={
              typeof orderOnTheWaySvg === 'string'
                ? orderOnTheWaySvg
                : orderOnTheWaySvg.src
            }
            alt={t('alt.onTheWay')}
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        )}

        {status === 'received' && (
          <Image
            src={
              typeof orderReceivedSvg === 'string'
                ? orderReceivedSvg
                : orderReceivedSvg.src
            }
            alt={t('alt.received')}
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        )}

        {status === 'delivered' && (
          <Image
            src={
              typeof orderCompleteSvg === 'string'
                ? orderCompleteSvg
                : orderCompleteSvg.src
            }
            alt={t('alt.delivered')}
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        )}

        {status === 'cancelled' && (
          <Image
            src={
              typeof orderCancelledSvg === 'string'
                ? orderCancelledSvg
                : orderCancelledSvg.src
            }
            alt={t('alt.cancelled')}
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Progress Bar */}
      {showProgressBar && (
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, index) => {
              const isCompleted = index < config.progressStep
              const isCurrent = index === config.progressStep

              return (
                <div
                  key={step.key}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="relative">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full mb-2 transition-colors flex items-center justify-center',
                        isCompleted
                          ? 'bg-brand-500'
                          : isCurrent
                            ? 'bg-brand-500'
                            : 'bg-gray-300'
                      )}
                    >
                      {isCompleted && (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-12 font-medium text-center',
                      isCurrent
                        ? 'text-brand-500 font-semibold'
                        : isCompleted
                          ? 'text-gray-600'
                          : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn('absolute top-0 h-full bg-brand-500 transition-all duration-500', isRTL ? 'right-0' : 'left-0')}
              style={{
                width: `${((config.progressStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Status Text */}
      <div className="text-center mt-2">
        <p className="text-16 font-semibold text-gray-900 mb-1">
          {config.title}
        </p>
        <p className="text-14 text-gray-600">{config.description}</p>
      </div>
    </div>
  )
}
