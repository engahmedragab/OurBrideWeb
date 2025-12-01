import Image from 'next/image'
import { Typography } from '@/Components/ui/Typography'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import appStoreBtn from '@/Assets/images/app-store-btn.png'
import googlePlayBtn from '@/Assets/images/google-play-btn.png'

const downloadAppVariants = cva(
  'w-full bg-gray-25 p-4',
  {
    variants: {
      variant: {
        default: 'rounded-none',
        secondary: 'rounded-tl-3xl',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface DownloadAppProps
  extends VariantProps<typeof downloadAppVariants> {
  className?: string
}

/**
 * DownloadApp component for displaying app store download buttons
 * @param variant - Style variant: 'default' (no border-radius) or 'secondary' (border only on top-right)
 * @param className - Additional CSS classes
 * @returns {JSX.Element} Download app component
 */
export default function DownloadApp({
  variant,
  className,
}: DownloadAppProps) {
  return (
    <div className={cn(downloadAppVariants({ variant }), className)}>
      {/* Title */}
      <Typography
        variant="h4"
        className={cn('mb-2 text-gray-900 font-semibold')}
      >
        Download Our APP
      </Typography>

      {/* App Store Buttons */}
      <div className={cn('flex flex-col sm:flex-row gap-4')}>
        {/* App Store Button */}
        <div className={cn('flex-shrink-0')}>
          <Image
            src={appStoreBtn}
            alt="Download on the App Store"
            width={150}
            height={40}
            className={cn('h-8 w-auto object-contain')}
          />
        </div>

        {/* Google Play Button */}
        <div className={cn('flex-shrink-0')}>
          <Image
            src={googlePlayBtn}
            alt="Get it on Google Play"
            width={150}
            height={40}
            className={cn('h-8 w-auto object-contain')}
          />
        </div>
      </div>
    </div>
  )
}

