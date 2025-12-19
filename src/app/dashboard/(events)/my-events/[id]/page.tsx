import React from 'react'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of event IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  // Generate IDs 1-10 to cover common event IDs
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }))
}

export default function EventDetailsPage() {
  return (
    <div>EventDetailsPage</div>
  )
}
