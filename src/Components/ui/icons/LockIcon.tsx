import { SVGProps } from 'react'

export interface LockIconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

export const LockIcon = ({
  className = 'w-5 h-5',
  ...props
}: LockIconProps) => {
  return (
    <svg
      width="17"
      height="19"
      viewBox="0 0 17 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M13.5 7.5V5.5C13.5 2.73858 11.2614 0.5 8.5 0.5C5.73858 0.5 3.5 2.73858 3.5 5.5V7.5M8.5 12V14M5.3 18.5H11.7C13.3802 18.5 14.2202 18.5 14.862 18.173C15.4265 17.8854 15.8854 17.4265 16.173 16.862C16.5 16.2202 16.5 15.3802 16.5 13.7V12.3C16.5 10.6198 16.5 9.77976 16.173 9.13803C15.8854 8.57354 15.4265 8.1146 14.862 7.82698C14.2202 7.5 13.3802 7.5 11.7 7.5H5.3C3.61984 7.5 2.77976 7.5 2.13803 7.82698C1.57354 8.1146 1.1146 8.57354 0.82698 9.13803C0.5 9.77976 0.5 10.6198 0.5 12.3V13.7C0.5 15.3802 0.5 16.2202 0.82698 16.862C1.1146 17.4265 1.57354 17.8854 2.13803 18.173C2.77976 18.5 3.61984 18.5 5.3 18.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

