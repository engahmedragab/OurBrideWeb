import { BookingPageClient } from './BookingPageClient'
import { getServicesPreparations } from '@/services/api/serviceApi'
import { extractServicesCategoryData } from '@/utils/services-category.utils'

// Generate static params for static export
export async function generateStaticParams() {
  try {
    // Fetch all services from the API to get actual service IDs
    const result = await getServicesPreparations()
    const extractedData = extractServicesCategoryData(result)

    // Extract all service IDs from the services array
    const serviceIds =
      extractedData.services?.map(service => ({
        id: String(service.id),
      })) || []

    // If we have service IDs, return them
    if (serviceIds.length > 0) {
      return serviceIds
    }

    // Fallback: Generate IDs 1-100 to cover common service IDs
    // This ensures we have some static params even if API fails
    return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
  } catch (error) {
    // Fallback: Generate IDs 1-100 if API call fails
    return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
  }
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: serviceId } = await params
  return <BookingPageClient serviceId={serviceId} />
}
