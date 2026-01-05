import { OrderDetailsClient } from './OrderDetailsClient'

// No generateStaticParams needed - using SSR for dynamic orders
// This allows orders to be fetched at runtime based on user authentication

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <OrderDetailsClient orderId={id} />
}
