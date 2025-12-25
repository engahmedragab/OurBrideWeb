'use client'

import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { MapPin, Building2, Navigation } from 'lucide-react'
import { useCreateAddress, useUpdateAddress, useCountries, useCitiesByCountry, useRegionsByCity } from '@/hooks'
import { getCitiesByCountry } from '@/services/api/locationApi'
import { useToast } from './Toaster'
import type { AddressResponse } from '@/types/responses'
import type { CreateAddressRequest, UpdateAddressRequest, Source } from '@/../client/common/api/gen/ourbride-api'
import { getUser } from '@/auth/utils/token'
import { cn } from '@/lib/utils'
import { SelectPopover } from './SelectPopover'
import type { SelectOption } from './SelectPopover'
import { LocationPickerModal, type LocationData } from './LocationPickerModal'

export interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  address?: AddressResponse | null
  onSuccess?: () => void
}

export const AddressModal = ({
  isOpen,
  onClose,
  address,
  onSuccess,
}: AddressModalProps) => {
  const { addToast } = useToast()
  const createAddressMutation = useCreateAddress()
  const updateAddressMutation = useUpdateAddress()

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    addressEn: '',
    addressAr: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    cityName: '',
    countryName: '',
    cityId: 0,
    countryId: 0,
    regionId: null as number | null,
    contactPhone: '',
    contactPerson: '',
    landmark: '',
    directions: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  // Fetch location data (after formData state is declared)
  const { data: countries = [], isLoading: isLoadingCountries } = useCountries()
  const { data: cities = [], isLoading: isLoadingCities } = useCitiesByCountry(
    formData.countryId > 0 ? formData.countryId : null
  )
  const { data: regions = [], isLoading: isLoadingRegions } = useRegionsByCity(
    formData.cityId > 0 ? formData.cityId : null
  )

  // Initialize form data when address is provided (edit mode)
  useEffect(() => {
    if (address) {
      setFormData({
        nameEn: address.nameEn || '',
        nameAr: address.nameAr || '',
        addressEn: address.addressEn || '',
        addressAr: address.addressAr || '',
        street: address.street || '',
        building: address.building || '',
        floor: address.floor || '',
        apartment: address.apartment || '',
        cityName: address.cityName || '',
        countryName: address.countryName || '',
        cityId: address.cityId || 0,
        countryId: address.countryId || 0,
        regionId: address.regionId || null,
        contactPhone: address.contactPhone || '',
        contactPerson: address.contactPerson || '',
        landmark: address.landmark || '',
        directions: address.directions || '',
      })
    } else {
      // Reset form for new address
      setFormData({
        nameEn: '',
        nameAr: '',
        addressEn: '',
        addressAr: '',
        street: '',
        building: '',
        floor: '',
        apartment: '',
        cityName: '',
        countryName: '',
        cityId: 0,
        countryId: 0,
        regionId: null,
        contactPhone: '',
        contactPerson: '',
        landmark: '',
        directions: '',
      })
    }
    setErrors({})
  }, [address, isOpen])

  // Update cityName and countryName when IDs change
  useEffect(() => {
    if (formData.countryId > 0) {
      const selectedCountry = countries.find(c => c.id === formData.countryId)
      if (selectedCountry) {
        setFormData(prev => ({
          ...prev,
          countryName: selectedCountry.nameEn || selectedCountry.nameAr || selectedCountry.name || '',
        }))
      }
    }
  }, [formData.countryId, countries])

  useEffect(() => {
    if (formData.cityId > 0) {
      const selectedCity = cities.find(c => c.id === formData.cityId)
      if (selectedCity) {
        setFormData(prev => ({
          ...prev,
          cityName: selectedCity.nameEn || selectedCity.nameAr || selectedCity.name || '',
        }))
      }
    }
  }, [formData.cityId, cities])

  /**
   * Handle location selection from LocationPickerModal
   * Parses the location data and fills in address fields
   */
  const handleLocationSelect = async (locationData: string | LocationData) => {
    try {
      let address: any = {}
      let displayName = ''
      let lat: number | null = null
      let lon: number | null = null

      // Handle structured location data
      if (typeof locationData === 'object' && locationData.address) {
        address = locationData.address
        displayName = locationData.displayName || ''
        if (locationData.lat && locationData.lon) {
          lat = parseFloat(locationData.lat)
          lon = parseFloat(locationData.lon)
        }
      } else if (typeof locationData === 'string') {
        // Fallback: if it's a string, try to reverse geocode if it contains coordinates
        const coordMatch = locationData.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/)
        if (coordMatch) {
          lat = parseFloat(coordMatch[1])
          lon = parseFloat(coordMatch[2])

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'OurBrideWeb/1.0',
              },
            }
          )

          if (response.ok) {
            const data = await response.json()
            address = data.address || {}
            displayName = data.display_name || locationData
          } else {
            displayName = locationData
          }
        } else {
          displayName = locationData
        }
      }

      // Extract address components
      const street = address.road || address.street || address.pedestrian || ''
      const city = address.city || address.town || address.village || address.municipality || ''
      const country = address.country || ''
      const building = address.house_number || ''

      // Try to match country with our dropdown options
      let matchedCountryId = 0

      if (country) {
        const matchedCountry = countries.find(
          c => c.nameEn?.toLowerCase().includes(country.toLowerCase()) ||
            c.nameAr?.toLowerCase().includes(country.toLowerCase()) ||
            c.name?.toLowerCase().includes(country.toLowerCase()) ||
            country.toLowerCase().includes(c.nameEn?.toLowerCase() || '') ||
            country.toLowerCase().includes(c.nameAr?.toLowerCase() || '')
        )
        if (matchedCountry) {
          matchedCountryId = matchedCountry.id
        }
      }

      // Update form data
      setFormData(prev => ({
        ...prev,
        street: street || displayName.split(',')[0] || displayName,
        cityName: city,
        countryName: country,
        countryId: matchedCountryId,
        building: building || prev.building,
      }))

      // If we found a country, fetch cities and try to match city
      if (matchedCountryId > 0 && city) {
        // Fetch cities for the selected country
        getCitiesByCountry(matchedCountryId)
          .then(loadedCities => {
            const matchedCity = loadedCities.find(
              c => c.nameEn?.toLowerCase().includes(city.toLowerCase()) ||
                c.nameAr?.toLowerCase().includes(city.toLowerCase()) ||
                c.name?.toLowerCase().includes(city.toLowerCase()) ||
                city.toLowerCase().includes(c.nameEn?.toLowerCase() || '') ||
                city.toLowerCase().includes(c.nameAr?.toLowerCase() || '')
            )
            if (matchedCity) {
              setFormData(prev => ({
                ...prev,
                cityId: matchedCity.id,
                cityName: matchedCity.nameEn || matchedCity.nameAr || matchedCity.name || city,
              }))
            }
          })
          .catch(console.error)
      }

      addToast('Location selected successfully', 'success')
    } catch (error) {
      console.error('Error parsing location:', error)
      // Fallback: just set the street address
      const displayName = typeof locationData === 'string' ? locationData : locationData.displayName || ''
      setFormData(prev => ({
        ...prev,
        street: displayName.split(',')[0] || displayName,
      }))
      addToast('Location selected. Please verify and complete the address details.', 'info')
    }
  }

  const updateField = (field: string, value: string | number | null) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }

      // Reset dependent fields when parent changes
      if (field === 'countryId') {
        newData.cityId = 0
        newData.cityName = ''
        newData.regionId = null
      } else if (field === 'cityId') {
        newData.regionId = null
      }

      return newData
    })
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.street.trim()) {
      newErrors.street = 'Street is required'
    }
    if (!formData.countryId || formData.countryId === 0) {
      newErrors.countryId = 'Country is required'
    }
    if (!formData.cityId || formData.cityId === 0) {
      newErrors.cityId = 'City is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const user = getUser()
      if (!user?.id) {
        addToast('Please login to add an address', 'error')
        return
      }

      // Get selected country and city names for display
      const selectedCountry = countries.find(c => c.id === formData.countryId)
      const selectedCity = cities.find(c => c.id === formData.cityId)
      const selectedRegion = regions.find(r => r.id === formData.regionId)

      if (address) {
        // Update existing address - include all fields that can be updated
        const updateData: UpdateAddressRequest = {
          id: address.id,
          street: formData.street || null,
          addressEn: formData.addressEn || formData.street || null,
          addressAr: formData.addressAr || formData.street || null,
          nameEn: formData.nameEn || formData.street || null,
          nameAr: formData.nameAr || formData.street || null,
          building: formData.building || null,
          floor: formData.floor || null,
          apartment: formData.apartment || null,
          countryId: formData.countryId > 0 ? formData.countryId : address.countryId,
          cityId: formData.cityId > 0 ? formData.cityId : address.cityId,
          regionId: formData.regionId,
          contactPhone: formData.contactPhone || null,
          contactPerson: formData.contactPerson || null,
          landmark: formData.landmark || null,
          directions: formData.directions || null,
        }
        await updateAddressMutation.mutateAsync({ id: address.id, data: updateData })
        addToast('Address updated successfully', 'success')
      } else {
        // Create new address - include all required and optional fields
        const createData: CreateAddressRequest = {
          sourceId: 0, // Will be set by backend
          source: 'User' as Source,
          userId: user.id,
          countryId: formData.countryId > 0 ? formData.countryId : 1, // Default to Egypt if not set
          cityId: formData.cityId > 0 ? formData.cityId : 1, // Default if not set
          street: formData.street || null,
          addressEn: formData.addressEn || formData.street || (selectedCity?.nameEn || selectedCountry?.nameEn) || null,
          addressAr: formData.addressAr || formData.street || (selectedCity?.nameAr || selectedCountry?.nameAr) || null,
          nameEn: formData.nameEn || formData.street || (selectedCity?.nameEn || selectedCountry?.nameEn) || null,
          nameAr: formData.nameAr || formData.street || (selectedCity?.nameAr || selectedCountry?.nameAr) || null,
          building: formData.building || null,
          floor: formData.floor || null,
          apartment: formData.apartment || null,
          regionId: formData.regionId,
          contactPhone: formData.contactPhone || null,
          contactPerson: formData.contactPerson || null,
          landmark: formData.landmark || null,
          directions: formData.directions || null,
        }
        await createAddressMutation.mutateAsync(createData)
        addToast('Address added successfully', 'success')
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Address save error:', error)
      addToast(
        error instanceof Error
          ? error.message
          : 'Failed to save address. Please try again.',
        'error'
      )
    }
  }

  const isLoading = createAddressMutation.isPending || updateAddressMutation.isPending

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={address ? 'Edit Address' : 'Add Delivery Address'}
      maxWidth="md"
      disabled={isLoading}
    >
      <div className="space-y-4">
        {/* Location Picker Button */}
        <button
          type="button"
          onClick={() => setShowLocationPicker(true)}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed transition-all',
            'border-brand-300 bg-brand-50 hover:bg-brand-100 hover:border-brand-400',
            'text-brand-600 font-medium text-14'
          )}
        >
          <Navigation className="h-5 w-5" />
          <span>Pick Location from Map</span>
        </button>

        {/* Street Address */}
        <Input
          type="text"
          placeholder="Street Address"
          prefixIcon={MapPin}
          value={formData.street}
          onChange={e => updateField('street', e.target.value)}
          variant={errors.street ? 'error' : 'default'}
          errorMessage={errors.street}
          className="w-full"
        />

        {/* Building, Floor, Apartment */}
        <div className="grid grid-cols-3 gap-3">
          <Input
            type="text"
            placeholder="Building"
            prefixIcon={Building2}
            value={formData.building}
            onChange={e => updateField('building', e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Floor"
            value={formData.floor}
            onChange={e => updateField('floor', e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Apartment"
            value={formData.apartment}
            onChange={e => updateField('apartment', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Country */}
        <div>
          <SelectPopover
            value={formData.countryId > 0 ? formData.countryId.toString() : ''}
            onChange={(value) => updateField('countryId', value ? parseInt(value, 10) : 0)}
            options={countries.map(country => ({
              value: country.id.toString(),
              label: country.nameEn || country.nameAr || country.name || `Country ${country.id}`,
            }))}
            placeholder={isLoadingCountries ? 'Loading countries...' : 'Select Country'}
            errorMessage={errors.countryId}
            disabled={isLoadingCountries}
            className="w-full"
          />
        </div>

        {/* City */}
        <div>
          <SelectPopover
            value={formData.cityId > 0 ? formData.cityId.toString() : ''}
            onChange={(value) => updateField('cityId', value ? parseInt(value, 10) : 0)}
            options={cities.map(city => ({
              value: city.id.toString(),
              label: city.nameEn || city.nameAr || city.name || `City ${city.id}`,
            }))}
            placeholder={
              !formData.countryId || formData.countryId === 0
                ? 'Select country first'
                : isLoadingCities
                  ? 'Loading cities...'
                  : 'Select City'
            }
            errorMessage={errors.cityId}
            disabled={!formData.countryId || formData.countryId === 0 || isLoadingCities}
            className="w-full"
          />
        </div>

        {/* Region */}
        <div>
          <SelectPopover
            value={formData.regionId ? formData.regionId.toString() : ''}
            onChange={(value) => updateField('regionId', value ? parseInt(value, 10) : null)}
            options={regions.map(region => ({
              value: region.id.toString(),
              label: region.nameEn || region.nameAr || region.name || `Region ${region.id}`,
            }))}
            placeholder={
              !formData.cityId || formData.cityId === 0
                ? 'Select city first'
                : isLoadingRegions
                  ? 'Loading regions...'
                  : 'Select Region (Optional)'
            }
            disabled={!formData.cityId || formData.cityId === 0 || isLoadingRegions}
            className="w-full"
          />
        </div>

        {/* Contact Person */}
        <Input
          type="text"
          placeholder="Contact Person (Optional)"
          value={formData.contactPerson}
          onChange={e => updateField('contactPerson', e.target.value)}
          className="w-full"
        />

        {/* Contact Phone */}
        <Input
          type="tel"
          placeholder="Contact Phone (Optional)"
          value={formData.contactPhone}
          onChange={e => updateField('contactPhone', e.target.value)}
          className="w-full"
        />

        {/* Landmark */}
        <Input
          type="text"
          placeholder="Landmark (Optional)"
          value={formData.landmark}
          onChange={e => updateField('landmark', e.target.value)}
          className="w-full"
        />

        {/* Directions */}
        <div className="relative">
          <textarea
            placeholder="Additional Directions (Optional)"
            value={formData.directions}
            onChange={e => updateField('directions', e.target.value)}
            rows={3}
            className={cn(
              'w-full px-4 py-3 rounded-md border bg-background text-16',
              'ring-offset-background transition-colors',
              'placeholder:text-gray-400 focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-offset-2',
              'border-gray-300 focus-visible:border-brand-500 focus-visible:ring-brand-500',
              'resize-none'
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : address ? 'Update' : 'Add Address'}
          </Button>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelect={async (locationData) => {
          // Parse the location data and fill form fields
          await handleLocationSelect(locationData)
          setShowLocationPicker(false)
        }}
      />
    </Modal>
  )
}

