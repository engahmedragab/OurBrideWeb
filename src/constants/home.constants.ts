/**
 * Home page constants
 */

export const TRUST_CARDS = [
  {
    id: '1',
    heading: "items.1.heading",
    description:
    "items.1.description",
    rotation: -30,
    background: 'gray' as const,
  },
  {
    id: '2',
    heading: "items.2.heading",
    description:
    "items.2.description",
    rotation: 15,
    background: 'white' as const,
  },
  {
    id: '3',
    heading: "items.3.heading",
    description: "items.3.description",
    rotation: -15,
    background: 'gray' as const,
  },
  {
    id: '4',
    heading: "items.4.heading",
    description: "items.4.description",
    rotation:   15,
    background: 'white' as const,
  },
  {
    id: '5',
    heading: "items.5.heading",
    description:
    "items.5.description",
    rotation: -15,
    background: 'gray' as const,
  },
  {
    id: '6',
    heading: "items.6.heading",
    description:
    "items.6.description",
    rotation: 30,
    background: 'white' as const,
  },
] as const

export const JOURNEY_STEPS = [
  {
    stepNumber: 1,
    title:  "journeySteps.steps.1.title",
    description: "journeySteps.steps.1.description",
  },
  {
    stepNumber: 2,
    title: "journeySteps.steps.2.title",
    description: "journeySteps.steps.2.description",
  },
  {
    stepNumber: 3,
    title: "journeySteps.steps.3.title",
    description: "journeySteps.steps.3.description",
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

