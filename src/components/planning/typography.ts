/**
 * Shared typography scale for Planning Services page
 * Ensures consistent text sizing across all components
 */

export const planningTypography = {
  // Page title - Largest (Planning Services header)
  pageTitle: 'text-xl md:text-2xl lg:text-3xl font-semibold',
  
  // Section title - Slightly smaller than page title (Summary card title)
  sectionTitle: 'text-lg md:text-xl font-semibold',
  
  // Body text - Used for service card titles and button text (same visual size)
  body: 'text-base md:text-sm font-normal',
  
  // Body medium - For emphasized body text
  bodyMedium: 'text-base md:text-sm font-medium',
  
  // Secondary text - For subtitles and labels
  secondary: 'text-sm md:text-xs text-gray-600',
  
  // Muted text - For less important information
  muted: 'text-xs md:text-[10px] text-gray-500',
  
  // Stat numbers - For summary card statistics
  statNumber: 'text-lg md:text-xl font-semibold',
  
  // Stat label - For labels under stats
  statLabel: 'text-xs md:text-[10px] text-gray-600',
} as const
