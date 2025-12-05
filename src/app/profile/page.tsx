'use client'

import React, { useState } from 'react'
import { UserPageLayout } from '@/components/layout'
import { Input, Button } from '@/components/ui'
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react'

/**
 * User Profile Page
 * Displays user profile information with personal details form and activity feed
 */
export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: 'Aya',
    lastName: 'Mohamed',
    gender: 'Female',
    phone: '+12123854879',
    email: 'azamohamed@example.com',
  })

  const [profileImage, setProfileImage] = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  )
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Mock user posts/activity data
  const userPosts = [
    {
      id: '1',
      user: {
        name: 'Aya Mohamed',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      date: '15 Aug 2025, 12:28 PM',
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie sit cras at sed lectus porta scelerisque. Tempus odio vitae nulla feugiat ornare non tempor sed maximus semper aliqueti facilisis lacum elementum sagittis enim dignissim nullam nibh tempus turpis erat. Sit id molestie boncus id.',
      images: [],
      likes: 49,
      comments: 31,
    },
    {
      id: '2',
      user: {
        name: 'Aya Mohamed',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      date: '15 Aug 2025, 12:28 PM',
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie sit cras at sed lectus porta scelerisque. Tempus odio vitae nulla feugiat ornare non tempor sed maximus semper aliqueti facilisis lacum elementum sagittis enim dignissim nullam nibh tempus turpis erat. Sit id molestie boncus id.',
      images: [
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
      ],
      likes: 49,
      comments: 39,
    },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving profile:', formData)
    setIsEditing(false)
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

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click()
    }
  }

  return (
    <UserPageLayout>
      <div className="flex gap-6">
        {/* Main Content - Feed */}
        <div className="flex-1 space-y-6">
          <h1 className="text-32 font-semibold text-gray-900">User Profile</h1>

          {/* Posts Feed */}
          <div className="space-y-4">
            {userPosts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.user.image}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 className="text-16 font-semibold text-gray-900">
                        {post.user.name}
                      </h3>
                      <p className="text-12 text-gray-500">{post.date}</p>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-14 text-gray-700 mb-4 leading-relaxed">
                  {post.content}
                </p>

                {/* Post Images */}
                {post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {post.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-14 text-gray-700 hover:text-brand-500 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-14 text-gray-700 hover:text-brand-500 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-14 text-gray-700 hover:text-brand-500 transition-colors ml-auto"
                    aria-label="Share post"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Personal Details */}
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-18 font-semibold text-gray-900">
                Personal Details
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <img
                  src={profileImage}
                  alt="Profile"
                  className={`w-24 h-24 rounded-full object-cover border-2 border-gray-200 ${
                    isEditing ? 'cursor-pointer' : ''
                  }`}
                  onClick={handleImageClick}
                />
                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <span className="text-white text-12 font-medium">
                      Change Photo
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-14 font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  value={formData.firstName}
                  onChange={e => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="First Name"
                  variant={isEditing ? 'default' : 'fill'}
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  value={formData.lastName}
                  onChange={e => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Last Name"
                  variant={isEditing ? 'default' : 'fill'}
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Input
                  value={formData.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Gender"
                  variant={isEditing ? 'default' : 'fill'}
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Phone Number"
                  variant={isEditing ? 'default' : 'fill'}
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-14 font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Email Address"
                  variant={isEditing ? 'default' : 'fill'}
                  size="lg"
                />
              </div>

              {isEditing && (
                <Button
                  variant="brand"
                  className="w-full text-white"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </UserPageLayout>
  )
}
