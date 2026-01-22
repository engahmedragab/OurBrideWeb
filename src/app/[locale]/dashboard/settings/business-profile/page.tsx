'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import { UserPageLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { useToast } from '@/components/ui/Toaster'
import {
  useProviderPublicProfileSettings,
  useUpdateProviderPublicProfileSettings,
} from '@/hooks/providers'
import { LoadingSpinner } from '@/components/ui'
import type { UpdateProviderPublicProfileSettingsRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Business Profile Settings Page
 * Allows providers to manage their public profile settings including logo and banner images
 */
export default function BusinessProfilePage() {
  const router = useRouter()
  const { addToast } = useToast()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const profileImageInputRef = useRef<HTMLInputElement>(null)

  // TODO: Get providerId from auth context or route params
  // For now, using a placeholder - you'll need to get this from your auth system
  const providerId = 1 // Replace with actual providerId from auth context

  const { data: settings, isLoading, error } = useProviderPublicProfileSettings(
    providerId,
    typeof window !== 'undefined'
  )
  const updateMutation = useUpdateProviderPublicProfileSettings()

  const [formData, setFormData] = useState<UpdateProviderPublicProfileSettingsRequest>({
    isPublicProfileEnabled: false,
    publicProfileSlug: null,
    showName: true,
    showDescription: true,
    showPhoneNumber: true,
    showAddress: true,
    showBranches: true,
    showServices: true,
    showProducts: true,
    showReviews: true,
    showRatings: true,
    showLinks: true,
    showWorkingHours: true,
    showPaymentMethods: true,
    showVerificationBadge: true,
    publicDescriptionAr: null,
    publicDescriptionEn: null,
    publicBannerImageUrl: null,
    publicLogoImageUrl: null,
    seoMetaTitle: null,
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        ...settings,
      }))
      if (settings.publicLogoImageUrl) {
        setLogoPreview(settings.publicLogoImageUrl)
      }
      if (settings.publicBannerImageUrl) {
        setBannerPreview(settings.publicBannerImageUrl)
      }
      if (settings.profileImageUrl) {
        setProfileImagePreview(settings.profileImageUrl)
      }
    }
  }, [settings])

  const handleInputChange = (
    field: keyof UpdateProviderPublicProfileSettingsRequest,
    value: string | boolean | null
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // TODO: Upload image to server and get URL
      // For now, we'll use the preview URL as placeholder
      // You'll need to implement image upload to your storage service
      // and then set formData.publicLogoImageUrl with the returned URL
    }
  }

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // TODO: Upload image to server and get URL
      // For now, we'll use the preview URL as placeholder
      // You'll need to implement image upload to your storage service
      // and then set formData.publicBannerImageUrl with the returned URL
    }
  }

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // TODO: Upload image to server and get URL
      // For now, we'll use the preview URL as placeholder
      // You'll need to implement image upload to your storage service
      // and then set formData.profileImageUrl with the returned URL
    }
  }

  const handleSave = async () => {
    try {
      // TODO: If images were uploaded, replace preview URLs with actual uploaded URLs
      // For now, using the preview URLs - you'll need to upload first and get URLs

      await updateMutation.mutateAsync({
        providerId,
        data: {
          ...formData,
          publicLogoImageUrl: logoPreview || formData.publicLogoImageUrl,
          publicBannerImageUrl: bannerPreview || formData.publicBannerImageUrl,
        },
      })

      addToast('Business profile settings updated successfully', 'success')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update business profile settings'
      addToast(errorMessage, 'error')
    }
  }

  const handleLogoUploadClick = () => {
    logoInputRef.current?.click()
  }

  const handleBannerUploadClick = () => {
    bannerInputRef.current?.click()
  }

  const handleProfileImageUploadClick = () => {
    profileImageInputRef.current?.click()
  }

  if (isLoading) {
    return (
      <UserPageLayout>
        <LoadingSpinner text="Loading business profile settings..." fullScreen={true} />
      </UserPageLayout>
    )
  }

  if (error) {
    return (
      <UserPageLayout>
        <div className="text-center py-12">
          <ErrorModal
            open={true}
            title="Failed to Load Business Profile Settings"
            message="Failed to load business profile settings. Please try again."
            onRetry={() => window.location.reload()}
            onClose={() => {}}
          />
        </div>
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      <div className="flex flex-col space-y-6">
        {/* Header with Save Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-18 font-normal text-gray-900">Business Profile Settings</h2>
          <Button
            variant="ghost"
            className="text-14 font-normal text-brand-500 hover:text-brand-600 hover:bg-transparent p-0 h-auto"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section: Images */}
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h3 className="text-16 font-normal text-gray-900 mb-4">Profile Image</h3>
              <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-6">
                {profileImagePreview || formData.profileImageUrl ? (
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={profileImagePreview || formData.profileImageUrl || ''}
                      alt="Profile"
                      fill
                      sizes="128px"
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center mb-4">
                    <p className="text-14 text-gray-500 mb-2">No profile image uploaded</p>
                  </div>
                )}

                <button
                  onClick={handleProfileImageUploadClick}
                  className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
                  disabled={updateMutation.isPending}
                >
                  {profileImagePreview || formData.profileImageUrl
                    ? 'Change Profile Image'
                    : 'Upload Profile Image'}
                </button>

                <input
                  ref={profileImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />

                {formData.profileImageUrl && (
                  <div className="mt-4 text-center">
                    <p className="text-12 text-gray-500">Current URL:</p>
                    <p className="text-12 text-gray-700 break-all">{formData.profileImageUrl}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Logo Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h3 className="text-16 font-normal text-gray-900 mb-4">Logo Image</h3>
              <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-6">
                {logoPreview || formData.publicLogoImageUrl ? (
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={logoPreview || formData.publicLogoImageUrl || ''}
                      alt="Logo"
                      fill
                      sizes="128px"
                      className="rounded-lg object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center mb-4">
                    <p className="text-14 text-gray-500 mb-2">No logo uploaded</p>
                  </div>
                )}

                <button
                  onClick={handleLogoUploadClick}
                  className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
                  disabled={updateMutation.isPending}
                >
                  {logoPreview || formData.publicLogoImageUrl
                    ? 'Change Logo'
                    : 'Upload Logo'}
                </button>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />

                {formData.publicLogoImageUrl && (
                  <div className="mt-4 text-center">
                    <p className="text-12 text-gray-500">Current URL:</p>
                    <p className="text-12 text-gray-700 break-all">{formData.publicLogoImageUrl}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h3 className="text-16 font-normal text-gray-900 mb-4">Banner Image</h3>
              <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-6">
                {bannerPreview || formData.publicBannerImageUrl ? (
                  <div className="relative w-full h-32 mb-4">
                    <Image
                      src={bannerPreview || formData.publicBannerImageUrl || ''}
                      alt="Banner"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-lg object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center mb-4">
                    <p className="text-14 text-gray-500 mb-2">No banner uploaded</p>
                  </div>
                )}

                <button
                  onClick={handleBannerUploadClick}
                  className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
                  disabled={updateMutation.isPending}
                >
                  {bannerPreview || formData.publicBannerImageUrl
                    ? 'Change Banner'
                    : 'Upload Banner'}
                </button>

                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />

                {formData.publicBannerImageUrl && (
                  <div className="mt-4 text-center">
                    <p className="text-12 text-gray-500">Current URL:</p>
                    <p className="text-12 text-gray-700 break-all">
                      {formData.publicBannerImageUrl}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section: Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="text-16 font-normal text-gray-900 mb-6">Profile Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Public Profile Slug
                </label>
                <Input
                  value={formData.publicProfileSlug || ''}
                  onChange={e => handleInputChange('publicProfileSlug', e.target.value || null)}
                  placeholder="public-profile-slug"
                  variant="default"
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Description (English)
                </label>
                <textarea
                  value={formData.publicDescriptionEn || ''}
                  onChange={e =>
                    handleInputChange('publicDescriptionEn', e.target.value || null)
                  }
                  placeholder="Enter description in English"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Description (Arabic)
                </label>
                <textarea
                  value={formData.publicDescriptionAr || ''}
                  onChange={e =>
                    handleInputChange('publicDescriptionAr', e.target.value || null)
                  }
                  placeholder="Enter description in Arabic"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  SEO Meta Title
                </label>
                <Input
                  value={formData.seoMetaTitle || ''}
                  onChange={e => handleInputChange('seoMetaTitle', e.target.value || null)}
                  placeholder="SEO Meta Title"
                  variant="default"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserPageLayout>
  )
}


