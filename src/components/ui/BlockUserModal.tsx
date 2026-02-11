'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import deleteXIcon from '@/assets/svg/deleteXIcon.svg'
import successCheck from '@/assets/svg/successCheck.svg'
import { useI18nTranslations } from '@/i18n/hooks'

export interface BlockUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  onReport?: () => void
  userName?: string
}

/**
 * Modal component for blocking a user
 * Shows confirmation step and success step
 */
export const BlockUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  onReport,
  userName,
}: BlockUserModalProps) => {
  const t = useI18nTranslations('messages')
  const [step, setStep] = useState<'confirm' | 'success'>('confirm')

  const resolvedUserName = userName ?? t('blockUser.defaultUserName')

  const handleClose = () => {
    setStep('confirm')
    onClose()
  }

  const handleBlock = () => {
    setStep('success')
    onConfirm()
  }

  const handleReport = () => {
    if (onReport) {
      onReport()
    } else {
      handleClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('blockUser.title')}
      maxWidth="sm"
      showCloseButton={true}
      containerClassName="w-full max-w-[380px]"
      contentClassName="px-6 pb-6 pt-0"
    >
      {step === 'confirm' ? (
        <div className="flex flex-col items-center gap-6">
          {/* Icon - Red X */}
          <div className="flex items-center justify-center mt-2">
            <Image
              src={deleteXIcon}
              alt={t('blockUser.blockUserAlt')}
              width={120}
              height={120}
              className="w-20 h-20"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-3 text-center w-full">
            <h3 className="text-16 font-semibold text-gray-900 leading-tight">
              {t('blockUser.confirmTitle', { userName: resolvedUserName })}
            </h3>
            <p className="text-14 font-normal text-gray-400 leading-relaxed">
              {t('blockUser.confirmDescription')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              variant="brand"
              size="lg"
              onClick={handleClose}
              className="w-full text-white rounded-full"
            >
              {t('blockUser.cancel')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleBlock}
              className="w-full bg-brand-50 text-brand-500 border border-brand-500 hover:bg-brand-100 hover:text-brand-600 rounded-full"
            >
              {t('blockUser.block')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Success Icon - Green checkmark */}
          <div className="flex items-center justify-center mt-2">
            <Image
              src={successCheck}
              alt={t('blockUser.successAlt')}
              width={120}
              height={120}
              className="w-20 h-20"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-3 text-center w-full">
            <h3 className="text-16 font-semibold text-gray-900 leading-tight">
              {t('blockUser.successTitle')}
            </h3>
            <p className="text-14 font-normal text-gray-400 leading-relaxed">
              {t('blockUser.successDescription')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              variant="brand"
              size="lg"
              onClick={handleClose}
              className="w-full text-white rounded-full"
            >
              {t('blockUser.done')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReport}
              className="w-full bg-white text-brand-500 border border-brand-500 hover:bg-brand-50 rounded-full"
            >
              {t('blockUser.report')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
