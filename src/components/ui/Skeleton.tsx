import { cn } from '@/lib/utils'

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
        <div key={index} className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
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
