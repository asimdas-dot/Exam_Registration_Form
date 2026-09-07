import React from 'react'

export const Logo: React.FC<{ size?: number }> = ({ size = 36 }) => {
  // Simple embedded logo using SVG, keeps styling consistent and fully client-side
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="48" height="48" rx="8" fill="#0F172A" />
      <g transform="translate(8,8)" fill="#60A5FA">
        <rect x="0" y="0" width="8" height="8" rx="1" />
        <rect x="12" y="0" width="8" height="8" rx="1" />
        <rect x="0" y="12" width="8" height="8" rx="1" />
      </g>
      <text x="28" y="30" fontFamily="sans-serif" fontSize="10" fill="#FFFFFF">ERS</text>
    </svg>
  )
}
