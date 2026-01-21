'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useI18nLocale } from '@/i18n'
import { UserPageLayout } from '@/components/layout'
import { Button, Input, LoadingSpinner, SelectPopover, DatePicker } from '@/components/ui'
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
  const pathname = usePathname()
  const { user: authUser } = useAuth()
  const currentLocale = useI18nLocale()

  // Fetch profile data
  const { data: profileData, isLoading: isLoadingProfile } = useUserProfileData()
  const { data: mineInfo } = useMineInfo()
  const updateMutation = useUpdateUserProfile()

  // Extract user data from mineInfo (fallback to profileData)
  // Handle different response structures: mineInfo.data.userProfile.user or mineInfo.userProfile.user
  const mineInfoAny = mineInfo as unknown as { data?: { userProfile?: { user?: unknown } }; userProfile?: { user?: unknown } } | Record<string, unknown>
  const data = (mineInfoAny?.data || mineInfoAny || {}) as { userProfile?: { user?: unknown } }
  const userProfile = (data?.userProfile || {}) as { user?: unknown }
  const userData = (userProfile?.user || profileData || authUser) as Record<string, unknown>

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
          const birthDateValue = userData.birthDate
          if (typeof birthDateValue === 'string' || typeof birthDateValue === 'number' || birthDateValue instanceof Date) {
            const date = new Date(birthDateValue)
            if (!isNaN(date.getTime())) {
              formattedBirthDate = date.toISOString().split('T')[0]
            }
          }
        } catch {
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

      // Map current locale to Language enum if user doesn't have a language preference
      let languageValue: Language | '' = (userData.language as Language) || ''
      if (!languageValue) {
        // If no language preference, use current locale
        languageValue = currentLocale === 'ar' ? Language.Arabic : Language.English
      }

      setFormData({
        firstName: (typeof userData.firstName === 'string' ? userData.firstName : '') || '',
        lastName: (typeof userData.lastName === 'string' ? userData.lastName : '') || '',
        gender: genderValue,
        mobileNumber: (typeof userData.phoneNumber === 'string' ? userData.phoneNumber : '') || '',
        email: (typeof userData.email === 'string' ? userData.email : '') || '',
        profileUrl: (typeof userData.profileUrl === 'string' ? userData.profileUrl : '') || '',
        profileMedia: null,
        personal: (typeof userData.personal === 'string' ? userData.personal : '') || '',
        personalType: (userData.personalType as PersonalType) || '',
        birthDate: formattedBirthDate,
        customTag: (typeof userData.customTag === 'string' ? userData.customTag : '') || '',
        language: languageValue,
        countryId: (typeof userData.countryId === 'number' ? userData.countryId : null),
      })
    }
  }, [userData, currentLocale])

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
        } catch {
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
          <LoadingSpinner size="lg" text="Loading profile..." fullScreen={true} />
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
                <SelectPopover
                  value={formData.gender || ''}
                  onChange={value => handleInputChange('gender', value as Gender)}
                  options={[
                    { value: '', label: 'Select Gender' },
                    { value: Gender.Unknown, label: 'Unknown' },
                    { value: Gender.Male, label: 'Male' },
                    { value: Gender.Female, label: 'Female' },
                  ]}
                  placeholder="Select Gender"
                />
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
                <SelectPopover
                  value={formData.personalType || ''}
                  onChange={value => handleInputChange('personalType', value as PersonalType)}
                  options={[
                    { value: '', label: 'Select Type' },
                    { value: PersonalType.National, label: 'National ID' },
                    { value: PersonalType.Passport, label: 'Passport' },
                  ]}
                  placeholder="Select Type"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Birth Date
                </label>
                <DatePicker
                  value={formData.birthDate || undefined}
                  onChange={date => {
                    if (typeof date === 'string') {
                      handleInputChange('birthDate', date)
                    } else if (date instanceof Date) {
                      handleInputChange('birthDate', date.toISOString().split('T')[0])
                    } else {
                      handleInputChange('birthDate', '')
                    }
                  }}
                  placeholder="Select Birth Date"
                  dateFormat="string"
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
                <SelectPopover
                  value={formData.language || ''}
                  onChange={value => {
                    const newLanguage = value as Language
                    handleInputChange('language', newLanguage)
                    
                    // Update the app locale when language changes
                    // Map Language enum to locale
                    const localeMap: Record<Language, 'ar' | 'en'> = {
                      [Language.Arabic]: 'ar',
                      [Language.English]: 'en',
                    }
                    
                    const newLocale = localeMap[newLanguage]
                    if (newLocale && newLocale !== currentLocale) {
                      // Construct the new URL with the new locale prefix
                      const newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`
                      
                      // Use window.location to navigate to the new locale path
                      // This will trigger the middleware to handle locale switching and direction change
                      if (typeof window !== 'undefined') {
                        window.location.href = newPath
                      }
                    }
                  }}
                  options={[
                    { value: Language.Arabic, label: 'العربية' },
                    { value: Language.English, label: 'English' },
                  ]}
                  placeholder="Select Language"
                />
              </div>

              <div>
                <label className="block text-14 font-normal text-gray-700 mb-2">
                  Country
                </label>
                <SelectPopover
                  value={formData.countryId?.toString() || ''}
                  onChange={value => handleInputChange('countryId', value ? parseInt(value, 10) : null)}
                  options={[
                    { value: '', label: 'Select Country' },
                    ...(countries?.map(country => ({
                      value: country.id.toString(),
                      label: country.nameEn || country.nameAr || `Country ${country.id}`,
                    })) || []),
                  ]}
                  placeholder="Select Country"
                  disabled={isLoadingCountries}
                />
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
