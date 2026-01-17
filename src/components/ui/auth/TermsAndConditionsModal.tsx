import { Modal } from '../Modal'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { useI18nTranslations } from '@/i18n'

export interface TermsAndConditionsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: () => void
}

/**
 * TermsAndConditionsModal - Modal displaying terms and conditions
 * Compact design with scrollable content
 */
export const TermsAndConditionsModal = ({
  isOpen,
  onClose,
  onAccept,
}: TermsAndConditionsModalProps) => {
  const t = useI18nTranslations('auth.terms')
  const handleAccept = () => {
    onAccept?.()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('title')}
      maxWidth="md"
      showCloseButton
      containerClassName="flex flex-col max-h-[90vh] w-[90vw] sm:w-full max-w-[420px] md:max-w-[520px]"
      contentClassName="flex flex-col flex-1 min-h-0 p-0"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-4 max-h-[70vh]">
          <div className="space-y-3 sm:space-y-4">
            {/* Introduction */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                {t('sections.introduction.title')}
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                {t('sections.introduction.body')}
              </Typography>
            </div>

            {/* Account Usage */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                {t('sections.accountUsage.title')}
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                {t('sections.accountUsage.body')}
              </Typography>
            </div>

            {/* Bookings & Services */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                {t('sections.bookingsServices.title')}
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                {t('sections.bookingsServices.body')}
              </Typography>
            </div>

            {/* Payments & Fees */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                {t('sections.paymentsFees.title')}
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                 { t('sections.paymentsFees.body')}
              </Typography>
            </div>

            {/* Content & Community */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                {t('sections.contentCommunity.title')}
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                 {t('sections.contentCommunity.body')}
              </Typography>
            </div>

            {/* Privacy & Security */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                {t('sections.privacySecurity.title')}
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                {t('sections.privacySecurity.body')}
              </Typography>
            </div>
          </div>
        </div>

        {/* Sticky Footer with Accept Button */}
        <div className="border-t border-gray-200 px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-4 bg-white">
          <Button
            variant="brand"
            size="lg"
            onClick={handleAccept}
            className="w-full text-white"
          >
            {t('acceptButton')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
