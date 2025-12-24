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

