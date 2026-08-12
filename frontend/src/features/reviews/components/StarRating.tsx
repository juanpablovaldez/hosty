import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { RATING_LABELS } from '../lib/reviews'

const STARS = [1, 2, 3, 4, 5]

export function StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${value} de 5 estrellas`}>
      {STARS.map((star) => (
        <Star
          key={star}
          className={cn('h-4 w-4', star <= value ? 'fill-amber text-amber' : 'text-muted-foreground')}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Puntaje">
        {STARS.map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
            onClick={() => onChange(star)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star
              className={cn('h-7 w-7', star <= value ? 'fill-amber text-amber' : 'text-muted-foreground')}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      <p className="h-4 text-xs text-muted-foreground">{value > 0 ? RATING_LABELS[value] : ''}</p>
    </div>
  )
}
