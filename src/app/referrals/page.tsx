'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { UserPageLayout } from '@/components/layout'
import {
  Button,
  Input,
  ReferralOnboardingModal,
  Badge,
  SocialShareButtons,
  InsightCard,
} from '@/components/ui'
import {
  CheckCircle,
  CheckCircle2Icon,
  Clock,
  Copy,
  Sparkle,
  XCircle,
  UserPlus,
  UserCheck,
  Gem,
  Link2,
  Percent,
  Loader2,
} from 'lucide-react'

interface ActivityItem {
  id: string
  userName: string
  userAvatar: string
  date: string
  bookings: number
  earnings: string
  status: 'Delivered' | 'Processing' | 'Pending'
}

interface Coupon {
  id: string
  discount: string
  dueDate: string
  status: 'Valid' | 'Expired'
}

interface ReferralInsights {
  totalInvites: number
  friendsJoined: number
  rewardsEarned: number
}

/**
 * Referrals Page
 * User referral program page with invite links, insights, and activity tracking
 */
export default function ReferralsPage() {
  const [inviteLink] = useState<string>('http://www.generatecode.ourbride.com')
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true)

  const handleCloseOnboarding = (): void => {
    setShowOnboarding(false)
  }

  // Mock data
  const referralInsights: ReferralInsights = {
    totalInvites: 5200,
    friendsJoined: 200,
    rewardsEarned: 5000,
  }

  const activityItems: ActivityItem[] = [
    {
      id: '1',
      userName: 'Sarah Ahmed',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 3,
      earnings: '+600 EGP',
      status: 'Delivered',
    },
    {
      id: '2',
      userName: 'Sarah Ahmed',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 4,
      earnings: '+600 EGP',
      status: 'Delivered',
    },
    {
      id: '3',
      userName: 'Aya Ahmed',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 2,
      earnings: '+600 EGP',
      status: 'Processing',
    },
    {
      id: '4',
      userName: 'Aya Ahmed',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 3,
      earnings: '+600 EGP',
      status: 'Processing',
    },
    {
      id: '5',
      userName: 'Aya Ahmed',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 3,
      earnings: '+600 EGP',
      status: 'Processing',
    },
  ]

  const coupons: Coupon[] = [
    {
      id: '1',
      discount: '20% OFF',
      dueDate: 'Due: Sep 20, 2025',
      status: 'Valid',
    },
    {
      id: '2',
      discount: '20% OFF',
      dueDate: 'Due: Sep 20, 2025',
      status: 'Expired',
    },
  ]

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(inviteLink).catch((error: Error) => {
      console.error('Failed to copy link:', error)
    })
  }

  return (
    <>
      <ReferralOnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />

      <UserPageLayout>
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-2 sm:gap-3">
          {/* Main Content */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Referral Insights */}
            <div className="  sm:p-3">
              <h2 className="text-16 sm:text-20 font-normal text-gray-900 mb-3 sm:mb-4">
                Referral Insights
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <InsightCard
                  icon={UserPlus}
                  label="Total Invites Sent"
                  value={referralInsights.totalInvites}
                />
                <InsightCard
                  icon={UserCheck}
                  label="Friends Joined"
                  value={referralInsights.friendsJoined}
                />
                <InsightCard
                  icon={Gem}
                  label="Pending Payout"
                  value={referralInsights.rewardsEarned}
                  currency="points"
                />
              </div>
            </div>

            {/* Invite Link */}
            <div className=" rounded-xl border border-gray-400/70 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-16 sm:text-18 font-normal text-gray-900">
                  Invite Link
                </h2>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 sm:gap-2 text-13 sm:text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                  <Link2  className="h-3.5 w-3.5 sm:h-4 sm:w-4 hidden md:block" />
                 
                  <span className="hidden sm:inline">Copy Link</span>
                 
                </button>
              </div>

              {/* Link Input */}
              <div className="mb-3 sm:mb-4 flex items-center justify-between gap-3">
                <Input
                  value={inviteLink}
                  readOnly
               
                  className="w-full bg-gray-50 text-13 sm:text-14"
                />
                <button onClick={handleCopyLink}><Copy className='h-5 w-5 text-brand-500 md:hidden hover:text-brand-600 transition-colors'/></button>
                
              </div>

              {/* Social Share Buttons */}
              <SocialShareButtons className="gap-2 sm:gap-3" />
            </div>

            {/* Bonus Progress */}
            <div className="rounded-xl border border-gray-400/70 p-4 sm:p-6">
              <h2 className="text-16 sm:text-18 font-normal text-gray-900 mb-3 sm:mb-4">
                Bonus Progress
              </h2>
              <div className="relative">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: '10%' }}
                  />
                </div>
                <p className="text-13 sm:text-14 text-gray-500/70 mt-3">
                  Invite 10 Friends To Get Bonus Coupon
                </p>
                <p className="text-14 sm:text-16 font-normal text-gray-500/70 absolute right-0 -top-6 sm:-top-8">
                  1/10 Invited
                </p>
              </div>
            </div>

            {/* Your Coupons */}
            <div className="  p-4 sm:p-6">
              <h2 className="text-16 sm:text-18 font-normal text-gray-900 mb-3 sm:mb-4">
                Your Coupons
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {coupons.map(coupon => (
                  <div
                    key={coupon.id}
                    className="flex  items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-300  gap-3"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      
                      <div className='flex flex-col gap-2'>
                     <div className="flex items-center gap-2 "><div className="  flex items-center justify-start flex-shrink-0">
                        <Percent size={24} className="text-gray-900" />
                      </div>
                        <p className="text-12 sm:text-16 font-normal text-gray-900 mb-0.5">
                          Coupon
                        </p></div> 
                        <p className="text-14 sm:text-16 font-normal text-gray-900 mb-0.5 sm:mb-1">
                          {coupon.discount}
                        </p>
                        <p className="text-11 sm:text-14 text-gray-400/90">
                          {coupon.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col  items-center justify-between sm:justify-end gap-2 sm:gap-3">
                      {coupon.status === 'Valid' && (
                        <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-10 sm:text-12 font-medium bg-green-50 text-green-600 border border-green-200">
                          <CheckCircle2Icon className="w-3 h-3" />
                          <span>Valid</span>
                        </div>
                      )}
                      {coupon.status === 'Expired' && (
                        <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-10 sm:text-12 font-medium bg-red-50 text-red-600 border border-red-200">
                          <XCircle className="w-3 h-3" />
                          <span>Expired</span>
                        </div>
                      )}
                      <Button
                        variant={coupon.status === 'Valid' ? 'outlineBrand' : 'outline'}
                        size="sm"
                        className={`${coupon.status === 'Valid' ? 'text-white' : 'text-gray-900'} text-10 sm:text-12 px-2 sm:px-2 `}
                        disabled={coupon.status === 'Expired'}
                      >
                        Redeem Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <aside className="w-full lg:w-full flex-shrink-0">
            <div className="  p-4 sm:p-6">
              <h2 className="text-16 sm:text-18 font-normal text-gray-900 mb-3 sm:mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {activityItems.map(item => (
                  <div key={item.id} className="  border border-gray-400/40 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={item.userAvatar}
                          alt={item.userName}
                          fill
                          sizes="40px"
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-13 sm:text-14 font-normal text-gray-900">
                            {item.userName}
                          </p>
                        
                        </div>
                        <p className="text-11 sm:text-12 text-gray-500 mb-2">
                          {item.date}
                        </p>
                        <p className="text-11 sm:text-12 text-gray-600 mb-2">
                          {item.bookings} Booking
                        </p>
                        <div className='flex items-center justify-between gap-2'><p className="text-11 sm:text-12 font-normal text-green-600 whitespace-nowrap">
                            {item.earnings}
                          </p>
                        <Badge
                          variant={
                            item.status === 'Delivered'
                              ? 'confirmed'
                              : 'pending'
                          }
                          className="gap-1 px-2  !py-1.5 text-8 sm:text-[9px] font-regular"
                        >
                          {item.status === 'Delivered' ? (
                            <CheckCircle2Icon className="w-3 h-3" />
                          ) : (
                            <Loader2 className="w-3 h-3" />
                          )}
                           
                          <span>
                            {item.status === 'Processing'
                              ? 'Invite Sent'
                              : item.status === 'Delivered'
                                ? 'Confirmed'
                                : item.status}
                          </span>
                        </Badge></div>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </UserPageLayout>
    </>
  )
}
