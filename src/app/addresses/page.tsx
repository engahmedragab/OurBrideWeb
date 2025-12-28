'use client'

import { useState } from 'react'
import { UserPageLayout } from '@/components/layout'
import {
  PageHeader,
  ErrorDisplay,
  LoadingOverlay,
  AddressModal,
  Button,
  EmptyState,
} from '@/components/ui'
import { useAddresses, useDeleteAddress, useCreateAddress, useUpdateAddress } from '@/hooks'
import type { AddressResponse } from '@/types/responses'
import { MapPin, Plus, Edit, Trash2, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toaster'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

export default function AddressesPage() {
  const { addToast } = useToast()
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null)

  // Fetch addresses
  const addressesQuery = useAddresses()
  const { data: addresses = [], isLoading: isLoadingAddresses, error: addressesError, isFetching, status, fetchStatus } = addressesQuery

  // Debug logging
  console.log('[AddressesPage] Component render', {
    addressesCount: addresses.length,
    addresses,
    isLoading: isLoadingAddresses,
    isFetching,
    status,
    fetchStatus,
    error: addressesError,
    queryEnabled: addressesQuery.isEnabled,
  })
  const deleteAddressMutation = useDeleteAddress()
  const createAddressMutation = useCreateAddress()
  const updateAddressMutation = useUpdateAddress()

  const handleAddAddress = () => {
    setEditingAddress(null)
    setShowAddressModal(true)
  }

  const handleEditAddress = (address: AddressResponse) => {
    setEditingAddress(address)
    setShowAddressModal(true)
  }

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      await deleteAddressMutation.mutateAsync(addressId)
      addToast('Address deleted successfully', 'success')
    } catch (error) {
      console.error('Failed to delete address:', error)
      addToast(
        error instanceof Error ? error.message : 'Failed to delete address',
        'error'
      )
    }
  }

  const handleModalSuccess = () => {
    setShowAddressModal(false)
    setEditingAddress(null)
  }

  // Show loading state
  if (isLoadingAddresses) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Delivery Addresses"
          rightContent={
            <Button
              variant="default"
              size="sm"
              onClick={handleAddAddress}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          }
        />
        <LoadingOverlay
          open={true}
          title="Loading addresses..."
          subtitle="Please wait a moment"
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (addressesError) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Delivery Addresses"
          rightContent={
            <Button
              variant="default"
              size="sm"
              onClick={handleAddAddress}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          }
        />
        <ErrorDisplay
          title="Error loading addresses"
          message="Please try again later"
          actionLabel="Back to Home"
          actionHref="/"
        />
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <PageHeader
        title="Delivery Addresses"
        subtitle={
          addresses.length > 0
            ? `${addresses.length} ${addresses.length === 1 ? 'Address' : 'Addresses'}`
            : undefined
        }
        rightContent={
          <Button
            variant="default"
            size="sm"
            onClick={handleAddAddress}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        }
      />

      {/* Content Area */}
      {addresses.length === 0 ? (
        <EmptyState
          illustration={orderEmptySvg}
          title="You don't have any delivery addresses"
          description="Add your first delivery address to make checkout faster"
          actionLabel="Add Address"
          onAction={handleAddAddress}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                'bg-white border-2 rounded-lg p-4 hover:border-brand-400 transition-all',
                address.isPrimary ? 'border-brand-400' : 'border-gray-200'
              )}
            >
              {/* Address Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <MapPin className="h-5 w-5 text-brand-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-16 font-semibold text-gray-900 truncate">
                      {address.nameEn || address.nameAr || 'Delivery Address'}
                    </h3>
                    {address.isPrimary && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-10 font-medium text-brand-600 bg-brand-50 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-2 mb-4">
                <p className="text-14 text-gray-700">
                  {address.street || address.addressEn || address.addressAr || ''}
                </p>
                {address.building && (
                  <div className="flex items-center gap-2 text-12 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>
                      {[address.building, address.floor, address.apartment]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
                <p className="text-14 text-gray-600">
                  {address.cityName && `${address.cityName}, `}
                  {address.countryName || 'Egypt'}
                </p>
                {address.contactPhone && (
                  <p className="text-14 text-gray-600">Phone: {address.contactPhone}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAddress(address)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteAddress(address.id)}
                  disabled={deleteAddressMutation.isPending}
                  className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false)
          setEditingAddress(null)
        }}
        address={editingAddress}
        onSuccess={handleModalSuccess}
      />

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={
          deleteAddressMutation.isPending ||
          createAddressMutation.isPending ||
          updateAddressMutation.isPending
        }
        title={
          deleteAddressMutation.isPending
            ? 'Deleting address...'
            : createAddressMutation.isPending || updateAddressMutation.isPending
              ? 'Saving address...'
              : 'Processing...'
        }
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}

