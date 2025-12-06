'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import redeemImage from '@/assets/images/redeem.png'
import diamondSvg from '@/assets/svg/Diamond.svg'

/**
 * Redeem Diamonds Modal Component Props
 */
export interface RedeemDiamondsModalProps {
  isOpen: boolean
  onClose: () => void
  onRedeem: () => void
  diamondsCount: number
  discountPercentage?: number
}

/**
 * Redeem Diamonds Modal Component
 * First step in the redeem flow - shows redeem confirmation
 */
export const RedeemDiamondsModal = ({
  isOpen,
  onClose,
  onRedeem,
  diamondsCount,
  discountPercentage = 20,
}: RedeemDiamondsModalProps) => {
  const handleRedeem = () => {
    onRedeem()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      showCloseButton={false}
      closeOnOverlayClick={true}
      containerClassName="bg-white rounded-2xl shadow-2xl"
      contentClassName="p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:gap-5 items-center w-full">
        {/* Header with Title and Close Button */}
        <div className="flex gap-2 items-start justify-between w-full">
          <h2 className="flex-1 text-16 sm:text-18 font-medium text-gray-900 text-start">
            Redeem Diamonds Points
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Illustration Image */}
        <div className="flex justify-center">
          <img
            src={typeof redeemImage === 'string' ? redeemImage : redeemImage.src}
            alt="Redeem"
            className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 sm:gap-4 items-start w-full">
          {/* Success Message */}
          <div className="text-center w-full">
            <p className="text-16 sm:text-18 font-normal text-gray-900">Success! 🎉</p>
          </div>

          {/* Diamonds to Discount Conversion */}
          <div className="flex gap-3 sm:gap-4 items-center justify-center w-full">
            <div className="flex gap-1.5 sm:gap-2 items-center justify-center">
              <p className="text-18 sm:text-20 font-medium text-gray-900">{diamondsCount}</p>
              <img
                src={typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src}
                alt="Diamond"
                className="h-6 w-6 sm:h-7 sm:w-7"
              />
            </div>
            <p className="text-18 sm:text-20 font-normal text-gray-500">= {discountPercentage}% OFF</p>
          </div>
        </div>

        {/* Redeem Button */}
        <Button
          variant="brand"
          size="lg"
          className="w-full !text-white text-14 sm:text-16"
          onClick={handleRedeem}
        >
          Redeem
        </Button>
      </div>
    </Modal>
  )
}

