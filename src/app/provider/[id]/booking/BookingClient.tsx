'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Check,
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  User,
  MapPin,
  Star,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, ErrorDisplay } from '@/components/ui'
import { getAvailableTimeSlots, getAvailableTimeSlotsForMultipleServices } from '@/services/api/reservationApi'
import type { TimeSlotResponse } from '@/types/responses'
import { cn } from '@/lib/utils'
import { formatRole } from '@/utils/role'
import { useServicesByProviderId } from '@/hooks/services/useServicesByProviderId'
import { useProviderPublicProfile } from '@/hooks/providers/useProviderPublicProfile'
import { useProviderTeamUsers, useProviderBranches } from '@/hooks/providers/useProviderPortfolio'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import Image from 'next/image'
import type { ServiceResponse } from '@/types/responses'
import type { PlaceResponse } from '@/types/responses'

interface BookingClientProps {
  providerId: string
  preSelectedServiceId?: string
}

// All data now comes from API - no mock data needed

// Generate time slots for bridal salon (10 AM - 10 PM)
// Generate dates for next 14 days
const generateDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }
  return dates
}

export function BookingClient({ providerId, preSelectedServiceId }: BookingClientProps) {
  const router = useRouter()
  const [step, setStep] = useState<'service' | 'team' | 'datetime' | 'confirm'>('service')
  const [selectedServices, setSelectedServices] = useState<string[]>(
    preSelectedServiceId ? [preSelectedServiceId] : []
  )
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('any')
  const [selectedBranch, setSelectedBranch] = useState<string>('any')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [dates] = useState(generateDates())
  const [timeSlots, setTimeSlots] = useState<TimeSlotResponse[]>([])
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [timeSlotsError, setTimeSlotsError] = useState<Error | null>(null)
  const [serviceDurations, setServiceDurations] = useState<Map<string, number>>(new Map())

  // Fetch services by provider ID from API
  const { data: servicesData, isLoading: isLoadingServices, error: servicesError } = useServicesByProviderId(parseInt(providerId))

  // Fetch provider data for the summary card
  const { data: providerData, isLoading: isLoadingProvider } = useProviderPublicProfile(parseInt(providerId))

  // Fetch all provider team users (for when multiple services are selected)
  const { data: allTeamUsers } = useProviderTeamUsers(
    parseInt(providerId),
    { enabled: selectedServices.length > 1 }
  )

  // Fetch all provider branches (for when multiple services are selected)
  const { data: allBranches } = useProviderBranches(
    parseInt(providerId),
    { enabled: selectedServices.length > 1 }
  )

  // Also fetch all team users and branches when multiple services are selected (to ensure they're available)
  // This ensures we have all options available even if the data hasn't loaded yet

  // Store full service data to access serviceStaffAssignments
  // MUST be called before any conditional returns to follow Rules of Hooks
  const servicesMap = React.useMemo(() => {
    const map = new Map<string, ServiceResponse>()
      ; (servicesData || []).forEach((service: ServiceResponse) => {
        map.set(service.id.toString(), service)
      })
    return map
  }, [servicesData])

  // Get team members from selected services' serviceStaffAssignments or all provider team users
  // MUST be called before any conditional returns to follow Rules of Hooks
  const team = React.useMemo(() => {
    const teamMembersMap = new Map<string, { id: string; name: string; rating: number | null; role: string | null }>()

    // If no services selected, return only "Any Available"
    if (selectedServices.length === 0) {
      return [
        { id: 'any', name: 'Any Available', rating: null as number | null, role: null as string | null },
      ]
    }

    // If more than one service is selected, use all provider team users
    if (selectedServices.length > 1 && allTeamUsers && allTeamUsers.length > 0) {
      allTeamUsers.forEach((user: any) => {
        const userId = user.id?.toString() || user.providerUserAssignmentId?.toString() || user.userId || ''
        const userName = user.providerName || user.name || user.user?.name || user.staffName || `Staff ${user.id || ''}`
        const userRole = user.role?.name || user.roleKey || user.staffRole || null

        if (userId && !teamMembersMap.has(userId)) {
          teamMembersMap.set(userId, {
            id: userId,
            name: userName,
            rating: null,
            role: formatRole(userRole),
          })
        }
      })
    } else {
      // If only one service is selected, use serviceStaffAssignments from that service
      selectedServices.forEach((serviceId) => {
        const service = servicesMap.get(serviceId)
        if (service?.serviceStaffAssignments && service.serviceStaffAssignments.length > 0) {
          service.serviceStaffAssignments.forEach((assignment) => {
            const staffId = assignment.staffId?.toString() || assignment.id.toString()
            const staffName = assignment.staffName || assignment.staffEmail || `Staff ${assignment.id}`

            // Only add if not already in map (to avoid duplicates)
            if (!teamMembersMap.has(staffId)) {
              teamMembersMap.set(staffId, {
                id: staffId,
                name: staffName,
                rating: null, // Rating not available in ServiceStaffAssignmentResponse
                role: formatRole(assignment.staffRole),
              })
            }
          })
        }
      })
    }

    // Convert map to array and add "Any Available" option at the beginning
    const teamMembers = Array.from(teamMembersMap.values())
    return [
      { id: 'any', name: 'Any Available', rating: null as number | null, role: null as string | null },
      ...teamMembers,
    ]
  }, [selectedServices, servicesMap, allTeamUsers])

  // Get branches from selected services' servicePlaceAssignments or all provider branches
  // MUST be called before any conditional returns to follow Rules of Hooks
  const branches = React.useMemo(() => {
    const branchesMap = new Map<string, { id: string; name: string; address: string }>()

    // If no services selected, return only "Any Available"
    if (selectedServices.length === 0) {
      return [
        { id: 'any', name: 'Any Available', address: '' },
      ]
    }

    // If more than one service is selected, use ALL provider branches
    if (selectedServices.length > 1) {
      if (allBranches && allBranches.length > 0) {
        allBranches.forEach((branch: PlaceResponse) => {
          const branchId = branch.id?.toString() || ''
          const branchName = branch.nameEn || branch.nameAr || `Branch ${branch.id}`
          const branchAddress = branch.address?.fullAddress || branch.address?.displayAddress || branch.address?.addressEn || branch.address?.addressAr || ''

          if (branchId && !branchesMap.has(branchId)) {
            branchesMap.set(branchId, {
              id: branchId,
              name: branchName,
              address: branchAddress,
            })
          }
        })
      }
    } else {
      // If only one service is selected, use servicePlaceAssignments from that service
      selectedServices.forEach((serviceId) => {
        const service = servicesMap.get(serviceId)
        if (service?.servicePlaceAssignments && service.servicePlaceAssignments.length > 0) {
          service.servicePlaceAssignments.forEach((assignment) => {
            if (assignment.place) {
              const placeId = assignment.placeId?.toString() || assignment.place.id?.toString() || assignment.id.toString()
              const placeName = assignment.place.nameEn || assignment.place.nameAr || `Branch ${assignment.placeId}`
              const placeAddress = assignment.place.address?.fullAddress || assignment.place.address?.displayAddress || assignment.place.address?.addressEn || assignment.place.address?.addressAr || ''

              // Only add if not already in map (to avoid duplicates)
              if (!branchesMap.has(placeId)) {
                branchesMap.set(placeId, {
                  id: placeId,
                  name: placeName,
                  address: placeAddress,
                })
              }
            }
          })
        }
      })
    }

    // Convert map to array and add "Any Available" option at the beginning
    const branchesList = Array.from(branchesMap.values())

    // If we have actual branches (not just "Any Available"), return them with "Any Available" option
    if (branchesList.length > 0) {
      return [
        { id: 'any', name: 'Any Available', address: '' },
        ...branchesList,
      ]
    }

    // If no branches found, still return "Any Available" option
    return [
      { id: 'any', name: 'Any Available', address: '' },
    ]
  }, [selectedServices, servicesMap, allBranches])

  // Map services from API (ServiceResponse[]) to the format needed by the component
  // MUST be called before any conditional returns to follow Rules of Hooks
  const services = React.useMemo(() => {
    return (servicesData || []).map((service: ServiceResponse) => {
      // Get duration from serviceDurations map (calculated from time slots), or use default
      const serviceId = service.id.toString()
      const duration = serviceDurations.get(serviceId) || 60 // Default 60 minutes if not yet calculated from slots

      // Get price - prefer saleBuyPrice or saleRentPrice, fallback to buyPrice or rentPrice
      const price = service.saleBuyPrice || service.saleRentPrice || service.buyPrice || service.rentPrice || 0

      // Get service name (ServiceResponse extends BaseLookupResponse which has nameEn and nameAr)
      const name = service.nameEn || service.nameAr || 'Service'

      return {
        id: serviceId,
        name,
        duration,
        price,
        currency: 'EGP', // Default currency, adjust if available in ServiceResponse
      }
    })
  }, [servicesData, serviceDurations])

  // Reset team member selection when services change
  // MUST be called before any conditional returns to follow Rules of Hooks
  React.useEffect(() => {
    if (step === 'team' && team.length > 0) {
      // If current selection is not in available team members, reset to 'any'
      const isCurrentSelectionValid = team.some(m => m.id === selectedTeamMember)
      if (!isCurrentSelectionValid) {
        setSelectedTeamMember('any')
      }
    }
  }, [selectedServices, team, step, selectedTeamMember])

  // Reset branch selection when services change
  // MUST be called before any conditional returns to follow Rules of Hooks
  React.useEffect(() => {
    if (branches.length > 0) {
      // If current selection is not in available branches, reset to 'any'
      const isCurrentSelectionValid = branches.some(b => b.id === selectedBranch)
      if (!isCurrentSelectionValid) {
        setSelectedBranch('any')
      }
      // If only "Any Available" is an option, auto-select it
      if (branches.length === 1 && branches[0].id === 'any' && selectedBranch !== 'any') {
        setSelectedBranch('any')
      }
    }
  }, [selectedServices, branches, selectedBranch])

  // Fetch time slots when moving to datetime step or when dependencies change
  // MUST be called before any conditional returns to follow Rules of Hooks
  React.useEffect(() => {
    const fetchTimeSlots = async () => {
      // Only fetch when we're on datetime step and have selected services
      if (step !== 'datetime' || selectedServices.length === 0) {
        setTimeSlots([])
        return
      }

      setIsLoadingTimeSlots(true)
      setTimeSlotsError(null)

      try {
        // Get branchId and staffId from selections
        const branchId = selectedBranch !== 'any' ? parseInt(selectedBranch, 10) : undefined
        const staffId = selectedTeamMember !== 'any' ? parseInt(selectedTeamMember, 10) : undefined

        // Format startDate as ISO string
        const startDate = selectedDate.toISOString()

        let slots: TimeSlotResponse[] = []

        if (selectedServices.length > 1) {
          // Multiple services - use getAvailableTimeSlotsForMultipleServices
          const serviceIds = selectedServices.map(id => parseInt(id, 10))
          slots = await getAvailableTimeSlotsForMultipleServices({
            serviceIds,
            branchId: branchId || null,
            staffId: staffId || null,
            startDate: startDate || null,
          })
        } else if (selectedServices.length === 1) {
          // Single service - use getAvailableTimeSlots
          const serviceId = parseInt(selectedServices[0], 10)
          slots = await getAvailableTimeSlots(serviceId, {
            branchId,
            staffId,
            startDate,
          })
        }

        // Calculate service durations from slots and update serviceDurations map
        const durationsMap = new Map<string, number>()
        slots.forEach((slot) => {
          if (slot.serviceId) {
            const serviceId = slot.serviceId.toString()
            // Calculate duration from start and end times
            const startTime = new Date(slot.start)
            const endTime = new Date(slot.end)
            const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

            // Store the duration for this service (use the first slot's duration or average if multiple)
            if (!durationsMap.has(serviceId) || durationsMap.get(serviceId)! === 0) {
              durationsMap.set(serviceId, durationMinutes)
            }
          }
        })

        // Update service durations state
        setServiceDurations(prev => {
          const updated = new Map(prev)
          durationsMap.forEach((duration, serviceId) => {
            updated.set(serviceId, duration)
          })
          return updated
        })

        // Use slots directly from backend (all calculations done in backend)
        // Sort by start time
        slots.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

        setTimeSlots(slots)
      } catch (error) {
        console.error('Error fetching time slots:', error)
        setTimeSlotsError(error instanceof Error ? error : new Error('Failed to fetch time slots'))
        setTimeSlots([])
      } finally {
        setIsLoadingTimeSlots(false)
      }
    }

    fetchTimeSlots()
  }, [step, selectedServices, selectedBranch, selectedTeamMember, selectedDate])

  // Regular functions - defined after hooks but before conditional returns
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const calculateDuration = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service?.duration || 0)
    }, 0)
  }

  const handleContinue = () => {
    if (step === 'service' && selectedServices.length > 0) {
      setStep('team')
      // Reset team member selection when moving to team step
      // If only "Any Available" is available, auto-select it
      if (team.length === 1 && team[0].id === 'any') {
        setSelectedTeamMember('any')
      } else if (!team.some(m => m.id === selectedTeamMember)) {
        setSelectedTeamMember('any')
      }
    } else if (step === 'team') {
      setStep('datetime')
    } else if (step === 'datetime' && selectedTime) {
      setStep('confirm')
    }
  }

  const handleConfirmBooking = () => {
    // Add to cart or proceed to checkout
    router.push('/cart')
  }

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
    }
  }

  const isLoading = isLoadingServices || isLoadingProvider
  const error = servicesError

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <ErrorDisplay
            title="Services not found"
            message="Unable to load services. Please try again later."
            actionLabel="Back to Providers"
            actionHref="/providers"
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (step === 'service') {
                    router.back()
                  } else if (step === 'team') {
                    setStep('service')
                  } else if (step === 'datetime') {
                    setStep('team')
                  } else if (step === 'confirm') {
                    setStep('datetime')
                  }
                }}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors !text-white"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-24 font-semibold text-gray-900">Book Appointment</h1>
                <p className="text-14 text-gray-600">
                  {step === 'service' && 'Select Services'}
                  {step === 'team' && 'Choose Team Member'}
                  {step === 'datetime' && 'Pick Date & Time'}
                  {step === 'confirm' && 'Confirm Booking'}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors !text-white"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {['service', 'team', 'datetime', 'confirm'].map((s, index) => (
              <React.Fragment key={s}>
                <div
                  className={cn(
                    "flex-1 h-2 rounded-full transition-colors",
                    ['service', 'team', 'datetime', 'confirm'].indexOf(step) >= index
                      ? "bg-brand-600"
                      : "bg-gray-200"
                  )}
                />
              </React.Fragment>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className={cn(
              "lg:col-span-2",
              selectedServices.length === 0 && "lg:col-span-3"
            )}>
              {/* Content */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                {/* Service Selection */}
                {step === 'service' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-20 font-semibold text-gray-900 mb-4">Select Services</h2>
                      {services.length > 0 ? (
                        <div className="space-y-3">
                          {services.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => toggleService(service.id)}
                              className={cn(
                                "w-full border-2 rounded-xl p-4 text-left transition-all",
                                selectedServices.includes(service.id)
                                  ? "border-brand-600 bg-brand-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="text-16 font-semibold text-gray-900 mb-1">
                                    {service.name}
                                  </h3>
                                  <div className="flex items-center gap-3 text-14 text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {service.duration} min
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {service.currency} {service.price}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                    selectedServices.includes(service.id)
                                      ? "border-brand-600 bg-brand-600"
                                      : "border-gray-300"
                                  )}
                                >
                                  {selectedServices.includes(service.id) && (
                                    <Check className="h-4 w-4 text-white" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-14 text-gray-500 text-center py-8">No services available</p>
                      )}
                    </div>

                    {/* Branch Selection - Show when services are selected and we have branches (more than just "Any Available") */}
                    {selectedServices.length > 0 && branches.some(b => b.id !== 'any') && (
                      <div>
                        <h2 className="text-20 font-semibold text-gray-900 mb-4">Select Branch</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {branches.map((branch) => (
                            <button
                              key={branch.id}
                              onClick={() => setSelectedBranch(branch.id)}
                              className={cn(
                                "border-2 rounded-xl p-4 text-left transition-all",
                                selectedBranch === branch.id
                                  ? "border-brand-600 bg-brand-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-16 font-semibold text-gray-900 mb-1">
                                    {branch.name}
                                  </h3>
                                  {branch.address && (
                                    <p className="text-14 text-gray-600 line-clamp-2">
                                      {branch.address}
                                    </p>
                                  )}
                                </div>
                                <div
                                  className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2",
                                    selectedBranch === branch.id
                                      ? "border-brand-600 bg-brand-600"
                                      : "border-gray-300"
                                  )}
                                >
                                  {selectedBranch === branch.id && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Team Selection */}
                {step === 'team' && (
                  <div className="space-y-6">
                    {/* Branch Selection */}
                    {branches.some(b => b.id !== 'any') && (
                      <div>
                        <h2 className="text-20 font-semibold text-gray-900 mb-4">Choose Branch</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {branches.map((branch) => (
                            <button
                              key={branch.id}
                              onClick={() => setSelectedBranch(branch.id)}
                              className={cn(
                                "border-2 rounded-xl p-4 text-left transition-all",
                                selectedBranch === branch.id
                                  ? "border-brand-600 bg-brand-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4 text-brand-500 flex-shrink-0" />
                                    <h3 className="text-16 font-semibold text-gray-900">
                                      {branch.name}
                                    </h3>
                                  </div>
                                  {branch.address && (
                                    <p className="text-14 text-gray-600 line-clamp-2">
                                      {branch.address}
                                    </p>
                                  )}
                                </div>
                                <div
                                  className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2",
                                    selectedBranch === branch.id
                                      ? "border-brand-600 bg-brand-600"
                                      : "border-gray-300"
                                  )}
                                >
                                  {selectedBranch === branch.id && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Team Member Selection */}
                    <div>
                      <h2 className="text-20 font-semibold text-gray-900 mb-4">Choose Team Member</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {team.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => setSelectedTeamMember(member.id)}
                            className={cn(
                              "border-2 rounded-xl p-4 transition-all bg-white",
                              selectedTeamMember === member.id
                                ? "border-brand-600 bg-brand-50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              {/* Circular Image/Icon */}
                              <div className="relative flex-shrink-0">
                                <div className={cn(
                                  "w-16 h-16 rounded-full flex items-center justify-center",
                                  selectedTeamMember === member.id
                                    ? "bg-brand-100"
                                    : "bg-gray-100"
                                )}>
                                  <User className={cn(
                                    "h-8 w-8",
                                    selectedTeamMember === member.id
                                      ? "text-brand-600"
                                      : "text-gray-400"
                                  )} />
                                </div>
                                {/* Rating Badge */}
                                {member.rating && (
                                  <div className="absolute -bottom-1 -left-1 bg-white rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-sm border border-gray-200">
                                    <span className="text-12 font-semibold text-gray-900">{member.rating.toFixed(1)}</span>
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  </div>
                                )}
                                {/* Selection Check Badge */}
                                {selectedTeamMember === member.id && (
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center border-2 border-white">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* Text Content */}
                              <div className="flex-1 min-w-0 text-left">
                                <h3 className="text-16 font-semibold text-gray-900 mb-1 truncate">
                                  {member.name}
                                </h3>
                                {member.role && (
                                  <p className="text-14 text-gray-600 truncate">
                                    {formatRole(member.role)}
                                  </p>
                                )}
                                {!member.rating && member.role && (
                                  <p className="text-12 text-gray-500 mt-1">View profile</p>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Date & Time Selection */}
                {step === 'datetime' && (
                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <h2 className="text-20 font-semibold text-gray-900 mb-4">Select Date</h2>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {dates.map((date, index) => {
                          const formatted = formatDate(date)
                          const isSelected = date.toDateString() === selectedDate.toDateString()
                          return (
                            <button
                              key={index}
                              onClick={() => setSelectedDate(date)}
                              className={cn(
                                "flex-shrink-0 w-20 border-2 rounded-xl p-3 text-center transition-all",
                                isSelected
                                  ? "border-brand-600 bg-brand-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                            >
                              <div className="text-12 text-gray-600 mb-1">{formatted.day}</div>
                              <div className="text-20 font-semibold text-gray-900">{formatted.date}</div>
                              <div className="text-12 text-gray-600">{formatted.month}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <h2 className="text-20 font-semibold text-gray-900 mb-4">Select Time</h2>
                      {isLoadingTimeSlots ? (
                        <div className="flex items-center justify-center py-8">
                          <LoadingSpinner size="md" />
                        </div>
                      ) : timeSlotsError ? (
                        <div className="py-8">
                          <ErrorDisplay
                            title="Failed to Load Time Slots"
                            message="Failed to load available time slots. Please try again."
                            actionLabel="Retry"
                            onAction={() => {
                              setTimeSlotsError(null)
                              // Trigger refetch by updating a dependency
                              setSelectedDate(new Date(selectedDate.getTime()))
                            }}
                          />
                        </div>
                      ) : timeSlots.length === 0 ? (
                        <p className="text-14 text-gray-500 text-center py-8">
                          No available time slots for the selected date, branch, and team member.
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {timeSlots.map((slot, index) => {
                            // Format time from ISO string
                            const startTime = new Date(slot.start)
                            const timeString = startTime.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })

                            // Check availability from backend status
                            const statusStr = typeof slot.status === 'string' ? slot.status : String(slot.status)
                            const statusValue = typeof slot.status === 'number' ? slot.status :
                              (slot.status === 'Available' ? 1 : slot.status === 'Unknown' ? 0 : 2)
                            const available = statusStr === 'Available' || statusValue === 1

                            return (
                              <button
                                key={slot.id || index}
                                onClick={() => available && setSelectedTime(slot.start)}
                                disabled={!available}
                                className={cn(
                                  "border-2 rounded-xl p-3 text-center transition-all text-14 font-medium",
                                  selectedTime === slot.start
                                    ? "border-brand-600 bg-brand-50 text-brand-600"
                                    : available
                                      ? "border-gray-200 hover:border-gray-300 text-gray-900"
                                      : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                                )}
                              >
                                {timeString}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Confirmation */}
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
                            Your appointment will be added to your cart. You can review and complete payment from there.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer - Below Main Content */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-14 text-gray-600">Total Duration</p>
                    <p className="text-18 font-semibold text-gray-900">{calculateDuration()} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-14 text-gray-600">Total Price</p>
                    <p className="text-24 font-semibold text-brand-600">{services[0]?.currency || 'EGP'} {calculateTotal()}</p>
                  </div>
                </div>
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full !text-white"
                  onClick={step === 'confirm' ? handleConfirmBooking : handleContinue}
                  disabled={
                    (step === 'service' && selectedServices.length === 0) ||
                    (step === 'datetime' && !selectedTime)
                  }
                >
                  {step === 'confirm' ? 'Confirm Booking' : 'Continue'}
                </Button>
              </div>
            </div>

            {/* Booking Summary - Right Side (Sticky) */}
            {selectedServices.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
                  {/* Provider Info Card */}
                  {providerData && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-start gap-3 mb-4">
                        {/* Provider Image */}
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          {providerData.publicLogoImageUrl || providerData.profileURL ? (
                            <Image
                              src={providerData.publicLogoImageUrl || providerData.profileURL || ''}
                              alt={providerData.nameEn || providerData.nameAr || 'Provider'}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full bg-brand-100 flex items-center justify-center">
                              <span className="text-20 font-semibold text-brand-600">
                                {(providerData.nameEn || providerData.nameAr || 'P').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Provider Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-18 font-semibold text-gray-900 mb-1 truncate">
                            {providerData.nameEn || providerData.nameAr || 'Provider'}
                          </h3>
                          {providerData.rate !== null && providerData.rate !== undefined && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-16 font-semibold text-gray-900">
                                {providerData.rate.toFixed(1)}
                              </span>
                              <RatingDisplay
                                rating={providerData.rate}
                                size="xs"
                                format="stars-only"
                                variant="compact"
                              />
                              {providerData.totalReviews > 0 && (
                                <span className="text-14 text-gray-600">
                                  ({providerData.totalReviews})
                                </span>
                              )}
                            </div>
                          )}
                          {providerData.shortAddress && (
                            <p className="text-14 text-gray-600 truncate">
                              {providerData.shortAddress}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Message */}
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-14 text-gray-600">
                          {selectedServices.length === 0
                            ? 'No services selected'
                            : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`}
                        </p>
                      </div>
                    </div>
                  )}

                  <h3 className="text-18 font-semibold text-gray-900 mb-4">Booking Summary</h3>

                  {/* Selected Services */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-14 font-medium text-gray-700 mb-3">Services</p>
                      <div className="space-y-3">
                        {selectedServices.map((serviceId) => {
                          const service = services.find((s) => s.id === serviceId)
                          return service ? (
                            <div key={serviceId} className="pb-3 border-b border-gray-100 last:border-0">
                              <p className="text-14 font-medium text-gray-900 mb-1">
                                {service.name}
                              </p>
                              <div className="flex items-center justify-between text-12 text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {service.duration} min
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {service.currency} {service.price}
                                </span>
                              </div>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>

                    {/* Branch - Show from service step onwards when selected */}
                    {selectedServices.length > 0 && selectedBranch && branches.some(b => b.id !== 'any') && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-14 font-medium text-gray-700 mb-2">Branch</p>
                        <p className="text-14 text-gray-900">
                          {branches.find(b => b.id === selectedBranch)?.name}
                        </p>
                        {branches.find(b => b.id === selectedBranch)?.address && (
                          <p className="text-12 text-gray-600 mt-1">
                            {branches.find(b => b.id === selectedBranch)?.address}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Team Member - Show from team step onwards */}
                    {(step === 'team' || step === 'datetime' || step === 'confirm') && selectedTeamMember && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-14 font-medium text-gray-700 mb-2">Team Member</p>
                        <p className="text-14 text-gray-900">
                          {team.find(m => m.id === selectedTeamMember)?.name}
                        </p>
                      </div>
                    )}

                    {/* Date & Time - Show from datetime step onwards */}
                    {(step === 'datetime' || step === 'confirm') && selectedDate && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-14 font-medium text-gray-700 mb-2">Date</p>
                        <p className="text-14 text-gray-900">
                          {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        {selectedTime && (
                          <p className="text-14 text-gray-600 mt-1">
                            {new Date(selectedTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Total Summary */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-14 text-gray-600">Duration</span>
                      <span className="text-14 font-medium text-gray-900">{calculateDuration()} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-14 font-medium text-gray-900">Total</span>
                      <span className="text-18 font-semibold text-brand-600">{services[0]?.currency || 'EGP'} {calculateTotal()}</span>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full !text-white"
                      onClick={step === 'confirm' ? handleConfirmBooking : handleContinue}
                      disabled={
                        (step === 'service' && selectedServices.length === 0) ||
                        (step === 'datetime' && !selectedTime)
                      }
                    >
                      {step === 'confirm' ? 'Confirm Booking' : 'Continue'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

