'use client'

import { Button } from './Button'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import modalSuccessSvg from '@/assets/svg/Modal-success.svg'

export interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onTrackRequest?: () => void
  className?: string
}

export const BookingConfirmationModal = ({
  isOpen,
  onClose,
  onTrackRequest,
  className,
}: BookingConfirmationModalProps) => {
  const router = useRouter()

  const handleTrackRequest = () => {
    if (onTrackRequest) {
      onTrackRequest()
    } else {
      router.push('/orders')
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Booking Confirmation"
      maxWidth="md"
      zIndex={7}
      className={className}
      contentClassName="p-0"
    >
      <div className="p-6">
        {/* Success Illustration */}
        <div className="flex justify-center mb-6">
          <img
            src={
              typeof modalSuccessSvg === 'string'
                ? modalSuccessSvg
                : modalSuccessSvg.src
            }
            alt="Booking Confirmation"
            className="w-full max-w-[281px] h-auto"
          />
        </div>

        {/* Success Message */}
        <div className="text-center mb-4">
          <p className="text-20 md:text-24 font-normal text-gray-900 mb-3">
            Your Request Has Been Sent!
          </p>
          <p className="text-14 md:text-16 text-gray-600 leading-relaxed">
            Your service request has been successfully submitted. The provider
            has been notified and you will receive an update once they respond.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            onClick={handleTrackRequest}
            variant="default"
            size="lg"
            className={cn(
              'w-full h-12 rounded-lg font-normal text-white',
              'bg-brand-500 hover:bg-brand-600',
              'transition-colors'
            )}
          >
            Track My Request
          </Button>
        </div>
      </div>
    </Modal>
  )
}
