import clsx from 'clsx'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'reset' | 'submit'
}

export default function Button({
  children,
  className,
  disabled,
  onClick,
  type,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        !disabled &&
          'rounded-md bg-blue-500 px-2 py-1 text-sm text-white transition-colors hover:bg-blue-600 focus:outline-none md:px-4 md:py-2',
        disabled &&
          'bg-gray-light pointer-events-none cursor-not-allowed rounded-md px-2 py-1 text-sm text-gray-500 md:px-4 md:py-2',
        className
      )}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
