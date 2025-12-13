'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { UserPageLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'

/**
 * Profile Edit Page
 * Allows users to edit their personal information and profile picture
 */
export default function ProfileEditPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    firstName: 'Aya',
    lastName: 'Mohamed',
    gender: 'Female',
    mobileNumber: '+212533658879',
    email: 'example@example.com',
  })

  const [profileImage, setProfileImage] = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // TODO: Implement save logic
    router.push('/profile')
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
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
          >
            Save Changes
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
