'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { Input } from './Input'
import { Button } from './Button'
import { CreditCard } from 'lucide-react'

export interface AddPaymentCardModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * AddPaymentCardModal Component
 * Modal for managing payout cards with Paymob integration
 */
export const AddPaymentCardModal = ({
  isOpen,
  onClose,
}: AddPaymentCardModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'debit' | 'mobile'>(
    'debit'
  )

  const savedCards = [
    {
      id: '1',
      number: '34** **** **** ***7',
      holder: 'Ahmed Ramadan',
      expiry: '02/30',
      label: 'Ahmed Ramadan -Master Card',
    },
    {
      id: '2',
      number: '34** **** **** ***7',
      holder: 'Ahmed Ramadan',
      expiry: '02/30',
      label: 'Ahmed Ramadan -Master Card',
    },
    {
      id: '3',
      number: '34** **** **** ***7',
      holder: 'Ahmed Ramadan',
      expiry: '02/30',
      label: 'Ahmed Ramadan -Master Card',
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payout Cards Management"
      maxWidth="xl"
      contentClassName="max-h-[70vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6"
    >
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left Side - Form */}
        <div className="flex-1 space-y-3 sm:space-y-4">
          {/* Subtitle */}
          <p className="text-13 sm:text-14 text-gray-500 -mt-2">
            Add Your Payment Method With Paymob
          </p>

          {/* Payment Method Dropdown */}
          <div>
            <Input
              placeholder="Ahmed Ramadan -Master Card ( Defualt )"
              className="cursor-pointer"
              readOnly
            />
          </div>

          {/* Full Name Input */}
          <div>
            <Input placeholder="Full Name" />
          </div>

          {/* Mobile Number Input */}
          <div>
            <Input placeholder="Mobile Number" />
          </div>

          {/* Payment Method Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod('debit')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-13 sm:text-14 font-normal transition-colors ${
                paymentMethod === 'debit'
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Debit / Credit
            </button>
            <button
              onClick={() => setPaymentMethod('mobile')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-13 sm:text-14 font-normal transition-colors ${
                paymentMethod === 'mobile'
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Mobile Wallet
            </button>
          </div>

          {/* Card Details Section */}
          {paymentMethod === 'debit' && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-13 sm:text-14 font-normal text-gray-900">
                Card Details
              </h3>

              {/* Name On Card */}
              <div>
                <Input placeholder="Name On Card" />
              </div>

              {/* Card Number */}
              <div>
                <Input placeholder="Card Number" />
              </div>

              {/* MM/YY and CVV */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Input placeholder="MM/YY" />
                <Input placeholder="CVV" />
              </div>
            </div>
          )}

          {/* Add New Card Button */}
          <Button
            variant="brand"
            size="lg"
            className="w-full text-white mt-4 sm:mt-6"
            onClick={onClose}
          >
            Add New Card
          </Button>
        </div>

        {/* Right Side - Saved Cards */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <h3 className="text-14 font-normal text-gray-900 mb-3 lg:hidden">
            Saved Cards
          </h3>
          <div className="space-y-3 sm:space-y-4 max-h-[400px] lg:max-h-[600px] overflow-y-auto pr-2">
            {savedCards.map(card => (
              <div key={card.id} className="relative">
                <div
                  className="rounded-2xl p-4 text-white relative overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #8b2635 100%)',
                  }}
                >
                  {/* More Options Button */}
                  <button className="absolute top-4 right-4 text-white/80 hover:text-white">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <circle cx="10" cy="4" r="1.5" />
                      <circle cx="10" cy="10" r="1.5" />
                      <circle cx="10" cy="16" r="1.5" />
                    </svg>
                  </button>

                  {/* Card Icons */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/80" />
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-400/80 -ml-3" />
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-13 sm:text-14 font-normal tracking-wider">
                      {card.number}
                    </p>
                  </div>

                  {/* Card Holder & Expiry */}
                  <div className="flex items-center justify-between">
                    <p className="text-11 sm:text-12 font-normal">
                      {card.holder}
                    </p>
                    <p className="text-11 sm:text-12 font-normal">
                      {card.expiry}
                    </p>
                  </div>
                </div>
                <p className="text-11 sm:text-12 text-gray-900 mt-2 text-center">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
