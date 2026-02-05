'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { RefreshCw, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserPageLayout } from '@/components/layout'
import {
    EmptyState,
    ReservationCard,
    PageHeader,
    ErrorDisplay,
    LoadingOverlay,
    Button,
    Pagination,
    LoadingSpinner, 
} from '@/components/ui'
import { CancelOrderModal } from '@/components/ui/CancelOrderModal'
import { getClientReservationsPaginated, cancelReservation } from '@/services/api/reservationApi'
import type { ReservationResponse } from '@/types/responses'
import { useToast } from '@/components/ui/Toaster'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAuthenticated } from '@/auth/utils/token'
import { useI18nTranslations } from '@/i18n/hooks'

const PAGE_SIZE = 10

/**
 * Hook to fetch user reservations with pagination
 */
const useReservations = (enabled: boolean = true, page: number = 1, pageSize: number = PAGE_SIZE) => {
    const authenticated = isAuthenticated()

    return useQuery<{
        reservations: ReservationResponse[]
        totalCount: number
    }>({
        queryKey: ['reservations', 'user', 'paginated', page, pageSize],
        queryFn: async () => {
            const result = await getClientReservationsPaginated({
                page,
                pageSize,
            })
            return result
        },
        enabled: enabled && authenticated,
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
    })
}

export default function ReservationsPage() {
  const t = useI18nTranslations('reservations')
  const router = useRouter()
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const [isMounted, setIsMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // ✅ Cancel Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null)

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

    // Fetch reservations - disable during SSR to prevent hydration mismatch
    const { data: reservationsData, isLoading, error, refetch } = useReservations(
        isMounted,
        currentPage,
        PAGE_SIZE
    )

    const reservations = reservationsData?.reservations ?? []
    const totalCount = reservationsData?.totalCount ?? 0
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Cancel reservation mutation
  const cancelReservationMutation = useMutation({
    mutationFn: async (reservationId: string) => {
      await cancelReservation(reservationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      addToast(t('toast.cancelSuccess'), 'success')
    },
    onError: (error: Error) => {
      addToast(error.message || t('toast.cancelFail'), 'error')
    },
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } catch (error) {
      console.error('Failed to refresh reservations:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ✅ Open modal instead of confirm()
  const handleCancelReservation = (reservationId: string) => {
    setSelectedReservationId(reservationId)
    setIsCancelModalOpen(true)
  }

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false)
    setSelectedReservationId(null)
  }

  const handleConfirmCancelModal = async (reason?: string) => {
    if (!selectedReservationId) return

    try {
     
      await cancelReservationMutation.mutateAsync(selectedReservationId)
      handleCloseCancelModal()
    } catch (error) {
      // Error is handled by mutation onError
      console.error('Failed to cancel reservation:', error)
    }
  }

    const handleViewDetails = (reservationId: string) => {
        // Navigate to reservation details page if it exists
        // For now, we can show a toast or navigate to a details page
        router.push(`/reservations/${reservationId}`)
    }

    const handleCreateReservation = () => {
        router.push('/services')
    }

  // Show loading state (during SSR or while fetching)
  if (!isMounted || isLoading) {
    return (
      <UserPageLayout>
        <PageHeader title={t('page.title')} />
        <LoadingSpinner fullScreen={true} size="lg" text={`${t('loading.title')} ${t('loading.subtitle')}`} />
      </UserPageLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <UserPageLayout>
        <PageHeader title={t('page.title')} />
        <ErrorDisplay
          title={t('error.title')}
          message={t('error.message')}
          actionLabel={t('error.actionLabel')}
          actionHref="/"
        />
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
        <PageHeader
          title={t('page.title')}
          subtitle={
            totalCount > 0
              ? t('page.subtitle.other', { count: totalCount })
              : t('page.subtitle.one', { count: totalCount })
          }
        />

        <div className="flex items-center gap-2 flex-shrink-0 sm:self-auto self-start">
          <Button
            variant="default"
            size="sm"
            onClick={handleCreateReservation}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('page.actions.newReservation')}
          </Button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('page.actions.refreshAria')}
          >
            <RefreshCw
              className={cn(
                'h-4 w-4 text-gray-600',
                isRefreshing && 'animate-spin'
              )}
            />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {reservations.length === 0 ? (
        <EmptyState
          illustration={orderEmptySvg}
          title={t('list.empty.title')}
          description={t('list.empty.description')}
          actionLabel={t('list.empty.actionLabel')}
          actionHref="/services"
        />
      ) : (
        <>
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancelReservation}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* ✅ Cancel Modal (re-using CancelOrderModal) */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancelModal}
        titleText={t('confirm.title')}
        text={t('confirm.cancelTitle')}
        keepText={t('confirm.keepButton')}
        cancelText={t('confirm.cancelButton')}
        note={false}
      />

      {/* Loading Overlay for Mutations */}
      <LoadingSpinner
        open={cancelReservationMutation.isPending}
        text={t('details.mutation.cancelling.title')}
       
      />
    </UserPageLayout>
  )
}
