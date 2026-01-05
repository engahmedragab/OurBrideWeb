'use client'

import { useState } from 'react'
import { UserPageLayout } from '@/components/layout'
import { GiftSentSuccessModal } from '@/components/ui'
import {
  ReceivedGiftItem,
  CouponCard,
  WalletSummaryCard,
  ReferralProgramCard,
  SentGiftsCard,
  SendGiftModal,
  type SentGiftItem,
} from '@/components/gift-center'

/**
 * Mock data for received gifts
 * Different amounts with different icon colors:
 * - 500 EGP: Blue
 * - 1K EGP: Green
 * - 2K EGP: Red
 * - 5K EGP: Purple
 * - 10K EGP: Orange
 */
const mockReceivedGifts = [
  {
    id: '1',
    senderName: 'Sara Mohamed',
    amount: 500,
    date: 'Sep 15, 2025',
    time: '11:30 am',
  },
  {
    id: '2',
    senderName: 'Ahmed Ali',
    amount: 1000,
    date: 'Sep 14, 2025',
    time: '10:15 am',
  },
  {
    id: '3',
    senderName: 'Fatima Hassan',
    amount: 2000,
    date: 'Sep 13, 2025',
    time: '09:45 am',
  },
  {
    id: '4',
    senderName: 'Omar Ibrahim',
    amount: 5000,
    date: 'Sep 12, 2025',
    time: '08:20 am',
  },
  {
    id: '5',
    senderName: 'Layla Ahmed',
    amount: 10000,
    date: 'Sep 11, 2025',
    time: '07:00 am',
  },
]

/**
 * Mock data for available coupons
 * Different amounts with different icon colors:
 * - 500 EGP: Blue
 * - 1K EGP: Green
 * - 2K EGP: Red
 * - 5K EGP: Purple
 * - 10K EGP: Orange
 */
const mockCoupons = [
  {
    id: '1',
    amount: 500,
    description: 'a simple way to show your appreciation',
  },
  {
    id: '2',
    amount: 1000,
    description: 'a simple way to show your appreciation',
  },
  {
    id: '3',
    amount: 2000,
    description: 'a simple way to show your appreciation',
  },
  {
    id: '4',
    amount: 5000,
    description: 'a simple way to show your appreciation',
  },
  {
    id: '5',
    amount: 10000,
    description: 'a simple way to show your appreciation',
  },
]

/**
 * Mock data for sent gifts
 * Different amounts with different icon colors:
 * - 500 EGP: Blue
 * - 1K EGP: Green
 * - 2K EGP: Red
 * - 5K EGP: Purple
 * - 10K EGP: Orange
 */
const mockSentGifts: SentGiftItem[] = [
  {
    id: '1',
    recipientName: 'Sara Mohomed',
    date: 'Sep 15, 2025',
    time: '11:30 am',
    amount: 500,
  },
  {
    id: '2',
    recipientName: 'Ahmed Ali',
    date: 'Sep 14, 2025',
    time: '10:15 am',
    amount: 1000,
  },
  {
    id: '3',
    recipientName: 'Fatima Hassan',
    date: 'Sep 13, 2025',
    time: '09:45 am',
    amount: 2000,
  },
  {
    id: '4',
    recipientName: 'Omar Ibrahim',
    date: 'Sep 12, 2025',
    time: '08:20 am',
    amount: 5000,
  },
  {
    id: '5',
    recipientName: 'Layla Ahmed',
    date: 'Sep 11, 2025',
    time: '07:00 am',
    amount: 10000,
  },
]

/**
 * Standalone Coupons Page Component
 * Displays received gifts, available coupons, and sidebar with wallet info
 * This is a separate page from the gift center, accessible from the user sidebar
 */
export default function CouponsPage() {
  const [sendGiftModalOpen, setSendGiftModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [hasSentGifts, setHasSentGifts] = useState(false)
  const [selectedCouponAmount, setSelectedCouponAmount] = useState(500)

  const handleSendClick = (amount: number) => {
    setSelectedCouponAmount(amount)
    setSendGiftModalOpen(true)
  }

  const handleCheckout = () => {
    setSendGiftModalOpen(false)
    setSuccessModalOpen(true)
    setHasSentGifts(true)
  }

  const handleSuccessClose = () => {
    setSuccessModalOpen(false)
  }

  return (
    <UserPageLayout>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left Column - Main Content */}
        <div className="space-y-4 sm:space-y-5">
          {/* Received Gifts Section */}
          <div>
            <h2 className="text-14 sm:text-16 font-normal text-gray-900 mb-2 sm:mb-3">
              Received Gifts
            </h2>
            <div className="space-y-2 sm:space-y-2.5">
              {mockReceivedGifts.map(gift => (
                <ReceivedGiftItem
                  key={gift.id}
                  senderName={gift.senderName}
                  amount={gift.amount}
                  date={gift.date}
                  time={gift.time}
                />
              ))}
            </div>
          </div>

          {/* Express Your Love Section */}
          <div>
            <div className="flex flex-col gap-0.5 sm:gap-1 mb-2 sm:mb-3">
              <h2 className="text-14 sm:text-16 font-normal text-gray-900 leading-4 sm:leading-5">
                Express Your Love
              </h2>
              <p className="text-12 sm:text-14 font-normal text-gray-500 leading-3 sm:leading-4">
                Send a simple gift now to show how much you care.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-2.5">
              {mockCoupons.map(coupon => (
                <CouponCard
                  key={coupon.id}
                  amount={coupon.amount}
                  description={coupon.description}
                  onSendClick={() => handleSendClick(coupon.amount)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-3 sm:space-y-4">
          <WalletSummaryCard />
          <ReferralProgramCard />
          <SentGiftsCard
            gifts={hasSentGifts ? mockSentGifts : []}
            isEmpty={!hasSentGifts}
          />
        </div>
      </div>

      {/* Send Gift Modal */}
      <SendGiftModal
        isOpen={sendGiftModalOpen}
        onClose={() => setSendGiftModalOpen(false)}
        couponAmount={selectedCouponAmount}
        onCheckout={handleCheckout}
      />

      {/* Success Modal */}
      <GiftSentSuccessModal
        isOpen={successModalOpen}
        onClose={handleSuccessClose}
      />
    </UserPageLayout>
  )
}
