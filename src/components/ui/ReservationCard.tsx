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
import { useI18nLocale, useI18nTranslations, useIsRTL } from '@/i18n/hooks'
import { pickLocalizedText } from '@/utils/translation/i18nText'

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
  if (status === ReservationStatus.Completed) return ' border-green-500'
  if (status === ReservationStatus.Cancelled) return ' border-red-500'
  return ' border-yellow-500'
}

export const ReservationCard = ({
  reservation,
  onCancel,
  onViewDetails,
  className,
}: ReservationCardProps) => {
  const t = useI18nTranslations('reservations')
  const isRTL = useIsRTL()
  const locale = useI18nLocale()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  const service = reservation.service
  const provider = reservation.provider
  const status = reservation.status
  const isCompleted = status === ReservationStatus.Completed || status === ReservationStatus.Cancelled
  const isInProgress = !isCompleted


  // translate the status
  const getTranslatedStatus = (status: ReservationStatus) => {
   
    switch (status) {
      case ReservationStatus.Completed:
        return t('card.status.completed')
      case ReservationStatus.Cancelled:
        return t('card.status.cancelled')
      case ReservationStatus.Confirmed:
        return t('card.status.confirmed')
      case ReservationStatus.Pending:
        return t('card.status.pending')
      default:
        return t('card.status.inProgress')
    }
  }

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

  // ✅ Localized texts (instead of nameEn ?? nameAr)
  const serviceName =
    pickLocalizedText(locale, {
      en: service?.nameEn,
      ar: service?.nameAr,
    }) ?? t('card.fallback.service')

  const providerName =
    pickLocalizedText(locale, {
      en: provider?.nameEn,
      ar: provider?.nameAr,
    }) ?? t('card.fallback.provider')

  const placeName =
    pickLocalizedText(locale, {
      en: reservation.reservationPlace?.nameEn,
      ar: reservation.reservationPlace?.nameAr,
    }) ?? null

  const placeAddress = reservation.reservationPlace?.address?.fullAddress ?? null
  const user = reservation.reservationStaff?.user
  const staffName = user ? `${user.firstName} ${user.lastName}`.trim() || null : null

  // Package localized
  const packageName =
    pickLocalizedText(locale, {
      en: reservation.servicePackage?.nameEn,
      ar: reservation.servicePackage?.nameAr,
    }) ?? t('card.fallback.package')

  const packageDescription =
    pickLocalizedText(locale, {
      en: reservation.servicePackage?.descriptionEn,
      ar: reservation.servicePackage?.descriptionAr,
    }) ?? null

  // Get service details
  const serviceImage = service?.imageUrl ?? '/placeholder-service.png'
  const serviceRating = service?.rate ?? 0

  // Get price
  const totalPrice = reservation.totalPrice ?? reservation.servicePrice ?? 0
  const depositAmount = reservation.depositAmount ?? null

  return (
    <div
      className={cn(
        'bg-white rounded-xl border  border-gray-200 p-6 shadow-sm relative',
        getStatusLineColor(status),
        isRTL ? 'border-r-4' : 'border-l-4',
        className
      )}
    >
      {/* Status Badge and Toggle */}
      <div
        className={cn(
          'flex w-full items-center gap-1 mb-2',
          'sm:absolute sm:top-6 sm:w-auto sm:mb-0 sm:gap-2',
          isRTL ? 'justify-start sm:left-6' : 'justify-end sm:right-6'
        )}
      >
        <StatusBadge
          status={mapReservationStatusToBadgeType(status)}
          label={getTranslatedStatus(status)}
          size="md"
          className="gap-1 px-1.5 py-0.5 text-[10px] leading-none sm:px-2 sm:py-1.5 sm:text-[12px]"
        />

        <button
          type="button"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={
            isDetailsOpen
              ? t('card.actions.collapseDetailsAria')
              : t('card.actions.expandDetailsAria')
          }
        >
          {isDetailsOpen ? (
            <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </button>
      </div>

      <div
        className={cn(
          'flex flex-col lg:flex-row gap-6',
          isRTL ? 'pl-0 sm:pl-28' : 'pr-0 sm:pr-28'
        )}
      >
        {/* Left Section - Reservation Info */}
        <div className="flex-1">
          {/* Reservation ID and Date */}
          <div className="mb-4">
            <h3 className="text-14 md:text-18 font-semibold text-gray-900 mb-1 break-all leading-snug">
              {t('card.header.title', { reservationId: reservation.reservationId })}
            </h3>
            {createdDate && (
              <p className="text-14 text-gray-600">
                {t('card.header.created')}: {createdDate}
              </p>
            )}
          </div>

          {isDetailsOpen && (
            <>
              {/* Service Info */}
              <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {serviceImage && serviceImage.trim() !== '' && serviceImage !== '/placeholder-service.png' && !imageError ? (
                      <Image
                        src={serviceImage}
                        alt={serviceName}
                        fill
                        sizes="80px"
                        className="object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-10 font-medium text-center px-1">
                          {t('card.service.noImage')}
                        </span>
                      </div>
                    )}
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
                      {t('card.service.providerLabel')}{' '}
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
                    <span>
                      {t('card.fields.date')}: {reservationDate}
                    </span>
                  </div>
                )}
                {reservationTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {t('card.fields.time')}: {reservationTime}
                    </span>
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
                    <span>
                      {t('card.fields.staff')}: {staffName}
                    </span>
                  </div>
                )}

                {reservation.quantity && reservation.quantity > 1 && (
                  <div className="flex items-center gap-2">
                    <span>
                      {t('card.fields.quantity')}: {reservation.quantity}
                    </span>
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
                    className="flex-1 !text-12 "
                  >
                    {t('card.actions.viewDetails')}
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
                    {t('card.actions.cancel')}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Section - Collapsible Details */}
        {isDetailsOpen && (
          <div className="flex-1 lg:max-w-md">
            <h4 className="text-16 font-semibold text-gray-900 mb-4">
              {t('card.details.title')}
            </h4>

            {/* Package Info */}
            {reservation.servicePackage && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={cn('text-14 font-semibold text-gray-900 mb-1', isRTL ? 'text-right' : 'text-left')}
                >
                  {t('card.details.packageLabel')}{' '}
                  <span className="font-semibold">{packageName}</span>
                </p>

                {!!packageDescription && (
                  <p
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={cn('text-12 text-gray-600', isRTL ? 'text-right' : 'text-left')}
                  >
                    {packageDescription}
                  </p>
                )}
              </div>
            )}

            {/* Place Details */}
            {placeAddress && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-14 font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('card.details.locationTitle')}
                </p>
                <p dir={isRTL ? 'rtl' : 'ltr'} className={cn('text-12 text-gray-600', isRTL ? 'text-right' : 'text-left')}>
                  {placeAddress}
                </p>
              </div>
            )}

            {/* Price Info */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {depositAmount && depositAmount > 0 && (
                <div className="flex justify-between text-14 text-gray-700">
                  <span>{t('card.details.deposit')}:</span>
                  <span className="font-semibold text-gray-900">
                    {depositAmount.toLocaleString()} {t('card.details.currency')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-16 font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>{t('card.details.totalPrice')}:</span>
                <span>
                  {totalPrice.toLocaleString()} {t('card.details.currency')}
                </span>
              </div>
            </div>

            {/* Notes */}
            {reservation.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 w-full">
                <p className="text-12 font-semibold text-blue-900 mb-1">{t('card.details.notes')}:</p>
                <p
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={cn(
                    'text-12 break-words whitespace-pre-wrap',
                    isRTL ? 'text-right' : 'text-left'
                  )}
                >
                  {reservation.notes}
                </p>
              </div>
            )}

            {/* Client Feedback */}
            {reservation.clientFeedback && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-12 font-semibold text-green-900 mb-1">{t('card.details.feedback')}:</p>
                <p dir={isRTL ? 'rtl' : 'ltr'} className={cn('text-12 text-green-700', isRTL ? 'text-right' : 'text-left')}>
                  {reservation.clientFeedback}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

