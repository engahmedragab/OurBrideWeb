import { Header, Footer } from '@/components/layout'
import { MobileAppsSection } from '@/components/ui/MobileAppsSection'

export default function DownloadAppPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <MobileAppsSection />
      </main>

      <Footer />
    </div>
  )
}
