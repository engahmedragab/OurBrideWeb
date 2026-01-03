'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import { RatingDisplay } from './RatingDisplay'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'
import {
  RequestProgressIndicator,
  type RequestStatus,
} from './RequestProgressIndicator'
import { cn } from '@/lib/utils'

export interface ServiceRequest {
  id: string
  title: string
  image: string
  rating: {
    value: number
    count: number
  }
  provider: {
    id?: string
    name: string
  }
}

export interface RequestCardProps {
  requestId: string
  requestDate: string
  status: RequestStatus
  service: ServiceRequest
  assignedTo?: string
  dueDate?: string
  dueTime?: string
  packages: Array<{
    title: string
    price: number
  }>
  subtotal: number
  taxesAndFees?: number
  total: number
  onCancelRequest?: () => void
  onCheckout?: () => void
  onReRequest?: () => void
  className?: string
}

export const RequestCard = ({
  requestId,
  requestDate,
  status,
  service,
  assignedTo,
  dueDate,
  dueTime,
  packages,
  subtotal,
  taxesAndFees = 0,
  total,
  onCancelRequest,
  onCheckout,
  onReRequest,
  className,
}: RequestCardProps) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true)
  const [isAssignedToOpen, setIsAssignedToOpen] = useState(false)
  const isCompleted = status === 'completed' || status === 'cancelled'
  const isInProgress = !isCompleted

  const getStatusBadgeType = (): 'completed' | 'cancelled' | 'inProgress' => {
    if (status === 'completed') return 'completed'
    if (status === 'cancelled') return 'cancelled'
    return 'inProgress'
  }

  const getStatusLineColor = () => {
    if (status === 'completed') return 'border-l-4 border-green-500'
    if (status === 'cancelled') return 'border-l-4 border-red-500'
    return 'border-l-4 border-yellow-500'
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative',
        getStatusLineColor(),
        className
      )}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Request Info and Progress */}
        <div className="flex-1">
          {/* Status Badge - Top Right */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <StatusBadge status={getStatusBadgeType()} />
            <button
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={
                isSummaryOpen
                  ? 'Collapse request summary'
                  : 'Expand request summary'
              }
            >
              {isSummaryOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Request Info */}
          <div className="mb-6 pr-32">
            <h3 className="text-18 font-semibold text-gray-900 mb-1">
              Request #{requestId}
            </h3>
            <p className="text-14 text-gray-600 mb-2">Placed: {requestDate}</p>

            {/* Assign To Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAssignedToOpen(!isAssignedToOpen)}
                className="flex items-center gap-1 text-14 text-brand-500 hover:text-brand-600 transition-colors"
              >
                <span>Assign To {assignedTo || 'Dashboard Name'}</span>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isAssignedToOpen && 'rotate-90'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <RequestProgressIndicator status={status} />
          </div>

          {/* Checkout Button for Confirmed Requests */}
          {status === 'confirmed' && onCheckout && (
            <div className="mt-4">
              <Button
                variant="brand"
                size="lg"
                className="w-full text-white"
                onClick={onCheckout}
              >
                Checkout
              </Button>
            </div>
          )}

          {/* Re-Request Button for Completed/Cancelled Requests */}
          {isCompleted && onReRequest && (
            <div className="mt-4">
              <Button
                variant="brand"
                size="md"
                className="w-full text-white"
                onClick={onReRequest}
              >
                Re-Request
              </Button>
            </div>
          )}
        </div>

        {/* Right Section - Request Summary */}
        <div className="flex-1 lg:max-w-md">
          {/* Due Date/Time */}
          {dueDate && (
            <div className="text-14 text-gray-600 mb-4">
              <p>
                Due: {dueDate}
                {dueTime && ` ${dueTime}`}
              </p>
            </div>
          )}

          {/* Collapsible Request Summary */}
          {isSummaryOpen && (
            <>
              <h4 className="text-16 font-semibold text-gray-900 mb-4">
                Request Summary
              </h4>

              {/* Service Info */}
              <div className="mb-4 bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-14 font-semibold text-gray-900 mb-1">
                      {service.title}
                    </p>
                    <RatingDisplay
                      rating={service.rating.value}
                      count={service.rating.count}
                      size="xs"
                      format="rated-by"
                      variant="compact"
                    />
                    <p className="text-12 text-gray-600">
                      Provider:{' '}
                      {service.provider.id ? (
                        <Link 
                          href={`/provider/${service.provider.id}`}
                          className="hover:text-brand-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {service.provider.name}
                        </Link>
                      ) : (
                        service.provider.name
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-2 mb-4">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-14 text-gray-700"
                  >
                    <span>{pkg.title}:</span>
                    <span className="font-semibold text-gray-900">
                      {pkg.price.toLocaleString()} EGP
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-14 text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {subtotal.toLocaleString()} EGP
                  </span>
                </div>
                {taxesAndFees > 0 && (
                  <div className="flex justify-between text-14 text-gray-700">
                    <span>Taxes & Fees:</span>
                    <span className="font-semibold text-gray-900">
                      {taxesAndFees.toLocaleString()} EGP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-16 font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>{total.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Cancel Request Button for In Progress Requests */}
              {isInProgress && status !== 'confirmed' && onCancelRequest && (
                <button
                  onClick={onCancelRequest}
                  className="w-full mt-4 text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors text-center"
                >
                  Cancel Request
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
