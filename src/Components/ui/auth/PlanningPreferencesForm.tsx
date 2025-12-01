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
  MapPin,
  User,
  Mail,
} from 'lucide-react'
import { BudgetIcon } from '../icons/BudgetIcon'
import { BridalBeautyIcon } from '../icons/services/BridalBeautyIcon'
import { WeddingHallIcon } from '../icons/services/WeddingHallIcon'
import { BouquetIcon } from '../icons/services/BouquetIcon'
import { WeddingCakeIcon } from '../icons/services/WeddingCakeIcon'
import { PhotographyIcon } from '../icons/services/PhotographyIcon'
import { WeddingSuitIcon } from '../icons/services/WeddingSuitIcon'
import { WeddingDressIcon } from '../icons/services/WeddingDressIcon'
import { AccessoriesIcon } from '../icons/services/AccessoriesIcon'

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

const SERVICES = [
  { id: 'bridal-beauty' as ServiceType, label: 'Bridal & Beauty', Icon: BridalBeautyIcon },
  { id: 'wedding-hall' as ServiceType, label: 'Wedding Hall', Icon: WeddingHallIcon },
  { id: 'bouquet' as ServiceType, label: 'Bouquet', Icon: BouquetIcon },
  { id: 'wedding-cake' as ServiceType, label: 'Wedding cake', Icon: WeddingCakeIcon },
  { id: 'photography' as ServiceType, label: 'Photography', Icon: PhotographyIcon },
  { id: 'wedding-suit' as ServiceType, label: 'Wedding suit', Icon: WeddingSuitIcon },
  { id: 'wedding-dress' as ServiceType, label: 'Wedding Dress', Icon: WeddingDressIcon },
  { id: 'accessories' as ServiceType, label: 'Accessories', Icon: AccessoriesIcon },
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
        className={cn('w-full space-y-2.5 sm:space-y-3', className)}
      >
        {/* Logo and Title */}
        <WelcomeHeader welcomeText="Planning Preferences" />

        {/* Services Section */}
        <div className="space-y-2">
          <Typography
            variant="h6"
            weight="regular"
            textColor="default"
            className="text-14 sm:text-16"
          >
            Services You're Looking For
          </Typography>

          {/* Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SERVICES.map(({ id, label, Icon }) => (
              <ServiceSelectCard
                key={id}
                icon={<Icon className="w-8 h-8" />}
                label={label}
                selected={selectedServices.includes(id)}
                onClick={() => handleServiceToggle(id)}
              />
            ))}
          </div>
        </div>

        {/* Budget Input */}
        <div className="space-y-0.5">
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
            prefixIcon={<BudgetIcon className="h-5 w-5" />}
            suffix="EGP"
            variant={isSubmitted && errors.budget ? 'error' : 'default'}
            errorMessage={isSubmitted ? errors.budget : undefined}
            size="lg"
          />
        </div>

        {/* Location Input */}
        <div className="space-y-0.5">
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
        <div className="space-y-2">
          <Typography
            variant="h6"
             weight="regular"
            textColor="default"
            className="text-14 sm:text-16"
          >
            Your Bride/Groom Details
          </Typography>

          {/* Full Name Input */}
          <div className="space-y-0.5">
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
          <div className="space-y-0.5">
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

