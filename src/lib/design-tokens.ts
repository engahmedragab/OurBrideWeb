/**
 * OurBride Design System Tokens
 * Based on Figma design specifications
 */

export const colors = {
  // Brand Color Scale (25-900)
  brand: {
    25: '#FFFFFF',
    50: '#FFF5F5',
    100: '#FFE5E5',
    200: '#FFCCCC',
    300: '#FF9999',
    400: '#FF6B6B',
    500: '#F14836',
    600: '#D63D2E',
    700: '#B83226',
    800: '#99291E',
    900: '#7A1F16',
    primary: '#F14836',
    primaryLight: '#FF6B6B',
    primaryDark: '#D63D2E',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #F14836 50%, #D63D2E 100%)',
  },
  // Gray Scale (25-900)
  gray: {
    25: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // Green Scale (25-900) - Success
  green: {
    25: '#FFFFFF',
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  // Blue Scale (25-900) - Info
  blue: {
    25: '#FFFFFF',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Yellow Scale (25-900) - Warning
  yellow: {
    25: '#FFFFFF',
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
  },
  // Red Scale (25-900) - Error
  red: {
    25: '#FFFFFF',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  // Semantic color mappings
  semantic: {
    success: {
      DEFAULT: '#22C55E',
      50: '#F0FDF4',
      500: '#22C55E',
      600: '#16A34A',
    },
    warning: {
      DEFAULT: '#EAB308',
      50: '#FEFCE8',
      500: '#EAB308',
      600: '#CA8A04',
    },
    error: {
      DEFAULT: '#EF4444',
      50: '#FEF2F2',
      500: '#EF4444',
      600: '#DC2626',
    },
    info: {
      DEFAULT: '#3B82F6',
      50: '#EFF6FF',
      500: '#3B82F6',
      600: '#2563EB',
    },
  },
  // Neutral colors (legacy support)
  neutral: {
    white: '#FFFFFF',
    black: '#171717',
  },
} as const

export const typography = {
  fontFamily: {
    sans: ['Poppins', 'system-ui', 'sans-serif'],
    display: ['Poppins', 'system-ui', 'sans-serif'],
    body: ['Poppins', 'system-ui', 'sans-serif'],
    poppins: ['Poppins', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    // Exact font sizes from Figma (8, 10, 12, 14, 16, 20, 24, 28, 30, 32px)
    '8': '0.5rem', // 8px
    '10': '0.625rem', // 10px
    '12': '0.75rem', // 12px
    '14': '0.875rem', // 14px
    '16': '1rem', // 16px
    '20': '1.25rem', // 20px
    '24': '1.5rem', // 24px
    '28': '1.75rem', // 28px
    '30': '1.875rem', // 30px
    '32': '2rem', // 32px
    // Legacy sizes for backward compatibility
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
  fontWeight: {
    // Exact font weights from Figma
    light: 300, // Light
    regular: 400, // Regular
    medium: 500, // Medium
    semibold: 600, // Semi bold
    bold: 700, // Bold
    black: 900, // Black
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },
  letterSpacing: {
    none: '0',
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.01em',
  },
} as const

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  brand: '0 4px 20px rgba(241, 72, 54, 0.3)',
  brandLg: '0 10px 40px rgba(241, 72, 54, 0.2)',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const
