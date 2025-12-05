'use client'

import Image from 'next/image'
import { Button } from './Button'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'
import modalSuccessSvg from '@/assets/svg/Modal-success.svg'

export interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onTrackOrder?: () => void
  className?: string
}

export const OrderConfirmationModal = ({
  isOpen,
  onClose,
  onTrackOrder,
  className,
}: OrderConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Confirmation"
      maxWidth="md"
      zIndex={7}
      className={className}
      contentClassName="p-0"
    >
      <div className="p-6">
          {/* Success Illustration */}
          <div className="flex justify-center mb-6">
            <Image
              src={modalSuccessSvg}
              alt="Success"
              width={120}
              height={120}
              className="w-24 h-24"
            />
          </div>

          {/* Success Message */}
          <div className="text-center mb-4">
            <p className="text-20 md:text-24 font-normal text-gray-900 mb-3">
              Your Order Is Placed successfully
            </p>
            <p className="text-14 text-gray-600 leading-relaxed">
              Enjoy exclusive coupons, seasonal discounts, and real offers from
              trusted vendors in your city
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <Button
              onClick={() => {
                if (onTrackOrder) {
                  onTrackOrder()
                }
                onClose()
              }}
              variant="default"
              size="lg"
              className={cn(
                'w-full h-12 rounded-lg font-normal text-white',
                'bg-[#F46D5F] hover:bg-[#E55A4A]',
                'transition-colors'
              )}
            >
              Track My Order
            </Button>
          </div>
        </div>
    </Modal>
  )
}
