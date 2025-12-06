'use client'

import { useState } from 'react'
import { Tabs, Button, Modal, Input, Checkbox, GiftSentSuccessModal } from '@/components/ui'
import { Gift, ArrowRight, Info, Diamond, User, Mail, Phone, CreditCard, Wallet } from 'lucide-react'
import referralWelcomeSvg from '@/assets/svg/refferal-welcome.svg'
import giftSuccessImage from '@/assets/images/Giftsuccess.png'
import { cn } from '@/lib/utils'

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
 * Received Gift Item Component
 */
interface ReceivedGiftItemProps {
  senderName: string
  amount: number
  date: string
  time: string
}

const ReceivedGiftItem = ({
  senderName,
  amount,
  date,
  time,
}: ReceivedGiftItemProps) => {
  return (
    <div className="border border-gray-300 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 bg-white">
      {/* Left Section - Icon and Content */}
      <div className="flex flex-1 gap-2 sm:gap-3 items-start min-w-0">
        {/* Gift Icon */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
          <p className="text-14 sm:text-16 font-normal text-gray-900 leading-5 sm:leading-6">
            {senderName} Sent You A Gift
          </p>
          <div className="flex items-center gap-2 text-12 sm:text-14 text-gray-500">
            <p>{date}</p>
            <p className="flex-1">{time}</p>
          </div>
        </div>
      </div>

      {/* Right Section - Amount */}
      <div className="flex items-center flex-shrink-0">
        <p className="text-14 sm:text-16 font-normal text-green-500 leading-5 sm:leading-6">
          +{amount} EGP
        </p>
      </div>
    </div>
  )
}

/**
 * Coupon Card Component
 */
interface CouponCardProps {
  amount: number
  description: string
  onSendClick: () => void
}

const CouponCard = ({ amount, description, onSendClick }: CouponCardProps) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      {/* Left Section - Icon and Content */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Gift Icon */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
          <p className="text-16 sm:text-18 font-medium text-gray-900 leading-6 sm:leading-7">
            {amount} egp Coupon
          </p>
          <p className="text-12 sm:text-14 font-normal text-gray-500 leading-5 sm:leading-6">
            {description}
          </p>
        </div>
      </div>

      {/* Right Section - Send Button */}
      <Button
        variant="brand"
        onClick={onSendClick}
        className="flex items-center gap-2 rounded-full px-6 sm:px-8 py-2 sm:py-2.5 flex-shrink-0 w-full sm:w-auto"
        size="sm"
      >
        <span className="text-14 sm:text-16 font-medium">Send Now</span>
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  )
}

/**
 * Wallet Summary Card Component
 */
const WalletSummaryCard = () => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="text-12 sm:text-14 text-gray-500">Your Balance</span>
          <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        </div>
      </div>
      <div className="text-24 sm:text-32 font-semibold text-gray-900 mb-3 sm:mb-4">500 EGP</div>
      <p className="text-10 sm:text-12 text-gray-500 mb-1 sm:mb-2">
        Last update: 03/03/2023 1:00 am
      </p>
      <p className="text-10 sm:text-12 text-gray-500">
        Notice: Balance Can Only Used In Our Mobile App Only
      </p>
    </div>
  )
}

/**
 * Referral Program Card Component
 */
const ReferralProgramCard = () => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
      {/* Illustration */}
      <div className="mb-3 sm:mb-4 flex justify-center">
        <img
          src={
            typeof referralWelcomeSvg === 'string'
              ? referralWelcomeSvg
              : referralWelcomeSvg.src
          }
          alt="Referral Program"
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
        />
      </div>

      {/* Content */}
      <h3 className="text-16 sm:text-18 font-semibold text-gray-900 mb-2 sm:mb-3">
        Referral Program
      </h3>
      <a
        href="#"
        className="text-12 sm:text-14 text-brand-500 font-medium mb-3 sm:mb-4 block hover:underline"
      >
        View Details <ArrowRight className="inline h-3 w-3 sm:h-4 sm:w-4" />
      </a>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-12 sm:text-14 text-gray-600">You have earned</span>
          <span className="text-14 sm:text-16 font-semibold text-gray-900">500</span>
          <Diamond className="h-3 w-3 sm:h-4 sm:w-4 text-brand-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-12 sm:text-14 text-gray-600">Invited</span>
          <span className="text-14 sm:text-16 font-semibold text-gray-900">1 Freinds</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Sent Gift Item Interface
 */
interface SentGiftItem {
  id: string
  recipientName: string
  date: string
  time: string
  amount: number
}

/**
 * Sent Gift Item Component
 */
interface SentGiftItemProps {
  recipientName: string
  date: string
  time: string
  amount: number
}

const SentGiftItemRow = ({
  recipientName,
  date,
  time,
  amount,
}: SentGiftItemProps) => {
  return (
    <div className="border border-gray-300 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 bg-white">
      {/* Left Section - Icon and Content */}
      <div className="flex flex-1 gap-2 sm:gap-3 items-start min-w-0">
        {/* Gift Icon */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
          <p className="text-14 sm:text-16 font-normal text-gray-900 leading-5 sm:leading-6">
            You sent a gift to {recipientName}
          </p>
          <div className="flex items-center gap-2 text-12 sm:text-14 text-gray-500">
            <p>{date}</p>
            <p className="flex-1">{time}</p>
          </div>
        </div>
      </div>

      {/* Right Section - Amount */}
      <div className="flex items-center flex-shrink-0">
        <p className="text-14 sm:text-16 font-normal text-green-500 leading-5 sm:leading-6">
          {amount} EGP
        </p>
      </div>
    </div>
  )
}

/**
 * Sent Gifts Card Component
 */
interface SentGiftsCardProps {
  gifts?: SentGiftItem[]
  isEmpty?: boolean
}

const SentGiftsCard = ({ gifts = [], isEmpty }: SentGiftsCardProps) => {
  const hasGifts = !isEmpty && gifts.length > 0

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
      <h3 className="text-16 sm:text-18 font-semibold text-gray-900 mb-3 sm:mb-4">Sent Gifts</h3>

      {hasGifts ? (
        /* Filled State - List of Sent Gifts */
        <div className="space-y-3 sm:space-y-4">
          {gifts.map(gift => (
            <SentGiftItemRow
              key={gift.id}
              recipientName={gift.recipientName}
              date={gift.date}
              time={gift.time}
              amount={gift.amount}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-6 sm:py-8">
          {/* Empty State Illustration */}
          <div className="mb-3 sm:mb-4 flex justify-center">
            <img
              src={
                typeof referralWelcomeSvg === 'string'
                  ? referralWelcomeSvg
                  : referralWelcomeSvg.src
              }
              alt="No Sent Gifts"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>
          <p className="text-12 sm:text-14 text-gray-600 text-center max-w-xs">
            You Don&apos;t Have any sent gifts, express Your Love and send a gift
            now.
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Send Gift Modal Component
 */
interface SendGiftModalProps {
  isOpen: boolean
  onClose: () => void
  couponAmount: number
  onCheckout?: () => void
}

const SendGiftModal = ({
  isOpen,
  onClose,
  couponAmount,
  onCheckout,
}: SendGiftModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>(
    'card'
  )
  const [acceptTerms, setAcceptTerms] = useState(false)

  const orderItems = [
    { id: '1', amount: couponAmount },
    { id: '2', amount: couponAmount },
    { id: '3', amount: couponAmount },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.amount, 0)
  const taxes = 20
  const total = subtotal + taxes

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Gift"
      maxWidth="2xl"
      contentClassName="p-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Left Column - Form */}
        <div className="space-y-4 sm:space-y-6">
          {/* Your Information */}
          <div>
            <h3 className="text-14 sm:text-16 font-semibold text-gray-900 mb-3 sm:mb-4">
              Your Informations
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <Input
                placeholder="Full Name"
                prefixIcon={User}
                className="w-full"
              />
              <Input
                placeholder="Mobile Number"
                prefixIcon={Phone}
                type="tel"
                className="w-full"
              />
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h3 className="text-14 sm:text-16 font-semibold text-gray-900 mb-3 sm:mb-4">
              Who will receive your gift?
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <Input
                placeholder="Full Name"
                prefixIcon={User}
                className="w-full"
              />
              <Input
                placeholder="E-mail"
                prefixIcon={Mail}
                type="email"
                className="w-full"
              />
              <Input
                placeholder="Mobile Number"
                prefixIcon={Phone}
                type="tel"
                className="w-full"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-14 sm:text-16 font-semibold text-gray-900 mb-3 sm:mb-4">
              Payment Method
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant={paymentMethod === 'card' ? 'brand' : 'outlineBrand'}
                size="sm"
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  'flex-1 rounded-full',
                  paymentMethod === 'card'
                    ? ''
                    : 'text-brand-500 hover:text-brand-600'
                )}
              >
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Debit / Credit
              </Button>
              <Button
                variant={paymentMethod === 'wallet' ? 'brand' : 'outlineBrand'}
                size="sm"
                onClick={() => setPaymentMethod('wallet')}
                className={cn(
                  'flex-1 rounded-full',
                  paymentMethod === 'wallet'
                    ? ''
                    : 'text-brand-500 hover:text-brand-600'
                )}
              >
                <Wallet className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Mobile Wallet
              </Button>
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div>
              <h3 className="text-14 sm:text-16 font-semibold text-gray-900 mb-3 sm:mb-4">
                Card Details
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <Input placeholder="Name On Card" className="w-full" />
                <Input placeholder="Card Number" type="tel" className="w-full" />
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Input placeholder="MM/YY" type="tel" className="w-full" />
                  <Input placeholder="CVV" type="tel" className="w-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h3 className="text-14 sm:text-16 font-semibold text-gray-900">Order Summary</h3>

          {/* Order Items */}
          <div className="space-y-3 sm:space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl ${
                  index === 0 ? 'border-2 border-brand-500' : 'border border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center flex-shrink-0">
                  <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                </div>
                <span className="text-14 sm:text-16 font-normal text-gray-900 flex-1">
                  {item.amount} egp Coupon
                </span>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-12 sm:text-14 text-gray-600">Subtotal</span>
              <span className="text-12 sm:text-14 font-semibold text-gray-900">
                {subtotal} EGP
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-12 sm:text-14 text-gray-600">Taxes & Fees</span>
              <span className="text-12 sm:text-14 font-semibold text-gray-900">
                {taxes} EGP
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-14 sm:text-16 font-semibold text-gray-900">Total</span>
              <span className="text-14 sm:text-16 font-semibold text-gray-900">
                {total} EGP
              </span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <Checkbox
                checked={acceptTerms}
                onChange={setAcceptTerms}
                variant="brand"
                size="sm"
              />
              <label className="text-10 sm:text-12 text-gray-600 cursor-pointer">
                I Accept Terms & Conditions
              </label>
            </div>
            <p className="text-9 sm:text-10 text-gray-500">
              If you are not around when the delivery person arrives, they will
              leave your order at the door. By placing your order, you agree to
              take full responsibility for it once it&apos;s delivered.
            </p>
          </div>

          {/* Checkout Button */}
          <Button
            variant="brand"
            size="md"
            className="w-full rounded-full"
            disabled={!acceptTerms}
            onClick={() => {
              if (onCheckout) {
                onCheckout()
              }
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </Modal>
  )
}

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

export default function GiftCenterPage() {
  const [activeTab, setActiveTab] = useState<'offers' | 'coupons' | 'ranking'>(
    'coupons'
  )
  const [sendGiftModalOpen, setSendGiftModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [hasSentGifts, setHasSentGifts] = useState(false)
  const [selectedCouponAmount, setSelectedCouponAmount] = useState(500)

  const tabs = [
    { value: 'offers', label: 'Offers' },
    { value: 'coupons', label: 'Coupons' },
    { value: 'ranking', label: 'Ranking' },
  ]

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
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <Tabs
          items={tabs}
          activeValue={activeTab}
          onChange={value =>
            setActiveTab(value as 'offers' | 'coupons' | 'ranking')
          }
          variant="underline"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'coupons' && (
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
      )}

      {/* Other Tabs Placeholder */}
      {activeTab !== 'coupons' && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-14 sm:text-16 text-gray-500">
            {activeTab === 'offers' ? 'Offers' : 'Ranking'} content coming
            soon
          </p>
        </div>
      )}

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
    </div>
  )
}

