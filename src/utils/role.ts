/**
 * Formats a role string by extracting the last part after the last dot.
 * 
 * Examples:
 * - "[158]ROLES.PROVIDER.OWNER" -> "OWNER"
 * - "ROLES.PROVIDER.OWNER" -> "OWNER"
 * - "OWNER" -> "OWNER"
 * - null/undefined -> null/undefined
 * 
 * @param role - The role string to format (e.g., "[158]ROLES.PROVIDER.OWNER")
 * @returns The formatted role (e.g., "OWNER") or null if input is null/undefined/empty
 */
export function formatRole(role: string | null | undefined): string | null {
  if (!role || typeof role !== 'string') {
    return null
  }

  // Split by dot and get the last part
  const parts = role.split('.')
  const lastPart = parts[parts.length - 1]

  // Return the last part, or the original string if no dots found
  return lastPart || role
}

