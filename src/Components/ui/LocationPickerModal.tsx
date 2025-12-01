'use client'

import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'

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

  // Mock location data
  const locations = [
    {
      id: 'giza',
      name: 'Giza',
      address: '1st District, First of October, Giza Governorate, October City',
    },
    
  ]

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectLocation = (location: string) => {
    onSelect(location)
    onClose()
  }

  const handleUseCurrentLocation = () => {
    // Mock current location
    onSelect('Current Location')
    onClose()
  }

  // Show filtered results if search query exists, otherwise show all
  const displayLocations = searchQuery ? filteredLocations : locations

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Set Location"
      maxWidth="sm"
      containerClassName="max-w-[400px]"
      contentClassName="p-4 sm:p-6"
    >
      <div className="space-y-6 ">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search For Location ...."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 px-4 pr-10 rounded-lg border border-gray-200 text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-brand-500 transition-colors"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none" />
        </div>

        {/* Use Current Location */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="flex items-center gap-2 text-brand-500 hover:text-brand-600 transition-colors w-full"
        >
          <MapPin className="h-5 w-5 text-brand-500" />
          <span className="text-14 font-medium">Use My Current location</span>
        </button>

        {/* Search Results */}
        <div className="space-y-4">
          <h3 className="text-14 font-semibold text-gray-900">Search Results</h3>
          <div className="space-y-3">
            {displayLocations.length > 0 ? (
              displayLocations.map(location => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleSelectLocation(location.name)}
                  className="w-full text-left p-0 hover:opacity-80 transition-opacity"
                >
                  <p className="text-16 font-regular text-gray-900">{location.name},</p>
                  <p className="text-12 text-gray-500 mt-0.5">{location.address}</p>
                </button>
              ))
            ) : (
              <p className="text-14 text-gray-500 text-center py-4">
                No locations found
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

