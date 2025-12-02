'use client'

import { Modal } from './Modal'
import { Button } from './Button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export interface CancelOrderSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onBrowseMore?: () => void
}

export const CancelOrderSuccessModal = ({
  isOpen,
  onClose,
  onBrowseMore,
}: CancelOrderSuccessModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      containerClassName="p-0"
      headerClassName="hidden"
      contentClassName="px-6 py-8"
    >
      <div className="flex flex-col items-center">
        {/* Success Icon */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-green-100 blur-sm"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-lg bg-green-50 shadow-sm">
              <div className="flex h-16 w-16 rotate-45 items-center justify-center rounded-lg bg-green-100">
                <Check className="h-10 w-10 -rotate-45 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-center text-24 font-semibold text-gray-900">
          Order Canceled Successfully
        </h2>

        {/* Description */}
        <p className="mb-6 text-center text-16 text-gray-600">
          Your order has been canceled. You can continue browsing and place a new
          order anytime
        </p>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-4">
          <Button
            variant="brand"
            size="lg"
            className="w-full text-white"
            onClick={onClose}
          >
            Close
          </Button>
          {onBrowseMore ? (
            <button
              onClick={onBrowseMore}
              className="text-center text-16 font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              Browse More
            </button>
          ) : (
            <Link
              href="/"
              className="text-center text-16 font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              Browse More
            </Link>
          )}
        </div>
      </div>
    </Modal>
  )
}

