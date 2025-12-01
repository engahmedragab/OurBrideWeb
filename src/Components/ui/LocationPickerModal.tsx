'use client'

import { useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'
import { Modal } from './Modal'
import { Input } from './Input'
import { Button } from './Button'

export interface LocationPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (value: string) => void
}

/**
 * LocationPickerModal - Modal for selecting location
 * Displays search input and location results
 */
export const LocationPickerModal = ({
  open,
  onClose,
  onSelect,
}: LocationPickerModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  // Mock location data
  const locations = [
    {
      id: 'giza',
      name: 'Giza',
      address: '1st District, First of October, Giza Governorate, October City',
    },
    {
      id: 'cairo',
      name: 'Cairo',
      address: 'Downtown Cairo, Cairo Governorate',
    },
    {
      id: 'alexandria',
      name: 'Alexandria',
      address: 'Alexandria Governorate',
    },
  ]

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location)
    onSelect(location)
    onClose()
  }

  const handleUseCurrentLocation = () => {
    // Mock current location
    onSelect('Current Location')
    onClose()
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Set Location"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search For Location ....."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            prefixIcon={Search}
            className="w-full"
          />
        </div>

        {/* Use Current Location */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="flex items-center gap-2 text-brand-500 hover:text-brand-600 transition-colors w-full"
        >
          <MapPin className="h-5 w-5" />
          <span className="text-14 font-medium">Use My Current location</span>
        </button>

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-2">
            <h3 className="text-14 font-semibold text-gray-900">Search Results</h3>
            <div className="space-y-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(location => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => handleSelectLocation(location.name)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    <p className="text-14 font-semibold text-gray-900">{location.name}</p>
                    <p className="text-12 text-gray-500 mt-1">{location.address}</p>
                  </button>
                ))
              ) : (
                <p className="text-14 text-gray-500 text-center py-4">
                  No locations found
                </p>
              )}
            </div>
          </div>
        )}

        {/* Default Results */}
        {!searchQuery && (
          <div className="space-y-2">
            <h3 className="text-14 font-semibold text-gray-900">Search Results</h3>
            <div className="space-y-2">
              {locations.map(location => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleSelectLocation(location.name)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                >
                  <p className="text-14 font-semibold text-gray-900">{location.name}</p>
                  <p className="text-12 text-gray-500 mt-1">{location.address}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

