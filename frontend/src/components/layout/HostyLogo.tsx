import { cn } from '@/shared/lib/utils'

interface HostyLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
}

function HostyIsotipo({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 20 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {/*
        "n" arch shape — single compound path with evenodd fill:
        - Outer arch: semicircle from (0,10) to (20,10) peaking at (10,0)
        - Inner arch: semicircle from (14,10) to (6,10) peaking at (10,6)
        - Two rectangular legs connecting arch to base (y=10 → y=24)
        - Dot: circle at (10,8) r=2, punched out via evenodd as pin marker
      */}
      <path
        fillRule="evenodd"
        d="M0 24V10A10 10 0 0 0 20 10V24H14V10A4 4 0 0 0 6 10V24H0Z M8 8a2 2 0 1 0 4 0a2 2 0 1 0-4 0"
      />
    </svg>
  )
}

export function HostyLogo({ className, size = 'md', showWordmark = true }: HostyLogoProps) {
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'

  return (
    <div className={cn('flex items-center gap-2 text-primary', className)}>
      <HostyIsotipo />
      {showWordmark && (
        <span className={cn('font-extrabold tracking-tight', textSize)}>hosty</span>
      )}
    </div>
  )
}
