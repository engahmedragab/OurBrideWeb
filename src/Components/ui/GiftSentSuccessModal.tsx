'use client'

import { Button } from './Button'
import { Modal } from './Modal'
import giftSuccessImage from '@/assets/images/Giftsuccess.png'

export interface GiftSentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

/**
 * GiftSentSuccessModal - Success popup after sending a gift
 * Displays a centered modal with success illustration and confirmation message
 */
export const GiftSentSuccessModal = ({
  isOpen,
  onClose,
  className,
}: GiftSentSuccessModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Booking Confirmation"
      maxWidth="sm"
      zIndex={60}
      className={className}
      contentClassName="p-0"
    >
      <div className="p-6">
        {/* Success Illustration */}
        <div className="flex justify-center mb-6">
          <img
            src={
              typeof giftSuccessImage === 'string'
                ? giftSuccessImage
                : giftSuccessImage.src
            }
            alt="Gift Sent Successfully"
            className="w-full max-w-[300px] h-auto object-contain"
          />
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <p className="text-20 font-semibold text-gray-900 mb-2">
            Success! ✨
          </p>
          <p className="text-16 text-gray-600">
            Your Gift Sent Successfully!
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onClose}
          variant="brand"
          size="lg"
          className="w-full rounded-full"
        >
          Got It
        </Button>
      </div>
    </Modal>
  )
}

