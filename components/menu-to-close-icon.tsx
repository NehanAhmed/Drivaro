'use client'

import { motion } from 'motion/react'

type Props = {
  size?: number
  strokeWidth?: number
}

export default function MenuToCloseIcon({
  size = 24,
  strokeWidth = 2,
}: Props) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="rest"
      whileHover="hover"
    >
      {/* Top line */}
      <motion.path
        d="M4 8l16 0"
        variants={{
          rest: { rotate: 0, y: 0 },
          hover: { rotate: 45, y: 4 },
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center' }}
      />

      {/* Bottom line */}
      <motion.path
        d="M4 16l16 0"
        variants={{
          rest: { rotate: 0, y: 0 },
          hover: { rotate: -45, y: -4 },
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center' }}
      />
    </motion.svg>
  )
}
