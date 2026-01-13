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
} from '@/components/ui'
import { getClientReservationsPaginated, cancelReservation } from '@/services/api/reservationApi'
import type { ReservationResponse } from '@/types/responses'
import { useToast } from '@/components/ui/Toaster'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAuthenticated } from '@/auth/utils/token'

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
    const router = useRouter()
    const queryClient = useQueryClient()
    const { addToast } = useToast()
    const [isMounted, setIsMounted] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

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
            addToast('Reservation cancelled successfully', 'success')
        },
        onError: (error: Error) => {
            addToast(
                error.message || 'Failed to cancel reservation',
                'error'
            )
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
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelReservation = async (reservationId: string) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) {
            return
        }

        try {
            await cancelReservationMutation.mutateAsync(reservationId)
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
                <PageHeader title="My Reservations" />
                <LoadingOverlay
                    open={true}
                    title="Loading reservations..."
                    subtitle="Please wait a moment"
                />
            </UserPageLayout>
        )
    }

    // Show error state
    if (error) {
        return (
            <UserPageLayout>
                <PageHeader title="My Reservations" />
                <ErrorDisplay
                    title="Error loading reservations"
                    message="Please try again later"
                    actionLabel="Back to Home"
                    actionHref="/"
                />
            </UserPageLayout>
        )
    }

    return (
        <UserPageLayout>
            {/* Page Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <PageHeader
                    title="My Reservations"
                    subtitle={
                        totalCount > 0
                            ? `${totalCount} ${totalCount === 1 ? 'Reservation' : 'Reservations'}`
                            : undefined
                    }
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleCreateReservation}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Reservation
                    </Button>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Refresh reservations"
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
                    title="You don't have any reservations"
                    description="Book a service to create your first reservation"
                    actionLabel="Browse Services"
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

            {/* Loading Overlay for Mutations */}
            <LoadingOverlay
                open={cancelReservationMutation.isPending}
                title="Cancelling reservation..."
                subtitle="Please wait a moment"
            />
        </UserPageLayout>
    )
}

