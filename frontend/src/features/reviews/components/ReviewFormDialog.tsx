import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { mensajeDeError } from '@/shared/lib/errors'
import { StarRatingInput } from './StarRating'
import { useCreateReview, useUpdateReview } from '../api/reviews.mutations'
import type { Review } from '../types'

const TEXTAREA_CLASS =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

const MAX_COMMENT = 1000

export function ReviewFormDialog({
  salonId,
  salonName,
  bookingId,
  userId,
  existingReview,
  onClose,
}: {
  salonId: string
  salonName: string
  bookingId?: string
  userId: string
  existingReview?: Review
  onClose: () => void
}) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [comment, setComment] = useState(existingReview?.comment ?? '')
  const [error, setError] = useState<string | null>(null)
  const createReview = useCreateReview()
  const updateReview = useUpdateReview()
  const isPending = createReview.isPending || updateReview.isPending

  async function handleSubmit() {
    if (rating === 0) {
      setError('Elegí un puntaje de 1 a 5 estrellas.')
      return
    }
    setError(null)
    try {
      if (existingReview) {
        await updateReview.mutateAsync({ id: existingReview.id, salonId, rating, comment })
        toast.success('Reseña actualizada')
      } else if (bookingId) {
        await createReview.mutateAsync({ salonId, bookingId, userId, rating, comment })
        toast.success('¡Gracias por tu reseña!')
      }
      onClose()
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo guardar la reseña.'))
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existingReview ? 'Editar tu reseña' : 'Dejá tu reseña'}</DialogTitle>
          <DialogDescription>
            Contá cómo fue tu experiencia en {salonName}. Tu reseña es pública.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>¿Qué puntaje le ponés?</Label>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="review-comment">Tu comentario (opcional)</Label>
            <textarea
              id="review-comment"
              rows={4}
              maxLength={MAX_COMMENT}
              placeholder="¿Cómo estaba el salón? ¿Cómo fue el trato del anfitrión?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={TEXTAREA_CLASS}
            />
            <p className="text-right text-xs text-muted-foreground">
              {comment.length}/{MAX_COMMENT}
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Guardando...' : existingReview ? 'Guardar cambios' : 'Publicar reseña'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
