import Image from 'next/image'
import { Typography } from '@/Components/ui/Typography'
import authHeroCardImage from '@/Assets/images/authHeroCard.png'

/**
 * AuthHeroCard component for authentication pages
 * Floating glass card with image header and text content
 * @returns {JSX.Element} Auth hero card component
 */
export default function AuthHeroCard() {
  return (
    <div
      className="overflow-hidden backdrop-blur-md w-full shadow-lg"
      style={{
        backgroundColor: 'rgba(89, 89, 89, 0.3)',
        borderRadius: '1.5rem',
      }}
    >
      {/* Top Section - Image Header */}
      <div className="relative w-full h-32 overflow-hidden">
        <Image
          src={authHeroCardImage}
          alt="Wedding organization"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Bottom Section - Text Content */}
      <div className="bg-white/40 backdrop-blur-md p-2 rounded-b-[3.125rem] text-center">
        <Typography
          variant="h4"
          className="mb-1 text-white text-center drop-shadow-md"
        >
          Organize your Wedding
        </Typography>

        <span className="text-12 text-white block drop-shadow-sm">
          Lorem ipsum dolor sit amet consectetur
        </span>
      </div>
    </div>
  )
}

