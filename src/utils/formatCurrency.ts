/**
 * Formats a number as EGP currency
 * @param amount - The amount to format
 * @returns Formatted string with commas and "EGP" suffix
 */
export function formatEGP(amount: number): string {
  return `${amount.toLocaleString('en-US')} EGP`
}
