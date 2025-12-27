'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { UserPageLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { PostCard } from '@/components/community'

/**
 * User Profile Page
 * Displays user profile information with personal details form and activity feed
 */
export default function ProfilePage() {
  const router = useRouter()
  const [profileImage] = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  )

  // Mock user data
  const userData = {
    name: 'Aya Mohamed',
    postsCount: 5,
    followersCount: 150,
    followingsCount: 150,
  }

  // Mock user posts/activity data
  const userPosts = [
    {
      id: '1',
      author: {
        name: 'Aya Mohamed',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      timestamp: '18 Aug 2025 12:45 PM',
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
      images: [],
      likes: 20,
      comments: 20,
      shares: 20,
    },
    {
      id: '2',
      author: {
        name: 'Aya Mohamed',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      timestamp: '18 Aug 2025 12:45 PM',
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
      images: [
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
      ],
      likes: 20,
      comments: 20,
      shares: 20,
    },
  ]

  return (
    <UserPageLayout>
      <div className="flex flex-col space-y-6">
        {/* Profile Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <Image
                src={profileImage}
                alt={userData.name}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="rounded-full object-cover"
              />
            </div>

            {/* Name and Stats */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-18 sm:text-20 font-normal text-gray-900">
                  {userData.name}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-14 font-normal text-brand-500 hover:text-brand-600 hover:bg-transparent p-0 h-auto"
                  onClick={() => router.push('/profile/edit')}
                >
                  Edit
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-14 font-normal text-gray-900">
                  {userData.postsCount} Posts
                </div>
                <div className="text-14 font-normal text-gray-900">
                  {userData.followersCount} Followers
                </div>
                <div className="text-14 font-normal text-gray-900">
                  {userData.followingsCount} Followings
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {userPosts.map(post => {
            // Transform mock data to PostResponse format
            const postResponse = {
              // BaseEntityResponse fields
              id: parseInt(post.id, 10),
              isDeleted: false,
              creationDate: post.timestamp,
              lastModifiedDate: post.timestamp,
              slug: null,
              // PostResponse fields
              title: '',
              content: post.content,
              summary: '',
              isPublished: true,
              isFeatured: false,
              isPinned: false,
              allowComments: true,
              isAnonymous: false,
              contentType: 'text',
              metaTitle: '',
              metaDescription: '',
              keywords: '',
              userId: '1',
              user: {
                id: '1',
                userName: post.author.name,
                firstName: post.author.name.split(' ')[0] || '',
                lastName: post.author.name.split(' ').slice(1).join(' ') || '',
                profileUrl: post.author.avatar,
                email: null,
              } as any,
              viewCount: 0,
              likeCount: post.likes || 0,
              commentCount: post.comments || 0,
              shareCount: post.shares || 0,
              favoriteCount: 0,
              reviewCount: post.comments || 0,
              publishedAt: post.timestamp,
              scheduledPublishDate: null,
              rate: null,
              reviews: [],
              tags: [],
              categories: [],
              items: [],
              preparations: [],
              providers: [],
              bazaarEvents: [],
              medias: post.images?.map((img: string, idx: number) => ({
                id: idx,
                url: img,
                thumbnailUrl: img,
                mediaType: 'image',
              })) || [],
            } as any
            return (
              <PostCard
                key={post.id}
                post={postResponse}
              />
            )
          })}
        </div>
      </div>
    </UserPageLayout>
  )
}
