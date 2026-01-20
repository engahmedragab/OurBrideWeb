'use client'

import Image from 'next/image'
import { Button } from './Button'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import modalSuccessSvg from '@/assets/svg/Modal-success.svg'
import { useI18nTranslations } from '@/i18n/hooks'

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
const tSD = useI18nTranslations('services.bookingConfirmationModal')
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
      title={tSD('title')}
      maxWidth="md"
      zIndex={7}
      className={className}
      contentClassName="p-0"
    >
      <div className="p-6">
        {/* Success Illustration */}
        <div className="flex justify-center mb-6">
          <Image
            src={
              typeof modalSuccessSvg === 'string'
                ? modalSuccessSvg
                : modalSuccessSvg.src
            }
            alt={tSD('title')}
            width={281}
            height={281}
            className="w-full max-w-[281px] h-auto"
          />
        </div>

        {/* Success Message */}
        <div className="text-center mb-4">
          <p className="text-20 md:text-24 font-normal text-gray-900 mb-3">
            {tSD('successMessage')}
          </p>
          <p className="text-14 md:text-16 text-gray-600 leading-relaxed">
            {tSD('successDescription')}
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
              {tSD('trackRequest')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
