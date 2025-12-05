import { Modal } from '../Modal'
import { Button } from '../Button'
import { Typography } from '../Typography'

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
  const handleAccept = () => {
    onAccept?.()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms & Conditions"
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
                Introduction
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                By using OurBride, you agree to the following terms and
                conditions.
              </Typography>
            </div>

            {/* Account Usage */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                Account Usage
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                Users must provide accurate personal information. You are
                responsible for keeping your account secure.
              </Typography>
            </div>

            {/* Bookings & Services */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                Bookings & Services
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                Bookings depend on provider availability. Cancellations and
                refunds follow each provider&apos;s policy.
              </Typography>
            </div>

            {/* Payments & Fees */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                Payments & Fees
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                All payments must be made through the app. OurBride deducts a 2%
                commission from provider earnings monthly.
              </Typography>
            </div>

            {/* Content & Community */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                Content & Community
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                Users must not post offensive or harmful content. OurBride
                reserves the right to remove any inappropriate material.
              </Typography>
            </div>

            {/* Privacy & Security */}
            <div className="space-y-1.5 sm:space-y-2">
              <Typography
                variant="h6"
                weight="semibold"
                className="text-gray-900 text-14 sm:text-16"
              >
                Privacy & Security
              </Typography>
              <Typography
                variant="body"
                textColor="secondary"
                className="text-gray-700 text-12 sm:text-13"
              >
                We protect your data under our Privacy Policy. Identity
                verification is required for providers.
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
            Accept Terms & Conditions
          </Button>
        </div>
      </div>
    </Modal>
  )
}
