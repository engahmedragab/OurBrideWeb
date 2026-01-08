'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPageLayout } from '@/components/layout'
import { Button, Input, LoadingSpinner, Select, DatePicker } from '@/components/ui'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { useUserProfileData, useUpdateUserProfile } from '@/hooks/profile/useProfile'
import { useMineInfo } from '@/hooks/home'
import { useAuth } from '@/auth'
import { useCountries } from '@/hooks/location/useLocations'
import { PersonalType, Language, Gender, Source, TenantScopeLevel, MediaType, CommonEntityStatus } from '@/../client/common/api/gen/ourbride-api'
import type { MediaRequest, UserRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Profile Edit Page
 * Allows users to edit their personal information and profile picture
 */
export default function ProfileEditPage() {
  const router = useRouter()
  const { user: authUser } = useAuth()

  // Fetch profile data
  const { data: profileData, isLoading: isLoadingProfile } = useUserProfileData()
  const { data: mineInfo } = useMineInfo()
  const updateMutation = useUpdateUserProfile()

  // Extract user data from mineInfo (fallback to profileData)
  // Handle different response structures: mineInfo.data.userProfile.user or mineInfo.userProfile.user
  const mineInfoAny = mineInfo as any
  const data: any = mineInfoAny?.data || mineInfoAny || {}
  const userProfile: any = data?.userProfile || {}
  const userData = userProfile?.user || profileData || authUser

  const [formData, setFormData] = useState<{
    firstName: string
    lastName: string
    gender: Gender | ''
    mobileNumber: string
    email: string
    profileUrl: string
    profileMedia: MediaRequest | null
    personal: string
    personalType: PersonalType | ''
    birthDate: string
    customTag: string
    language: Language | ''
    countryId: number | null
  }>({
    firstName: '',
    lastName: '',
    gender: '' as Gender | '',
    mobileNumber: '',
    email: '',
    profileUrl: '',
    profileMedia: null,
    personal: '',
    personalType: '' as PersonalType | '',
    birthDate: '',
    customTag: '',
    language: '' as Language | '',
    countryId: null,
  })

  // Fetch countries for country selector
  const { data: countries, isLoading: isLoadingCountries } = useCountries()

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (userData) {
      // Format birthDate for DatePicker (YYYY-MM-DD format)
      let formattedBirthDate = ''
      if (userData.birthDate) {
        try {
          const date = new Date(userData.birthDate)
          if (!isNaN(date.getTime())) {
            formattedBirthDate = date.toISOString().split('T')[0]
          }
        } catch (e) {
          console.warn('Invalid birthDate format:', userData.birthDate)
        }
      }

      // Map gender to Gender enum
      let genderValue: Gender | '' = ''
      if (userData.gender !== undefined && userData.gender !== null) {
        if (typeof userData.gender === 'string') {
          // Check if it's already a valid Gender enum value
          if (Object.values(Gender).includes(userData.gender as Gender)) {
            genderValue = userData.gender as Gender
          } else {
            // Map common string values to enum
            const genderLower = userData.gender.toLowerCase()
            if (genderLower === 'male' || genderLower === 'm') {
              genderValue = Gender.Male
            } else if (genderLower === 'female' || genderLower === 'f') {
              genderValue = Gender.Female
            } else {
              genderValue = Gender.Unknown
            }
          }
        } else if (typeof userData.gender === 'number') {
          // If it's a number, map to enum (0=Unknown, 1=Male, 2=Female typically)
          const genderMap: Record<number, Gender> = {
            0: Gender.Unknown,
            1: Gender.Male,
            2: Gender.Female,
          }
          genderValue = genderMap[userData.gender] || Gender.Unknown
        }
      }

      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        gender: genderValue,
        mobileNumber: userData.phoneNumber || '',
        email: userData.email || '',
        profileUrl: userData.profileUrl || '',
        profileMedia: null,
        personal: userData.personal || '',
        personalType: (userData.personalType as PersonalType) || '',
        birthDate: formattedBirthDate,
        customTag: userData.customTag || '',
        language: (userData.language as Language) || '',
        countryId: userData.countryId || null,
      })
    }
  }, [userData])

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      // Format birthDate to ISO string if provided
      let formattedBirthDate: string | null = null
      if (formData.birthDate) {
        try {
          const date = new Date(formData.birthDate)
          if (!isNaN(date.getTime())) {
            formattedBirthDate = date.toISOString()
          }
        } catch (e) {
          console.warn('Invalid birthDate format:', formData.birthDate)
        }
      }

      // Build the request object with proper UserRequest type
      const requestData: UserRequest = {
        id: userData?.id ? String(userData.id) : null,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        gender: formData.gender || null,
        phoneNumber: formData.mobileNumber || null,
        email: formData.email || null,
        profileUrl: formData.profileUrl || null,
        profileMedia: formData.profileMedia || undefined,
        personal: formData.personal || null,
        personalType: formData.personalType || undefined,
        birthDate: formattedBirthDate,
        customTag: formData.customTag || null,
        language: formData.language || undefined,
        countryId: formData.countryId,
      }

      // Ensure we have at least the id field
      if (!requestData.id) {
        throw new Error('Cannot update profile: user ID is required')
      }

      console.log('Sending profile update request:', JSON.stringify(requestData, null, 2))

      await updateMutation.mutateAsync(requestData)

      // Navigate back to profile page after successful save
      router.push('/profile')
    } catch (error) {
      // Error is handled by the mutation's onError handler
      console.error('Failed to save profile:', error)
    }
  }

  const handleImageUploaded = (url: string, mediaData?: Record<string, unknown>) => {
    // Create MediaRequest from upload response
    let mediaRequest: MediaRequest | null = null

    if (mediaData) {
      // Map the upload response to MediaRequest format
      mediaRequest = {
        sourceId: (typeof mediaData.sourceId === 'number' ? mediaData.sourceId : 0),
        source: (mediaData.source as Source) || Source.User,
        providerId: (typeof mediaData.providerId === 'number' ? mediaData.providerId : null),
        branchId: (typeof mediaData.branchId === 'number' ? mediaData.branchId : null),
        staffId: (typeof mediaData.staffId === 'string' ? mediaData.staffId : null),
        userId: (typeof mediaData.userId === 'string' ? mediaData.userId : null),
        scopeLevel: (mediaData.scopeLevel as TenantScopeLevel) || TenantScopeLevel.Global,
        isGlobal: Boolean(mediaData.isGlobal),
        isInherited: Boolean(mediaData.isInherited),
        parentId: (typeof mediaData.parentId === 'number' ? mediaData.parentId : null),
        nameAr: (typeof mediaData.nameAr === 'string' ? mediaData.nameAr : (typeof mediaData.fileName === 'string' ? mediaData.fileName : null)),
        nameEn: (typeof mediaData.nameEn === 'string' ? mediaData.nameEn : (typeof mediaData.fileName === 'string' ? mediaData.fileName : null)),
        descriptionEn: (typeof mediaData.descriptionEn === 'string' ? mediaData.descriptionEn : null),
        descriptionAr: (typeof mediaData.descriptionAr === 'string' ? mediaData.descriptionAr : null),
        alt: (typeof mediaData.alt === 'string' ? mediaData.alt : (typeof mediaData.fileName === 'string' ? mediaData.fileName : null)),
        size: (typeof mediaData.size === 'number' ? mediaData.size : null),
        fileId: (typeof mediaData.fileId === 'string' ? mediaData.fileId : null),
        fileName: (typeof mediaData.fileName === 'string' ? mediaData.fileName : null),
        fileExtension: (typeof mediaData.fileExtension === 'string' ? mediaData.fileExtension : null),
        mimeType: (typeof mediaData.mimeType === 'string' ? mediaData.mimeType : null),
        url: (typeof mediaData.url === 'string' ? mediaData.url : url),
        thumbnailUrl: (typeof mediaData.thumbnailUrl === 'string' ? mediaData.thumbnailUrl : null),
        previewUrl: (typeof mediaData.previewUrl === 'string' ? mediaData.previewUrl : null),
        originalUrl: (typeof mediaData.originalUrl === 'string' ? mediaData.originalUrl : null),
        mediaType: (mediaData.mediaType as MediaType) || MediaType.Image,
        width: (typeof mediaData.width === 'number' ? mediaData.width : null),
        height: (typeof mediaData.height === 'number' ? mediaData.height : null),
        duration: (typeof mediaData.duration === 'number' ? mediaData.duration : null),
        resolution: (typeof mediaData.resolution === 'string' ? mediaData.resolution : null),
        quality: (typeof mediaData.quality === 'string' ? mediaData.quality : null),
        status: (mediaData.status as CommonEntityStatus) || undefined,
        isPublic: Boolean(mediaData.isPublic),
        isFeatured: Boolean(mediaData.isFeatured),
        isDownloadable: Boolean(mediaData.isDownloadable),
        title: (typeof mediaData.title === 'string' ? mediaData.title : null),
        caption: (typeof mediaData.caption === 'string' ? mediaData.caption : null),
        keywords: (typeof mediaData.keywords === 'string' ? mediaData.keywords : null),
        tags: (typeof mediaData.tags === 'string' ? mediaData.tags : null),
        metadata: (typeof mediaData.metadata === 'string' ? mediaData.metadata : null),
      }
    }

    setFormData(prev => ({
      ...prev,
      profileUrl: url,
      profileMedia: mediaRequest
    }))
  }

  const handleImageRemoved = () => {
    setFormData(prev => ({ ...prev, profileUrl: '', profileMedia: null }))
  }

  if (isLoadingProfile) {
    return (
      <UserPageLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading profile..." />
        </div>
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      <div className="flex flex-col space-y-6">
        {/* Header with Save Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-18 font-normal text-gray-900">
            Personal Information
          </h2>
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
          {/* Left Section: Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  value={formData.firstName}
                  onChange={e => handleInputChange('firstName', e.target.value)}
                  placeholder="First Name"
                  variant="default"
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  value={formData.lastName}
                  onChange={e => handleInputChange('lastName', e.target.value)}
                  placeholder="Last Name"
                  variant="default"
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Gender
                </label>
                <Select
                  value={formData.gender}
                  onChange={e => handleInputChange('gender', e.target.value as Gender)}
                  variant="default"
                  size="lg"
                >
                  <option value="">Select Gender</option>
                  <option value={Gender.Unknown}>Unknown</option>
                  <option value={Gender.Male}>Male</option>
                  <option value={Gender.Female}>Female</option>
                </Select>
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Mobile Number
                </label>
                <Input
                  value={formData.mobileNumber}
                  onChange={e =>
                    handleInputChange('mobileNumber', e.target.value)
                  }
                  placeholder="Mobile Number"
                  variant="default"
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  E-mail
                </label>
                <Input
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="E-mail"
                  variant="default"
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Personal ID / Passport
                </label>
                <Input
                  value={formData.personal}
                  onChange={e => handleInputChange('personal', e.target.value)}
                  placeholder="Personal ID or Passport Number"
                  variant="default"
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Personal ID Type
                </label>
                <Select
                  value={formData.personalType}
                  onChange={e => handleInputChange('personalType', e.target.value as PersonalType)}
                  variant="default"
                  size="lg"
                >
                  <option value="">Select Type</option>
                  <option value={PersonalType.National}>National ID</option>
                  <option value={PersonalType.Passport}>Passport</option>
                </Select>
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Birth Date
                </label>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={e => handleInputChange('birthDate', e.target.value)}
                  placeholder="Birth Date"
                  variant="default"
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Custom Tag
                </label>
                <Input
                  value={formData.customTag}
                  onChange={e => handleInputChange('customTag', e.target.value)}
                  placeholder="Custom Tag"
                  variant="default"
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Language
                </label>
                <Select
                  value={formData.language}
                  onChange={e => handleInputChange('language', e.target.value as Language)}
                  variant="default"
                  size="lg"
                >
                  <option value="">Select Language</option>
                  <option value={Language.Arabic}>Arabic</option>
                  <option value={Language.English}>English</option>
                </Select>
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Country
                </label>
                <Select
                  value={formData.countryId || ''}
                  onChange={e => handleInputChange('countryId', e.target.value ? parseInt(e.target.value, 10) : null)}
                  variant="default"
                  size="lg"
                  disabled={isLoadingCountries}
                >
                  <option value="">Select Country</option>
                  {countries?.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.nameEn || country.nameAr || `Country ${country.id}`}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Right Section: Profile Picture */}
          <div>
            <h2 className="text-18 font-normal text-gray-900 mb-6">
              Profile Picture
            </h2>

            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <ImageUploader
                existingImageUrl={formData.profileUrl}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                uploadButtonText="Upload a new Picture"
                circular={true}
                previewSize="md"
                maxSize={2 * 1024 * 1024} // 2MB
                disabled={updateMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </UserPageLayout>
  )
}
