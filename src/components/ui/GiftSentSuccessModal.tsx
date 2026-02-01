'use client'

import Image from 'next/image'
import { Button } from './Button'
import { Modal } from './Modal'
import giftSuccessImage from '@/assets/images/Giftsuccess.png'
import { useI18nTranslations } from '@/i18n/hooks'

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
  const t = useI18nTranslations('coupons')
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('successModal.title')}
      maxWidth="sm"
      zIndex={60}
      className={className}
      contentClassName="p-0"
    >
      <div className="p-6">
        {/* Success Illustration */}
        <div className="flex justify-center mb-6">
          <Image
            src={
              typeof giftSuccessImage === 'string'
                ? giftSuccessImage
                : giftSuccessImage.src
            }
            alt={t('successModal.alt')}
            width={150}
            height={150}
            className="w-full max-w-[120px] h-[120px] sm:max-w-[150px] sm:h-[150px] object-contain"
          />
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <p className="text-20 font-semibold text-gray-900 mb-2">
            {t('successModal.success')}
          </p>
          <p className="text-16 text-gray-600">
            {t('successModal.message')}
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onClose}
          variant="brand"
          size="lg"
          className="w-full rounded-full text-white"
        >
          {t('successModal.gotIt')}
        </Button>
      </div>
    </Modal>
  )
}

