'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { Input } from './Input'
import { Button } from './Button'
import { PINModal } from './PINModal'
import { StatusModal } from './StatusModal'

export interface WithdrawFundsModalProps {
  isOpen: boolean
  onClose: () => void
  balance?: number
}

/**
 * WithdrawFundsModal Component
 * Modal for withdrawing funds to selected payment card
 */
export const WithdrawFundsModal = ({
  isOpen,
  onClose,
  balance = 3500.0,
}: WithdrawFundsModalProps) => {
  const [selectedCardId, setSelectedCardId] = useState<string>('1')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [showPINModal, setShowPINModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const availableCards = [
    {
      id: '1',
      number: '34** **** **** **7',
      holder: 'Ahmed Ramadan',
      expiry: '02/30',
    },
    {
      id: '2',
      number: '34** **** **** **7',
      holder: 'Ahmed Ramadan',
      expiry: '02/30',
    },
  ]

  const handleWithdraw = () => {
    setShowPINModal(true)
  }

  const handlePINConfirm = (pin: string) => {
    // Handle PIN verification here
    setShowPINModal(false)
    setShowSuccessModal(true)
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    setWithdrawAmount('')
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen && !showPINModal && !showSuccessModal}
        onClose={onClose}
        title="Payout Cards Management"
        maxWidth="sm"
      >
        <div className="space-y-6">
          {/* Balance Section */}
          <div>
            <p className="text-12 text-gray-500 mb-1">Balance</p>
            <p className="text-20 font-semibold text-gray-900">
              {balance.toFixed(2)} EGP
            </p>
            <p className="text-12 text-gray-400 mt-1">
              Last Update: Sep 15, 2025 11:30 am
            </p>
          </div>

          {/* Withdraw Details */}
          <div>
            <h3 className="text-14 font-normal text-gray-900 mb-3">
              Withdraw Details
            </h3>
            <Input
              type="number"
              placeholder="Amount"
              suffix="EGP"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
            />
          </div>

          {/* Available Cards */}
          <div>
            <h3 className="text-14 font-normal text-gray-900 mb-3">
              Available Cards
            </h3>
            <div className="space-y-3">
              {availableCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                    selectedCardId === card.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-14 font-normal text-gray-900">
                      {card.number}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-red-500" />
                      <div className="w-6 h-6 rounded-full bg-orange-400 -ml-3" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-12 text-gray-500">
                    <span>{card.holder}</span>
                    <span>{card.expiry}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Withdraw Button */}
          <Button
            variant="brand"
            size="lg"
            className="w-full text-white"
            onClick={handleWithdraw}
            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
          >
            Withdraw EGP {withdrawAmount || '0'}
          </Button>
        </div>
      </Modal>

      {/* PIN Modal */}
      <PINModal
        isOpen={showPINModal}
        onClose={() => setShowPINModal(false)}
        onConfirm={handlePINConfirm}
      />

      {/* Success Modal */}
      <StatusModal
        open={showSuccessModal}
        title="Withdrawal successful"
        description="Your funds have been transferred to your bank account."
        confirmLabel="Let's Start"
        onConfirm={handleSuccessClose}
        onClose={handleSuccessClose}
      />
    </>
  )
}
