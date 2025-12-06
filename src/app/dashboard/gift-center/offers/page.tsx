'use client'

import { useState } from 'react'
import {
  WeeklyMissionsSection,
  WeeklyOfferSection,
  DiamondsSummaryCard,
  ReferralProgramCard,
  AvailableCouponsSection,
  RedeemDiamondsModal,
  RedeemSuccessModal,
  type MissionCardProps,
  type OfferCardProps,
  type OfferCouponCardProps,
} from '@/components/gift-center'

/**
 * Mock data for weekly missions
 */
const mockMissions: MissionCardProps[] = [
  {
    title: 'Make Order Over 500 EGP',
    currentProgress: 0,
    targetProgress: 500,
    rewardAmount: 500,
    rewardUnit: 'EGP',
    status: 'pending',
    onViewProducts: () => {
      // TODO: Navigate to products
    },
  },
  {
    title: 'Make Order Over 500 EGP',
    currentProgress: 0,
    targetProgress: 500,
    rewardAmount: 500,
    rewardUnit: 'EGP',
    status: 'pending',
    onViewProducts: () => {
      // TODO: Navigate to products
    },
  },
  {
    title: 'Make Order Over 500 EGP',
    currentProgress: 500,
    targetProgress: 500,
    rewardAmount: 500,
    rewardUnit: 'EGP',
    status: 'completed',
    onViewProducts: () => {
      // TODO: Navigate to products
    },
  },
]

/**
 * Mock data for weekly offer
 */
const mockWeeklyOffer: OfferCardProps | null = {
  discountLabel: 'You won\n20% Off card',
  code: 'amz005',
  validUntilLabel: 'Valid Due 15 Sep,2025',
  status: 'active',
  onCopyCode: () => {
    // TODO: Copy code to clipboard
  },
}

/**
 * Mock data for available coupons
 */
const mockAvailableCoupons: OfferCouponCardProps[] = [
  {
    title: '20% On Any Product',
    expiryDateLabel: 'Due 21 Sep,2025',
    code: '265F#8',
    status: 'active',
    onCopyCode: () => {
      // TODO: Copy code to clipboard
    },
  },
  {
    title: '20% On Any Product',
    expiryDateLabel: 'Due 21 Sep,2025',
    code: '265F#8',
    status: 'active',
    onCopyCode: () => {
      // TODO: Copy code to clipboard
    },
  },
  {
    title: '20% On Any Product',
    expiryDateLabel: 'Due 21 Sep,2025',
    code: '265F#8',
    status: 'active',
    onCopyCode: () => {
      // TODO: Copy code to clipboard
    },
  },
  {
    title: '20% On Any Product',
    expiryDateLabel: 'Due 21 Sep,2025',
    code: '265F#8',
    status: 'active',
    onCopyCode: () => {
      // TODO: Copy code to clipboard
    },
  },
]

/**
 * Offers Page Component
 * Displays weekly missions, weekly offer, and available coupons
 */
export default function OffersPage() {
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const diamondsCount = 3500

  const handleRedeemDiamonds = () => {
    setIsRedeemModalOpen(true)
  }

  const handleRedeemConfirm = () => {
    setIsRedeemModalOpen(false)
    setIsSuccessModalOpen(true)
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)
  }

  const handleViewReferralDetails = () => {
    // TODO: Navigate to referral details
  }

  const handleCopyCode = () => {
    // TODO: Copy code to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText('amz005')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {/* Center Column - Main Content */}
      <div className="md:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Weekly Missions Section */}
        <WeeklyMissionsSection
          title="Weekly Missions"
          resetLabel="Restore in"
          resetCountdown="6 D 23 H 59 M"
          missions={mockMissions}
        />

        {/* Weekly Offer Section */}
        <WeeklyOfferSection
          title="Weekly Offer"
          resetLabel="Restore in"
          resetCountdown="6 D 23 H 59 M"
          activeOffer={mockWeeklyOffer}
          placeholderCards={2}
        />
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
        {/* Diamonds Summary Card */}
        <DiamondsSummaryCard
          title="Diamonds you have"
          diamondsCount={3500}
          actionLabel="Redeem"
          onActionPress={handleRedeemDiamonds}
        />

        {/* Referral Program Card */}
        <ReferralProgramCard
          title="Referral Program"
          earnedPointsOrDiamonds={500}
          invitedFriendsCount={1}
          onViewDetails={handleViewReferralDetails}
        />

        {/* Available Coupons Section */}
        <AvailableCouponsSection
          title="Available Coupons"
          coupons={mockAvailableCoupons}
        />
      </div>

      {/* Redeem Diamonds Modal */}
      <RedeemDiamondsModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        onRedeem={handleRedeemConfirm}
        diamondsCount={diamondsCount}
        discountPercentage={20}
      />

      {/* Redeem Success Modal */}
      <RedeemSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        discountLabel="You won 20% Off card"
        validUntilLabel="Valid Due 15 Sep,2025"
        code="amz005"
        onCopyCode={handleCopyCode}
      />
    </div>
  )
}
