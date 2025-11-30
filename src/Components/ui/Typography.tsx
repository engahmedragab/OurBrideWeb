import { HTMLAttributes, ElementType, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      // Headings - using Poppins (display font)
      h1: 'font-poppins text-32 font-bold',
      h2: 'font-poppins text-30 font-bold',
      h3: 'font-poppins text-28 font-semibold',
      h4: 'font-poppins text-24 font-semibold',
      h5: 'font-poppins text-20 font-semibold',
      h6: 'font-poppins text-16 font-semibold',

      // Body text - using Inter
      body: 'font-inter text-16 font-normal',
      bodyLarge: 'font-inter text-20 font-normal',
      bodySmall: 'font-inter text-14 font-normal',
      bodyTiny: 'font-inter text-12 font-normal',
      bodyMicro: 'font-inter text-10 font-normal',
      bodySmallest: 'font-inter text-8 font-normal',

      // Special variants
      caption: 'font-inter text-12 font-normal',
      overline: 'font-inter text-10 font-semibold uppercase tracking-wide',
      lead: 'font-inter text-20 font-normal text-foreground-secondary',
      muted: 'font-inter text-14 text-foreground-secondary',
      link: 'font-inter text-16 font-medium text-primary hover:underline',

      // Display sizes from Figma
      display32: 'font-poppins text-32 font-bold',
      display30: 'font-poppins text-30 font-bold',
      display28: 'font-poppins text-28 font-semibold',
      display24: 'font-poppins text-24 font-semibold',
      display20: 'font-poppins text-20 font-semibold',
    },
    fontFamily: {
      inter: 'font-inter',
      poppins: 'font-poppins',
    },
    weight: {
      light: 'font-light', // 300
      regular: 'font-normal', // 400
      medium: 'font-medium', // 500
      semibold: 'font-semibold', // 600
      bold: 'font-bold', // 700
      black: 'font-black', // 900
    },
    textColor: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-foreground-secondary',
      tertiary: 'text-foreground-tertiary',
      muted: 'text-foreground-muted',
      brand: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      info: 'text-info',
      white: 'text-white',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    variant: 'body',
    textColor: 'default',
    align: 'left',
  },
})

type TypographyVariants = VariantProps<typeof typographyVariants>

export interface TypographyProps
  extends HTMLAttributes<HTMLElement>, Omit<TypographyVariants, 'variant'> {
  variant?: TypographyVariants['variant']
  as?: ElementType
  gradient?: boolean
}

const variantToElement: Record<
  NonNullable<TypographyVariants['variant']>,
  ElementType
> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  bodyLarge: 'p',
  bodySmall: 'p',
  bodyTiny: 'p',
  bodyMicro: 'p',
  bodySmallest: 'p',
  caption: 'span',
  overline: 'span',
  lead: 'p',
  muted: 'p',
  link: 'a',
  display32: 'h1',
  display30: 'h1',
  display28: 'h2',
  display24: 'h3',
  display20: 'h4',
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant = 'body',
      as,
      gradient,
      textColor,
      align,
      fontFamily,
      weight,
      ...props
    },
    ref
  ) => {
    const Component = as || (variant ? variantToElement[variant] : 'p')

    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({
            variant,
            textColor,
            align,
            fontFamily,
            weight,
            className,
          }),
          gradient &&
            'bg-gradient-to-r from-brand-500 via-primary to-brand-700 bg-clip-text text-transparent'
        )}
        {...props}
      />
    )
  }
)

Typography.displayName = 'Typography'

export { Typography, typographyVariants }
