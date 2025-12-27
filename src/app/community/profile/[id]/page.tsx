import { redirect } from 'next/navigation'

// Generate static params for static export
// This route redirects to /community/profile?id=xxx, so we only need minimal params
// Return at least one param to satisfy Next.js static export requirement
export function generateStaticParams() {
  // Return a single placeholder - this route just redirects anyway
  // The actual profile page uses query parameters which works with static export
  return [{ id: 'redirect' }]
}

// This route redirects to the query parameter version for backward compatibility
// The new route is /community/profile?id=xxx&type=User
// Note: We can't use searchParams here in static export mode, so we default to 'User'
// The actual profile page will infer the type from the ID format if needed
export default async function CommunityProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Redirect to query parameter version (default to User type)
  // The profile page will infer the correct type from the ID format if needed
  redirect(`/community/profile?id=${id}&type=User`)
}
