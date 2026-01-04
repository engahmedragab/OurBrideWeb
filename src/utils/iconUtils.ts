/**
 * Utility functions for parsing icon and color formats from backend
 */

/**
 * Parse hex codepoint string to number
 * @param iconName - String like "0xe333"
 * @returns Number codepoint, e.g. 58163
 */
export const parseHexCodepoint = (iconName: string | null | undefined): number | null => {
  if (!iconName) return null
  try {
    // Remove any whitespace and parse
    const cleaned = iconName.trim()
    if (cleaned.startsWith('0x') || cleaned.startsWith('0X')) {
      return parseInt(cleaned, 16)
    }
    // Try parsing as decimal if no 0x prefix
    return parseInt(cleaned, 10)
  } catch {
    return null
  }
}

/**
 * Convert ARGB hex string to RGBA CSS string
 * @param colorName - String like "0xff8e8e8e" (ARGB format: Alpha, Red, Green, Blue)
 * @returns RGBA CSS string like "rgba(142,142,142,1)"
 */
export const argbToRgba = (colorName: string | null | undefined): string => {
  if (!colorName) return 'rgba(142,142,142,1)' // Default gray
  
  try {
    const cleaned = colorName.trim()
    let hex = cleaned
    
    // Remove 0x prefix if present
    if (hex.startsWith('0x') || hex.startsWith('0X')) {
      hex = hex.slice(2)
    }
    
    // ARGB format: first 2 chars are alpha, then RGB
    if (hex.length === 8) {
      const alphaHex = hex.slice(0, 2)
      const redHex = hex.slice(2, 4)
      const greenHex = hex.slice(4, 6)
      const blueHex = hex.slice(6, 8)
      
      const alpha = parseInt(alphaHex, 16) / 255
      const red = parseInt(redHex, 16)
      const green = parseInt(greenHex, 16)
      const blue = parseInt(blueHex, 16)
      
      return `rgba(${red},${green},${blue},${alpha})`
    }
    
    // If 6 chars, assume RGB (no alpha, use alpha=1)
    if (hex.length === 6) {
      const redHex = hex.slice(0, 2)
      const greenHex = hex.slice(2, 4)
      const blueHex = hex.slice(4, 6)
      
      const red = parseInt(redHex, 16)
      const green = parseInt(greenHex, 16)
      const blue = parseInt(blueHex, 16)
      
      return `rgba(${red},${green},${blue},1)`
    }
  } catch (error) {
    console.warn('[iconUtils] Failed to parse colorName:', colorName, error)
  }
  
  return 'rgba(142,142,142,1)' // Default gray fallback
}

/**
 * Convert ARGB hex string to hex color (for CSS)
 * @param colorName - String like "0xff8e8e8e"
 * @returns Hex color string like "#8e8e8e"
 */
export const argbToHex = (colorName: string | null | undefined): string => {
  if (!colorName) return '#8e8e8e'
  
  try {
    const cleaned = colorName.trim()
    let hex = cleaned
    
    if (hex.startsWith('0x') || hex.startsWith('0X')) {
      hex = hex.slice(2)
    }
    
    // ARGB format: skip alpha, use RGB
    if (hex.length === 8) {
      return `#${hex.slice(2)}`
    }
    
    if (hex.length === 6) {
      return `#${hex}`
    }
  } catch (error) {
    console.warn('[iconUtils] Failed to parse colorName to hex:', colorName, error)
  }
  
  return '#8e8e8e'
}

