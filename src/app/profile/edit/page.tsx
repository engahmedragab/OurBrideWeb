'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { UserPageLayout } from '@/components/layout'
import { Button, Input, LoadingSpinner } from '@/components/ui'
import { useUserProfileData, useUpdateUserProfile } from '@/hooks/profile/useProfile'
import { useMineInfo } from '@/hooks/home'
import { useAuth } from '@/auth'

/**
 * Profile Edit Page
 * Allows users to edit their personal information and profile picture
 */
export default function ProfileEditPage() {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Fetch profile data
  const { data: profileData, isLoading: isLoadingProfile } = useUserProfileData()
  const { data: mineInfo } = useMineInfo()
  const updateMutation = useUpdateUserProfile()

  // Extract user data from mineInfo (fallback to profileData)
  const userData = mineInfo?.data?.userProfile?.user || profileData || authUser

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobileNumber: '',
    email: '',
    profileUrl: '',
  })

  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/200')

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        gender: typeof userData.gender === 'string' ? userData.gender : String(userData.gender || ''),
        mobileNumber: userData.phoneNumber || '',
        email: userData.email || '',
        profileUrl: userData.profileUrl || '',
      })
      if (userData.profileUrl) {
        setProfileImage(userData.profileUrl)
      }
    }
  }, [userData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      // Convert gender to number if needed (API might expect number)
      const genderValue = formData.gender
      
      await updateMutation.mutateAsync({
        id: userData?.id || undefined,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        gender: genderValue || null,
        phoneNumber: formData.mobileNumber || null,
        email: formData.email || null,
        profileUrl: profileImage !== 'https://via.placeholder.com/200' ? profileImage : null,
      })
      
      // Navigate back to profile page after successful save
      router.push('/profile')
    } catch (error) {
      // Error is handled by the mutation's onError handler
      console.error('Failed to save profile:', error)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfileImage(result)
        // Update formData profileUrl
        setFormData(prev => ({ ...prev, profileUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
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
                <Input
                  value={formData.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  placeholder="Gender"
                  variant="default"
                  size="lg"
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
            </div>
          </div>

          {/* Right Section: Profile Picture */}
          <div>
            <h2 className="text-18 font-normal text-gray-900 mb-6">
              Profile Picture
            </h2>

            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6">
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  sizes="(max-width: 640px) 128px, 160px"
                  className="rounded-full object-cover"
                />
              </div>

              <button
                onClick={handleUploadClick}
                className="text-14 font-normal text-brand-500 hover:text-brand-600 transition-colors"
              >
                Upload a new Picture
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </UserPageLayout>
  )
}
