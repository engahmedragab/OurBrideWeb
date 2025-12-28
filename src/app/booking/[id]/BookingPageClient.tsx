'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
    User,
    Phone,
    Tag,
    Diamond,
    Gift,
    Calendar,
    Star,
    Users,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { DatePicker } from '@/components/ui/DatePicker'
import { LoadingSpinner, ErrorDisplay } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Service } from '@/types/service'
import { useServiceDetail, useServicePackages } from '@/hooks/services'
import { getServiceById } from '@/services/api/serviceApi'
import { createReservation, getAvailableTimeSlots } from '@/services/api/reservationApi'
import type { ReservationRequest } from '@/../client/common/api/gen/ourbride-api'
import type { ServiceResponse } from '@/types/responses/service-response'
import type { ServicePlaceAssignmentResponse } from '@/types/responses/service-place-assignment-response'
import type { ServiceStaffAssignmentResponse } from '@/types/responses/service-staff-assignment-response'
import type { TimeSlotResponse } from '@/types/responses/time-slot-response'
import { AvailabilityStatus } from '@/types/responses/common'
import { useAuthContext } from '@/auth/context/AuthContext'
import { getUser } from '@/auth/utils/token'

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
    const { user } = useAuthContext()

    // Fetch raw service response for full data access
    const [rawServiceResponse, setRawServiceResponse] = useState<ServiceResponse | null>(null)

    // Fetch service detail
    const {
        data: serviceDetailData,
        isLoading: serviceLoading,
        error: serviceError,
    } = useServiceDetail(serviceId, !!serviceId)

    const service = serviceDetailData?.service

    // Fetch raw service response in parallel
    useEffect(() => {
        if (serviceId) {
            const parsedId = parseInt(serviceId, 10)
            if (!isNaN(parsedId)) {
                getServiceById(parsedId)
                    .then((response: ServiceResponse | null) => {
                        if (response) {
                            setRawServiceResponse(response)
                        }
                    })
                    .catch((error: unknown) => {
                        console.error('Error fetching raw service response:', error)
                    })
            }
        }
    }, [serviceId])

    // Fetch service packages
    const {
        data: packagesData,
        isLoading: packagesLoading,
    } = useServicePackages(serviceId, !!serviceId)

    const servicePackages = packagesData?.packages || []

    // Map service packages to Package format
    const packages: Package[] = useMemo(() => {
        return servicePackages.map((pkg) => ({
            id: pkg.id,
            title: pkg.name,
            price: pkg.price,
            description: pkg.description,
        }))
    }, [servicePackages])

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
            role: assignment.staffRole,
        }))
    }, [rawServiceResponse])

    // Package upgrades - removed as not available in API
    // If needed in future, can be added as a separate API call
    const packageUpgrades: PackageUpgrade[] = []

    // State for time slot selector
    const [is12Hour, setIs12Hour] = useState(true)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedSlotId, setSelectedSlotId] = useState<number | undefined>(undefined)

    // State for dynamically fetched time slots
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [timeSlotsLoading, setTimeSlotsLoading] = useState(false)
    const [timeSlotsError, setTimeSlotsError] = useState<Error | null>(null)

    // Get user data from both context and localStorage (fallback)
    const userFromStorage = typeof window !== 'undefined' ? getUser() : null
    const currentUser = user || userFromStorage

    // Helper function to extract user name
    const getUserName = (userData: typeof currentUser): string => {
        if (!userData) return ''
        const userAny = userData as any
        // Check for fullName (AuthUser)
        if (userAny.fullName) return userAny.fullName
        // Check for firstName + lastName (UserResponse)
        if (userAny.firstName && userAny.lastName) {
            return `${userAny.firstName} ${userAny.lastName}`.trim()
        }
        // Fallback to userName
        return userAny.userName || ''
    }

    // Helper function to extract phone number
    const getUserPhone = (userData: typeof currentUser): string => {
        if (!userData) return ''
        const userAny = userData as any
        return userAny.phoneNumber || ''
    }

    // Initialize form data with user data if available
    const getInitialFormData = (): BookingFormData => {
        return {
            fullName: getUserName(currentUser),
            mobileNumber: getUserPhone(currentUser),
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

    // Update form data when user changes
    useEffect(() => {
        const updatedUser = user || (typeof window !== 'undefined' ? getUser() : null)
        if (updatedUser) {
            const fullName = getUserName(updatedUser)
            const phoneNumber = getUserPhone(updatedUser)

            if (fullName || phoneNumber) {
                setFormData(prev => ({
                    ...prev,
                    fullName: fullName || prev.fullName,
                    mobileNumber: phoneNumber || prev.mobileNumber,
                }))
            }
        }
    }, [user])

    // Fetch time slots when service, branch, staff, or date changes
    useEffect(() => {
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

                // Use currentDate for startDate if available
                if (currentDate) {
                    options.startDate = currentDate.toISOString()
                }

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
                console.error('Error fetching time slots:', error)
                setTimeSlotsError(error instanceof Error ? error : new Error('Failed to fetch time slots'))
                setTimeSlots([])
            } finally {
                setTimeSlotsLoading(false)
            }
        }

        fetchTimeSlots()
    }, [serviceId, formData.selectedBranch, formData.selectedStaff, currentDate])

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

    // Get period label (morning, afternoon, evening)
    const getPeriodLabel = (date: Date) => {
        const hour = date.getHours()
        if (hour < 12) return 'Morning'
        if (hour < 17) return 'Afternoon'
        return 'Evening'
    }

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

    // Group slots by period
    const groupedByPeriod = useMemo(() => {
        const grouped: Record<string, TimeSlot[]> = {}
        filteredSlots.forEach((slot) => {
            const label = getPeriodLabel(new Date(slot.start))
            if (!grouped[label]) grouped[label] = []
            grouped[label].push(slot)
        })
        return grouped
    }, [filteredSlots])

    // Check if there are available slots
    const hasAvailableSlots = useMemo(() => {
        return filteredSlots.some((slot) => slot.available)
    }, [filteredSlots])

    // Handle date selection
    const handleDateSelect = (dateLabel: string) => {
        setSelectedDate(dateLabel)
        // Parse date and update currentDate if needed
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
                if (selectedDateObj < new Date()) {
                    selectedDateObj.setFullYear(currentYear + 1)
                }
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
    const fetchNextDays = () => {
        const nextDate = new Date(currentDate)
        nextDate.setDate(nextDate.getDate() + 7)
        setCurrentDate(nextDate)
    }

    const fetchPreviousDays = () => {
        const prevDate = new Date(currentDate)
        prevDate.setDate(prevDate.getDate() - 7)
        setCurrentDate(prevDate)
    }

    // Update form data when packages are loaded
    useEffect(() => {
        if (packages.length > 0 && !formData.selectedPackage) {
            setFormData(prev => ({
                ...prev,
                selectedPackage: packages[0]?.id || '',
            }))
        }
    }, [packages, formData.selectedPackage])

    // Update form data when branches are loaded
    useEffect(() => {
        if (branches.length > 0 && !formData.selectedBranch) {
            setFormData(prev => ({
                ...prev,
                selectedBranch: branches[0]?.id || '',
            }))
        }
    }, [branches, formData.selectedBranch])

    // Update form data when staff are loaded
    useEffect(() => {
        if (staff.length > 0 && !formData.selectedStaff) {
            setFormData(prev => ({
                ...prev,
                selectedStaff: staff[0]?.id || '',
            }))
        }
    }, [staff, formData.selectedStaff])

    const [errors, setErrors] = useState<Record<string, string>>({})

    const selectedPackageData = packages.find(
        p => p.id === formData.selectedPackage
    )
    const selectedUpgradesData = packageUpgrades.filter(u =>
        formData.selectedUpgrades.includes(u.id)
    )

    const subtotal =
        (selectedPackageData?.price || 0) +
        selectedUpgradesData.reduce((sum, u) => sum + u.price, 0)
    const taxes = 120
    const deliveryFee = 90
    const total = subtotal + taxes + deliveryFee

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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
        }
        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required'
        }
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

    const handleConfirm = async () => {
        if (!validateForm()) {
            return
        }

        if (!service || !serviceId) {
            return
        }

        setIsSubmitting(true)

        try {
            // Prepare reservation request
            const providerId = rawServiceResponse?.providerId || (service.provider?.id ? parseInt(service.provider.id, 10) : undefined)

            // Get selected time slot to extract proper date/time
            const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId)
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
                        let selectedDateObj = new Date(currentYear, monthIndex, parseInt(day))
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

            const reservationRequest: ReservationRequest = {
                serviceId: parseInt(serviceId, 10),
                providerId: providerId || undefined,
                branchId: formData.selectedBranch ? parseInt(formData.selectedBranch, 10) : undefined,
                staffId: formData.selectedStaff ? (parseInt(formData.selectedStaff, 10) || undefined) : undefined,
                servicePackageId: formData.selectedPackage ? parseInt(formData.selectedPackage, 10) : undefined,
                reservationSlotId: selectedSlotId ? Number(selectedSlotId) : undefined,
                requestedStartTime,
                reservationDate,
                notes: `Name: ${formData.fullName}, Phone: ${formData.mobileNumber}${formData.promoCode ? `, Promo Code: ${formData.promoCode}` : ''}`,
                depositAmount: rawServiceResponse?.deposit || undefined,
            }

            // Create reservation
            await createReservation(reservationRequest)

            // Navigate to cart
            router.push('/cart')
        } catch (error) {
            console.error('Error creating reservation:', error)
            alert(error instanceof Error ? error.message : 'Failed to create reservation. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Show loading state
    if (serviceLoading || packagesLoading) {
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
                    <div className="container-custom py-6 md:py-8">
                        <ErrorDisplay
                            title="Service Not Found"
                            message={
                                !serviceId
                                    ? 'Please provide a service ID in the URL'
                                    : serviceError instanceof Error
                                        ? serviceError.message
                                        : 'Failed to load service details. Please try again.'
                            }
                            actionLabel="Reload"
                            onAction={() => window.location.reload()}
                        />
                    </div>
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
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1">
                <div className="container-custom py-6 md:py-8">
                    <h1 className="text-24 md:text-32 font-semibold text-gray-900 mb-6 md:mb-8">
                        Booking Details
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Left Column - Booking Details */}
                        <div className="w-full lg:w-[60%] lg:flex-shrink-0 space-y-6">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-16 font-semibold text-gray-900 mb-4">
                                    Personal Information
                                </h3>
                                <div className="space-y-4">
                                    <Input
                                        prefixIcon={User}
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={e =>
                                            handleInputChange('fullName', e.target.value)
                                        }
                                        errorMessage={errors.fullName}
                                        variant={errors.fullName ? 'error' : 'default'}
                                    />
                                    <Input
                                        prefixIcon={Phone}
                                        placeholder="Mobile Number"
                                        value={formData.mobileNumber}
                                        onChange={e =>
                                            handleInputChange('mobileNumber', e.target.value)
                                        }
                                        errorMessage={errors.mobileNumber}
                                        variant={errors.mobileNumber ? 'error' : 'default'}
                                    />
                                </div>
                            </div>

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
                                                    'px-4 py-3 rounded-lg border-2 text-14 font-medium text-gray-900 transition-colors',
                                                    formData.selectedBranch === branch.id
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-gray-300 hover:border-gray-400'
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
                                                    'px-4 py-3 rounded-lg border-2 text-14 font-medium text-gray-900 transition-colors text-left',
                                                    formData.selectedStaff === staffMember.id
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate">{staffMember.name}</div>
                                                        {staffMember.role && (
                                                            <div className="text-12 text-gray-500 truncate">{staffMember.role}</div>
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
                                                    'px-4 py-4 rounded-lg border-2 text-left transition-colors',
                                                    formData.selectedPackage === pkg.id
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-gray-300 hover:border-gray-400'
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
                                                    'px-4 py-4 rounded-lg border-2 text-left transition-colors',
                                                    formData.selectedUpgrades.includes(upgrade.id)
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-gray-300 hover:border-gray-400'
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

                            {/* Available Times */}
                            <div className="flex flex-col gap-3 border rounded-lg p-4 bg-white">
                                <div className="border-b pb-2">
                                    <h3 className="text-16 font-semibold text-gray-900">
                                        Available Times
                                    </h3>
                                </div>

                                {/* Time Format Toggle */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-14 font-medium text-gray-700">
                                        Time Format
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIs12Hour(true)}
                                            className={cn(
                                                'px-4 py-2 rounded-lg text-14 font-medium transition-colors',
                                                is12Hour
                                                    ? 'bg-brand-500 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            )}
                                        >
                                            12 Hour
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIs12Hour(false)}
                                            className={cn(
                                                'px-4 py-2 rounded-lg text-14 font-medium transition-colors',
                                                !is12Hour
                                                    ? 'bg-brand-500 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            )}
                                        >
                                            24 Hour
                                        </button>
                                    </div>
                                </div>

                                {/* Select a Day */}
                                {uniqueDates.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-14 font-medium text-gray-700">
                                            Select a Day
                                        </label>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            <Button
                                                variant="outline"
                                                onClick={fetchPreviousDays}
                                                className="flex-shrink-0"
                                            >
                                                Back
                                            </Button>
                                            {uniqueDates.map((dateLabel) => (
                                                <Button
                                                    key={dateLabel}
                                                    variant={dateLabel === selectedDate ? 'default' : 'outline'}
                                                    onClick={() => handleDateSelect(dateLabel)}
                                                    className="flex-shrink-0"
                                                >
                                                    {dateLabel}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="outline"
                                                onClick={fetchNextDays}
                                                className="flex-shrink-0"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Available Time Slots */}
                                {timeSlotsLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <LoadingSpinner size="md" text="Loading time slots..." />
                                    </div>
                                ) : timeSlotsError ? (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-14 text-red-800">
                                            {timeSlotsError.message || 'Failed to load time slots'}
                                        </p>
                                    </div>
                                ) : timeSlots.length === 0 ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="text-center">
                                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-14 text-gray-600">
                                                No time slots available
                                            </p>
                                        </div>
                                    </div>
                                ) : !hasAvailableSlots ? (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-14 text-yellow-800">
                                            No available slots for this date
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <label className="text-14 font-medium text-gray-700">
                                            Available Slots
                                        </label>
                                        {Object.entries(groupedByPeriod).map(([periodLabel, slots]) => (
                                            <div key={periodLabel} className="flex flex-col gap-2">
                                                <h6 className="text-14 font-semibold text-gray-900">
                                                    {periodLabel}
                                                </h6>
                                                <div className="flex flex-wrap gap-2">
                                                    {slots.map((slot) => {
                                                        const isSelected = selectedSlotId === slot.id
                                                        const isAvailable = slot.available

                                                        return (
                                                            <button
                                                                key={`${slot.id}-${slot.start}`}
                                                                type="button"
                                                                disabled={!isAvailable}
                                                                onClick={() => handleTimeSlotSelect(slot)}
                                                                className={cn(
                                                                    'px-4 py-2 rounded-lg text-14 font-medium transition-colors',
                                                                    isSelected
                                                                        ? 'bg-brand-500 text-white border-2 border-brand-600'
                                                                        : isAvailable
                                                                            ? 'bg-white border-2 border-gray-300 text-gray-900 hover:border-brand-500'
                                                                            : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                                                                )}
                                                            >
                                                                {formatTime(new Date(slot.start))}
                                                                {isSelected && (
                                                                    <span className="ml-2">✓</span>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {errors.selectedTime && (
                                    <p className="text-12 text-red-500 mt-2">
                                        {errors.selectedTime}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Booking Summary */}
                        <div className="w-full lg:w-[40%] lg:flex-shrink-0 space-y-6">
                            <h3 className="text-20 font-semibold text-gray-900">
                                Booking Summary
                            </h3>

                            {/* Service Card */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
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
                                                {service.rating.value} Rated By ({service.rating.count}
                                                ) Users
                                            </span>
                                        </div>
                                        <p className="text-14 text-gray-600">
                                            Provider: {service.provider.name}
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* Price Breakdown */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-14 text-gray-600">Subtotal</span>
                                        <span className="text-14 font-semibold text-gray-900">
                                            {subtotal.toLocaleString()}{' '}
                                            {service.price.currency.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-14 text-gray-600">Taxes & Fees</span>
                                        <span className="text-14 font-semibold text-gray-900">
                                            {taxes.toLocaleString()}{' '}
                                            {service.price.currency.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-14 text-gray-600">Delivery Fee</span>
                                        <span className="text-14 font-semibold text-gray-900">
                                            {deliveryFee.toLocaleString()}{' '}
                                            {service.price.currency.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-16 font-semibold text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-16 font-semibold text-gray-900">
                                            {total.toLocaleString()}{' '}
                                            {service.price.currency.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div>
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
                                    <p className="text-12 text-red-500 ml-8">
                                        {errors.acceptTerms}
                                    </p>
                                )}
                                <p className="text-12 text-gray-600 leading-relaxed">
                                    If you are not around when the delivery person arrives, they
                                    will leave your order at the door. by placing your order, you
                                    agree to take full responsibility for it once it&apos;s
                                    delivered.
                                </p>
                            </div>

                            {/* Confirm Booking Button */}
                            <Button
                                variant="default"
                                size="lg"
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className={cn(
                                    'w-full h-12 rounded-lg font-normal text-white',
                                    'bg-brand-500 hover:bg-brand-600',
                                    'transition-colors',
                                    isSubmitting && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

