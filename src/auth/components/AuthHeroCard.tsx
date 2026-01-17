import Image from 'next/image'
import { Typography } from '@/components/ui/Typography'
import authHeroCardImage from '@/assets/images/authHeroCard.png'

/**
 * AuthHeroCard component for authentication pages
 * Floating glass card with image header and text content
 * @returns {JSX.Element} Auth hero card component
 */
interface AuthHeroCardProps {
  title: string
  subtitle: string
}
export default function AuthHeroCard({ title, subtitle }: AuthHeroCardProps) {
  return (
    <div className="overflow-hidden w-full shadow-lg rounded-3xl bg-glassCard/10 backdrop-blur-sm">
      {/* Top Section - Image Header */}
      <div className="relative w-full h-32 overflow-hidden rounded-t-3xl">
        <Image
          src={authHeroCardImage}
          alt="Wedding organization"
          fill
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {/* Bottom Section - Text Content */}
      <div className="  backdrop-blur-sm p-3 rounded-b-3xl text-center">
        <Typography
          variant="h4"
          className="mb-1 !text-white text-center drop-shadow-md font-semibold text-14"
        >
         {title}
        </Typography>

        <span className="text-12 text-white block drop-shadow-sm">
         {subtitle}
        </span>
      </div>
    </div>
  )
}
