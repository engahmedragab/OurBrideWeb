import React from 'react'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of event IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default function EventDetailsPage() {
  return (
    <div>EventDetailsPage</div>
  )
}
