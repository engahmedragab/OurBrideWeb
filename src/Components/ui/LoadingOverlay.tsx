import { cn } from '@/lib/utils'
import brandLogo from '@/assets/svg/Brand-logo.svg'

export interface LoadingOverlayProps {
  open: boolean
  title?: string
  subtitle?: string
  className?: string
  containerClassName?: string
}

/**
 * LoadingOverlay - Reusable loading overlay component
 * Displays logo, loading text, and optional subtitle
 */
export const LoadingOverlay = ({
  open,
  title = 'Loading….',
  subtitle = "Just a moment, we're almost there",
  className,
  containerClassName,
}: LoadingOverlayProps) => {
  if (!open) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl bg-white p-8 sm:p-10 shadow-lg min-w-[280px] sm:min-w-[320px]',
          containerClassName
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img
            src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
            alt="OurBride Logo"
            className="h-20 w-auto sm:h-24"
          />
        </div>

        {/* Loading Text */}
        <div className="mt-4 sm:mt-5 flex flex-col items-center">
          <p className="text-base sm:text-lg font-semibold text-gray-900">{title}</p>
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

