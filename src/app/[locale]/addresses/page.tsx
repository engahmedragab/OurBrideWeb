'use client'

import { useState, useEffect } from 'react'
import { UserPageLayout } from '@/components/layout'
import {
  PageHeader,
  ErrorDisplay,
  AddressModal,
  Button,
  EmptyState,
  LoadingSpinner,
} from '@/components/ui'
import { useAddresses, useDeleteAddress, useCreateAddress, useUpdateAddress, useSetDefaultAddress } from '@/hooks'
import type { DeliveryAddressResponse } from '@/types/responses'
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toaster'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import { useI18nTranslations } from '@/i18n'
import { ConfirmDialog } from '@/components/planning'

export default function AddressesPage() {
  const t = useI18nTranslations('deliveryAddresses')
  const tCommon = useI18nTranslations('common')
  const { addToast } = useToast()
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<DeliveryAddressResponse | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch addresses - disable during SSR to prevent hydration mismatch
  const addressesQuery = useAddresses({ enabled: isMounted })
  const { data: addresses = [], isLoading: isLoadingAddresses, error: addressesError } = addressesQuery
  const deleteAddressMutation = useDeleteAddress()
  const createAddressMutation = useCreateAddress()
  const updateAddressMutation = useUpdateAddress()
  const setDefaultAddressMutation = useSetDefaultAddress()

  const handleAddAddress = () => {
    setEditingAddress(null)
    setShowAddressModal(true)
  }

  const handleEditAddress = (address: DeliveryAddressResponse) => {
    setEditingAddress(address)
    setShowAddressModal(true)
  }

  const handleDeleteAddress = (addressId: number) => {
    setAddressToDelete(addressId)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDeleteAddress = async () => {
    if (!addressToDelete) return

    try {
      await deleteAddressMutation.mutateAsync(addressToDelete)
      addToast(t('deleteSuccess'), 'success')
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : t('deleteError'),
        'error'
      )
    } finally {
      setIsDeleteConfirmOpen(false)
      setAddressToDelete(null)
    }
  }

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      await setDefaultAddressMutation.mutateAsync(addressId)
      addToast(t('defaultSuccess'), 'success')
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : t('defaultError'),
        'error'
      )
    }
  }

  const handleModalSuccess = () => {
    setShowAddressModal(false)
    setEditingAddress(null)
  }

  // Show loading state (during SSR or while fetching)
  if (!isMounted || isLoadingAddresses) {
    return (
      <UserPageLayout>
        <PageHeader
          title={t('title')}
          rightContent={
            <Button
              variant="default"
              size="sm"
              onClick={handleAddAddress}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('addAddress')}
            </Button>
          }
        />
        <LoadingSpinner
        fullScreen={true} size="xl"
          open={true}
          text={`${t('loadingTitle')} ${t('loadingSubtitle')}`}
      
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (addressesError) {
    return (
      <UserPageLayout>
        <PageHeader
          title={t('title')}
          rightContent={
            <Button
              variant="default"
              size="sm"
              onClick={handleAddAddress}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('addAddress')}
            </Button>
          }
        />
        <ErrorDisplay
          title={t('errorTitle')}
          message={t('errorMessage')}
          actionLabel={t('errorAction')}
          actionHref="/"
        />
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <PageHeader
        title={t('title')}
        subtitle={
          addresses.length > 0
            ? t('count', { count: addresses.length })
            : undefined
        }
        rightContent={
          addresses.length > 0 ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleAddAddress}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('addAddress')}
            </Button>
          ) : null
        }
      />

      {/* Content Area */}
      {addresses.length === 0 ? (
        <EmptyState
          illustration={orderEmptySvg}
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          actionLabel={t('addAddress')}
          actionHref=""
          onAction={handleAddAddress}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                'bg-white border-2 rounded-lg p-5 hover:border-brand-400 transition-all shadow-sm hover:shadow-md',
                address.isDefault ? 'border-brand-400 shadow-brand-100' : 'border-gray-200'
              )}
            >
              {/* Address Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
                    address.isDefault ? 'bg-brand-100' : 'bg-gray-100'
                  )}>
                    <MapPin className={cn(
                      'h-5 w-5',
                      address.isDefault ? 'text-brand-600' : 'text-gray-600'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-16 font-semibold text-gray-900 truncate">
                      {address.contactName || t('contactFallback')}
                    </h3>
                    {address.isDefault && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-brand-600 text-brand-600" />
                        <span className="text-10 font-medium text-brand-600">
                          {t('defaultLabel')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-2 mb-4">
                <p className="text-14 font-medium text-gray-900">
                  {address.address1 || ''}
                </p>
                {address.address2 && (
                  <p className="text-14 text-gray-600">{address.address2}</p>
                )}
                <p className="text-14 text-gray-600">
                  {address.city && `${address.city}, `}
                  {address.state && `${address.state}, `}
                  {address.country || t('countryFallback')}
                  {address.postcode && ` ${address.postcode}`}
                </p>
                <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
                  {address.contactNumber1 && (
                    <p className="text-13 text-gray-600 flex items-center gap-1">
                      <span className="font-medium">{t('phone')}</span> {address.contactNumber1}
                    </p>
                  )}
                  {address.contactNumber2 && (
                    <p className="text-13 text-gray-600 flex items-center gap-1">
                      <span className="font-medium">{t('altPhone')}</span> {address.contactNumber2}
                    </p>
                  )}
                  {address.email && (
                    <p className="text-13 text-gray-600 flex items-center gap-1">
                      <span className="font-medium">{t('email')}</span> {address.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefaultAddress(address.id)}
                    disabled={setDefaultAddressMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 border-brand-200"
                  >
                    <Star className="h-4 w-4" />
                    {t('setDefault')}
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {t('edit')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={deleteAddressMutation.isPending}
                    className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('delete')}
                  </Button>
                </div>
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

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title={t('delete')}
        description={t('confirmDelete')}
        confirmText={t('delete')}
        cancelText={tCommon('cancel')}
        onConfirm={handleConfirmDeleteAddress}
        onCancel={() => {
          setIsDeleteConfirmOpen(false)
          setAddressToDelete(null)
        }}
      />

      {/* Loading Overlay for Mutations */}
      <LoadingSpinner
        open={
          deleteAddressMutation.isPending ||
          createAddressMutation.isPending ||
          updateAddressMutation.isPending ||
          setDefaultAddressMutation.isPending
        }
        fullScreen={true}
        size="xl"
        text={`${
          deleteAddressMutation.isPending
            ? t('deleteLoading')
            : setDefaultAddressMutation.isPending
              ? t('defaultLoading')
              : createAddressMutation.isPending || updateAddressMutation.isPending
                ? t('saveLoading')
                : t('processing')
        }\n${t('loadingSubtitle')}`}
      />
    </UserPageLayout>
  )
}
 
