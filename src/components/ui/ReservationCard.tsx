'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock, User, X } from 'lucide-react'
import { RatingDisplay } from './RatingDisplay'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'
import type { ReservationResponse } from '@/types/responses'
import { ReservationStatus } from '@/types/responses/common'

export interface ReservationCardProps {
  reservation: ReservationResponse
  onCancel?: (reservationId: string) => void
  onViewDetails?: (reservationId: string) => void
  className?: string
}

const mapReservationStatusToBadgeType = (
  status: ReservationStatus
): 'completed' | 'cancelled' | 'inProgress' => {
  // Map ReservationStatus enum values to badge types
  if (status === ReservationStatus.Completed) return 'completed'
  if (status === ReservationStatus.Cancelled) return 'cancelled'
  return 'inProgress'
}

const getStatusLineColor = (status: ReservationStatus) => {
  if (status === ReservationStatus.Completed) return 'border-l-4 border-green-500'
  if (status === ReservationStatus.Cancelled) return 'border-l-4 border-red-500'
  return 'border-l-4 border-yellow-500'
}

export const ReservationCard = ({
  reservation,
  onCancel,
  onViewDetails,
  className,
}: ReservationCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const service = reservation.service
  const provider = reservation.provider
  const status = reservation.status
  const isCompleted = status === ReservationStatus.Completed || status === ReservationStatus.Cancelled
  const isInProgress = !isCompleted

  // Format dates
  const reservationDate = reservation.reservationDate
    ? new Date(reservation.reservationDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null

  const reservationTime = reservation.requestedStartTime
    ? new Date(reservation.requestedStartTime).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null

  const createdDate = reservation.creationDate
    ? new Date(reservation.creationDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null

  // Get service details
  const serviceName = service?.nameEn ?? service?.nameAr ?? 'Service'
  const serviceImage = service?.imageUrl ?? '/placeholder-service.png'
  const serviceRating = service?.rate ?? 0
  const providerName = provider?.nameEn ?? provider?.nameAr ?? 'Provider'
  const placeName = reservation.reservationPlace?.nameEn ?? reservation.reservationPlace?.nameAr ?? null
  const placeAddress = reservation.reservationPlace?.address?.fullAddress ?? null
  const user = reservation.reservationStaff?.user
  const staffName = user ? `${user.firstName} ${user.lastName}`.trim() || null : null

  // Get price
  const totalPrice = reservation.totalPrice ?? reservation.servicePrice ?? 0
  const depositAmount = reservation.depositAmount ?? null

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative',
        getStatusLineColor(status),
        className
      )}
    >
      {/* Status Badge and Toggle */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <StatusBadge status={mapReservationStatusToBadgeType(status)} />
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={isDetailsOpen ? 'Collapse details' : 'Expand details'}
        >
          {isDetailsOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 pr-32">
        {/* Left Section - Reservation Info */}
        <div className="flex-1">
          {/* Reservation ID and Date */}
          <div className="mb-4">
            <h3 className="text-18 font-semibold text-gray-900 mb-1">
              Reservation #{reservation.reservationId}
            </h3>
            {createdDate && (
              <p className="text-14 text-gray-600">Created: {createdDate}</p>
            )}
          </div>

          {/* Service Info */}
          <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={serviceImage}
                  alt={serviceName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={service?.id ? `/services/category/${service.id}` : '#'}
                  className="text-16 font-semibold text-gray-900 hover:text-brand-600 transition-colors mb-1 block"
                >
                  {serviceName}
                </Link>
                {serviceRating > 0 && (
                  <div className="mb-1">
                    <RatingDisplay
                      rating={serviceRating}
                      size="xs"
                      format="value-only"
                      variant="compact"
                      showValue={true}
                    />
                  </div>
                )}
                <p className="text-14 text-gray-600">
                  Provider:{' '}
                  {reservation.providerId ? (
                    <Link 
                      href={`/provider/${reservation.providerId}`}
                      className="hover:text-brand-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {providerName}
                    </Link>
                  ) : (
                    providerName
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="space-y-2 text-14 text-gray-700">
            {reservationDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Date: {reservationDate}</span>
              </div>
            )}
            {reservationTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Time: {reservationTime}</span>
              </div>
            )}
            {placeName && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{placeName}</span>
              </div>
            )}
            {staffName && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>Staff: {staffName}</span>
              </div>
            )}
            {reservation.quantity && reservation.quantity > 1 && (
              <div className="flex items-center gap-2">
                <span>Quantity: {reservation.quantity}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(reservation.reservationId)}
                className="flex-1"
              >
                View Details
              </Button>
            )}
            {isInProgress && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(reservation.reservationId)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Right Section - Collapsible Details */}
        {isDetailsOpen && (
          <div className="flex-1 lg:max-w-md">
            <h4 className="text-16 font-semibold text-gray-900 mb-4">
              Reservation Details
            </h4>

            {/* Package Info */}
            {reservation.servicePackage && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-14 font-semibold text-gray-900 mb-1">
                  Package: {reservation.servicePackage.nameEn ?? reservation.servicePackage.nameAr ?? 'Package'}
                </p>
                {reservation.servicePackage.descriptionEn && (
                  <p className="text-12 text-gray-600">
                    {reservation.servicePackage.descriptionEn}
                  </p>
                )}
              </div>
            )}

            {/* Place Details */}
            {placeAddress && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-14 font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </p>
                <p className="text-12 text-gray-600">{placeAddress}</p>
              </div>
            )}

            {/* Price Info */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {depositAmount && depositAmount > 0 && (
                <div className="flex justify-between text-14 text-gray-700">
                  <span>Deposit:</span>
                  <span className="font-semibold text-gray-900">
                    {depositAmount.toLocaleString()} EGP
                  </span>
                </div>
              )}
              <div className="flex justify-between text-16 font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Price:</span>
                <span>{totalPrice.toLocaleString()} EGP</span>
              </div>
            </div>

            {/* Notes */}
            {reservation.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-12 font-semibold text-blue-900 mb-1">Notes:</p>
                <p className="text-12 text-blue-700">{reservation.notes}</p>
              </div>
            )}

            {/* Client Feedback */}
            {reservation.clientFeedback && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-12 font-semibold text-green-900 mb-1">Your Feedback:</p>
                <p className="text-12 text-green-700">{reservation.clientFeedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

