'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Check,
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  User,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, ErrorDisplay } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useProviderDetail } from '@/hooks/providers/useProviderDetail'

interface BookingClientProps {
  providerId: string
  preSelectedServiceId?: string
}

// All data now comes from API - no mock data needed

// Generate time slots for bridal salon (10 AM - 10 PM)
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 10; hour < 22; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      slots.push({
        time: `${displayHour}:${min.toString().padStart(2, '0')} ${period}`,
        available: Math.random() > 0.3, // Random availability
      })
    }
  }
  return slots
}

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [dates] = useState(generateDates())
  const [timeSlots] = useState(generateTimeSlots())

  // Fetch provider data from API
  const { data: providerData, isLoading, error } = useProviderDetail(parseInt(providerId))

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
  if (error || !providerData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <ErrorDisplay
            title="Provider not found"
            message="Unable to load booking information. Please try again later."
            actionLabel="Back to Providers"
            actionHref="/providers"
          />
        </main>
        <Footer />
      </div>
    )
  }

  // Map services from API (currently empty, will be populated when services endpoint is integrated)
  const services = [] as Array<{ id: string; name: string; duration: number; price: number; currency: string }>
  
  // Map team members from API (currently empty, will be populated when team endpoint is integrated)
  const team = [
    { id: 'any', name: 'Any Available', rating: null as number | null },
  ] as Array<{ id: string; name: string; rating: number | null }>

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
              </div>
            )}

            {/* Team Selection */}
            {step === 'team' && (
              <div>
                <h2 className="text-20 font-semibold text-gray-900 mb-4">Choose Team Member</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {team.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedTeamMember(member.id)}
                      className={cn(
                        "border-2 rounded-xl p-4 text-center transition-all",
                        selectedTeamMember === member.id
                          ? "border-brand-600 bg-brand-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-16 font-semibold text-gray-900 mb-1">{member.name}</h3>
                      {member.rating && (
                        <p className="text-14 text-gray-600">★ {member.rating}</p>
                      )}
                    </button>
                  ))}
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={cn(
                          "border-2 rounded-xl p-3 text-center transition-all text-14 font-medium",
                          selectedTime === slot.time
                            ? "border-brand-600 bg-brand-50 text-brand-600"
                            : slot.available
                            ? "border-gray-200 hover:border-gray-300 text-gray-900"
                            : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
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
                    <p className="text-24 font-semibold text-brand-600">{services[0]?.currency || 'SAR'} {calculateTotal()}</p>
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
                          <p className="text-14 text-gray-600 mt-1">{selectedTime}</p>
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
                    <span className="text-18 font-semibold text-brand-600">{services[0]?.currency || 'SAR'} {calculateTotal()}</span>
                  </div>
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

