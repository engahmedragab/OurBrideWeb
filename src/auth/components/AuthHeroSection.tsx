import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@/components/ui/Typography'
import { ChevronLeft } from 'lucide-react'
import AuthHeroCard from './AuthHeroCard'
import { DownloadApp } from '@/components/common'
import authHeroImage from '@/assets/images/authHero.jpg'

/**
 * AuthHeroSection component for authentication pages
 * Displays a hero section with background image, floating card, and interactive elements
 * @returns {JSX.Element} Auth hero section component
 */
export default function AuthHeroSection() {
  return (
    <div className="relative w-full h-full max-w-4xl mx-auto lg:rounded-3xl overflow-hidden">
      {/* Background Image */}
      <Image
        src={authHeroImage}
        alt="Wedding background"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute -top-1 left-0 z-30 rounded-br-3xl px-4 py-3 md:py-4 bg-white text-14 sm:text-16 font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 shadow-md"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Back To home</span>
      </Link>

      {/* Floating Hero Card - Top Right */}
      <div className="absolute top-6 right-10 lg:top-4 lg:right-4  z-30 w-1/4 max-w-[12.5rem] min-w-[9.375rem]">
        <AuthHeroCard />
      </div>

      {/* Text Section - Bottom Left (overlaid on pink structure) */}
      <div className="absolute bottom-1/2 translate-y-full  md:bottom-1/4 md:translate-y-0 lg:left-4 left-6 z-30 max-w-[20rem] sm:max-w-[23.75rem]">
        <Typography
          variant="h1"
          className="!text-white font-bold text-20 sm:text-24 mb-2 sm:mb-3 drop-shadow-lg"
        >
          Organize your Wedding
        </Typography>
        <Typography className="!text-white text-12 sm:text-14 opacity-90 drop-shadow-md leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Volutpat tincidunt nullam
          lacus enim mus consectetur. Posuere eget aliquam nunc faucibus amet.
          Laoreet egestas dapibus commodo tellus id lacus nisl egestas
          consectetur. Id quam convallis nunc mi sem.
        </Typography>
      </div>

      {/* Download App Section - Bottom Right */}
      <div className="absolute bottom-0 right-0 z-30">
        <DownloadApp variant="secondary" />
      </div>
    </div>
  )
}
