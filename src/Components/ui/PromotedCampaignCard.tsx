import { cn } from '@/lib/utils'
import { Input } from './Input'
import { SocialShareButtons } from './SocialShareButtons'

export interface PromotedCampaignCardProps {
  badgeText: string
  title: string
  link: string
  backgroundColor?: string
  className?: string
  onShare?: {
    onFacebookClick?: () => void
    onInstagramClick?: () => void
    onWhatsappClick?: () => void
    onQrCodeClick?: () => void
  }
}

/**
 * PromotedCampaignCard Component
 * Reusable card for displaying promoted campaigns with badge, title, link, and share buttons
 */
export const PromotedCampaignCard = ({
  badgeText,
  title,
  link,
  backgroundColor = '#FFF4F2',
  className = '',
  onShare,
}: PromotedCampaignCardProps) => {
  // Map common colors to Tailwind classes
  const getBackgroundClass = (bgColor?: string) => {
    if (!bgColor) return 'bg-brand-50'
    const colorMap: Record<string, string> = {
      '#FFF4F2': 'bg-brand-50',
      '#E6F9F4': 'bg-green-50',
      '#FFB8A8': 'bg-campaign-coral',
      '#00D9A3': 'bg-campaign-mint-green',
    }
    return colorMap[bgColor] || undefined
  }

  const bgClass = getBackgroundClass(backgroundColor)

  return (
    <div
      className={cn('rounded-xl p-4 sm:p-6 text-center', bgClass, className)}
      style={!bgClass && backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="inline-block bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
        <p className="text-12 sm:text-14 font-medium text-gray-900">{badgeText}</p>
      </div>
      <h3 className="text-18 sm:text-20 font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
      <Input value={link} readOnly className="mb-4 sm:mb-6 bg-white text-13 sm:text-14" />
      <SocialShareButtons
        className="py-3 sm:py-4"
        onFacebookClick={onShare?.onFacebookClick}
        onInstagramClick={onShare?.onInstagramClick}
        onWhatsappClick={onShare?.onWhatsappClick}
        onQrCodeClick={onShare?.onQrCodeClick}
      />
    </div>
  )
}

