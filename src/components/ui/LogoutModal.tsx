'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { LogoutIcon } from './ModalIcons'

export interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

/**
 * Modal component for confirming logout
 * Matches Figma design exactly
 */
export const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) => {
  const handleCancel = () => {
    onClose()
  }

  const handleLogout = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Logout"
      maxWidth="sm"
      showCloseButton={true}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Icon - Light pink squircle with red arrow */}
        <LogoutIcon />

        {/* Content */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-16 font-semibold text-gray-900">
            Are you sure you want to log out of your account?
          </h3>
          <p className="text-14 text-gray-600 max-w-md">
            You'll need to enter your credentials again to sign back in
          </p>
        </div>

        {/* Actions - Cancel first (red), then Logout (light pink) */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <Button
            variant="brand"
            size="lg"
            onClick={handleCancel}
            className="w-full text-white"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleLogout}
            className="w-full bg-brand-100 text-brand-500 border-brand-200 hover:bg-brand-100 hover:text-brand-600"
          >
            Logout
          </Button>
        </div>
      </div>
    </Modal>
  )
}
