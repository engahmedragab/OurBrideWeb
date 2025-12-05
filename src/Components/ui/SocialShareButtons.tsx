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
        className="border-brand-500 text-brand-500 hover:bg-brand-50"
        onClick={onFacebookClick}
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-brand-500 text-brand-500 hover:bg-brand-50"
        onClick={onInstagramClick}
      >
        <Instagram className="h-4 w-4" />
        Instagram
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-brand-500 text-brand-500 hover:bg-brand-50"
        onClick={onWhatsappClick}
      >
        <MessageCircle className="h-4 w-4" />
        Whatsapp
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-brand-500 text-brand-500 hover:bg-brand-50"
        onClick={onQrCodeClick}
      >
        <QrCode className="h-4 w-4" />
        QR Code
      </Button>
    </div>
  )
}

