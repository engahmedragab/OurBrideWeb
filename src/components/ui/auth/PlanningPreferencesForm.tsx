'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Input } from '../Input'
import { Button } from '@/components/ui/Button'
import { Typography } from '@/components/ui/Typography'
import { ServiceSelectCard } from '../ServiceSelectCard'
import { LocationPickerModal } from '../LocationPickerModal'
import { StatusModal } from '../StatusModal'
import { WelcomeHeader } from './WelcomeHeader'
import { 
  MapPin, 
  User, 
  Mail, 
  X, 
  Wallet,
  Sparkles,
  Building2,
  Flower2,
  Cake,
  Camera,
  Shirt,
  Crown,
  Heart,
  Gift,
  Music,
  Car,
  UtensilsCrossed,
  Palette,
  Scissors,
  Gem,
  type LucideIcon
} from 'lucide-react'
import { getPlanningPreferences, setPlanningPreferences, type PlanningPreference } from '@/services/profile/profileApi'
import { useAuth } from '@/auth'
import { LoadingOverlay } from '../LoadingOverlay'

export interface PlanningPreferencesFormProps {
  onBackClick?: () => void
  className?: string
}

/**
 * Map service names to Lucide icons
 * This function matches service names (case-insensitive) to appropriate Lucide icons
 */
const getServiceIcon = (serviceName: string): LucideIcon => {
  const name = serviceName.toLowerCase().trim()
  
  // Bridal & Beauty
  if (name.includes('bridal') || name.includes('beauty') || name.includes('makeup') || name.includes('salon')) {
    return Sparkles
  }
  
  // Wedding Hall / Venue
  if (name.includes('hall') || name.includes('venue') || name.includes('location') || name.includes('place')) {
    return Building2
  }
  
  // Bouquet / Flowers
  if (name.includes('bouquet') || name.includes('flower') || name.includes('floral')) {
    return Flower2
  }
  
  // Wedding Cake
  if (name.includes('cake') || name.includes('dessert') || name.includes('sweet')) {
    return Cake
  }
  
  // Photography / Videography
  if (name.includes('photo') || name.includes('video') || name.includes('camera') || name.includes('film')) {
    return Camera
  }
  
  // Wedding Suit / Men's Wear
  if (name.includes('suit') || name.includes('tuxedo') || name.includes('men') || name.includes('groom')) {
    return Shirt
  }
  
  // Wedding Dress / Bridal Wear
  if (name.includes('dress') || name.includes('gown') || name.includes('bridal wear')) {
    return Heart
  }
  
  // Accessories / Jewelry
  if (name.includes('accessor') || name.includes('jewelry') || name.includes('jewellery') || name.includes('ring')) {
    return Crown
  }
  
  // Music / DJ / Entertainment
  if (name.includes('music') || name.includes('dj') || name.includes('entertainment') || name.includes('band')) {
    return Music
  }
  
  // Transportation
  if (name.includes('car') || name.includes('transport') || name.includes('vehicle') || name.includes('limousine')) {
    return Car
  }
  
  // Catering / Food
  if (name.includes('catering') || name.includes('food') || name.includes('restaurant') || name.includes('dining')) {
    return UtensilsCrossed
  }
  
  // Decoration / Design
  if (name.includes('decoration') || name.includes('design') || name.includes('decor') || name.includes('styling')) {
    return Palette
  }
  
  // Hair / Styling
  if (name.includes('hair') || name.includes('styling') || name.includes('haircut')) {
    return Scissors
  }
  
  // Gift / Favors
  if (name.includes('gift') || name.includes('favor') || name.includes('souvenir')) {
    return Gift
  }
  
  // Jewelry / Gem
  if (name.includes('gem') || name.includes('diamond') || name.includes('pearl')) {
    return Gem
  }
  
  // Default fallback
  return Sparkles
}

/**
 * PlanningPreferencesForm - Form for collecting planning preferences
 * Includes service selection, budget, location, and user details
 */
export const PlanningPreferencesForm = ({
  onBackClick: _onBackClick,
  className,
}: PlanningPreferencesFormProps) => {
  const router = useRouter()
  const { user, refreshUser } = useAuth()

  // API state
  const [availablePreferences, setAvailablePreferences] = useState<PlanningPreference[]>([])
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  
  // Track if preferences have been fetched to prevent duplicate calls
  const preferencesFetchedRef = useRef(false)

  // Form state - track selected preference IDs (preparationIds)
  const [selectedPreferenceIds, setSelectedPreferenceIds] = useState<number[]>([])
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
    preferences?: string
    budget?: string
    location?: string
    fullName?: string
    email?: string
  }>({})

  // Focus states
  const [budgetFocused, setBudgetFocused] = useState(false)
  const [locationFocused, setLocationFocused] = useState(false)
  const [fullNameFocused, setFullNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)

  // Fetch available planning preferences on mount (only once)
  useEffect(() => {
    // Prevent duplicate calls (React Strict Mode in development runs effects twice)
    if (preferencesFetchedRef.current) {
      return
    }

    const fetchPreferences = async () => {
      try {
        preferencesFetchedRef.current = true
        setIsLoadingPreferences(true)
        setApiError(null)
        const preferences = await getPlanningPreferences()
        setAvailablePreferences(Array.isArray(preferences) ? preferences : [])
      } catch (error) {
        // On error, allow retry by resetting the ref
        preferencesFetchedRef.current = false
        const errorMessage = error instanceof Error ? error.message : 'Failed to load planning preferences'
        setApiError(errorMessage)
        console.error('Error fetching planning preferences:', error)
      } finally {
        setIsLoadingPreferences(false)
      }
    }

    fetchPreferences()
  }, [])

  // Pre-populate form with user data if available
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName)
      if (user.email) setEmail(user.email)
    }
  }, [user])

  const handlePreferenceToggle = (preferenceId: number) => {
    setSelectedPreferenceIds(prev =>
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    )
    // Clear error if any
    if (errors.preferences) {
      setErrors(prev => ({ ...prev, preferences: undefined }))
    }
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

    if (selectedPreferenceIds.length === 0) {
      newErrors.preferences = 'Please select at least one service'
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setApiError(null)

    if (!validateForm()) {
      return
    }

    if (selectedPreferenceIds.length === 0) {
      setErrors(prev => ({ ...prev, preferences: 'Please select at least one service' }))
      return
    }

    try {
      setIsSubmitting(true)
      
      // Submit selected preferences
      await setPlanningPreferences(selectedPreferenceIds)
      
      // Update user's isPreferenceInit to true after successful submission
      if (typeof window !== 'undefined' && user) {
        const updatedUser = { ...user, isPreferenceInit: true }
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
        
        // Also update the cookie so middleware and other parts can access it
        // Use the same cookie setting logic as in token.ts
        const expires = new Date()
        expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000)
        document.cookie = `user_data=${JSON.stringify(updatedUser)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
      }
      
      // Refresh user data in context
      if (refreshUser) {
        await refreshUser()
      }
      
      // Show success modal
      setShowSuccessModal(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save planning preferences'
      setApiError(errorMessage)
      console.error('Error setting planning preferences:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false)
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleSkip = () => {
    // Skip - preferenceInit stays false, redirect to home page
    router.push('/')
  }

  // Map field status to Input variants
  const getInputVariant = (
    hasError: boolean,
    value: string,
    isFocused: boolean
  ): 'default' | 'error' | 'success' | 'focused' | 'fill' => {
    if (hasError) return 'error'
    if (isFocused) return 'focused'
    if (value && value.length > 0) return 'fill'
    return 'default'
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
            Services You&apos;re Looking For
          </Typography>

          {/* Error Message */}
          {apiError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

          {isSubmitted && errors.preferences && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.preferences}</p>
            </div>
          )}

          {/* Services Grid */}
          {isLoadingPreferences ? (
            <div className="flex justify-center py-8">
              <Typography variant="body" textColor="muted">
                Loading services...
              </Typography>
            </div>
          ) : availablePreferences.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availablePreferences.map((preference) => {
                // Render icon from API data (image or Lucide icon based on service name)
                const renderIcon = () => {
                  // If we have an image URL from API, use it
                  if (preference.imageUrl) {
                    return (
                      <img
                        src={preference.imageUrl}
                        alt={preference.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                      />
                    )
                  }
                  
                  // Use Lucide icon based on service name - always in brand color from design system
                  const Icon = getServiceIcon(preference.name)
                  
                  return (
                    <Icon 
                      className="w-8 h-8 sm:w-10 sm:h-10 text-brand-500" 
                      strokeWidth={1}
                    />
                  )
                }
                
                return (
                  <ServiceSelectCard
                    key={preference.id}
                    icon={renderIcon()}
                    label={preference.name}
                    selected={selectedPreferenceIds.includes(preference.id)}
                    onClick={() => handlePreferenceToggle(preference.id)}
                  />
                )
              })}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <Typography variant="body" textColor="muted">
                No services available
              </Typography>
            </div>
          )}
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
            onFocus={() => setBudgetFocused(true)}
            onBlur={() => setBudgetFocused(false)}
            prefixIcon={<Wallet className="h-5 w-5" />}
            suffix="EGP"
            variant={getInputVariant(
              isSubmitted && !!errors.budget,
              budget,
              budgetFocused
            )}
            errorMessage={isSubmitted ? errors.budget : undefined}
            size="lg"
          />
        </div>

        {/* Location Input */}
        <div className="space-y-0.5">
          <div className="relative w-full">
            <div className="relative">
              <Input
                type="text"
                placeholder="Location"
                value={location}
                readOnly
                onFocus={() => setLocationFocused(true)}
                onBlur={() => setLocationFocused(false)}
                prefixIcon={MapPin}
                variant={getInputVariant(
                  isSubmitted && !!errors.location,
                  location,
                  locationFocused
                )}
                errorMessage={undefined}
                size="lg"
                className="pr-24"
              />
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-brand-500 hover:text-brand-600 font-medium text-14 transition-colors"
              >
                Set Location
              </button>
            </div>
            {isSubmitted && errors.location && (
              <div className="mt-1.5 flex items-center gap-2 text-14 font-normal leading-4 text-red-500">
                <div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500 flex-shrink-0">
                  <X className="h-2.5 w-2.5 text-red-500" />
                </div>
                <span>{errors.location}</span>
              </div>
            )}
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
              onFocus={() => setFullNameFocused(true)}
              onBlur={() => setFullNameFocused(false)}
              prefixIcon={User}
              variant={getInputVariant(
                isSubmitted && !!errors.fullName,
                fullName,
                fullNameFocused
              )}
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
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              prefixIcon={Mail}
              variant={getInputVariant(
                isSubmitted && !!errors.email,
                email,
                emailFocused
              )}
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
          disabled={isSubmitting || isLoadingPreferences}
        >
          {isSubmitting ? 'Saving...' : 'Confirm'}
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
        description="Your planning preferences have been saved"
        confirmLabel="Confirm"
        onConfirm={handleSuccessConfirm}
        onClose={handleSuccessConfirm}
      />

      {/* Loading Overlay */}
      <LoadingOverlay
        open={isSubmitting || isLoadingPreferences}
        title={isSubmitting ? "Saving..." : "Loading..."}
        subtitle="Please wait a moment."
      />
    </>
  )
}
