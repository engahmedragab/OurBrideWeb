'use client'

import { cn } from '@/lib/utils'
import orderPreparingSvg from '@/assets/svg/order-preparing.svg'
import orderReceivedSvg from '@/assets/svg/order-received.svg'
import requestUnderReviewSvg from '@/assets/svg/request-under-review.svg'
import orderCompleteSvg from '@/assets/svg/order-compelete.svg'
import orderCancelledSvg from '@/assets/svg/order-canceld.svg'

export type RequestStatus =
  | 'requestReceived'
  | 'underReview'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export interface RequestProgressIndicatorProps {
  status: RequestStatus
  className?: string
}

const statusConfig = {
  requestReceived: {
    title: "We've Got Your Request!",
    description:
      'Your booking request has been sent to the provider. Please wait while they review it.',
    progressStep: 0,
  },
  underReview: {
    title: 'Provider is Reviewing',
    description:
      "The provider is checking your request details. You'll get notified once they decide.",
    progressStep: 1,
  },
  confirmed: {
    title: 'Request Confirmed',
    description:
      'Your request has been confirmed by the provider. You can proceed to checkout.',
    progressStep: 2,
  },
  completed: {
    title: 'Request Completed',
    description:
      'Your request has been completed successfully. Thank you for choosing OurBride!',
    progressStep: 2,
  },
  cancelled: {
    title: 'Request Cancelled',
    description: 'This request was cancelled. We hope to serve you next time.',
    progressStep: -1,
  },
}

const steps = [
  { label: 'Request Received', key: 'requestReceived' },
  { label: 'Under Review', key: 'underReview' },
  { label: 'Confirmed', key: 'confirmed' },
]

export const RequestProgressIndicator = ({
  status,
  className,
}: RequestProgressIndicatorProps) => {
  const config = statusConfig[status]

  // Don't show progress bar for cancelled or completed requests
  const showProgressBar = status !== 'cancelled' && status !== 'completed'

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Illustration */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {status === 'requestReceived' && (
          <img
            src={
              typeof orderPreparingSvg === 'string'
                ? orderPreparingSvg
                : orderPreparingSvg.src
            }
            alt="Request Received"
            className="w-full h-full object-contain"
          />
        )}
        {status === 'underReview' && (
          <img
            src={
              typeof requestUnderReviewSvg === 'string'
                ? requestUnderReviewSvg
                : requestUnderReviewSvg.src
            }
            alt="Under Review"
            className="w-full h-full object-contain"
          />
        )}
        {status === 'confirmed' && (
          <img
            src={
              typeof orderReceivedSvg === 'string'
                ? orderReceivedSvg
                : orderReceivedSvg.src
            }
            alt="Confirmed"
            className="w-full h-full object-contain"
          />
        )}
        {status === 'completed' && (
          <img
            src={
              typeof orderCompleteSvg === 'string'
                ? orderCompleteSvg
                : orderCompleteSvg.src
            }
            alt="Completed"
            className="w-full h-full object-contain"
          />
        )}
        {status === 'cancelled' && (
          <img
            src={
              typeof orderCancelledSvg === 'string'
                ? orderCancelledSvg
                : orderCancelledSvg.src
            }
            alt="Cancelled"
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
                          ? 'text-brand-500 font-semibold'
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
