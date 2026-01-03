'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    User,
    Phone,
    Calendar,
    Star,
    Users,
    ArrowLeft,
    X,
    Check,
    Clock,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { LoadingSpinner, ErrorDisplay, ProcessingModal } from '@/components/ui'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { cn } from '@/lib/utils'
import { formatRole } from '@/utils/role'
import { useServiceDetail } from '@/hooks/services'
import { createReservation, getAvailableTimeSlots, getReservationById } from '@/services/api/reservationApi'
import { addPurchase } from '@/services/api/purchaseApi'
import type { ReservationRequest, PurchaseRequest } from '@/../client/common/api/gen/ourbride-api'
import { PurchaseType, ServiceType } from '@/../client/common/api/gen/ourbride-api'
import type { ServiceResponse } from '@/types/responses/service-response'
import type { ServicePlaceAssignmentResponse } from '@/types/responses/service-place-assignment-response'
import type { ServiceStaffAssignmentResponse } from '@/types/responses/service-staff-assignment-response'
import type { TimeSlotResponse } from '@/types/responses/time-slot-response'
import type { ReservationResponse } from '@/types/responses'
import { ReservationStatus } from '@/types/responses/common'
import { useUserFromToken } from '@/hooks/auth'

export interface Branch {
    id: string
    name: string
    address: string
}

export interface Staff {
    id: string
    name: string
    email: string | null
    role: string | null
}

export interface Package {
    id: string
    title: string
    price: number
    description?: string
}

export interface PackageUpgrade {
    id: string
    title: string
    price: number
}

export interface TimeSlot {
    id: number
    start: string // ISO DateTime string
    end: string // ISO DateTime string
    status: number // AvailabilityStatus enum value
    available: boolean
}

export interface BookingFormData {
    fullName: string
    mobileNumber: string
    selectedBranch: string
    selectedStaff: string
    selectedPackage: string
    selectedUpgrades: string[]
    selectedDate: string
    selectedTime: string
    promoCode?: string
    useDiamonds?: boolean
    useGiftsCash?: boolean
    acceptTerms: boolean
}

// All mock data removed - using real API data

interface BookingPageClientProps {
    serviceId: string
}

export function BookingPageClient({ serviceId }: BookingPageClientProps) {
    const router = useRouter()
    const userInfo = useUserFromToken()

    // Fetch service detail (includes both transformed service and raw response)
    const {
        data: serviceDetailData,
        isLoading: serviceLoading,
        error: serviceError,
    } = useServiceDetail(serviceId, !!serviceId)

    const service = serviceDetailData?.service
    // Use raw service response from the hook instead of making a duplicate API call
    const rawServiceResponse = serviceDetailData?.rawServiceResponse || null

    // Extract packages from service response (packages are included in the service response)
    const packages: Package[] = useMemo(() => {
        if (!rawServiceResponse?.packages || rawServiceResponse.packages.length === 0) {
            return []
        }

        return rawServiceResponse.packages.map((pkg) => ({
            id: String(pkg.id),
            title: pkg.nameEn || pkg.nameAr || '',
            price: pkg.price,
            description: pkg.descriptionEn || pkg.descriptionAr || undefined,
        }))
    }, [rawServiceResponse?.packages])

    // Extract branches from service place assignments
    const branches: Branch[] = useMemo(() => {
        if (!rawServiceResponse?.servicePlaceAssignments || rawServiceResponse.servicePlaceAssignments.length === 0) {
            return []
        }

        return rawServiceResponse.servicePlaceAssignments
            .filter((assignment: ServicePlaceAssignmentResponse) => assignment.place !== null)
            .map((assignment: ServicePlaceAssignmentResponse, index: number) => ({
                id: String(assignment.placeId || assignment.id || index),
                name: assignment.place?.nameEn || assignment.place?.nameAr || `Branch ${index + 1}`,
                address: assignment.place?.address?.fullAddress || '',
            }))
    }, [rawServiceResponse])

    // Extract staff from service staff assignments
    const staff: Staff[] = useMemo(() => {
        if (!rawServiceResponse?.serviceStaffAssignments || rawServiceResponse.serviceStaffAssignments.length === 0) {
            return []
        }

        return rawServiceResponse.serviceStaffAssignments.map((assignment: ServiceStaffAssignmentResponse) => ({
            id: String(assignment.staffId || assignment.id),
            name: assignment.staffName || assignment.staffEmail || `Staff ${assignment.id}`,
            email: assignment.staffEmail,
            role: formatRole(assignment.staffRole),
        }))
    }, [rawServiceResponse])

    // Package upgrades - removed as not available in API
    // If needed in future, can be added as a separate API call
    const packageUpgrades: PackageUpgrade[] = []

    // Step management
    type BookingStep = 'details' | 'datetime' | 'confirm'
    // Always start with 'details' step
    const [step, setStep] = useState<BookingStep>('details')

    // State for time slot selector
    const [is12Hour] = useState(true)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    // Initialize currentDate to today at midnight to ensure consistent date handling
    const [currentDate, setCurrentDate] = useState<Date>(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return today
    })
    const [selectedSlotId, setSelectedSlotId] = useState<number | undefined>(undefined)

    // State for dynamically fetched time slots
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [timeSlotsLoading, setTimeSlotsLoading] = useState(false)
    const [timeSlotsError, setTimeSlotsError] = useState<Error | null>(null)

    // User info is now extracted from token using the hook

    // Initialize form data with empty values (will be populated by useEffect)
    const getInitialFormData = (): BookingFormData => {
        return {
            fullName: '',
            mobileNumber: '',
            selectedBranch: '',
            selectedStaff: '',
            selectedPackage: '',
            selectedUpgrades: [],
            selectedDate: '',
            selectedTime: '',
            promoCode: '',
            useDiamonds: false,
            useGiftsCash: false,
            acceptTerms: false,
        }
    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<BookingFormData>(getInitialFormData())
    const [queueStatus, setQueueStatus] = useState<'idle' | 'queued' | 'processing' | 'completed' | 'failed'>('idle')
    const pollingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [showProcessingModal, setShowProcessingModal] = useState(false)

    // Set mounted state
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Update form data when user info changes or component mounts
    useEffect(() => {
        if (!isMounted) {
            return
        }

        console.log('🟡 UserInfo data:', userInfo)

        // Use userInfo from hook (already extracted from token)
        const fullName = userInfo.name || userInfo.fullName || ''
        const phoneNumber = userInfo.phoneNumber || ''

        console.log('🟡 Extracted fullName:', fullName)
        console.log('🟡 Extracted phoneNumber:', phoneNumber)

        // Only update if we have valid data and form is empty
        if ((fullName || phoneNumber)) {
            setFormData(prev => {
                // Only update if the fields are currently empty to avoid overwriting user input
                const updates: Partial<BookingFormData> = {}
                if (fullName && !prev.fullName) {
                    updates.fullName = fullName
                }
                if (phoneNumber && !prev.mobileNumber) {
                    updates.mobileNumber = phoneNumber
                }
                // Only update if there are changes
                if (Object.keys(updates).length > 0) {
                    console.log('🟡 Updating form data with:', updates)
                    return { ...prev, ...updates }
                }
                return prev
            })
        } else {
            console.log('🟡 No userInfo data available to populate form')
        }
    }, [userInfo, isMounted])

    // Fetch time slots only when on datetime step and when service, branch, staff, or date changes
    useEffect(() => {
        // Only fetch time slots when we're on the datetime step
        if (step !== 'datetime') {
            return
        }

        const fetchTimeSlots = async () => {
            if (!serviceId) return

            const parsedServiceId = parseInt(serviceId, 10)
            if (isNaN(parsedServiceId)) return

            setTimeSlotsLoading(true)
            setTimeSlotsError(null)

            try {
                const options: {
                    staffId?: number
                    branchId?: number
                    startDate?: string
                } = {}

                if (formData.selectedStaff) {
                    const staffIdNum = parseInt(formData.selectedStaff, 10)
                    if (!isNaN(staffIdNum)) {
                        options.staffId = staffIdNum
                    }
                }

                if (formData.selectedBranch) {
                    const branchIdNum = parseInt(formData.selectedBranch, 10)
                    if (!isNaN(branchIdNum)) {
                        options.branchId = branchIdNum
                    }
                }

                // Use currentDate for startDate - ensure it's set to today if not already set
                const dateToUse = currentDate || (() => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return today
                })()
                options.startDate = dateToUse.toISOString()

                const slots = await getAvailableTimeSlots(parsedServiceId, options)

                const mappedSlots: TimeSlot[] = slots.map((slot: TimeSlotResponse, index: number) => {
                    // Handle both string and number status values
                    const statusStr = typeof slot.status === 'string' ? slot.status : String(slot.status)
                    const statusValue = typeof slot.status === 'number' ? slot.status :
                        (slot.status === 'Available' ? 1 : slot.status === 'Unknown' ? 0 : 2)

                    // Check availability - status can be string "Available" or number 1
                    const available = statusStr === 'Available' ||
                        statusStr === 'Unknown' ||
                        statusValue === 1 ||
                        statusValue === 0

                    // Generate unique ID if slot.id is 0 or missing
                    // Use a hash of the start time to ensure uniqueness
                    let uniqueId: number
                    if (slot.id && slot.id !== 0) {
                        uniqueId = slot.id
                    } else {
                        // Create a unique ID from the start time timestamp
                        const startTime = slot.start ? new Date(slot.start).getTime() : 0
                        uniqueId = Math.abs(startTime % 2147483647) || (index + 1) // Use timestamp or fallback to index
                    }

                    return {
                        id: uniqueId,
                        start: slot.start,
                        end: slot.end,
                        status: statusValue,
                        available,
                    }
                })

                setTimeSlots(mappedSlots)
            } catch (error) {
                setTimeSlotsError(error instanceof Error ? error : new Error('Failed to fetch time slots'))
                setTimeSlots([])
            } finally {
                setTimeSlotsLoading(false)
            }
        }

        fetchTimeSlots()
    }, [step, serviceId, formData.selectedBranch, formData.selectedStaff, currentDate])

    // Format time helper
    const formatTime = (date: Date) =>
        is12Hour
            ? date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            })
            : date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            })

    // Format date helper
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })
    }

    // Get period label (morning, afternoon, evening) - kept for potential future use
    // const getPeriodLabel = (date: Date) => {
    //     const hour = date.getHours()
    //     if (hour < 12) return 'Morning'
    //     if (hour < 17) return 'Afternoon'
    //     return 'Evening'
    // }

    // Get unique dates from time slots
    const uniqueDates = useMemo(() => {
        return Array.from(
            new Set(timeSlots.map((slot) => formatDate(new Date(slot.start))))
        )
    }, [timeSlots])

    // Set initial selected date
    useEffect(() => {
        if (uniqueDates.length > 0 && !selectedDate) {
            setSelectedDate(uniqueDates[0])
        }
    }, [uniqueDates, selectedDate])

    // Filter slots by selected date
    const filteredSlots = useMemo(() => {
        if (!selectedDate) return []
        return timeSlots.filter(
            (slot) => formatDate(new Date(slot.start)) === selectedDate
        )
    }, [timeSlots, selectedDate])

    // Check if there are available slots
    const hasAvailableSlots = useMemo(() => {
        return filteredSlots.some((slot) => slot.available)
    }, [filteredSlots])

    // Handle date selection
    const handleDateSelect = (dateLabel: string) => {
        setSelectedDate(dateLabel)
        // Parse date and update currentDate to trigger time slot refetch
        const currentYear = new Date().getFullYear()
        const dateMatch = dateLabel.match(/(\w+), (\w+) (\d+)/)

        if (dateMatch) {
            const [, , monthName, day] = dateMatch
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
            const monthIndex = monthNames.indexOf(monthName)

            if (monthIndex !== -1) {
                const selectedDateObj = new Date(currentYear, monthIndex, parseInt(day))
                // If the date is in the past, assume it's next year
                const now = new Date()
                now.setHours(0, 0, 0, 0)
                if (selectedDateObj < now) {
                    selectedDateObj.setFullYear(currentYear + 1)
                }
                // Set time to midnight to ensure consistent date handling
                selectedDateObj.setHours(0, 0, 0, 0)
                setCurrentDate(selectedDateObj)
            }
        }
    }

    // Handle time slot selection
    const handleTimeSlotSelect = (slot: TimeSlot) => {
        setSelectedSlotId(slot.id)
        const timeString = formatTime(new Date(slot.start))
        handleInputChange('selectedTime', timeString)
        // Also update selected date if needed
        const slotDate = formatDate(new Date(slot.start))
        if (slotDate !== formData.selectedDate) {
            handleInputChange('selectedDate', slotDate)
        }
    }

    // Navigation handlers - time slots will be fetched automatically via useEffect
    // These functions are kept for potential future use with navigation buttons

    // Update form data when packages are loaded
    useEffect(() => {
        if (packages.length > 0) {
            setFormData(prev => {
                // Only set if not already selected
                if (!prev.selectedPackage) {
                    return {
                        ...prev,
                        selectedPackage: packages[0]?.id || '',
                    }
                }
                return prev
            })
        }
    }, [packages])

    // Update form data when branches are loaded
    useEffect(() => {
        if (branches.length > 0) {
            setFormData(prev => {
                // Only set if not already selected
                if (!prev.selectedBranch) {
                    return {
                        ...prev,
                        selectedBranch: branches[0]?.id || '',
                    }
                }
                return prev
            })
        }
    }, [branches])

    // Update form data when staff are loaded
    useEffect(() => {
        if (staff.length > 0) {
            setFormData(prev => {
                // Only set if not already selected
                if (!prev.selectedStaff) {
                    return {
                        ...prev,
                        selectedStaff: staff[0]?.id || '',
                    }
                }
                return prev
            })
        }
    }, [staff])


    const [errors, setErrors] = useState<Record<string, string>>({})

    const selectedPackageData = packages.find(
        p => p.id === formData.selectedPackage
    )
    const selectedUpgradesData = packageUpgrades.filter(u =>
        formData.selectedUpgrades.includes(u.id)
    )

    // Calculate total price (package price + upgrades, no taxes or delivery fees)
    const subtotal =
        (selectedPackageData?.price || 0) +
        selectedUpgradesData.reduce((sum, u) => sum + u.price, 0)
    const total = subtotal

    // Calculate service duration from selected time slot, package, or use default
    const serviceDuration = useMemo(() => {
        if (selectedSlotId) {
            const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId)
            if (selectedSlot) {
                const startTime = new Date(selectedSlot.start)
                const endTime = new Date(selectedSlot.end)
                const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
                return durationMinutes
            }
        }
        // Fallback: try to get duration from selected package
        if (selectedPackageData?.description) {
            // Try to parse duration from package description if available
            const durationMatch = selectedPackageData.description.match(/(\d+)\s*min/i)
            if (durationMatch) {
                return parseInt(durationMatch[1], 10)
            }
        }
        // Default duration if not available
        return 60
    }, [selectedSlotId, timeSlots, selectedPackageData])

    const handleInputChange = (field: keyof BookingFormData, value: string | boolean | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleUpgradeToggle = (upgradeId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedUpgrades: prev.selectedUpgrades.includes(upgradeId)
                ? prev.selectedUpgrades.filter(id => id !== upgradeId)
                : [...prev.selectedUpgrades, upgradeId],
        }))
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.selectedDate) {
            newErrors.selectedDate = 'Please select a date'
        }
        if (!formData.selectedTime) {
            newErrors.selectedTime = 'Please select a time'
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Stop polling function (handles both setInterval and setTimeout)
    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearTimeout(pollingIntervalRef.current)
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
        }
    }

    // Start polling for reservation status using production-ready API pattern
    // Poll GET /api/v1/services/reservations/{reservationId} until status changes from "Pending"
    // API now returns "Pending" (2) as initial status after creation
    const startPolling = (
        reservationId: string | null,
        providerId: number | undefined,
        clientId: string | undefined,
        serviceIdParam: string,
        requestedStartTimeParam: string | undefined,
        notesParam: string
    ) => {
        if (!reservationId) {
            setQueueStatus('failed')
            setShowProcessingModal(false)
            setIsSubmitting(false)
            alert('Reservation ID is missing. Please check your reservations page.')
            return
        }

        setQueueStatus('queued')
        setShowProcessingModal(true)
        let pollCount = 0
        const maxPolls = 30 // Maximum 30 polls (about 2 minutes with exponential backoff)
        let delay = 2000 // Start with 2 seconds (exponential backoff: 2s, 3s, 4s, 5s, 6s...)

        const poll = async () => {
            pollCount++

            try {
                // Poll reservation by ID (production-ready pattern)
                const reservation = await getReservationById(reservationId)

                if (!reservation) {
                    if (pollCount >= maxPolls) {
                        handlePollingTimeout()
                        return
                    }

                    // Continue polling with exponential backoff
                    delay = Math.min(delay + 1000, 6000) // Max 6 seconds
                    pollingIntervalRef.current = setTimeout(poll, delay)
                    return
                }

                const status = reservation.status

                // Check if status changed from "Pending" (2) - processing complete
                // API now returns "Pending" as initial status, poll until it changes to another status
                const isProcessing = status === ReservationStatus.Pending

                if (!isProcessing) {
                    // Status changed from "Pending" - processing complete
                    handleReservationStatusUpdate(reservation, providerId, clientId, serviceIdParam, requestedStartTimeParam, notesParam)
                    return
                }

                // Still processing (status is "Pending"), continue polling
                if (pollCount >= maxPolls) {
                    handlePollingTimeout()
                    return
                }

                // Exponential backoff: 2s, 3s, 4s, 5s, 6s...
                delay = Math.min(delay + 1000, 6000)
                pollingIntervalRef.current = setTimeout(poll, delay)

            } catch (error: unknown) {
                // If reservation not found (404), continue polling (might not be created yet)
                const err = error as { response?: { status?: number }; statusCode?: number }
                if (err?.response?.status === 404 || err?.statusCode === 404) {
                    if (pollCount >= maxPolls) {
                        handlePollingTimeout()
                        return
                    }

                    delay = Math.min(delay + 1000, 6000)
                    pollingIntervalRef.current = setTimeout(poll, delay)
                    return
                }

                // Other errors - retry with backoff
                if (pollCount >= maxPolls) {
                    handlePollingTimeout()
                    return
                }

                delay = Math.min(delay + 1000, 6000)
                pollingIntervalRef.current = setTimeout(poll, delay)
            }
        }

        // Start polling after initial delay
        pollingIntervalRef.current = setTimeout(poll, delay)
    }

    // Handle reservation status update after processing completes
    const handleReservationStatusUpdate = (
        reservation: ReservationResponse,
        providerId: number | undefined,
        clientId: string | undefined,
        serviceIdParam: string,
        requestedStartTimeParam: string | undefined,
        notesParam: string
    ) => {
        const finalReservationId = reservation.reservationId

        if (!finalReservationId) {
            setQueueStatus('failed')
            setShowProcessingModal(false)
            stopPolling()
            setIsSubmitting(false)
            alert('Reservation found but missing ID. Please check your reservations page.')
            return
        }

        // Stop polling
        stopPolling()

        // Handle different statuses
        // Note: Status should not be "Pending" here since we poll until it changes
        // But keeping as fallback in case of edge cases
        const status = reservation.status
        switch (status) {
            case ReservationStatus.Pending:
                // Status is still "Pending" - this shouldn't happen after polling, but proceed anyway
                // Reservation was created successfully, proceed with purchase creation
                setQueueStatus('completed')
                setShowProcessingModal(false)
                setIsSubmitting(false)
                // Create purchase and navigate
                createPurchaseAndNavigate(finalReservationId, providerId, clientId, serviceIdParam, requestedStartTimeParam, notesParam)
                break

            case ReservationStatus.Confirmed:
                setQueueStatus('completed')
                setShowProcessingModal(false)
                setIsSubmitting(false)
                // Create purchase and navigate
                createPurchaseAndNavigate(finalReservationId, providerId, clientId, serviceIdParam, requestedStartTimeParam, notesParam)
                break

            case ReservationStatus.Rejected:
                setQueueStatus('failed')
                setShowProcessingModal(false)
                stopPolling()
                setIsSubmitting(false)
                alert('Reservation was rejected. Please check your reservations page for details.')
                break

            case ReservationStatus.TestRequested:
                setQueueStatus('completed')
                setShowProcessingModal(false)
                setIsSubmitting(false)
                // Create purchase and navigate
                createPurchaseAndNavigate(finalReservationId, providerId, clientId, serviceIdParam, requestedStartTimeParam, notesParam)
                break

            case ReservationStatus.None:
                // "None" status - reservation created successfully (some APIs return "None" for created reservations)
                setQueueStatus('completed')
                setShowProcessingModal(false)
                setIsSubmitting(false)
                // Create purchase and navigate
                createPurchaseAndNavigate(finalReservationId, providerId, clientId, serviceIdParam, requestedStartTimeParam, notesParam)
                break

            default:
                setQueueStatus('completed')
                setShowProcessingModal(false)
                setIsSubmitting(false)
                // Create purchase and navigate for other statuses
                createPurchaseAndNavigate(finalReservationId, providerId, clientId, serviceIdParam, requestedStartTimeParam, notesParam)
        }
    }

    // Create purchase record and navigate to cart
    const createPurchaseAndNavigate = async (
        reservationId: string,
        providerId: number | undefined,
        clientId: string | undefined,
        serviceIdParam: string,
        requestedStartTimeParam: string | undefined,
        notesParam: string
    ) => {
        // Create purchase record after successful reservation
        try {
            console.log('🟢 Creating purchase record...')
            const servicePrice = service?.price?.original || service?.price?.discounted || 0

            // Ensure providerId is available - try multiple sources
            const finalProviderId = providerId ||
                rawServiceResponse?.providerId ||
                (service?.provider?.id ? parseInt(service.provider.id, 10) : undefined)

            const purchasePayload: PurchaseRequest = {
                purchaseType: PurchaseType.Service,
                serviceId: parseInt(serviceIdParam, 10),
                providerId: finalProviderId || undefined,
                serviceType: rawServiceResponse?.type as ServiceType || ServiceType.Rent,
                totalPrice: servicePrice,
                quantity: 1,
                reservationId: reservationId,
                comment: notesParam,
                startDate: requestedStartTimeParam || undefined,
                endDate: requestedStartTimeParam
                    ? new Date(new Date(requestedStartTimeParam).getTime() + 60 * 60 * 1000).toISOString()
                    : undefined, // 1 hour default
                depositAmount: rawServiceResponse?.deposit || undefined,
                clientId: clientId || undefined,
            }

            console.log('🟢 Purchase payload:', JSON.stringify(purchasePayload, null, 2))
            const purchaseResponse = await addPurchase(purchasePayload)
            console.log('✅ Purchase created successfully:', purchaseResponse)

            // Navigate to reservation details page after successful purchase creation
            console.log('🟢 Navigating to reservation details page...')
            router.push(`/reservations/${reservationId}`)
        } catch (error) {
            console.error('❌ Error creating purchase:', error)
            // Even if purchase creation fails, navigate to reservation details
            console.log('🟡 Purchase creation failed, but navigating to reservation details anyway...')
            router.push(`/reservations/${reservationId}`)
        }
    }

    // Handle polling timeout
    const handlePollingTimeout = () => {
        setQueueStatus('failed')
        setShowProcessingModal(false)
        stopPolling()
        setIsSubmitting(false)
        alert('Reservation is taking longer than expected. Please check your reservations page.')
    }

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            stopPolling()
        }
    }, [])

    // Step navigation handlers
    const handleContinue = () => {
        if (step === 'details') {
            // Validate details (branch, staff, package if required)
            if (branches.length > 0 && !formData.selectedBranch) {
                setErrors({ ...errors, selectedBranch: 'Please select a branch' })
                return
            }
            // Reset currentDate to today when moving to datetime step
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            setCurrentDate(today)
            // Clear previous time slot selection
            setSelectedSlotId(undefined)
            setSelectedDate(null)
            setStep('datetime')
        } else if (step === 'datetime') {
            // Validate date/time selection
            if (!formData.selectedTime) {
                setErrors({ ...errors, selectedTime: 'Please select a date and time' })
                return
            }
            setStep('confirm')
        }
    }

    const handleBack = () => {
        if (step === 'datetime') {
            setStep('details')
        } else if (step === 'confirm') {
            setStep('datetime')
        } else if (step === 'details') {
            router.back()
        }
    }

    const handleConfirm = async () => {
        console.log('🔵 handleConfirm called')
        console.log('🔵 Form data:', formData)
        console.log('🔵 Selected slot ID:', selectedSlotId)
        console.log('🔵 Service:', service)
        console.log('🔵 Service ID:', serviceId)

        const isValid = validateForm()
        console.log('🔵 Form validation result:', isValid)
        console.log('🔵 Validation errors:', errors)

        if (!isValid) {
            console.log('❌ Form validation failed, returning early')
            return
        }

        if (!service || !serviceId) {
            console.log('❌ Service or serviceId missing, returning early')
            console.log('❌ Service:', service)
            console.log('❌ ServiceId:', serviceId)
            return
        }

        console.log('✅ Validation passed, setting isSubmitting to true')
        setIsSubmitting(true)

        try {
            console.log('🟢 Starting reservation creation process')

            // Prepare reservation request
            const providerId = rawServiceResponse?.providerId || (service.provider?.id ? parseInt(service.provider.id, 10) : undefined)
            console.log('🟢 Provider ID:', providerId)
            console.log('🟢 Raw service response:', rawServiceResponse)

            // Get selected time slot to extract proper date/time
            const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId)
            console.log('🟢 Selected slot:', selectedSlot)
            console.log('🟢 All time slots:', timeSlots)
            console.log('🟢 Selected slot ID:', selectedSlotId)

            let requestedStartTime: string | undefined
            let reservationDate: string | undefined

            if (selectedSlot) {
                // Use the actual slot start time
                requestedStartTime = selectedSlot.start
                reservationDate = new Date(selectedSlot.start).toISOString().split('T')[0]
            } else if (formData.selectedDate && formData.selectedTime) {
                // Fallback: construct from form data
                // Parse the selected date (format: "Mon, Jan 15")
                const currentYear = new Date().getFullYear()
                const dateMatch = formData.selectedDate.match(/(\w+), (\w+) (\d+)/)

                if (dateMatch) {
                    const [, , monthName, day] = dateMatch
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    const monthIndex = monthNames.indexOf(monthName)

                    if (monthIndex !== -1) {
                        const selectedDateObj = new Date(currentYear, monthIndex, parseInt(day))
                        if (selectedDateObj < new Date()) {
                            selectedDateObj.setFullYear(currentYear + 1)
                        }

                        // Parse time (format: "2:30 PM" or "14:30")
                        const timeMatch = formData.selectedTime.match(/(\d+):(\d+)\s*(AM|PM)?/i)
                        if (timeMatch) {
                            let hours = parseInt(timeMatch[1], 10)
                            const minutes = parseInt(timeMatch[2], 10)
                            const period = timeMatch[3]?.toUpperCase()

                            if (period === 'PM' && hours !== 12) {
                                hours += 12
                            } else if (period === 'AM' && hours === 12) {
                                hours = 0
                            }

                            selectedDateObj.setHours(hours, minutes, 0, 0)
                            requestedStartTime = selectedDateObj.toISOString()
                            reservationDate = selectedDateObj.toISOString().split('T')[0]
                        }
                    }
                }
            }

            console.log('🟢 Preparing reservation request')
            console.log('🟢 Requested start time:', requestedStartTime)
            console.log('🟢 Reservation date:', reservationDate)

            const reservationRequest: ReservationRequest = {
                serviceId: parseInt(serviceId, 10),
                providerId: providerId || undefined,
                branchId: formData.selectedBranch ? parseInt(formData.selectedBranch, 10) : undefined,
                staffId: formData.selectedStaff ? (parseInt(formData.selectedStaff, 10) || undefined) : undefined,
                servicePackageId: formData.selectedPackage ? parseInt(formData.selectedPackage, 10) : undefined,
                reservationSlotId: selectedSlotId ? Number(selectedSlotId) : undefined,
                requestedStartTime,
                reservationDate,
                notes: formData.promoCode ? `Promo Code: ${formData.promoCode}` : '',
                depositAmount: rawServiceResponse?.deposit || undefined,
            }

            console.log('🟢 Reservation request payload:', JSON.stringify(reservationRequest, null, 2))

            // Get client ID from user info
            const clientId = userInfo.id || undefined

            // Store notes for purchase creation
            const notes = formData.promoCode ? `Promo Code: ${formData.promoCode}` : ''

            // Create reservation (production-ready API pattern)
            // API returns 201 Created with reservationId immediately, status will be "Created" (1)
            try {
                console.log('🟡 Calling createReservation API...')
                const apiResponse = await createReservation(reservationRequest)
                console.log('🟡 API Response received:', apiResponse)

                // Extract reservation ID from response
                // API returns 201 Created with reservationId immediately
                const responseData = apiResponse as unknown as { reservationId?: string; id?: string | number; status?: ReservationStatus }
                const reservationId = apiResponse?.reservationId ||
                    (typeof responseData?.id === 'string' ? responseData.id : responseData?.id?.toString()) ||
                    responseData?.reservationId

                console.log('🟡 Extracted reservation ID:', reservationId)

                if (!reservationId) {
                    console.error('❌ Reservation ID not found in response')
                    throw new Error('Reservation ID not found in response. Please try again.')
                }

                // Always start polling
                // Poll GET /api/v1/services/reservations/{reservationId} until status changes from "Pending" (2)
                // "Pending" indicates the reservation is being validated/processed in the queue
                console.log('✅ Reservation created successfully, starting polling...')
                setIsSubmitting(false)
                setShowProcessingModal(true)
                setQueueStatus('queued')

                // Start polling by reservation ID (production-ready pattern)
                // Poll until status changes from "Pending" to "Confirmed", "Rejected", etc.
                console.log('🟢 Starting polling with reservation ID:', reservationId)
                startPolling(reservationId, providerId, clientId, serviceId, requestedStartTime, notes)

            } catch (error: unknown) {
                console.error('❌ Error in createReservation try block:', error)
                const err = error as {
                    response?: {
                        status?: number;
                        data?: {
                            statusCode?: number;
                            reservationId?: string;
                            data?: { reservationId?: string };
                            id?: string;
                            message?: string;
                            errors?: Array<{ error?: string }>;
                        }
                    }
                }

                // Check if error response has reservation ID (some APIs return 202/201 with ID)
                const errorStatus = err?.response?.status || err?.response?.data?.statusCode
                if (errorStatus === 202 || errorStatus === 201) {
                    const reservationId = err.response?.data?.reservationId ||
                        err.response?.data?.data?.reservationId ||
                        err.response?.data?.id ||
                        null

                    if (reservationId) {
                        setIsSubmitting(false)
                        setShowProcessingModal(true)
                        setQueueStatus('queued')
                        startPolling(reservationId, providerId, clientId, serviceId, requestedStartTime, notes)
                        return
                    }
                }

                // Handle validation errors (400)
                if (errorStatus === 400) {
                    const errorMessage = err?.response?.data?.message ||
                        err?.response?.data?.errors?.[0]?.error ||
                        'Invalid request. Please check your input.'
                    setQueueStatus('failed')
                    setShowProcessingModal(false)
                    setIsSubmitting(false)
                    alert(errorMessage)
                    return
                }

                throw error
            }
        } catch (error) {
            console.error('❌ Error in handleConfirm catch block:', error)
            console.error('❌ Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            })
            setQueueStatus('failed')
            setShowProcessingModal(false)
            setIsSubmitting(false)
            stopPolling()
            alert(error instanceof Error ? error.message : 'Failed to create reservation. Please try again.')
        }
    }

    // Show loading state
    if (serviceLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading booking details..." />
                </main>
                <Footer />
            </div>
        )
    }

    // Show error state
    if (serviceError || !serviceId) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                    <ErrorModal
                        open={true}
                        title="Failed to Load Service Details"
                        message={
                            !serviceId
                                ? 'Please provide a service ID in the URL'
                                : serviceError instanceof Error
                                    ? serviceError.message
                                    : 'Failed to load service details. Please try again.'
                        }
                        onRetry={() => window.location.reload()}
                        onClose={() => router.push('/services')}
                    />
                </main>
                <Footer />
            </div>
        )
    }

    // Show error if service not found
    if (!service) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">
                    <div className="container-custom py-6 md:py-8">
                        <ErrorDisplay
                            title="Service Not Found"
                            message="The service you're looking for doesn't exist or has been removed."
                            actionLabel="Back to Services"
                            onAction={() => router.push('/services')}
                        />
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1">
                <div className="container-custom py-6 md:py-8 max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                            <div>
                                <h1 className="text-24 font-semibold text-gray-900">Book Appointment</h1>
                                <p className="text-14 text-gray-600">
                                    {step === 'details' && 'Booking Details'}
                                    {step === 'datetime' && 'Select Date & Time'}
                                    {step === 'confirm' && 'Confirm Booking'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-700" />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 mb-8">
                        {['details', 'datetime', 'confirm'].map((s, index) => (
                            <React.Fragment key={s}>
                                <div
                                    className={cn(
                                        "flex-1 h-2 rounded-full transition-colors",
                                        ['details', 'datetime', 'confirm'].indexOf(step) >= index
                                            ? "bg-brand-600"
                                            : "bg-gray-200"
                                    )}
                                />
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Booking Details */}
                        <div className="lg:col-span-2">
                            {/* Main Content Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                                {/* Booking Details Step */}
                                {step === 'details' && (
                                    <div className="space-y-6">
                                        <h2 className="text-20 font-semibold text-gray-900 mb-4">
                                            Booking Details
                                        </h2>

                                        {/* Available Branches */}
                                        {branches.length > 0 && (
                                            <div>
                                                <h3 className="text-16 font-semibold text-gray-900 mb-4">
                                                    Available Branches
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {branches.map(branch => (
                                                        <button
                                                            key={branch.id}
                                                            type="button"
                                                            onClick={() =>
                                                                handleInputChange('selectedBranch', branch.id)
                                                            }
                                                            className={cn(
                                                                'px-4 py-3 rounded-xl border-2 text-14 font-medium text-gray-900 transition-colors',
                                                                formData.selectedBranch === branch.id
                                                                    ? 'border-brand-600 bg-brand-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            )}
                                                        >
                                                            {branch.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Available Staff */}
                                        {staff.length > 0 && (
                                            <div>
                                                <h3 className="text-16 font-semibold text-gray-900 mb-4">
                                                    Select Staff
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {staff.map(staffMember => (
                                                        <button
                                                            key={staffMember.id}
                                                            type="button"
                                                            onClick={() =>
                                                                handleInputChange('selectedStaff', staffMember.id)
                                                            }
                                                            className={cn(
                                                                'px-4 py-3 rounded-xl border-2 text-14 font-medium text-gray-900 transition-colors text-left',
                                                                formData.selectedStaff === staffMember.id
                                                                    ? 'border-brand-600 bg-brand-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium truncate">{staffMember.name}</div>
                                                                    {staffMember.role && (
                                                                        <div className="text-12 text-gray-500 truncate">{formatRole(staffMember.role)}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Select Your Package */}
                                        {packages.length > 0 && (
                                            <div>
                                                <h3 className="text-16 font-semibold text-gray-900 mb-4">
                                                    Select Your Package
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {packages.map(pkg => (
                                                        <button
                                                            key={pkg.id}
                                                            type="button"
                                                            onClick={() =>
                                                                handleInputChange('selectedPackage', pkg.id)
                                                            }
                                                            className={cn(
                                                                'px-4 py-4 rounded-xl border-2 text-left transition-colors',
                                                                formData.selectedPackage === pkg.id
                                                                    ? 'border-brand-600 bg-brand-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            )}
                                                        >
                                                            <div className="text-14 font-semibold text-gray-900 mb-1">
                                                                {pkg.title}
                                                            </div>
                                                            <div className="text-14 text-gray-600">
                                                                Price | {pkg.price.toLocaleString()}{' '}
                                                                {service.price.currency.toUpperCase()}
                                                            </div>
                                                            {pkg.description && (
                                                                <div className="text-12 text-gray-500 mt-1">
                                                                    {pkg.description}
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Package Details - Only show if upgrades are available */}
                                        {packageUpgrades.length > 0 && (
                                            <div>
                                                <h3 className="text-16 font-semibold text-gray-900 mb-4">
                                                    Package Details
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {packageUpgrades.map(upgrade => (
                                                        <button
                                                            key={upgrade.id}
                                                            type="button"
                                                            onClick={() => handleUpgradeToggle(upgrade.id)}
                                                            className={cn(
                                                                'px-4 py-4 rounded-xl border-2 text-left transition-colors',
                                                                formData.selectedUpgrades.includes(upgrade.id)
                                                                    ? 'border-brand-600 bg-brand-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            )}
                                                        >
                                                            <div className="text-14 font-semibold text-gray-900 mb-1">
                                                                {upgrade.title}
                                                            </div>
                                                            <div className="text-14 text-gray-600">
                                                                Price | {upgrade.price.toLocaleString()}{' '}
                                                                {service.price.currency.toUpperCase()}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Date & Time Selection Step */}
                                {step === 'datetime' && (
                                    <div className="space-y-6">
                                        {/* Date Selection */}
                                        <div>
                                            <h2 className="text-20 font-semibold text-gray-900 mb-4">Select Date</h2>
                                            {uniqueDates.length > 0 ? (
                                                <div className="flex gap-2 overflow-x-auto pb-2">
                                                    {uniqueDates.map((dateLabel) => {
                                                        const dateObj = new Date(dateLabel)
                                                        const isSelected = selectedDate === dateLabel
                                                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
                                                        const dayNum = dateObj.getDate()
                                                        const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' })

                                                        return (
                                                            <button
                                                                key={dateLabel}
                                                                onClick={() => handleDateSelect(dateLabel)}
                                                                className={cn(
                                                                    "flex-shrink-0 w-20 border-2 rounded-xl p-3 text-center transition-all",
                                                                    isSelected
                                                                        ? "border-brand-600 bg-brand-50"
                                                                        : "border-gray-200 hover:border-gray-300"
                                                                )}
                                                            >
                                                                <div className="text-12 text-gray-600 mb-1">{dayName}</div>
                                                                <div className="text-20 font-semibold text-gray-900">{dayNum}</div>
                                                                <div className="text-12 text-gray-600">{monthName}</div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex justify-center items-center py-8">
                                                    <LoadingSpinner size="md" text="Loading dates..." />
                                                </div>
                                            )}
                                        </div>

                                        {/* Time Selection */}
                                        <div>
                                            <h2 className="text-20 font-semibold text-gray-900 mb-4">Select Time</h2>
                                            {timeSlotsLoading ? (
                                                <div className="flex justify-center items-center py-8">
                                                    <LoadingSpinner size="md" text="Loading time slots..." />
                                                </div>
                                            ) : timeSlotsError ? (
                                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                                    <p className="text-14 text-red-800">
                                                        {timeSlotsError.message || 'Failed to load time slots'}
                                                    </p>
                                                </div>
                                            ) : timeSlots.length === 0 || !hasAvailableSlots ? (
                                                <div className="flex justify-center items-center py-8">
                                                    <div className="text-center">
                                                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-14 text-gray-600">
                                                            No time slots available for this date
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {timeSlots.filter(slot => slot.available).map((slot) => {
                                                        const isSelected = selectedSlotId === slot.id
                                                        return (
                                                            <button
                                                                key={`${slot.id}-${slot.start}`}
                                                                type="button"
                                                                onClick={() => handleTimeSlotSelect(slot)}
                                                                className={cn(
                                                                    'border-2 rounded-xl p-3 text-center transition-all text-14 font-medium',
                                                                    isSelected
                                                                        ? 'border-brand-600 bg-brand-50 text-brand-600'
                                                                        : 'border-gray-200 hover:border-gray-300 text-gray-900'
                                                                )}
                                                            >
                                                                {formatTime(new Date(slot.start))}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                            {errors.selectedTime && (
                                                <p className="text-12 text-red-500 mt-2">
                                                    {errors.selectedTime}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Confirmation Step */}
                                {step === 'confirm' && (
                                    <div className="space-y-6">
                                        <h2 className="text-20 font-semibold text-gray-900 mb-4">Review Your Booking</h2>
                                        <p className="text-14 text-gray-600">
                                            Please review your booking details on the right. Once you&apos;re ready, click &quot;Confirm Booking&quot; below to complete your appointment.
                                        </p>

                                        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                                                    <Check className="h-5 w-5 text-brand-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-16 font-semibold text-gray-900 mb-1">Almost Done!</h3>
                                                    <p className="text-14 text-gray-600">
                                                        Your appointment will be confirmed and you&apos;ll receive a confirmation message.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer - Continue/Confirm Button */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-14 text-gray-600">Total Price</p>
                                        <p className="text-24 font-semibold text-brand-600">
                                            {total.toLocaleString()}{' '}
                                            {service.price.currency.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="brand"
                                    size="lg"
                                    onClick={() => {
                                        console.log('🔵 Button clicked!')
                                        console.log('🔵 Current step:', step)
                                        console.log('🔵 Is submitting:', isSubmitting)
                                        if (step === 'confirm') {
                                            console.log('🔵 Calling handleConfirm...')
                                            handleConfirm()
                                        } else {
                                            console.log('🔵 Calling handleContinue...')
                                            handleContinue()
                                        }
                                    }}
                                    disabled={
                                        isSubmitting ||
                                        (step === 'datetime' && !formData.selectedTime) ||
                                        (step === 'confirm' && (!formData.selectedTime || !formData.acceptTerms))
                                    }
                                    className="w-full !text-white"
                                >
                                    {isSubmitting ? 'Processing...' : step === 'confirm' ? 'Confirm Booking' : 'Continue'}
                                </Button>
                                {step === 'confirm' && errors.selectedTime && (
                                    <p className="text-12 text-red-500 mt-2 text-center">
                                        {errors.selectedTime}
                                    </p>
                                )}
                                {step === 'confirm' && errors.acceptTerms && (
                                    <p className="text-12 text-red-500 mt-2 text-center">
                                        {errors.acceptTerms}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Booking Summary (Sticky) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                <h3 className="text-20 font-semibold text-gray-900">
                                    Booking Summary
                                </h3>

                                {/* Service Card */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <p className="text-14 font-medium text-gray-700 mb-3">Service</p>
                                    <div className="flex items-start gap-4">
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                            {service.images && service.images.length > 0 && service.images[0] && service.images[0].trim() !== '' ? (
                                                <Image
                                                    src={service.images[0]}
                                                    alt={service.title}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600">
                                                    <span className="text-white text-2xl font-semibold">
                                                        {service.title.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-16 font-semibold text-gray-900 mb-2">
                                                {service.title}
                                            </h4>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            'h-4 w-4',
                                                            star <= Math.floor(service.rating.value)
                                                                ? 'fill-brand-500 text-brand-500'
                                                                : star === Math.ceil(service.rating.value) &&
                                                                    service.rating.value % 1 !== 0
                                                                    ? 'fill-brand-500/50 text-brand-500'
                                                                    : 'fill-gray-200 text-gray-200'
                                                        )}
                                                    />
                                                ))}
                                                <span className="text-14 text-gray-600 ml-1">
                                                    {service.rating.value} ({service.rating.count})
                                                </span>
                                            </div>
                                            <p className="text-14 text-gray-600">
                                                {service.provider.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Summary - Services and Totals */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    {/* Service count indicator */}
                                    <p className="text-12 text-gray-500 mb-4">1 service selected</p>

                                    <h3 className="text-18 font-semibold text-gray-900 mb-4">Booking Summary</h3>

                                    {/* Services Section */}
                                    <div className="mb-4">
                                        <p className="text-14 font-medium text-gray-700 mb-3">Services</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-14 text-gray-900 mb-1">
                                                        {service.title}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-12 text-gray-600">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{serviceDuration} min</span>
                                                    </div>
                                                </div>
                                                <div className="text-14 font-semibold text-gray-900 ml-4">
                                                    {service.price.currency.toUpperCase()} {subtotal.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Details - Show when staff, branch, package, or time slot is selected */}
                                    {(formData.selectedBranch || formData.selectedStaff || formData.selectedPackage || formData.selectedTime || selectedSlotId) && (
                                        <div className="mb-4 pt-4 border-t border-gray-200">
                                            <p className="text-14 font-medium text-gray-700 mb-3">Booking Details</p>
                                            <div className="space-y-2">
                                                {/* Branch */}
                                                {formData.selectedBranch && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-12 text-gray-600">Branch</span>
                                                        <span className="text-12 text-gray-900 font-medium">
                                                            {branches.find(b => b.id === formData.selectedBranch)?.name || 'N/A'}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Staff */}
                                                {formData.selectedStaff && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-12 text-gray-600">Staff</span>
                                                        <span className="text-12 text-gray-900 font-medium">
                                                            {staff.find(s => s.id === formData.selectedStaff)?.name || 'N/A'}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Package */}
                                                {formData.selectedPackage && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-12 text-gray-600">Package</span>
                                                        <span className="text-12 text-gray-900 font-medium">
                                                            {packages.find(p => p.id === formData.selectedPackage)?.title || 'N/A'}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Date & Time */}
                                                {(formData.selectedTime || selectedSlotId) && (() => {
                                                    const selectedSlot = selectedSlotId ? timeSlots.find(slot => slot.id === selectedSlotId) : null
                                                    const slotDate = selectedSlot ? new Date(selectedSlot.start) : (formData.selectedDate ? new Date(formData.selectedDate) : null)
                                                    const slotTime = selectedSlot ? formatTime(new Date(selectedSlot.start)) : formData.selectedTime
                                                    const formattedDate = slotDate ? formatDate(slotDate) : formData.selectedDate

                                                    return (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-12 text-gray-600">Date & Time</span>
                                                            <div className="text-right">
                                                                {formattedDate && (
                                                                    <span className="text-12 text-gray-900 font-medium block">{formattedDate}</span>
                                                                )}
                                                                {slotTime && (
                                                                    <span className="text-12 text-gray-600">{slotTime}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Summary Totals */}
                                    <div className="pt-4 border-t border-gray-200 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-14 text-gray-600">Duration</span>
                                            <span className="text-14 font-semibold text-gray-900">
                                                {serviceDuration} min
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-14 font-medium text-gray-900">Total</span>
                                            <span className="text-18 font-semibold text-red-600">
                                                {service.price.currency.toUpperCase()} {total.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms & Conditions - Only show on confirm step */}
                                {step === 'confirm' && (
                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                        <div className="flex items-start gap-3 mb-3">
                                            <Checkbox
                                                checked={formData.acceptTerms}
                                                onChange={checked =>
                                                    handleInputChange('acceptTerms', checked)
                                                }
                                                variant={errors.acceptTerms ? 'error' : 'default'}
                                            />
                                            <label className="text-14 text-gray-900 cursor-pointer">
                                                I Accept Terms & Conditions
                                            </label>
                                        </div>
                                        {errors.acceptTerms && (
                                            <p className="text-12 text-red-500 ml-8 mb-2">
                                                {errors.acceptTerms}
                                            </p>
                                        )}
                                        <p className="text-12 text-gray-600 leading-relaxed ml-8">
                                            If you are not around when the delivery person arrives, they
                                            will leave your order at the door. By placing your order, you
                                            agree to take full responsibility for it once it&apos;s
                                            delivered.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Processing Modal */}
            <ProcessingModal
                isOpen={showProcessingModal}
                title="Processing Reservation"
                message="Reservation creation queued. Processing..."
                onClose={() => {
                    // Only allow closing if not actively processing
                    if (queueStatus === 'failed' || queueStatus === 'completed') {
                        setShowProcessingModal(false)
                    }
                }}
                closeOnOverlayClick={false}
            />
        </div>
    )
}

