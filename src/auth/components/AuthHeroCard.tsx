import Image from 'next/image'
import { Typography } from '@/components/ui/Typography'
import authHeroCardImage from '@/assets/images/authHeroCard.png'

/**
 * AuthHeroCard component for authentication pages
 * Floating glass card with image header and text content
 * @returns {JSX.Element} Auth hero card component
 */
export default function AuthHeroCard() {
  return (
    <div className="overflow-hidden w-full shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
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
      <div className="bg-white/60 backdrop-blur-sm p-3 rounded-b-3xl text-center">
        <Typography
          variant="h4"
          className="mb-1 text-white text-center drop-shadow-md font-bold text-14"
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

