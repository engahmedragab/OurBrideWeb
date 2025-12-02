import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@/Components/ui/Typography'
import { ChevronLeft } from 'lucide-react'
import AuthHeroCard from './AuthHeroCard'
import { DownloadApp } from '@/Components/common'
import authHeroImage from '@/Assets/images/authHero.png'

/**
 * AuthHeroSection component for authentication pages
 * Displays a hero section with background image, floating card, and interactive elements
 * @returns {JSX.Element} Auth hero section component
 */
export default function AuthHeroSection() {
  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden ">
      {/* Background Image */}
      <Image
        src={authHeroImage}
        alt="Wedding background"
        fill
        className="object-cover"
        priority
      />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-0 left-0 z-30 px-4 py-3 md:py-4 bg-white rounded-bl-2xl text-14 sm:text-16 font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 overflow-hidden"
        style={{ borderBottomRightRadius: '1.5625rem' }}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="">Back to home</span>
       
      </Link>

      {/* Floating Hero Card */}
      <div className="absolute top-4 right-4 sm:top-11 sm:right-6 z-30 w-1/4 max-w-[12.5rem] min-w-[9.375rem]">
        <AuthHeroCard />
      </div>

      {/* Text Section - Bottom */}
      <div
        className="absolute left-4 sm:left-6 z-30 px-4 md:px-2 max-w-[20rem] sm:max-w-[23.75rem] text-start"
        style={{ bottom: '25%' }}
      >
        <Typography variant="h1" className="!text-white font-bold text-20 sm:text-24 mb-2 sm:mb-3 drop-shadow-lg">
          Organize your Wedding
        </Typography>
        <Typography className="!text-white text-12 sm:text-14 opacity-90 drop-shadow-md">
          Lorem ipsum dolor sit amet consectetur. Volutpat tincidunt nullam lacus
          enim mus consectetur. Posuere eget aliquam nunc faucibus amet.
        </Typography>
      </div>

      {/* Download App Buttons - Right */}
      <div className="absolute bottom-0 right-0   2xl:left-1/2   z-30 ">
        <DownloadApp variant="secondary" className='px-8 md:px-3' />
      </div>
    </div>
  )
}
