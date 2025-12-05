/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/auth/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Color - Based on OurBride brand (#f14836)
        brand: {
          25: '#FFFFFF', // White
          50: '#FFF5F5', // Very light brand tint
          100: '#FFE5E5', // Light brand tint
          200: '#FFCCCC', // Lighter brand
          300: '#FF9999', // Light brand
          400: '#FF6B6B', // Medium-light brand
          500: '#F14836', // Base brand color
          600: '#D63D2E', // Darker brand
          700: '#B83226', // Dark brand
          800: '#99291E', // Very dark brand
          900: '#7A1F16', // Darkest brand
          DEFAULT: '#f14836',
        },
        // Gray Scale
        gray: {
          25: '#FFFFFF', // White
          50: '#FAFAFA', // Very light gray
          75: '#F4F4F6', // Ultra light gray (badge background)
          100: '#F5F5F5', // Light gray
          200: '#E5E5E5', // Lighter gray
          300: '#D4D4D4', // Light gray
          400: '#A3A3A3', // Medium-light gray
          500: '#737373', // Medium gray
          600: '#525252', // Medium-dark gray
          700: '#404040', // Dark gray
          800: '#262626', // Very dark gray
          900: '#171717', // Darkest gray
          DEFAULT: '#737373',
        },
        // Green (Success)
        green: {
          25: '#FFFFFF', // White
          50: '#F0FDF4', // Very light green
          100: '#DCFCE7', // Light green
          200: '#BBF7D0', // Lighter green
          300: '#86EFAC', // Light green
          400: '#4ADE80', // Medium-light green
          500: '#22C55E', // Base green
          600: '#16A34A', // Darker green
          700: '#15803D', // Dark green
          800: '#166534', // Very dark green
          900: '#14532D', // Darkest green
          DEFAULT: '#22C55E',
        },
        // Blue (Info)
        blue: {
          25: '#FFFFFF', // White
          50: '#EFF6FF', // Very light blue
          100: '#DBEAFE', // Light blue
          200: '#BFDBFE', // Lighter blue
          300: '#93C5FD', // Light blue
          400: '#60A5FA', // Medium-light blue
          500: '#3B82F6', // Base blue
          600: '#2563EB', // Darker blue
          700: '#1D4ED8', // Dark blue
          800: '#1E40AF', // Very dark blue
          900: '#1E3A8A', // Darkest blue
          DEFAULT: '#3B82F6',
        },
        // Yellow (Warning)
        yellow: {
          25: '#FFFFFF', // White
          50: '#FEFCE8', // Very light yellow
          100: '#FEF9C3', // Light yellow
          200: '#FEF08A', // Lighter yellow
          300: '#FDE047', // Light yellow
          400: '#FACC15', // Medium-light yellow
          500: '#EAB308', // Base yellow
          600: '#CA8A04', // Darker yellow
          700: '#A16207', // Dark yellow
          800: '#854D0E', // Very dark yellow
          900: '#713F12', // Darkest yellow
          DEFAULT: '#EAB308',
        },
        // Red (Error)
        red: {
          25: '#FFFFFF', // White
          50: '#FEF2F2', // Very light red
          100: '#FEE2E2', // Light red
          200: '#FECACA', // Lighter red
          300: '#FCA5A5', // Light red
          400: '#F87171', // Medium-light red
          500: '#EF4444', // Base red
          600: '#DC2626', // Darker red
          700: '#B91C1C', // Dark red
          800: '#991B1B', // Very dark red
          900: '#7F1D1D', // Darkest red
          DEFAULT: '#EF4444',
        },
        // Legacy color mappings for backward compatibility
        primary: {
          DEFAULT: '#f14836',
          50: '#FFF5F5',
          100: '#FFE5E5',
          500: '#F14836',
          600: '#D63D2E',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#737373',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#F5F5F5',
          foreground: '#171717',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#FAFAFA',
          tertiary: '#F5F5F5',
        },
        foreground: {
          DEFAULT: '#171717',
          secondary: '#525252',
          tertiary: '#737373',
          muted: '#A3A3A3',
        },
        border: {
          DEFAULT: '#E5E5E5',
          light: '#F5F5F5',
          dark: '#D4D4D4',
        },
        input: '#E5E5E5',
        ring: '#f14836',
        // Semantic color mappings
        success: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#EAB308',
          50: '#FEFCE8',
          500: '#EAB308',
          600: '#CA8A04',
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          foreground: '#ffffff',
        },
        glassCard: '#595959',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Exact font sizes from Figma (8, 10, 12, 14, 16, 20, 24, 28, 30, 32px)
        8: ['0.5rem', { lineHeight: '1.2', letterSpacing: '0' }], // 8px
        10: ['0.625rem', { lineHeight: '1.2', letterSpacing: '0' }], // 10px
        12: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0' }], // 12px
        14: ['0.875rem', { lineHeight: '1.4', letterSpacing: '0' }], // 14px
        16: ['1rem', { lineHeight: '1.5', letterSpacing: '0' }], // 16px
        20: ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }], // 20px
        24: ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }], // 24px
        28: ['1.75rem', { lineHeight: '1.4', letterSpacing: '0' }], // 28px
        30: ['1.875rem', { lineHeight: '1.4', letterSpacing: '0' }], // 30px
        32: ['2rem', { lineHeight: '1.4', letterSpacing: '0' }], // 32px
        // Legacy sizes for backward compatibility
        xs: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.4', letterSpacing: '0' }], // 14px
        base: ['1rem', { lineHeight: '1.5', letterSpacing: '0' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '0' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '0' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0' }],
      },
      fontWeight: {
        // Exact font weights from Figma
        light: '300', // Light
        normal: '400', // Regular
        medium: '500', // Medium
        semibold: '600', // Semi bold
        bold: '700', // Bold
        black: '900', // Black
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.375rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        brand: '0 4px 20px rgba(241, 72, 54, 0.3)',
        'brand-lg': '0 10px 40px rgba(241, 72, 54, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
