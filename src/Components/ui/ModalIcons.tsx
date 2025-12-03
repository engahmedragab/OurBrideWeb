'use client'

import { cn } from '@/lib/utils'
import deleteXIcon from '@/Assets/svg/deleteXIcon.svg'

export interface ModalIconProps {
  className?: string
  iconClassName?: string
}

/**
 * Delete/Danger icon for modals
 * Light pink squircle background with red X
 * Matches Figma design exactly
 */
export const DeleteIcon = ({ className, iconClassName }: ModalIconProps) => {
  return (
    <div className={cn('relative size-[120px]', className)}>
      <div
        className="absolute inset-[4.19%_4.15%_4.18%_4.16%]"
        data-name="Group"
      >
        {/* Squircle background - exact color from Figma: rgba(254, 237, 235, 1) */}
        <svg
          className="block max-w-none size-full"
          viewBox="0 0 111 111"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.6144 0.872727C36.9938 -0.290909 53.435 -0.290909 69.8144 0.872727C79.5515 1.56701 87.5744 8.36415 89.2201 17.4327C84.2743 17.7449 79.6385 19.9489 76.2743 23.5877C72.91 27.2264 71.0756 32.0205 71.1515 36.9756H39.9344C34.8195 36.9756 29.9141 39.0075 26.2973 42.6242C22.6806 46.241 20.6487 51.1464 20.6487 56.2613C20.6487 61.3762 22.6806 66.2816 26.2973 69.8984C29.9141 73.5151 34.8195 75.547 39.9344 75.547H71.1515C71.0771 80.5555 72.9542 85.3964 76.3857 89.0454C79.8171 92.6945 84.5337 94.8652 89.5373 95.0984L89.503 95.8356C88.9887 106.113 80.4173 114.101 69.823 114.864C53.4379 116.029 36.9909 116.029 20.6058 114.864C10.0115 114.093 1.4401 106.104 0.925819 95.8356C0.302146 83.1881 -0.00652084 70.527 0.000104413 57.8642C0.000104413 44.8356 0.317247 32.1413 0.925819 19.9013C1.4401 9.62416 10.0115 1.62701 20.6144 0.872727Z"
            fill="rgba(254, 237, 235, 1)"
          />
        </svg>

        {/* Red X icon - using SVG file */}
        <div className="absolute left-[29.30px] top-[29.27px]">
          <img
            src={
              typeof deleteXIcon === 'string' ? deleteXIcon : deleteXIcon.src
            }
            alt="Delete icon"
            width={52}
            height={52}
            className={cn(iconClassName)}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Logout/Exit icon for modals
 * Light pink squircle background with red arrow pointing right
 * Matches Figma design exactly
 */
export const LogoutIcon = ({ className, iconClassName }: ModalIconProps) => {
  return (
    <div className={cn('relative size-[120px]', className)}>
      {/* Squircle background - exact color from Figma: rgba(255, 216, 216, 1) */}
      <div className="absolute h-[115.737px] left-[0.71px] top-[2.13px] w-[89.537px]">
        <svg
          className="block max-w-none size-full"
          viewBox="0 0 90 116"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.6144 0.872727C36.9938 -0.290909 53.435 -0.290909 69.8144 0.872727C79.5515 1.56701 87.5744 8.36415 89.2201 17.4327C84.2743 17.7449 79.6385 19.9489 76.2743 23.5877C72.91 27.2264 71.0756 32.0205 71.1515 36.9756H39.9344C34.8195 36.9756 29.9141 39.0075 26.2973 42.6242C22.6806 46.241 20.6487 51.1464 20.6487 56.2613C20.6487 61.3762 22.6806 66.2816 26.2973 69.8984C29.9141 73.5151 34.8195 75.547 39.9344 75.547H71.1515C71.0771 80.5555 72.9542 85.3964 76.3857 89.0454C79.8171 92.6945 84.5337 94.8652 89.5373 95.0984L89.503 95.8356C88.9887 106.113 80.4173 114.101 69.823 114.864C53.4379 116.029 36.9909 116.029 20.6058 114.864C10.0115 114.093 1.4401 106.104 0.925819 95.8356C0.302146 83.1881 -0.00652084 70.527 0.000104413 57.8642C0.000104413 44.8356 0.317247 32.1413 0.925819 19.9013C1.4401 9.62416 10.0115 1.62701 20.6144 0.872727Z"
            fill="rgba(255, 216, 216, 1)"
          />
        </svg>
      </div>

      {/* Red arrow icon - exact SVG from Figma */}
      <div className="absolute h-[56.306px] left-[32.07px] top-[30.24px] w-[87.229px]">
        <svg
          className="block max-w-none size-full"
          viewBox="0 0 88 57"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M50.6314 10.0543C50.3567 8.49012 50.5219 6.88032 51.1087 5.40452C51.6955 3.92872 52.6807 2.64497 53.9546 1.69648C55.2284 0.747994 56.7407 0.172067 58.3228 0.0329512C59.9049 -0.106165 61.4945 0.197001 62.9143 0.908628C72.4029 5.6572 81.5829 14.8286 86.3229 24.3172C86.9187 25.508 87.229 26.8213 87.229 28.1529C87.229 29.4845 86.9187 30.7978 86.3229 31.9886C81.5829 41.4772 72.4029 50.6572 62.9143 55.3972C61.4945 56.1088 59.9049 56.412 58.3228 56.2729C56.7407 56.1338 55.2284 55.5578 53.9546 54.6093C52.6807 53.6609 51.6955 52.3771 51.1087 50.9013C50.5219 49.4255 50.3567 47.8157 50.6314 46.2515L52.3028 36.7286H8.57143C6.29814 36.7286 4.11797 35.8256 2.51051 34.2181C0.903058 32.6107 0 30.4305 0 28.1572C0 25.8839 0.903058 23.7037 2.51051 22.0963C4.11797 20.4888 6.29814 19.5858 8.57143 19.5858H52.3028L50.6314 10.0543Z"
            fill="var(--Red-500, #FF3B3B)"
          />
        </svg>
      </div>
    </div>
  )
}
