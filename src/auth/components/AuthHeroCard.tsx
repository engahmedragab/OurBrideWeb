import Image from 'next/image'
import { Typography } from '@/Components/ui/Typography'
import { cn } from '@/lib/utils'
import authHeroCardImage from '@/Assets/images/authHeroCard.png'

/**
 * AuthHeroCard component for authentication pages
 * Displays a card with hero image, title, and description
 * @returns {JSX.Element} Auth hero card component
 */
export default function AuthHeroCard() {
  return (
    <div
      className={cn(
        'bg-glassCard/50 backdrop-blur-md',
        'rounded-3xl p-4',
        'overflow-hidden',
        'w-full'
      )}
    >
      {/* Top Section - Image */}
      <div className={cn('relative w-full h-28 ')}>
        <Image
          src={authHeroCardImage}
          alt="Wedding organization"
          fill
          className={cn('object-fill')}
          priority
        />
      </div>

      {/* Bottom Section - Text Content */}
      <div
        className={cn(
          'text-center'
        )}
      >
        <Typography
          variant="h6"
          className={cn('my-2 !text-14 text-white text-center')}
        >
          Organize your Wedding
        </Typography>

        <span
          className={cn(
            '!text-12 text-white',
            'block'
          )}
        >
          Lorem ipsum dolor sit amet consectetur
        </span>
      </div>
    </div>
  )
}
