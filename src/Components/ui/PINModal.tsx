'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { OTPInput } from './OTPInput'
import { Button } from './Button'
import pinLockSvg from '@/Assets/svg/Affiliate-pin.svg'

export interface PINModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (pin: string) => void
  title?: string
}

/**
 * PINModal Component
 * Modal for entering PIN code verification
 */
export const PINModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Enter Your PIN',
}: PINModalProps) => {
  const [pinValue, setPinValue] = useState<string[]>(['', '', '', ''])

  const handleConfirm = () => {
    const pin = pinValue.join('')
    if (pin.length === 4) {
      onConfirm(pin)
      setPinValue(['', '', '', ''])
    }
  }

  const isPinComplete = pinValue.every((digit) => digit !== '')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      contentClassName="flex flex-col items-center"
    >
      <div className="flex flex-col items-center w-full">
        {/* PIN Lock Illustration */}
        <div className="mb-6">
          <img
            src={typeof pinLockSvg === 'string' ? pinLockSvg : pinLockSvg.src}
            alt="Enter PIN"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* OTP Input */}
        <div className="w-full mb-6">
          <OTPInput length={4} value={pinValue} onChange={setPinValue} />
        </div>

        {/* Confirm Button */}
        <Button
          variant="brand"
          size="lg"
          className="w-full text-white"
          onClick={handleConfirm}
          disabled={!isPinComplete}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  )
}

