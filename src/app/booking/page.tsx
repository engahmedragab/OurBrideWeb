'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Phone,
  Tag,
  Diamond,
  Gift,
  Calendar,
  Star,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { DatePicker } from '@/components/ui/DatePicker'
import { cn } from '@/lib/utils'
import type { Service } from '@/types/service'

export interface Branch {
  id: string
  name: string
  address: string
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
  id: string
  time: string
  available: boolean
}

export interface BookingFormData {
  fullName: string
  mobileNumber: string
  selectedBranch: string
  selectedPackage: string
  selectedUpgrades: string[]
  selectedDate: string
  selectedTime: string
  promoCode?: string
  useDiamonds?: boolean
  useGiftsCash?: boolean
  acceptTerms: boolean
}

const mockBranches: Branch[] = [
  { id: '1', name: 'Branch Name', address: 'Giza, 6 Of October' },
  { id: '2', name: 'Branch Name', address: 'Cairo, Maadi' },
  { id: '3', name: 'Branch Name', address: 'Giza, Elshikh Zayed' },
  { id: '4', name: 'Branch Name', address: "Mansoura, Glaa' St." },
  { id: '5', name: 'Branch Name', address: 'Giza, Dokki' },
]

const mockPackages: Package[] = [
  {
    id: '1',
    title: 'Package Title',
    price: 4500,
    description: 'Basic package',
  },
  {
    id: '2',
    title: 'Package Title',
    price: 6000,
    description: 'Standard package',
  },
  {
    id: '3',
    title: 'Package Title',
    price: 8000,
    description: 'Premium package',
  },
]

const mockUpgrades: PackageUpgrade[] = [
  { id: '1', title: 'Upgrade Title', price: 4500 },
  { id: '2', title: 'Upgrade Title', price: 3000 },
  { id: '3', title: 'Upgrade Title', price: 2500 },
  { id: '4', title: 'Upgrade Title', price: 2000 },
  { id: '5', title: 'Upgrade Title', price: 1500 },
  { id: '6', title: 'Upgrade Title', price: 1000 },
]

const mockTimeSlots: TimeSlot[] = [
  { id: '1', time: '9:00 AM', available: true },
  { id: '2', time: '10:00 AM', available: true },
  { id: '3', time: '11:00 AM', available: false },
  { id: '4', time: '12:00 PM', available: true },
  { id: '5', time: '1:00 PM', available: true },
  { id: '6', time: '2:00 PM', available: true },
  { id: '7', time: '3:00 PM', available: false },
  { id: '8', time: '4:00 PM', available: true },
]

export default function BookingPage() {
  const router = useRouter()

  // Mock service data - in real app, fetch from API using service ID from query params
  const [service] = useState<Service>({
    id: '1',
    title: 'Service Title',
    description: 'Service description',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200',
    ],
    rating: {
      value: 4.5,
      count: 24,
    },
    provider: {
      id: '1',
      name: 'Ali Mohamed',
      verified: true,
    },
    price: {
      original: 5000,
      discounted: 4500,
      currency: 'EGP',
    },
    category: {
      id: '1',
      name: 'Category',
      slug: 'category',
    },
    tags: [],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    isWishlisted: false,
  })

  const [branches] = useState<Branch[]>(mockBranches)
  const [packages] = useState<Package[]>(mockPackages)
  const [packageUpgrades] = useState<PackageUpgrade[]>(mockUpgrades)
  const [timeSlots] = useState<TimeSlot[]>(mockTimeSlots)

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    mobileNumber: '',
    selectedBranch: branches[0]?.id || '',
    selectedPackage: packages[0]?.id || '',
    selectedUpgrades: [],
    selectedDate: '',
    selectedTime: '',
    promoCode: '',
    useDiamonds: false,
    useGiftsCash: false,
    acceptTerms: false,
  })

  const [showPromoInput, setShowPromoInput] = useState(false)
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

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
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

  const handleConfirm = () => {
    if (!validateForm()) {
      return
    }

    // TODO: Replace with actual API call
    // After successful booking, navigate to confirmation page
    router.push('/orders')
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

              {/* Select Your Package */}
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
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Details */}
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

              {/* Available Times */}
              <div>
                <h3 className="text-16 font-semibold text-gray-900 mb-4">
                  Available Times
                </h3>
                <div className="mb-4">
                  <DatePicker
                    value={formData.selectedDate || undefined}
                    onChange={date =>
                      handleInputChange('selectedDate', date || '')
                    }
                    placeholder="Select a date"
                    prefixIcon={Calendar}
                    errorMessage={errors.selectedDate}
                    variant={errors.selectedDate ? 'error' : 'default'}
                    dateFormat="string"
                  />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleInputChange('selectedTime', slot.time)}
                      disabled={!slot.available}
                      className={cn(
                        'px-4 py-3 rounded-lg border-2 text-14 font-medium transition-colors',
                        !slot.available
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : formData.selectedTime === slot.time
                            ? 'border-brand-500 bg-brand-50 text-gray-900'
                            : 'border-gray-300 text-gray-900 hover:border-gray-400'
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
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
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
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

              {/* Promo Code */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    prefixIcon={Tag}
                    placeholder="Enter Promo Code"
                    value={formData.promoCode}
                    onChange={e =>
                      handleInputChange('promoCode', e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    variant="default"
                    className="h-10 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white"
                  >
                    Redeem
                  </Button>
                </div>
              </div>

              {/* Diamonds */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300">
                    <Diamond className="h-5 w-5 text-brand-500" />
                    <span className="text-14 text-gray-900">
                      Diamonds: 250 Points
                    </span>
                  </div>
                  <Button
                    variant="default"
                    className="h-10 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white"
                    onClick={() =>
                      handleInputChange('useDiamonds', !formData.useDiamonds)
                    }
                  >
                    Redeem
                  </Button>
                </div>
              </div>

              {/* Gifts Cash */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300">
                    <Gift className="h-5 w-5 text-brand-500" />
                    <span className="text-14 text-gray-900">
                      Gifts Cash: 500 {service.price.currency.toUpperCase()}
                    </span>
                  </div>
                  <Button
                    variant="default"
                    className="h-10 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white"
                    onClick={() =>
                      handleInputChange('useGiftsCash', !formData.useGiftsCash)
                    }
                  >
                    Redeem
                  </Button>
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
                className={cn(
                  'w-full h-12 rounded-lg font-normal text-white',
                  'bg-brand-500 hover:bg-brand-600',
                  'transition-colors'
                )}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

