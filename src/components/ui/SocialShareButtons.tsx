'use client'

import { Button } from './Button'
import { Share2, MessageCircle, QrCode } from 'lucide-react'

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
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      <Button
        variant="outline"
        size="md"
        className="border-brand-500   text-brand-500 hover:bg-brand-500 hover:text-white py-2 flex px-2 sm:px-2  gap-1 sm:gap-2 rounded-lg bg-transparent "
        onClick={onFacebookClick}
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-10 sm:text-14  leading-tight hidden md:block ">Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="md"
        className="border-brand-500   text-brand-500 hover:bg-brand-500 hover:text-white py-2 flex px-2 sm:px-2  gap-1 sm:gap-2 rounded-lg bg-transparent "
        onClick={onInstagramClick}
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-10 sm:text-14  leading-tight hidden md:block">Instagram</span>
      </Button>
      <Button
        variant="outline"
        size="md"
        className="border-brand-500   text-brand-500 hover:bg-brand-500 hover:text-white py-2 flex px-2 sm:px-2  gap-1 sm:gap-2 rounded-lg bg-transparent "
        onClick={onWhatsappClick}
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-10 sm:text-14  leading-tight hidden md:block">Whatsapp</span>
      </Button>
      <Button
        variant="outline"
        size="md"
        className="border-brand-500   text-brand-500 hover:bg-brand-500 hover:text-white py-2 flex  px-2 sm:px-2  gap-1 sm:gap-2 rounded-lg bg-transparent "
        onClick={onQrCodeClick}
      >
        <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-10 sm:text-14  leading-tight hidden md:block">QR Code</span>
      </Button>
    </div>
  )
}

