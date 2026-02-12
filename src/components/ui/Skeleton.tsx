import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'

/**
 * Base Skeleton component
 */
export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}

/**
 * Card Skeleton for Products and Services
 */
export const CardSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-xl overflow-visible shadow-sm"
        >
          {/* Image Skeleton */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title Skeleton */}
            <Skeleton className="h-5 w-3/4" />

            {/* Provider Name Skeleton */}
            <Skeleton className="h-4 w-1/2" />

            {/* Rating Skeleton */}
            <Skeleton className="h-4 w-16" />

            {/* Pricing Skeleton */}
            <Skeleton className="h-5 w-24" />

            {/* Action Buttons Skeleton */}
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 flex-1 rounded-full" />
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

/**
 * Provider Card Skeleton
 */
export const ProviderCardSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 md:p-8 text-center flex flex-col items-center border border-gray-100 shadow-sm"
        >
          {/* Profile Image Skeleton */}
          <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-4" />

          {/* Name Skeleton */}
          <Skeleton className="h-5 w-32 mb-1" />

          {/* Profession Skeleton */}
          <Skeleton className="h-4 w-24 mb-4" />

          {/* Stars Skeleton */}
          <div className="flex items-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>

          {/* Contact Button Skeleton */}
          <Skeleton className="h-10 w-full mb-3 rounded-full" />

          {/* View Profile Link Skeleton */}
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </>
  )
}

/**
 * Testimonial Card Skeleton
 */
export const TestimonialCardSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 md:p-8 flex flex-col shadow-sm"
        >
          {/* Quote Skeleton */}
          <Skeleton className="h-20 w-full mb-6" />

          {/* Author Info Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

/**
 * Member Testimonial Card Skeleton
 */
export const MemberTestimonialCardSkeleton = ({
  count = 1,
}: {
  count?: number
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 md:p-8 shadow-sm"
        >
          {/* Author Info Skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Review Text Skeleton */}
          <Skeleton className="h-24 w-full mb-4" />

          {/* Product Images Skeleton */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
          </div>

          {/* Likes and Comments Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </>
  )
}

/**
 * Offer Banner Skeleton
 */
export const OfferBannerSkeleton = () => {
  return (
    <section className="container-custom">
      <div className="relative">
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 relative w-full">
            {/* Left Content - Text and Buttons */}
            <div className="text-center lg:text-left px-4 md:px-5 py-3 md:py-4 order-1 lg:order-1 flex flex-col justify-center">
              {/* Heading Skeleton */}
              <Skeleton className="h-6 w-3/4 mx-auto lg:mx-0 mb-2" />
              
              {/* Description Skeleton */}
              <Skeleton className="h-4 w-full max-w-lg mx-auto lg:mx-0 mb-2" />
              <Skeleton className="h-4 w-5/6 max-w-lg mx-auto lg:mx-0 mb-4" />
              
              {/* Button Skeleton */}
              <div className="flex justify-center lg:justify-start">
                <Skeleton className="h-10 w-40 rounded-full" />
              </div>
            </div>
            
            {/* Product Image Skeleton - Right side */}
            <div className="flex justify-end items-end order-1 lg:order-2 relative overflow-hidden">
              <div className="relative w-full h-full flex items-end justify-end">
                <Skeleton className="w-full h-[140px] md:h-[170px] lg:h-[200px] xl:h-[230px] rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Dash Indicators Skeleton */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Skeleton className="h-1.5 w-12 rounded-full" />
          <Skeleton className="h-1.5 w-4 rounded-full" />
          <Skeleton className="h-1.5 w-4 rounded-full" />
        </div>
      </div>
    </section>
  )
}

/**
 * Header Skeleton (matches header layout in screenshot)
 */


export const HeaderSkeleton = ({
  className,
  isRTL = true,
}: {
  className?: string
  isRTL?: boolean
}) => {
  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={cn(
        'sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm',
        className
      )}
      role="status"
      aria-label="Loading header"
      aria-busy="true"
    >
      <div className={cn("w-full px-4 lg:px-4 flex h-16 items-center justify-between md:justify-around gap-2 sm:gap-1",
        isRTL ? 'md:px-3' : 'md:px-4'
      )} suppressHydrationWarning>
        {/* Logo - matches Header structure exactly */}
        <div className="flex items-center gap-2 shrink-0 md:w-[80px] lg:w-[100px]" suppressHydrationWarning>
          {/* Use Link component to match actual Header structure - prevents hydration mismatch */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity duration-150 hover:opacity-80 focus:outline-none rounded-md pointer-events-none"
            suppressHydrationWarning
            aria-hidden="true"
            tabIndex={-1}
          >
            <Skeleton className="h-14 sm:h-16 w-[120px] rounded-md" />
          </Link>
        </div>

        {/* Navigation Menu (md+) - wrapped in ClientOnly in actual Header */}
        <div className="hidden md:flex items-center" suppressHydrationWarning>
          <div className="gap-0.5 rounded-full border border-gray-100 bg-white px-1.5 py-1.5 shadow-sm h-12 lg:h-12 flex items-center" suppressHydrationWarning>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded-full px-2 lg:px-3 py-2"
                suppressHydrationWarning
              >
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-12 lg:w-14 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Search (lg+) */}
        <div className="hidden flex-1 max-w-md lg:flex items-center" suppressHydrationWarning>
          <div className="flex items-center gap-1 rounded-full border border-gray-100 bg-white/60 px-3 h-12 shadow-sm w-full" suppressHydrationWarning>
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
            <div className="flex-1" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5" suppressHydrationWarning>
          {/* Mobile Menu Button (md-) */}
          <Skeleton className="h-10 w-10 rounded-md md:hidden" />

          {/* Wishlist, Notifications, Cart (md+) */}
          <div className="hidden md:flex items-center rounded-full border border-brand-500 bg-transparent px-1" suppressHydrationWarning>
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* Language Switcher (md+) - wrapped in ClientOnly in actual Header */}
          <div className="hidden md:flex items-center" suppressHydrationWarning>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* User Profile */}
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </header>
  )
}

/**
 * Footer Skeleton (matches your Footer layout)
 */
export const FooterSkeleton = ({
  className,
  isRTL = true,
  sectionsCount = 5,
  linksPerSection = 5,
}: {
  className?: string
  isRTL?: boolean
  sectionsCount?: number
  linksPerSection?: number
}) => {
  return (
    <footer
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn('w-full bg-white', className)}
      role="status"
      aria-label="Loading footer"
      aria-busy="true"
    >
      {/* top brand line */}
      <div className="w-full h-[1px] bg-brand-500" />

      <div className="bg-white px-5">
        <div className="py-10 mx-auto container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* Left */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
              {/* Logo */}
           {/* ✅ Logo centered on small screens */}
<div className={cn('self-center md:self-start', 'mx-auto md:mx-0')}>
  <Skeleton className="h-12 md:h-18 w-40 rounded-lg" />
</div>

              {/* Description */}
              <div className={cn('max-w-sm space-y-1', isRTL ? 'text-right self-end' : 'text-left self-start')}>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
              </div>

              {/* Download */}
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="h-6 w-44" />
                <div className={cn('flex flex-wrap items-center gap-3', isRTL ? 'justify-end' : 'justify-start')}>
                  <Skeleton className="h-12 w-40 rounded-lg" />
                  <Skeleton className="h-12 w-40 rounded-lg" />
                </div>
              </div>

              {/* Social */}
              <div className="flex flex-col gap-6 pt-2 w-full">
                <Skeleton className="h-6 w-40" />
                <div className={cn('flex flex-wrap items-center gap-3', isRTL ? 'justify-end' : 'justify-start')}>
                  <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-xl" />
                  <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-xl" />
                  <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Right (Sections) */}
            <div className={cn('md:col-span-8 lg:col-span-9 lg:pt-24', isRTL ? 'me-3' : 'ms-3')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 gap-y-12">
                {Array.from({ length: sectionsCount }).map((_, colIdx) => (
                  <div key={`footer-skel-col-${colIdx}`} className="flex flex-col gap-4">
                    {/* Section Title */}
                    <Skeleton className="h-5 w-24" />
                    {/* Links */}
                    <div className="flex flex-col gap-3">
                      {Array.from({ length: linksPerSection }).map((__, linkIdx) => (
                        <Skeleton
                          key={`footer-skel-link-${colIdx}-${linkIdx}`}
                          className={cn(
                            'h-4',
                            linkIdx % 3 === 0 ? 'w-28' : linkIdx % 3 === 1 ? 'w-24' : 'w-32'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-200 my-10" />

          {/* Copyright */}
          <div className="text-center">
            <Skeleton className="h-4 w-72 mx-auto" />
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="w-full bg-gray-800 h-2" />
    </footer>
  )
}
