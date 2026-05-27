import { cn } from '@/shared/lib/utils'

interface HostyLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
}

const SIZE_MAP = {
  sm: { iso: 'w-5 h-5', text: 'text-base' },
  md: { iso: 'w-7 h-7', text: 'text-xl' },
  lg: { iso: 'w-9 h-9', text: 'text-2xl' },
}

function HostyIsotipo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <rect x="18" y="18" width="20" height="84" rx="3" />
      <rect x="82" y="18" width="20" height="84" rx="3" />
      <path d="M18 62 a42 42 0 0 1 84 0 v14 h-20 v-14 a22 22 0 0 0 -44 0 v14 h-20 z" />
      <circle cx="60" cy="58" r="6" />
    </svg>
  )
}

export function HostyLogo({ className, size = 'md', showWordmark = true }: HostyLogoProps) {
  const { iso, text } = SIZE_MAP[size]
  return (
    <div className={cn('flex items-center gap-2.5 text-primary', className)}>
      <HostyIsotipo className={iso} />
      {showWordmark && (
        <span className={cn('font-extrabold tracking-tight', text)}>hosty</span>
      )}
    </div>
  )
}
