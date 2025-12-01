'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Input } from '../Input'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { ServiceSelectCard } from '../ServiceSelectCard'
import { LocationPickerModal } from '../LocationPickerModal'
import { StatusModal } from '../StatusModal'
import { WelcomeHeader } from './WelcomeHeader'
import {
  Sparkles,
  Building2,
  Flower2,
  Cake,
  Camera,
  Shirt,
  Crown,
  DollarSign,
  MapPin,
  User,
  Mail,
  ShirtIcon,
} from 'lucide-react'

export interface PlanningPreferencesFormProps {
  onBackClick?: () => void
  className?: string
}

type ServiceType =
  | 'bridal-beauty'
  | 'wedding-hall'
  | 'bouquet'
  | 'wedding-cake'
  | 'photography'
  | 'wedding-suit'
  | 'wedding-dress'
  | 'accessories'

const services = [
  { id: 'bridal-beauty' as ServiceType, label: 'Bridal & Beauty', icon: Sparkles },
  { id: 'wedding-hall' as ServiceType, label: 'Wedding Hall', icon: Building2 },
  { id: 'bouquet' as ServiceType, label: 'Bouquet', icon: Flower2 },
  { id: 'wedding-cake' as ServiceType, label: 'Wedding cake', icon: Cake },
  { id: 'photography' as ServiceType, label: 'Photography', icon: Camera },
  { id: 'wedding-suit' as ServiceType, label: 'Wedding suit', icon: Shirt },
  { id: 'wedding-dress' as ServiceType, label: 'Wedding Dress', icon: ShirtIcon },
  { id: 'accessories' as ServiceType, label: 'Accessories', icon: Crown },
]

/**
 * PlanningPreferencesForm - Form for collecting planning preferences
 * Includes service selection, budget, location, and user details
 */
export const PlanningPreferencesForm = ({
  onBackClick,
  className,
}: PlanningPreferencesFormProps) => {
  const router = useRouter()

  // Form state
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([])
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  // Modal state
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Validation state
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{
    budget?: string
    location?: string
    fullName?: string
    email?: string
  }>({})

  const handleServiceToggle = (serviceId: ServiceType) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation)
    setShowLocationModal(false)
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!budget.trim()) {
      newErrors.budget = 'Budget is required'
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    if (validateForm()) {
      // Show success modal
      setShowSuccessModal(true)
    }
  }

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false)
    // Redirect to home or login
    router.push('/')
  }

  const handleSkip = () => {
    // Skip and redirect
    router.push('/')
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn('w-full space-y-4 sm:space-y-5', className)}
      >
        {/* Logo and Title */}
        <WelcomeHeader welcomeText="Planning Preferences" />

        {/* Services Section */}
        <div className="space-y-3">
          <Typography
            variant="h6"
            weight="semibold"
            textColor="default"
            className="text-16 sm:text-18"
          >
            Services You're Looking For
          </Typography>

          {/* Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {services.map(service => {
              const Icon = service.icon
              return (
                <ServiceSelectCard
                  key={service.id}
                  icon={Icon}
                  label={service.label}
                  selected={selectedServices.includes(service.id)}
                  onClick={() => handleServiceToggle(service.id)}
                />
              )
            })}
          </div>
        </div>

        {/* Budget Input */}
        <div className="space-y-1">
          <Input
            type="text"
            placeholder="Enter Your Budget"
            value={budget}
            onChange={e => {
              setBudget(e.target.value)
              if (errors.budget) {
                setErrors(prev => ({ ...prev, budget: undefined }))
              }
            }}
            prefixIcon={DollarSign}
            suffix="EGP"
            variant={isSubmitted && errors.budget ? 'error' : 'default'}
            errorMessage={isSubmitted ? errors.budget : undefined}
            size="lg"
          />
        </div>

        {/* Location Input */}
        <div className="space-y-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Location"
              value={location}
              readOnly
              prefixIcon={MapPin}
              variant={isSubmitted && errors.location ? 'error' : 'default'}
              errorMessage={isSubmitted ? errors.location : undefined}
              size="lg"
              className="pr-24"
            />
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 hover:text-brand-600 font-medium text-14 transition-colors"
            >
              Set Location
            </button>
          </div>
        </div>

        {/* Your Bride/Groom Details Section */}
        <div className="space-y-3">
          <Typography
            variant="h6"
            weight="semibold"
            textColor="default"
            className="text-16 sm:text-18"
          >
            Your Bride/Groom Details
          </Typography>

          {/* Full Name Input */}
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => {
                setFullName(e.target.value)
                if (errors.fullName) {
                  setErrors(prev => ({ ...prev, fullName: undefined }))
                }
              }}
              prefixIcon={User}
              variant={isSubmitted && errors.fullName ? 'error' : 'default'}
              errorMessage={isSubmitted ? errors.fullName : undefined}
              size="lg"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }))
                }
              }}
              prefixIcon={Mail}
              variant={isSubmitted && errors.email ? 'error' : 'default'}
              errorMessage={isSubmitted ? errors.email : undefined}
              size="lg"
            />
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="w-full text-white"
        >
          Confirm
        </Button>

        {/* Skip Link */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-14 font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Skip For Now
          </button>
        </div>
      </form>

      {/* Location Picker Modal */}
      <LocationPickerModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={handleLocationSelect}
      />

      {/* Success Modal */}
      <StatusModal
        open={showSuccessModal}
        title="Success!"
        description="Your Account has been created"
        confirmLabel="Confirm"
        onConfirm={handleSuccessConfirm}
        onClose={handleSuccessConfirm}
      />
    </>
  )
}

