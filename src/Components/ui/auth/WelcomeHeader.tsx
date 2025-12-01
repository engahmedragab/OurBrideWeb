import { cn } from '@/lib/utils'
import { Typography } from '../Typography'
import logoImage from '@/Assets/images/logoWithoutourbirde.png'

export interface WelcomeHeaderProps {
  welcomeText?: string
  className?: string
}

/**
 * WelcomeHeader - Reusable component for welcome message with logo
 * Displays logo, welcome text, and underline
 */
export const WelcomeHeader = ({
  welcomeText = 'Welcome To OurBride',
  className,
}: WelcomeHeaderProps) => {
  return (
    <div className={cn('flex flex-col items-center space-y-1', className)}>
      {/* Logo */}
      <div className="flex items-center justify-center">
        <img
          src={typeof logoImage === 'string' ? logoImage : logoImage.src}
          alt="OurBride Logo"
          className="h-10 w-auto sm:h-12"
        />
      </div>

      {/* Welcome Text */}
      <div className="flex flex-col items-center space-y-0.5">
        <Typography
          variant="h6"
          weight="semibold"
          textColor="default"
          align="center"
          className="text-gray-800 text-14 sm:text-16"
        >
          {welcomeText}
        </Typography>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-28 bg-brand-500 rounded-full" />
          <div className="h-0.5 w-4 bg-brand-500 rounded-full" />
        </div>
      </div>
    </div>
  )
}

