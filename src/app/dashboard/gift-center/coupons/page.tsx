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
    </>
  )
}

