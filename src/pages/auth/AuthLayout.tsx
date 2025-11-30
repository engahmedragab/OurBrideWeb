import { Outlet, Link } from 'react-router-dom'
import { Typography } from '@/components/ui/Typography'
import { StoreBadges } from '@/components/ui/StoreBadges'
import { publicRoutes } from '@/constants'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

/**
 * AuthLayout component for authentication pages
 * Provides a two-column layout with visual content on the left
 * and form content on the right
 */
export default function AuthLayout() {
  return (
    <div className={cn('flex min-h-screen')}>
      {/* Left Section */}
      <div
        className={cn(
          'relative hidden lg:flex lg:w-[40%] flex-col',
          'bg-gray-100 overflow-hidden'
        )}
      >
        {/* Back to Home */}
        <Link
          to={publicRoutes.HOME}
          className={cn(
            'absolute top-6 left-6 z-10',
            'flex items-center gap-2',
            'text-16 font-medium text-gray-700',
            'hover:text-brand-500 transition-colors'
          )}
        >
          <ChevronLeft className={cn('h-5 w-5')} />
          <span>Back To home</span>
        </Link>

        {/* Main Images */}
        <div
          className={cn('relative flex-1 flex items-center justify-center p-8')}
        >
          {/* Main Image */}
          <div
            className={cn(
              'w-full h-full max-w-2xl',
              'rounded-2xl bg-gray-200',
              'flex items-center justify-center'
            )}
          >
            <div className={cn('text-gray-400 text-16')}>Main Image</div>
          </div>

          {/* Inset Image */}
          <div
            className={cn(
              'absolute top-8 right-8',
              'w-64 h-80',
              'rounded-xl bg-gray-200',
              'flex items-center justify-center shadow-lg'
            )}
          >
            <div className={cn('text-gray-400 text-14')}>Inset Image</div>
          </div>

          {/* Text Overlay */}
          <div className={cn('absolute bottom-8 left-8 max-w-md text-white')}>
            <Typography
              variant="h2"
              className={cn('mb-4 text-white font-bold')}
            >
              Organize your Wedding
            </Typography>

            <Typography variant="body" className={cn('text-white/90')}>
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </div>
        </div>

        {/* Download Our App */}
        <div className={cn('px-8 pb-8 flex flex-col gap-4')}>
          <Typography
            variant="h6"
            className={cn('text-gray-900 font-semibold')}
          >
            Download Our APP
          </Typography>

          <StoreBadges size="md" />
        </div>
      </div>

      {/* Right Section */}
      <div className={cn('w-full lg:w-[60%] flex flex-col bg-white')}>
        {/* Back To Home - Mobile */}
        <Link
          to={publicRoutes.HOME}
          className={cn(
            'lg:hidden flex items-center gap-2 p-6',
            'text-16 font-medium text-gray-700',
            'hover:text-brand-500 transition-colors'
          )}
        >
          <ChevronLeft className={cn('h-5 w-5')} />
          <span>Back To home</span>
        </Link>

        {/* Form content (children routes) */}
        <div
          className={cn('flex-1 flex items-center justify-center p-6 lg:p-12')}
        >
          <div className={cn('w-full max-w-md')}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
