'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'
import { useI18nTranslations } from '@/i18n'

export interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

/**
 * Modal component for confirming account deletion
 * Matches Figma design exactly - small centered card with diamond icon
 */
export const DeleteAccountModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) => {
  const t = useI18nTranslations('settings.deleteAccountModal')
  
  const handleKeepAccount = () => {
    onClose()
  }

  const handleDeleteAccount = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('title')}
      maxWidth="sm"
      showCloseButton={true}
      containerClassName="w-full max-w-[380px]"
      contentClassName="px-6 pb-6 pt-0"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Icon area - Soft pink diamond with red X */}
        <div className="flex items-center justify-center mt-2">
          {/* Diamond shape: rotated square with soft pink background */}
          <div className="relative w-20 h-20 rotate-45 bg-[rgba(254,237,235,1)] rounded-lg flex items-center justify-center">
            {/* Red X icon - rotated back to normal orientation */}
            <div className="absolute -rotate-45">
              <svg
                width="32"
                height="32"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M48.548 16.7032C49.4689 15.8129 50.2032 14.7482 50.7082 13.5711C51.2132 12.394 51.4787 11.1282 51.4892 9.84736C51.4997 8.56656 51.2551 7.2965 50.7695 6.11127C50.2839 4.92604 49.5672 3.84938 48.661 2.94412C47.7549 2.03886 46.6776 1.32312 45.4919 0.838664C44.3062 0.354211 43.0359 0.110747 41.7551 0.122477C40.4744 0.134206 39.2087 0.400896 38.0321 0.906983C36.8555 1.41307 35.7915 2.14842 34.9021 3.07012L25.7962 12.1631L16.7032 3.07012C15.8201 2.12241 14.7552 1.36227 13.5719 0.835058C12.3887 0.307844 11.1114 0.0243531 9.81621 0.00150118C8.52103 -0.0213507 7.23452 0.216905 6.03342 0.70205C4.83232 1.18719 3.74123 1.90929 2.82526 2.82527C1.90929 3.74124 1.18719 4.83232 0.702047 6.03342C0.216902 7.23452 -0.0213507 8.52104 0.0015012 9.81622C0.0243531 11.1114 0.307841 12.3887 0.835055 13.5719C1.36227 14.7552 2.12241 15.8201 3.07012 16.7032L12.1631 25.8091L3.07012 34.9021C1.36624 36.7306 0.438637 39.1492 0.482729 41.6482C0.526821 44.1472 1.53917 46.5315 3.30649 48.2988C5.07381 50.0661 7.45813 51.0785 9.95711 51.1225C12.4561 51.1666 14.8746 50.239 16.7032 48.5352L25.7962 39.4422L34.8892 48.5352C36.6971 50.3464 39.1504 51.3653 41.7095 51.3677C44.2686 51.3702 46.7239 50.3559 48.5352 48.548C50.3464 46.7402 51.3653 44.2868 51.3678 41.7277C51.3702 39.1686 50.3559 36.7133 48.548 34.9021L39.455 25.8091L48.548 16.7032Z"
                  fill="#FF3B3B"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-3 text-center w-full">
          <h3 className="text-16 font-semibold text-gray-900 leading-tight">
            {t('question')}
          </h3>
          <p className="text-14 font-normal text-gray-600 leading-relaxed max-w-sm">
            {t('description')}
          </p>
        </div>

        {/* Actions - Keep Account first (red), then Delete Account (light pink) */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <Button
            variant="brand"
            size="lg"
            onClick={handleKeepAccount}
            className="w-full text-white rounded-full"
          >
            {t('keepAccount')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDeleteAccount}
            className="w-full bg-brand-50 text-brand-500 border border-brand-500 hover:bg-brand-100 hover:text-brand-600 rounded-full"
          >
            {t('deleteAccount')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
