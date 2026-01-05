'use client'

import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { MapPin, Building2, Navigation } from 'lucide-react'
import { useCreateAddress, useUpdateAddress } from '@/hooks'
import { useToast } from './Toaster'
import type { DeliveryAddressResponse } from '@/types/responses'
import type { DeliveryAddressRequest } from '@/../client/common/api/gen/ourbride-api'
import { getUser } from '@/auth/utils/token'
import { cn } from '@/lib/utils'
import { SelectPopover } from './SelectPopover'
import type { SelectOption } from './SelectPopover'
import { LocationPickerModal, type LocationData } from './LocationPickerModal'

export interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  address?: DeliveryAddressResponse | null
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
    contactName: '',
    contactNumber1: '',
    contactNumber2: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    addressComment: '',
    isDefault: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  // Initialize form data when address is provided (edit mode)
  useEffect(() => {
    if (address) {
      setFormData({
        contactName: address.contactName || '',
        contactNumber1: address.contactNumber1 || '',
        contactNumber2: address.contactNumber2 || '',
        email: address.email || '',
        address1: address.address1 || '',
        address2: address.address2 || '',
        city: address.city || '',
        state: address.state || '',
        postcode: address.postcode || '',
        country: address.country || '',
        addressComment: address.addressComment || '',
        isDefault: address.isDefault || false,
      })
    } else {
      // Reset form for new address
      setFormData({
        contactName: '',
        contactNumber1: '',
        contactNumber2: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        addressComment: '',
        isDefault: false,
      })
    }
    setErrors({})
  }, [address, isOpen])

  /**
   * Handle location selection from LocationPickerModal
   * Parses the location data and fills in address fields
   */
  const handleLocationSelect = async (locationData: string | LocationData) => {
    try {
      let address: Partial<LocationData['address']> &
        Record<string, string | undefined> = {}
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
      const street =
        (address?.road as string) ||
        (address?.street as string) ||
        (address?.pedestrian as string) ||
        ''
      const city =
        (address?.city as string) ||
        (address?.town as string) ||
        (address?.village as string) ||
        (address?.municipality as string) ||
        ''
      const country = (address?.country as string) || ''
      const building = (address?.house_number as string) || ''

      // Update form data
      setFormData(prev => ({
        ...prev,
        address1: street || displayName.split(',')[0] || displayName,
        city: city,
        country: country,
        address2: building || prev.address2,
      }))

      addToast('Location selected successfully', 'success')
    } catch (error) {
      // Fallback: just set the address
      const displayName =
        typeof locationData === 'string'
          ? locationData
          : locationData.displayName || ''
      setFormData(prev => ({
        ...prev,
        address1: displayName.split(',')[0] || displayName,
      }))
      addToast(
        'Location selected. Please verify and complete the address details.',
        'info'
      )
    }
  }

  const updateField = (
    field: string,
    value: string | number | boolean | null
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
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

    if (!formData.address1.trim()) {
      newErrors.address1 = 'Address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required'
    }
    if (!formData.contactNumber1.trim()) {
      newErrors.contactNumber1 = 'Contact number is required'
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

      if (address) {
        // Update existing deliveryaddress
        const updateData: DeliveryAddressRequest = {
          id: address.id,
          contactName: formData.contactName,
          contactNumber1: formData.contactNumber1,
          contactNumber2: formData.contactNumber2 || null,
          email: formData.email || null,
          address1: formData.address1,
          address2: formData.address2 || null,
          city: formData.city,
          state: formData.state || null,
          postcode: formData.postcode || null,
          country: formData.country,
          addressComment: formData.addressComment || null,
          isDefault: formData.isDefault,
        }
        await updateAddressMutation.mutateAsync({
          id: address.id,
          data: updateData,
        })
        addToast('Address updated successfully', 'success')
      } else {
        // Create new deliveryaddress
        const createData: DeliveryAddressRequest = {
          contactName: formData.contactName,
          contactNumber1: formData.contactNumber1,
          contactNumber2: formData.contactNumber2 || null,
          email: formData.email || null,
          address1: formData.address1,
          address2: formData.address2 || null,
          city: formData.city,
          state: formData.state || null,
          postcode: formData.postcode || null,
          country: formData.country,
          addressComment: formData.addressComment || null,
          isDefault: formData.isDefault,
        }
        await createAddressMutation.mutateAsync(createData)
        addToast('Address added successfully', 'success')
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'Failed to save address. Please try again.',
        'error'
      )
    }
  }

  const isLoading =
    createAddressMutation.isPending || updateAddressMutation.isPending

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

        {/* Contact Name */}
        <Input
          type="text"
          placeholder="Contact Name *"
          value={formData.contactName}
          onChange={e => updateField('contactName', e.target.value)}
          variant={errors.contactName ? 'error' : 'default'}
          errorMessage={errors.contactName}
          className="w-full"
        />

        {/* Contact Numbers */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="tel"
            placeholder="Contact Number *"
            value={formData.contactNumber1}
            onChange={e => updateField('contactNumber1', e.target.value)}
            variant={errors.contactNumber1 ? 'error' : 'default'}
            errorMessage={errors.contactNumber1}
            className="w-full"
          />
          <Input
            type="tel"
            placeholder="Alternative Number (Optional)"
            value={formData.contactNumber2}
            onChange={e => updateField('contactNumber2', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Email */}
        <Input
          type="email"
          placeholder="Email (Optional)"
          value={formData.email}
          onChange={e => updateField('email', e.target.value)}
          className="w-full"
        />

        {/* Address Line 1 */}
        <Input
          type="text"
          placeholder="Address Line 1 *"
          prefixIcon={MapPin}
          value={formData.address1}
          onChange={e => updateField('address1', e.target.value)}
          variant={errors.address1 ? 'error' : 'default'}
          errorMessage={errors.address1}
          className="w-full"
        />

        {/* Address Line 2 */}
        <Input
          type="text"
          placeholder="Address Line 2 (Optional)"
          prefixIcon={Building2}
          value={formData.address2}
          onChange={e => updateField('address2', e.target.value)}
          className="w-full"
        />

        {/* City, State, Postcode */}
        <div className="grid grid-cols-3 gap-3">
          <Input
            type="text"
            placeholder="City *"
            value={formData.city}
            onChange={e => updateField('city', e.target.value)}
            variant={errors.city ? 'error' : 'default'}
            errorMessage={errors.city}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="State (Optional)"
            value={formData.state}
            onChange={e => updateField('state', e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Postcode (Optional)"
            value={formData.postcode}
            onChange={e => updateField('postcode', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Country */}
        <Input
          type="text"
          placeholder="Country *"
          value={formData.country}
          onChange={e => updateField('country', e.target.value)}
          variant={errors.country ? 'error' : 'default'}
          errorMessage={errors.country}
          className="w-full"
        />

        {/* Address Comment */}
        <div className="relative">
          <textarea
            placeholder="Additional Notes (Optional)"
            value={formData.addressComment}
            onChange={e => updateField('addressComment', e.target.value)}
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

        {/* Default Address Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={e => updateField('isDefault', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="isDefault" className="text-14 text-gray-700">
            Set as default delivery address
          </label>
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
        onSelect={async locationData => {
          // Parse the location data and fill form fields
          await handleLocationSelect(locationData)
          setShowLocationPicker(false)
        }}
      />
    </Modal>
  )
}
