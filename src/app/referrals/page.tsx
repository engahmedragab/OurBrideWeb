'use client'

import React, { useState } from 'react'
import { UserPageLayout } from '@/components/layout'
import { Button, Input, ReferralOnboardingModal } from '@/components/ui'
import {
  Send,
  UserPlus,
  Gift,
  Copy,
  Facebook,
  Instagram,
  MessageCircle,
  QrCode,
  CheckCircle,
  Clock,
  Ticket,
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

/**
 * Referrals Page
 * User referral program page with invite links, insights, and activity tracking
 */
export default function ReferralsPage() {
  const [inviteLink] = useState('http://www.generatecode.ourbride.com')
  const [showOnboarding, setShowOnboarding] = useState(true)

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
  }

  // Mock data
  const referralInsights = {
    totalInvites: 5200,
    friendsJoined: 200,
    rewardsEarned: 5000,
  }

  const activityItems: ActivityItem[] = [
    {
      id: '1',
      userName: 'Sarah Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 3,
      earnings: '+600 EGP',
      status: 'Delivered',
    },
    {
      id: '2',
      userName: 'Sarah Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 4,
      earnings: '+600 EGP',
      status: 'Delivered',
    },
    {
      id: '3',
      userName: 'Aya Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 2,
      earnings: '+600 EGP',
      status: 'Processing',
    },
    {
      id: '4',
      userName: 'Aya Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      bookings: 3,
      earnings: '+600 EGP',
      status: 'Processing',
    },
    {
      id: '5',
      userName: 'Aya Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
  }

  const getStatusStyles = (status: ActivityItem['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-50 text-green-600 border border-green-200'
      case 'Processing':
        return 'bg-blue-50 text-blue-600 border border-blue-200'
      case 'Pending':
        return 'bg-gray-50 text-gray-600 border border-gray-200'
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200'
    }
  }

  const getStatusIcon = (status: ActivityItem['status']) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-3 h-3" />
      case 'Processing':
        return <Clock className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <>
      <ReferralOnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />
      
      <UserPageLayout>
        <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Referral Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-18 font-normal text-gray-900 mb-4">
              Referral Insights
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Total Invites Sent */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-14 text-gray-600 mb-1">Total Invites Sent</p>
                  <p className="text-20 font-normal text-gray-900">
                    {referralInsights.totalInvites}{' '}
                    <span className="text-12 text-gray-500">Egp</span>
                  </p>
                </div>
              </div>

              {/* Friends Joined */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-14 text-gray-600 mb-1">Friends Joined</p>
                  <p className="text-20 font-normal text-gray-900">
                    {referralInsights.friendsJoined}{' '}
                    <span className="text-12 text-gray-500">Egp</span>
                  </p>
                </div>
              </div>

              {/* Rewards Earned */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-14 text-gray-600 mb-1">Rewards Earned</p>
                  <p className="text-20 font-normal text-gray-900">
                    {referralInsights.rewardsEarned}{' '}
                    <span className="text-12 text-gray-500">Egp</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invite Link */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-18 font-normal text-gray-900">Invite Link</h2>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </button>
            </div>

            {/* Link Input */}
            <div className="mb-4">
              <Input
                value={inviteLink}
                readOnly
                suffix="EGP"
                className="w-full bg-gray-50"
              />
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="border-brand-500 text-brand-500 hover:bg-brand-50"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="border-brand-500 text-brand-500 hover:bg-brand-50"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </Button>
              <Button
                variant="outline"
                className="border-brand-500 text-brand-500 hover:bg-brand-50"
              >
                <MessageCircle className="h-5 w-5" />
                Whatsapp
              </Button>
              <Button
                variant="outline"
                className="border-brand-500 text-brand-500 hover:bg-brand-50"
              >
                <QrCode className="h-5 w-5" />
                QR Code
              </Button>
            </div>
          </div>

          {/* Bonus Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-18 font-normal text-gray-900 mb-4">
              Bonus Progress
            </h2>
            <div className="relative">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: '10%' }} />
              </div>
              <p className="text-14 text-gray-500 mt-3">
                Invite 10 Friends To Get Bonus Coupon
              </p>
              <p className="text-16 font-normal text-gray-900 absolute right-0 -top-8">
                1/10 Invited
              </p>
            </div>
          </div>

          {/* Your Coupons */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-18 font-normal text-gray-900 mb-4">
              Your Coupons
            </h2>
            <div className="space-y-4">
              {coupons.map(coupon => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Ticket className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-14 text-gray-600 mb-0.5">
                        Coupon
                      </p>
                      <p className="text-16 font-normal text-gray-900 mb-1">
                        {coupon.discount}
                      </p>
                      <p className="text-12 text-gray-500">{coupon.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {coupon.status === 'Valid' && (
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-12 font-medium bg-green-50 text-green-600 border border-green-200">
                        <CheckCircle className="w-3 h-3" />
                        <span>Valid</span>
                      </div>
                    )}
                    {coupon.status === 'Expired' && (
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-12 font-medium bg-red-50 text-red-600 border border-red-200">
                        <Clock className="w-3 h-3" />
                        <span>Expired</span>
                      </div>
                    )}
                    <Button
                      variant={coupon.status === 'Valid' ? 'brand' : 'gray'}
                      size="md"
                      className={coupon.status === 'Valid' ? 'text-white' : 'text-gray-900'}
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
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-18 font-normal text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {activityItems.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.userAvatar}
                      alt={item.userName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-14 font-normal text-gray-900">
                          {item.userName}
                        </p>
                        <p className="text-14 font-normal text-green-600 whitespace-nowrap">
                          {item.earnings}
                        </p>
                      </div>
                      <p className="text-12 text-gray-500 mb-2">{item.date}</p>
                      <p className="text-12 text-gray-600 mb-2">
                        {item.bookings} Booking
                      </p>
                       <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-12 font-medium ${getStatusStyles(item.status)}`}>
                         {getStatusIcon(item.status)}
                         <span>{item.status === 'Processing' ? 'Pending Payout' : item.status === 'Delivered' ? 'Confirmed' : item.status}</span>
                       </div>
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

