'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Package,
  FileText,
  Star,
  X,
  AlertCircle,
  Phone,
  ExternalLink,
} from 'lucide-react'
import { UserPageLayout } from '@/components/layout'
import {
  PageHeader,
  ErrorDisplay,
  LoadingOverlay,
  Button,
  StatusBadge,
} from '@/components/ui'
import {
  getReservationById,
  cancelReservation,
} from '@/services/api/reservationApi'
import type { ReservationResponse } from '@/types/responses'
import { ReservationStatus } from '@/types/responses/common'
import { useToast } from '@/components/ui/Toaster'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

interface ReservationDetailsClientProps {
  reservationId: string
}

const mapReservationStatusToBadgeType = (
  status: ReservationStatus
): 'completed' | 'cancelled' | 'inProgress' => {
  if (status === ReservationStatus.Completed) return 'completed'
  if (status === ReservationStatus.Cancelled) return 'cancelled'
  return 'inProgress'
}

const getStatusColor = (status: ReservationStatus) => {
  if (status === ReservationStatus.Completed)
    return 'text-green-600 bg-green-50 border-green-200'
  if (status === ReservationStatus.Cancelled)
    return 'text-red-600 bg-red-50 border-red-200'
  return 'text-yellow-600 bg-yellow-50 border-yellow-200'
}

export function ReservationDetailsClient({
  reservationId,
}: ReservationDetailsClientProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch reservation details
  const {
    data: reservation,
    isLoading,
    error,
    refetch,
  } = useQuery<ReservationResponse | null>({
    queryKey: ['reservation', reservationId],
    queryFn: async () => {
      const data = await getReservationById(reservationId)
      return data
    },
    enabled: isMounted && !!reservationId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })

  // Cancel reservation mutation
  const cancelReservationMutation = useMutation({
    mutationFn: async (id: string) => {
      await cancelReservation(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reservation', reservationId],
      })
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      addToast('Reservation cancelled successfully', 'success')
      router.push('/reservations')
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to cancel reservation', 'error')
    },
  })

  const handleCancelReservation = async () => {
    if (
      !confirm(
        'Are you sure you want to cancel this reservation? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      await cancelReservationMutation.mutateAsync(reservationId)
    } catch (error) {
      // Error is handled by mutation onError
      console.error('Failed to cancel reservation:', error)
    }
  }

  // Show loading state
  if (!isMounted || isLoading) {
    return (
      <UserPageLayout>
        <PageHeader title="Reservation Details" />
        <LoadingOverlay
          open={true}
          title="Loading reservation..."
          subtitle="Please wait a moment"
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (error || !reservation) {
    return (
      <UserPageLayout>
        <PageHeader title="Reservation Details" />
        <ErrorDisplay
          title="Reservation not found"
          message="The reservation you're looking for doesn't exist or has been removed"
          actionLabel="Back to Reservations"
          actionHref="/reservations"
        />
      </UserPageLayout>
    )
  }

  const service = reservation.service
  const provider = reservation.provider
  const status = reservation.status
  const isCompleted =
    status === ReservationStatus.Completed ||
    status === ReservationStatus.Cancelled
  const isInProgress = !isCompleted

  // Format dates
  const reservationDate = reservation.reservationDate
    ? new Date(reservation.reservationDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
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

  const reservationDateTime = reservation.requestedStartTime
    ? new Date(reservation.requestedStartTime).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null

  const createdDate = reservation.creationDate
    ? new Date(reservation.creationDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  const lastModifiedDate = reservation.lastModifiedDate
    ? new Date(reservation.lastModifiedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  // Get service details
  const serviceName = service?.nameEn ?? service?.nameAr ?? 'Service'
  const serviceImage = service?.imageUrl ?? '/placeholder-service.png'
  const serviceRating = service?.rate ?? 0
  const serviceDescription =
    service?.descriptionEn ?? service?.descriptionAr ?? null

  // Get provider details
  const providerName = provider?.nameEn ?? provider?.nameAr ?? 'Provider'
  const providerImage = provider?.profileURL ?? null
  const providerPhone = provider?.phoneNumber ?? null
  const providerAddress = provider?.shortAddress ?? null

  // Get place details
  const placeName =
    reservation.reservationPlace?.nameEn ??
    reservation.reservationPlace?.nameAr ??
    null
  const placeAddress =
    reservation.reservationPlace?.address?.fullAddress ?? null

  // Get staff details
  const user = reservation.reservationStaff?.user
  const staffName = user
    ? `${user.firstName} ${user.lastName}`.trim() || null
    : null
  const staffPhone = user?.phoneNumber ?? null

  // Get price details
  const totalPrice = reservation.totalPrice ?? reservation.servicePrice ?? 0
  const depositAmount = reservation.depositAmount ?? null
  const servicePrice = reservation.servicePrice ?? null

  return (
    <UserPageLayout>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <PageHeader
          title={`Reservation #${reservation.reservationId}`}
          subtitle={
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={mapReservationStatusToBadgeType(status)} />
              <span className="text-14 text-gray-600">{status}</span>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-20 font-semibold text-gray-900 mb-4">
              Service Information
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={serviceImage}
                  alt={serviceName}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <Link
                  href={service?.id ? `/services/category/${service.id}` : '#'}
                  className="text-18 font-semibold text-gray-900 hover:text-brand-600 transition-colors mb-2 block"
                >
                  {serviceName}
                </Link>
                {serviceRating > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={cn(
                          'h-4 w-4',
                          star <= Math.floor(serviceRating)
                            ? 'fill-brand-500 text-brand-500'
                            : 'fill-gray-200 text-gray-200'
                        )}
                      />
                    ))}
                    <span className="text-14 text-gray-600 ml-1">
                      {serviceRating.toFixed(1)}
                    </span>
                  </div>
                )}
                {serviceDescription && (
                  <p className="text-14 text-gray-600 line-clamp-3">
                    {serviceDescription}
                  </p>
                )}
                {service?.id && (
                  <Link
                    href={`/services/category/${service.id}`}
                    className="inline-flex items-center gap-1 text-14 text-brand-600 hover:text-brand-700 mt-2"
                  >
                    View Service Details
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Reservation Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-20 font-semibold text-gray-900 mb-4">
              Reservation Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reservationDateTime && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-12 text-gray-500 mb-1">
                      Reservation Date & Time
                    </p>
                    <p className="text-14 font-medium text-gray-900">
                      {reservationDateTime}
                    </p>
                  </div>
                </div>
              )}
              {reservationDate && !reservationDateTime && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-12 text-gray-500 mb-1">
                      Reservation Date
                    </p>
                    <p className="text-14 font-medium text-gray-900">
                      {reservationDate}
                    </p>
                  </div>
                </div>
              )}
              {reservationTime && !reservationDateTime && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-12 text-gray-500 mb-1">
                      Reservation Time
                    </p>
                    <p className="text-14 font-medium text-gray-900">
                      {reservationTime}
                    </p>
                  </div>
                </div>
              )}
              {reservation.quantity && reservation.quantity > 1 && (
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-12 text-gray-500 mb-1">Quantity</p>
                    <p className="text-14 font-medium text-gray-900">
                      {reservation.quantity}
                    </p>
                  </div>
                </div>
              )}
              {createdDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-12 text-gray-500 mb-1">Created On</p>
                    <p className="text-14 font-medium text-gray-900">
                      {createdDate}
                    </p>
                  </div>
                </div>
              )}
              {lastModifiedDate && lastModifiedDate !== createdDate && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-12 text-gray-500 mb-1">Last Modified</p>
                    <p className="text-14 font-medium text-gray-900">
                      {lastModifiedDate}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Information Card */}
          {(placeName || placeAddress) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-20 font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  {placeName && (
                    <p className="text-16 font-medium text-gray-900 mb-1">
                      {placeName}
                    </p>
                  )}
                  {placeAddress && (
                    <p className="text-14 text-gray-600">{placeAddress}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Staff Information Card */}
          {staffName && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-20 font-semibold text-gray-900 mb-4">
                Assigned Staff
              </h2>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-14 font-medium text-gray-900">
                    {staffName}
                  </p>
                  {staffPhone && (
                    <p className="text-14 text-gray-600 mt-1">{staffPhone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Package Information Card */}
          {reservation.servicePackage && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-20 font-semibold text-gray-900 mb-4">
                Package Details
              </h2>
              <div className="space-y-2">
                <p className="text-16 font-medium text-gray-900">
                  {reservation.servicePackage.nameEn ??
                    reservation.servicePackage.nameAr ??
                    'Package'}
                </p>
                {(reservation.servicePackage.descriptionEn ||
                  reservation.servicePackage.descriptionAr) && (
                  <p className="text-14 text-gray-600">
                    {reservation.servicePackage.descriptionEn ??
                      reservation.servicePackage.descriptionAr}
                  </p>
                )}
                {reservation.servicePackage.price && (
                  <p className="text-16 font-semibold text-gray-900 mt-2">
                    {reservation.servicePackage.price.toLocaleString()} EGP
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Resources Card */}
          {reservation.resources && reservation.resources.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-20 font-semibold text-gray-900 mb-4">
                Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reservation.resources.map(resource => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-14 text-gray-900">
                      {resource.nameEn ??
                        resource.nameAr ??
                        `Resource ${resource.id}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Card */}
          {reservation.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-20 font-semibold text-gray-900 mb-4">
                Notes
              </h2>
              <p className="text-14 text-gray-700 whitespace-pre-wrap">
                {reservation.notes}
              </p>
            </div>
          )}

          {/* Client Feedback Card */}
          {reservation.clientFeedback && (
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm bg-blue-50">
              <h2 className="text-20 font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Feedback
              </h2>
              <p className="text-14 text-blue-800 whitespace-pre-wrap">
                {reservation.clientFeedback}
              </p>
            </div>
          )}

          {/* Test Request Information */}
          {reservation.isTestRequested && (
            <div className="bg-white rounded-xl border border-yellow-200 p-6 shadow-sm bg-yellow-50">
              <h2 className="text-20 font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Test Request
              </h2>
              <div className="space-y-2">
                <p className="text-14 text-yellow-800">
                  You have requested a test for this service.
                </p>
                {reservation.isTestAccepted !== null && (
                  <p className="text-14 font-medium text-yellow-900">
                    Status:{' '}
                    {reservation.isTestAccepted ? 'Accepted' : 'Rejected'}
                  </p>
                )}
                {reservation.clientWantsToContinue !== null && (
                  <p className="text-14 text-yellow-800">
                    Continue with service:{' '}
                    {reservation.clientWantsToContinue ? 'Yes' : 'No'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div
            className={cn(
              'bg-white rounded-xl border p-6 shadow-sm',
              getStatusColor(status)
            )}
          >
            <h3 className="text-16 font-semibold mb-4">Reservation Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-14 text-gray-700">Status:</span>
                <StatusBadge status={mapReservationStatusToBadgeType(status)} />
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-12 text-gray-600">
                  {status === ReservationStatus.Completed &&
                    'This reservation has been completed.'}
                  {status === ReservationStatus.Cancelled &&
                    'This reservation has been cancelled.'}
                  {status === ReservationStatus.Confirmed &&
                    'This reservation has been confirmed.'}
                  {status === ReservationStatus.Pending &&
                    'This reservation is pending confirmation.'}
                  {!['Completed', 'Cancelled', 'Confirmed', 'Pending'].includes(
                    status
                  ) && 'This reservation is in progress.'}
                </p>
              </div>
            </div>
          </div>

          {/* Provider Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-16 font-semibold text-gray-900 mb-4">
              Provider
            </h3>
            <div className="space-y-3">
              {providerImage && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={providerImage}
                    alt={providerName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-16 font-semibold text-gray-900">
                  {providerName}
                </p>
                {providerAddress && (
                  <p className="text-14 text-gray-600 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {providerAddress}
                  </p>
                )}
              </div>
              {providerPhone && (
                <div className="flex items-center gap-2 text-14 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {providerPhone}
                </div>
              )}
              {provider?.id && (
                <Link
                  href={`/providers/${provider.id}`}
                  className="inline-flex items-center gap-1 text-14 text-brand-600 hover:text-brand-700 mt-2"
                >
                  View Provider Profile
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-16 font-semibold text-gray-900 mb-4">
              Pricing
            </h3>
            <div className="space-y-3">
              {servicePrice && (
                <div className="flex items-center justify-between">
                  <span className="text-14 text-gray-700">Service Price:</span>
                  <span className="text-14 font-medium text-gray-900">
                    {servicePrice.toLocaleString()} EGP
                  </span>
                </div>
              )}
              {depositAmount && depositAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-14 text-gray-700">Deposit:</span>
                  <span className="text-14 font-medium text-gray-900">
                    {depositAmount.toLocaleString()} EGP
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-16 font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-18 font-bold text-brand-600">
                    {totalPrice.toLocaleString()} EGP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          {isInProgress && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-16 font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCancelReservation}
                  disabled={cancelReservationMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <X className="h-4 w-4" />
                  Cancel Reservation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={cancelReservationMutation.isPending}
        title="Cancelling reservation..."
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}
