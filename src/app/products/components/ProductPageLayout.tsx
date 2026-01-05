/**
 * Reusable layout component for product pages
 */

import { Header, Footer } from '@/components/layout'
import { LoadingSpinner } from '@/components/ui'

interface ProductPageLayoutProps {
  children?: React.ReactNode
  isLoading?: boolean
  loadingText?: string
}

export function ProductPageLayout({
  children,
  isLoading = false,
  loadingText = 'Loading...',
}: ProductPageLayoutProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <LoadingSpinner size="lg" text={loadingText} fullScreen={true} />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
