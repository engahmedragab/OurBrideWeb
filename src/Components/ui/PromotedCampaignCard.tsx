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
  return (
    <div
      className={`rounded-xl p-6 text-center ${className}`}
      style={{ backgroundColor }}
    >
      <div className="inline-block bg-white px-4 py-2 rounded-full mb-4">
        <p className="text-14 font-medium text-gray-900">{badgeText}</p>
      </div>
      <h3 className="text-20 font-semibold text-gray-900 mb-4">{title}</h3>
      <Input value={link} readOnly suffix="EGP" className="mb-6 bg-white" />
      <SocialShareButtons
        className="py-4"
        onFacebookClick={onShare?.onFacebookClick}
        onInstagramClick={onShare?.onInstagramClick}
        onWhatsappClick={onShare?.onWhatsappClick}
        onQrCodeClick={onShare?.onQrCodeClick}
      />
    </div>
  )
}

