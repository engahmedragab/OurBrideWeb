'use client'

import { Button } from './Button'
import { Facebook, Instagram, MessageCircle, QrCode } from 'lucide-react'

export interface SocialShareButtonsProps {
  onFacebookClick?: () => void
  onInstagramClick?: () => void
  onWhatsappClick?: () => void
  onQrCodeClick?: () => void
  className?: string
}

/**
 * SocialShareButtons Component
 * Reusable social media share buttons for sharing links and campaigns
 * Shows icons only on mobile, icons + labels on desktop
 */
export const SocialShareButtons = ({
  onFacebookClick,
  onInstagramClick,
  onWhatsappClick,
  onQrCodeClick,
  className = '',
}: SocialShareButtonsProps) => {
  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        className="border-brand-500 text-brand-500 hover:bg-brand-50 flex-col sm:flex-row px-2 sm:px-3 gap-1 sm:gap-2"
        onClick={onFacebookClick}
      >
        <Facebook className="h-4 w-4 sm:h-4 sm:w-4" />
        <span className="text-10 sm:text-13 leading-tight">Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-brand-500 text-brand-500 hover:bg-brand-50 flex-col sm:flex-row px-2 sm:px-3 gap-1 sm:gap-2"
        onClick={onInstagramClick}
      >
        <Instagram className="h-4 w-4 sm:h-4 sm:w-4" />
        <span className="text-10 sm:text-13 leading-tight">Instagram</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-brand-500 text-brand-500 hover:bg-brand-50 flex-col sm:flex-row px-2 sm:px-3 gap-1 sm:gap-2"
        onClick={onWhatsappClick}
      >
        <MessageCircle className="h-4 w-4 sm:h-4 sm:w-4" />
        <span className="text-10 sm:text-13 leading-tight">Whatsapp</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-brand-500 text-brand-500 hover:bg-brand-50 flex-col sm:flex-row px-2 sm:px-3 gap-1 sm:gap-2"
        onClick={onQrCodeClick}
      >
        <QrCode className="h-4 w-4 sm:h-4 sm:w-4" />
        <span className="text-10 sm:text-13 leading-tight">QR Code</span>
      </Button>
    </div>
  )
}
