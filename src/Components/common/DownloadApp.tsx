import { Typography } from '@/Components/ui/Typography'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import AppleIcon from '@/Assets/svg/Apple.svg'
import PlaystoreIcon from '@/Assets/svg/Playstore.svg'

const downloadAppVariants = cva('bg-gray-25 p-2', {
  variants: {
    variant: {
      default: 'rounded-none',
      secondary: 'rounded-tl-3xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

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
        variant="h6"
        className={cn('mb-3 md:mb-4 !text-12 md:!text-14 text-gray-900 font-semibold text-center')}
      >
        Download Our APP
      </Typography>

      {/* App Store Buttons */}
      <div className={cn('flex flex-row gap-1.5 md:gap-2')}>
        {/* App Store Button */}
        <button
          className={cn(
            'flex items-center gap-x-1.5 md:gap-x-2 bg-white border border-gray-300 rounded-lg',
            'px-2 py-1 md:px-4 md:py-2',
            'hover:bg-gray-100 transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Download on the App Store"
          type="button"
        >
          <img
            src={typeof AppleIcon === 'string' ? AppleIcon : AppleIcon.src || AppleIcon}
            alt=""
            className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0"
            aria-hidden="true"
          />
          <div className="flex flex-col items-start">
            <span className="text-8 md:text-10 font-normal text-gray-900 leading-tight">
              Download on the
            </span>
            <span className="text-12 md:text-14 font-semibold text-gray-900 leading-tight">
              App Store
            </span>
          </div>
        </button>

        {/* Google Play Button */}
        <button
          className={cn(
            'flex items-center gap-x-1.5 md:gap-x-2 bg-white border border-gray-300 rounded-lg',
            'px-2 py-1 md:px-4 md:py-2',
            'hover:bg-gray-100 transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="GET IT ON Google Play"
          type="button"
        >
          <img
            src={typeof PlaystoreIcon === 'string' ? PlaystoreIcon : PlaystoreIcon.src || PlaystoreIcon}
            alt=""
            className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0"
            aria-hidden="true"
          />
          <div className="flex flex-col items-start">
            <span className="text-8 md:text-10 font-normal text-gray-900 leading-tight">
              GET IT ON
            </span>
            <span className="text-12 md:text-14 font-semibold text-gray-900 leading-tight">
              Google Play
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
