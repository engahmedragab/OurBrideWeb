'use client'

import { useState } from 'react'
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
    senderName: 'Sara Mohamed',
    amount: 500,
    date: 'Sep 15, 2025',
    time: '11:30 am',
  },
  {
    id: '3',
    senderName: 'Sara Mohamed',
    amount: 500,
    date: 'Sep 15, 2025',
    time: '11:30 am',
  },
]

/**
 * Mock data for available coupons
 */
const mockCoupons = [
  {
    id: '1',
    amount: 500,
    description: 'a simple way to show your appreciation',
  },
  {
    id: '2',
    amount: 500,
    description: 'a simple way to show your appreciation',
  },
  {
    id: '3',
    amount: 500,
    description: 'a simple way to show your appreciation',
  },
]

/**
 * Mock data for sent gifts
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
    recipientName: 'Sara Mohomed',
    date: 'Sep 15, 2025',
    time: '11:30 am',
    amount: 500,
  },
  {
    id: '3',
    recipientName: 'Sara Mohomed',
    date: 'Sep 15, 2025',
    time: '11:30 am',
    amount: 500,
  },
]

/**
 * Coupons Page Component
 * Displays received gifts, available coupons, and sidebar with wallet info
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Received Gifts Section */}
          <div>
            <h2 className="text-18 sm:text-20 font-semibold text-gray-900 mb-3 sm:mb-4">
              Received Gifts
            </h2>
            <div className="space-y-3 sm:space-y-4">
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
            <div className="flex flex-col gap-1 sm:gap-2 mb-3 sm:mb-4">
              <h2 className="text-20 sm:text-24 font-medium text-gray-900 leading-6 sm:leading-8">
                Express Your Love
              </h2>
              <p className="text-16 sm:text-20 font-normal text-gray-500 leading-5 sm:leading-6">
                Send a simple gift now to show how much you care.
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
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
        <div className="space-y-4 sm:space-y-6">
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
    </>
  )
}

