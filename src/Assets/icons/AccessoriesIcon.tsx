import { SVGProps } from 'react'

export interface AccessoriesIconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

export const AccessoriesIcon = ({
  className = 'w-10 h-10',
  ...props
}: AccessoriesIconProps) => {
  return (
    <svg
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M21.0383 35.0608C21.0383 25.419 13.1496 17.5303 3.50781 17.5303C3.50781 27.172 11.3965 35.0608 21.0383 35.0608Z"
        stroke="currentColor"
        strokeWidth="2.2439"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0077 14.5497C13.8522 11.0436 10.3461 9.11523 10.3461 9.11523C10.3461 9.11523 8.94365 13.4979 9.46957 18.5817"
        stroke="currentColor"
        strokeWidth="2.2439"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.2995 22.6139V21.0361C26.2995 13.3227 21.0404 7.01172 21.0404 7.01172C21.0404 7.01172 15.7812 13.3227 15.7812 21.0361V22.6139"
        stroke="currentColor"
        strokeWidth="2.2439"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.6084 18.5817C33.1343 13.4979 31.7319 9.11523 31.7319 9.11523C31.7319 9.11523 28.2258 10.8683 25.0703 14.5497"
        stroke="currentColor"
        strokeWidth="2.2439"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.0391 35.0608C30.6808 35.0608 38.5696 27.172 38.5696 17.5303C28.9278 17.5303 21.0391 25.419 21.0391 35.0608Z"
        stroke="currentColor"
        strokeWidth="2.2439"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

