import { cn } from '@/lib/utils'
import logoImage from '@/Assets/images/logoWithoutourbirde.png'

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
          'flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-lg',
          containerClassName
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img
            src={typeof logoImage === 'string' ? logoImage : logoImage.src}
            alt="OurBride Logo"
            className="h-16 w-auto"
          />
        </div>

        {/* Loading Text */}
        <div className="mt-3 flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

