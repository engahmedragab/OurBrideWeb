/**
 * Error state component for product pages
 */

import { BackButton } from '@/components/ui'

interface ProductErrorStateProps {
  message?: string
  backHref?: string
  backLabel?: string
}

export function ProductErrorState({
  message = 'Something went wrong',
  backHref = '/products',
  backLabel = 'Back to Products',
}: ProductErrorStateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-18 text-gray-600 mb-4">{message}</div>
          <BackButton href={backHref} label={backLabel} />
        </div>
      </div>
    </div>
  )
}
