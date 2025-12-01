import { SVGProps } from 'react'

export interface BudgetIconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

export const BudgetIcon = ({
  className = 'w-5 h-5',
  ...props
}: BudgetIconProps) => {
  return (
    <svg
      width="21"
      height="19"
      viewBox="0 0 21 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M11.5 2.5C11.5 3.60457 9.03757 4.5 6 4.5C2.96243 4.5 0.5 3.60457 0.5 2.5M11.5 2.5C11.5 1.39543 9.03757 0.5 6 0.5C2.96243 0.5 0.5 1.39543 0.5 2.5M11.5 2.5V6.95715C10.2785 7.32398 9.5 7.87893 9.5 8.5M0.5 2.5V14.5C0.5 15.6046 2.96243 16.5 6 16.5C7.32963 16.5 8.54906 16.3284 9.5 16.0429V8.5M0.5 6.5C0.5 7.60457 2.96243 8.5 6 8.5C7.32963 8.5 8.54906 8.32843 9.5 8.04285M0.5 10.5C0.5 11.6046 2.96243 12.5 6 12.5C7.32963 12.5 8.54906 12.3284 9.5 12.0429M20.5 8.5C20.5 9.60457 18.0376 10.5 15 10.5C11.9624 10.5 9.5 9.60457 9.5 8.5M20.5 8.5C20.5 7.39543 18.0376 6.5 15 6.5C11.9624 6.5 9.5 7.39543 9.5 8.5M20.5 8.5V16.5C20.5 17.6046 18.0376 18.5 15 18.5C11.9624 18.5 9.5 17.6046 9.5 16.5V8.5M20.5 12.5C20.5 13.6046 18.0376 14.5 15 14.5C11.9624 14.5 9.5 13.6046 9.5 12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

