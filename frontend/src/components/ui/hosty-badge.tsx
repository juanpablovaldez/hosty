import { Check, Star, Shield } from 'lucide-react'

/* ─── HostyIso — isotipo inline reutilizable ─────────────── */
interface HostyIsoProps {
  size?: number
  color?: string
}

export function HostyIso({ size = 16, color = 'currentColor' }: HostyIsoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill={color}
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <rect x="18" y="18" width="20" height="84" rx="3" />
      <rect x="82" y="18" width="20" height="84" rx="3" />
      <path d="M18 62 a42 42 0 0 1 84 0 v14 h-20 v-14 a22 22 0 0 0 -44 0 v14 h-20 z" />
      <circle cx="60" cy="58" r="6" />
    </svg>
  )
}

/* ─── HostyBadge ─────────────────────────────────────────── */
type BadgeVariant = 'verificado' | 'mejor' | 'confianza'
type BadgeSize = 'sm' | 'lg'

interface HostyBadgeProps {
  variant: BadgeVariant
  size?: BadgeSize
}

const VARIANTS: Record<
  BadgeVariant,
  {
    bg: string
    text: string
    ring: string
    sep: string
    icon: 'check' | 'star' | 'shield'
    label: string
  }
> = {
  verificado: {
    bg: '#1D6B47',
    text: '#FFFFFF',
    ring: 'rgba(255,255,255,0.18)',
    sep: 'rgba(255,255,255,0.26)',
    icon: 'check',
    label: 'Verificado',
  },
  mejor: {
    bg: '#F5A623',
    text: '#1C2B3A',
    ring: 'rgba(28,43,58,0.10)',
    sep: 'rgba(28,43,58,0.14)',
    icon: 'star',
    label: 'Mejor Salón Hosty',
  },
  confianza: {
    bg: '#1C2B3A',
    text: '#F8F4EF',
    ring: 'rgba(250,248,245,0.18)',
    sep: 'rgba(250,248,245,0.20)',
    icon: 'shield',
    label: 'Alta Confiabilidad',
  },
}

export function HostyBadge({ variant, size = 'sm' }: HostyBadgeProps) {
  const v = VARIANTS[variant]
  const isLg = size === 'lg'

  const isoSize = isLg ? 19 : 12
  const iconSize = isLg ? 13 : 9

  const IconComponent = {
    check: Check,
    star: Star,
    shield: Shield,
  }[v.icon]

  return (
    <div
      className={[
        'relative inline-flex items-center font-bold uppercase tracking-[0.07em] leading-none',
        isLg
          ? 'gap-[9px] pl-[11px] pr-[18px] py-[9px] rounded-[10px] text-[13px] tracking-[0.05em]'
          : 'gap-1.5 px-[11px] py-[5px] pl-[7px] rounded-[6px] text-[10.5px]',
      ].join(' ')}
      style={{
        background: v.bg,
        color: v.text,
        boxShadow: isLg
          ? '0 2px 10px rgba(28,43,58,0.14)'
          : '0 1px 5px rgba(28,43,58,0.16)',
      }}
    >
      {/* Inner ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[2px] rounded-[4px] border"
        style={{
          borderRadius: isLg ? '7px' : '4px',
          borderColor: v.ring,
          inset: isLg ? '2.5px' : '2px',
        }}
      />

      {/* Isotipo */}
      <HostyIso size={isoSize} color={v.text} />

      {/* Separador vertical */}
      <span
        aria-hidden
        className="shrink-0"
        style={{
          display: 'block',
          width: '1px',
          height: isLg ? '15px' : '11px',
          background: v.sep,
        }}
      />

      {/* Icono de variante */}
      <IconComponent
        size={iconSize}
        strokeWidth={v.icon === 'check' ? 3.5 : 1.5}
        fill={v.icon === 'star' ? v.text : 'none'}
        color={v.text}
      />

      {v.label}
    </div>
  )
}
