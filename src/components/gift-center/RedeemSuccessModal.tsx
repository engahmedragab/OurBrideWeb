'use client'

import Image from 'next/image'
import { Copy } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import saleSvg from '@/assets/svg/sale.svg'
import subtractImage from '@/assets/images/Subtract.png'

/**
 * Redeem Success Modal Component Props
 */
export interface RedeemSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  discountLabel?: string
  validUntilLabel?: string
  code?: string
  onCopyCode?: () => void
}

/**
 * Redeem Success Modal Component
 * Second step in the redeem flow - shows success with coupon
 */
export const RedeemSuccessModal = ({
  isOpen,
  onClose,
  discountLabel = 'You won 20% Off card',
  validUntilLabel = 'Valid Due 15 Sep,2025',
  code = 'amz005',
  onCopyCode,
}: RedeemSuccessModalProps) => {
  const handleCopyCode = () => {
    if (code && onCopyCode) {
      onCopyCode()
    } else if (code) {
      navigator.clipboard.writeText(code)
    }
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
            Success! 🎉
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

        {/* Ticket Card */}
        <div
          className="relative rounded-xl bg-white overflow-hidden h-[280px] sm:h-[320px] w-[200px] sm:w-[240px] flex flex-col"
          style={{
            backgroundImage: `url(${typeof subtractImage === 'string' ? subtractImage : subtractImage.src})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Sale Icon */}
          <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-10">
            <Image
              src={typeof saleSvg === 'string' ? saleSvg : saleSvg.src}
              alt="Sale"
              width={72}
              height={72}
              className="h-18 w-18"
            />
          </div>

          {/* Content - Centered */}
          <div className="flex flex-col gap-2.5 sm:gap-3 items-center justify-center flex-1 relative z-10 px-4 sm:px-5 mt-14">
            {/* Discount Label */}
            {discountLabel && (
              <div className="text-center w-3/4">
                <p className="text-14 sm:text-16 font-medium text-gray-900 leading-5 sm:leading-6 whitespace-pre-wrap">
                  {discountLabel}
                </p>
              </div>
            )}

            {/* Valid Until */}
            {validUntilLabel && (
              <p className="text-12 sm:text-14 font-normal text-gray-500 leading-4 sm:leading-5 w-full text-center">
                {validUntilLabel}
              </p>
            )}

            {/* Code Section */}
            {code && (
              <div className="w-full pt-1 sm:pt-1.5">
                <div className="bg-green-100 border border-dashed border-green-500 rounded-sm h-10 sm:h-12 flex items-center justify-center relative">
                  <p className="text-14 sm:text-16 font-normal text-green-500">{code}</p>
                  {onCopyCode && (
                    <button
                      onClick={handleCopyCode}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                      aria-label="Copy code"
                    >
                      <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Got It Button */}
        <Button
          variant="brand"
          size="lg"
          className="w-full !text-white text-14 sm:text-16"
          onClick={onClose}
        >
          Got It
        </Button>
      </div>
    </Modal>
  )
}

