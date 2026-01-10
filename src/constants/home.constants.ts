/**
 * Home page constants
 */

export const TRUST_CARDS = [
  {
    id: '1',
    heading: 'Made for Local Brides',
    description:
      'Tailored for brides across Egypt — especially those outside the capital.',
    rotation: -30,
    background: 'gray' as const,
  },
  {
    id: '2',
    heading: 'Simple & Beautiful Experience',
    description:
      'A feminine, easy-to-use design that makes planning delightful.',
    rotation: 15,
    background: 'white' as const,
  },
  {
    id: '3',
    heading: 'Real Offers & Savings',
    description: 'Exclusive coupons and discounts designed for your budget.',
    rotation: -15,
    background: 'gray' as const,
  },
  {
    id: '4',
    heading: 'All-in-One Platform',
    description: 'Plan, book, shop, and celebrate everything in one place.',
    rotation:   15,
    background: 'white' as const,
  },
  {
    id: '5',
    heading: 'Verified Trusted Providers',
    description:
      'All our service providers are carefully verified and trusted.',
    rotation: -15,
    background: 'gray' as const,
  },
  {
    id: '6',
    heading: 'Secure Payments',
    description:
      'Your payments are safe and secure with our trusted payment system.',
    rotation: 30,
    background: 'white' as const,
  },
] as const

export const JOURNEY_STEPS = [
  {
    stepNumber: 1,
    title: 'Step #1',
    description: 'Exclusive coupons and discounts designed for your budget.',
  },
  {
    stepNumber: 2,
    title: 'Step #2',
    description: 'Exclusive coupons and discounts designed for your budget.',
  },
  {
    stepNumber: 3,
    title: 'Step #3',
    description: 'Exclusive coupons and discounts designed for your budget.',
  },
] as const

export const TRUST_CARD_POSITION_CLASSES = [
  '',
  'lg:translate-x-[10px] lg:translate-y-[15px]',
  'lg:-translate-x-[5px] lg:-translate-y-[10px]',
  'lg:translate-x-[8px] lg:-translate-y-[5px]',
  'lg:-translate-x-[12px] lg:translate-y-[12px]',
  'lg:translate-x-[15px] lg:translate-y-[8px]',
] as const

export const PAGINATION_CONFIG = {
  PRODUCTS_PER_PAGE: 4,
  SERVICES_PER_PAGE: 4,
  TESTIMONIALS_PER_PAGE: 3,
  MEMBER_TESTIMONIALS_PER_PAGE: 3,
} as const

