'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
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

const statusConfig = {
  preparing: {
    title: "We've Got Your Order!",
    description: "Your order is confirmed and we're preparing it with care.",
    progressStep: 0,
  },
  onTheWay: {
    title: 'Your order is on the way!',
    description: 'Your order has been shipped and is on its way to you.',
    progressStep: 1,
  },
  received: {
    title: 'Order received',
    description: 'Your order has been received and is ready for pickup.',
    progressStep: 2,
  },
  delivered: {
    title: 'Order Completed',
    description:
      'Your order is done and delivered successfully. Thank you for choosing OurBride!',
    progressStep: 2,
  },
  cancelled: {
    title: 'Order Canceled',
    description: 'This order was canceled We hope to serve you next time',
    progressStep: -1,
  },
}

const steps = [
  { label: 'Preparing Order', key: 'preparing' },
  { label: 'On The Way', key: 'onTheWay' },
  { label: 'Received', key: 'received' },
]

export const OrderProgressIndicator = ({
  status,
  className,
}: OrderProgressIndicatorProps) => {
  const config = statusConfig[status]

  // Don't show progress bar for cancelled or delivered (completed) orders
  const showProgressBar = status !== 'cancelled' && status !== 'delivered'

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Illustration */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {status === 'preparing' && (
          <Image
            src={
              typeof orderPreparingSvg === 'string'
                ? orderPreparingSvg
                : orderPreparingSvg.src
            }
            alt="Order Preparing"
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
            alt="Order On The Way"
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
            alt="Order Received"
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
            alt="Order Complete"
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
            alt="Order Cancelled"
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
              className="absolute top-0 left-0 h-full bg-brand-500 transition-all duration-500"
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
