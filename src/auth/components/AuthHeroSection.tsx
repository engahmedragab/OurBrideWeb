import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@/Components/ui/Typography'
import { cn } from '@/lib/utils'
import AuthHeroCard from './AuthHeroCard'
import { DownloadApp } from '@/Components/common'
import authHeroImage from '@/Assets/images/authHero.png'

/**
 * AuthHeroSection component for authentication pages
 * Displays a hero section with background image, navigation button, and content sections
 * @returns {JSX.Element} Auth hero section component
 */
export default function AuthHeroSection() {
  return (
    <div className={cn('relative w-full h-full ')}>
      {/* Background Image */}
      <div className={cn('absolute inset-0 w-full h-full ')}>
        <Image
          src={authHeroImage}
          alt="Wedding hero background"
          fill
          className={cn('object-cover !rounded-3xl')}
          priority
        />
      </div>

      {/* Back to Home Button */}
      <Link
        href="/"
        className={cn(
          'absolute top-0 left-0 z-20',
          'px-6 py-4',
          'bg-white',
          'rounded-br-3xl',
          'text-16 font-semibold text-gray-900',
          'hover:bg-white transition-colors duration-200'
        )}
      >
        Back to home
      </Link>

      {/* Content Container */}
        {/* Left Section */}
       
          {/* Floating AuthHeroCard - Top Left of Left Section */}
          <div
            className={cn(
              'relative z-10',
              'mb-6',
              'lg:absolute lg:top-3 lg:right-3',
              'max-w-[200px] '
            )}
          >
            <AuthHeroCard />
          </div>

          {/* Text Content Overlay - Middle Area */}
          <div
            className={cn(
              'absolute bottom-24 left-6 max-w-[400px] ',
            )}
          >
            <Typography
              variant="h1"
              className={cn('mb-2 lg:mb-4 !text-20 text-white font-bold')}
            >
              Organize your Wedding
            </Typography>
            <Typography
              variant="body"
              className={cn('!text-white text-14')}
            >
              Lorem ipsum dolor sit amet consectetur. Volutpat tincidunt nullam lacus enim mus consectetur. Posuere eget aliquam nunc faucibus amet. Laoreet egestas dapibus commodo tellus id lacus nisl egestas consectetur. Id quam convallis nunc mi sem.
            </Typography>
          </div>

          {/* DownloadApp at Bottom */}
          <div className={cn('absolute bottom-0 right-0 z-10 mt-auto')}>
            <DownloadApp variant="secondary" />
          </div>
        </div>

     
    
  )
}

