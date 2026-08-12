import { useState } from 'react'
import { toast } from 'sonner'
import { MessageSquare, Star, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { mensajeDeError } from '@/shared/lib/errors'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { StarRating } from './StarRating'
import { ReviewFormDialog } from './ReviewFormDialog'
import { useSalonReviews } from '../api/reviews.queries'
import { useDeleteReview, useReplyReview } from '../api/reviews.mutations'
import { averageRating, ratingDistribution, formatReviewDate } from '../lib/reviews'
import type { Review } from '../types'

const TEXTAREA_CLASS =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const average = averageRating(reviews)
  const distribution = ratingDistribution(reviews)

  if (average == null) return null

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex flex-col items-center gap-1">
        <span className="text-4xl font-bold text-foreground">{average.toFixed(1)}</span>
        <StarRating value={Math.round(average)} />
        <span className="text-xs text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star]
          const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3 text-right">{star}</span>
              <Star className="h-3 w-3 fill-amber text-amber" strokeWidth={1.5} />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-amber" style={{ width: `${percent}%` }} />
              </div>
              <span className="w-6">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HostReplyForm({
  review,
  salonId,
  onDone,
}: {
  review: Review
  salonId: string
  onDone: () => void
}) {
  const [reply, setReply] = useState(review.hostReply ?? '')
  const replyReview = useReplyReview()

  async function handleReply() {
    try {
      await replyReview.mutateAsync({ id: review.id, salonId, reply })
      toast.success('Respuesta publicada')
      onDone()
    } catch (err) {
      toast.error(mensajeDeError(err, 'No se pudo publicar la respuesta'))
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <textarea
        rows={3}
        maxLength={1000}
        placeholder="Respondé públicamente a esta reseña..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className={TEXTAREA_CLASS}
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onDone} disabled={replyReview.isPending}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleReply} disabled={replyReview.isPending}>
          {replyReview.isPending ? 'Publicando...' : 'Publicar respuesta'}
        </Button>
      </div>
    </div>
  )
}

function ReviewCard({
  review,
  salonId,
  isHost,
  onEdit,
}: {
  review: Review
  salonId: string
  isHost: boolean
  onEdit: (review: Review) => void
}) {
  const user = useAuthStore((s) => s.user)
  const [replying, setReplying] = useState(false)
  const deleteReview = useDeleteReview()
  const isAuthor = user?.id === review.userId

  async function handleDelete() {
    try {
      await deleteReview.mutateAsync({ id: review.id, salonId })
      toast.success('Reseña eliminada')
    } catch (err) {
      toast.error(mensajeDeError(err, 'No se pudo eliminar la reseña'))
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground">{review.authorName}</span>
          <div className="flex items-center gap-2">
            <StarRating value={review.rating} />
            <span className="text-xs text-muted-foreground">
              {formatReviewDate(review.createdAt)}
              {review.updatedAt && ' · editada'}
            </span>
          </div>
        </div>

        {isAuthor && (
          <div className="flex flex-shrink-0 gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(review)} className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteReview.isPending}
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              Borrar
            </Button>
          </div>
        )}
      </div>

      {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}

      {review.hostReply && !replying && (
        <div className="mt-1 rounded-lg border-l-2 border-primary bg-muted/50 px-3 py-2">
          <p className="text-xs font-medium text-foreground">Respuesta del anfitrión</p>
          <p className="mt-1 text-sm text-muted-foreground">{review.hostReply}</p>
        </div>
      )}

      {isHost && !replying && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => setReplying(true)} className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} />
            {review.hostReply ? 'Editar respuesta' : 'Responder'}
          </Button>
        </div>
      )}

      {isHost && replying && (
        <HostReplyForm review={review} salonId={salonId} onDone={() => setReplying(false)} />
      )}
    </div>
  )
}

export function SalonReviews({
  salonId,
  salonName,
  hostId,
}: {
  salonId: string
  salonName: string
  hostId: string | null
}) {
  const user = useAuthStore((s) => s.user)
  const { data: reviews = [], isLoading } = useSalonReviews(salonId)
  const [editing, setEditing] = useState<Review | null>(null)
  const isHost = !!user && !!hostId && user.id === hostId

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-foreground">
        Reseñas {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hay reseñas de este salón. Las reseñas las dejan quienes ya realizaron su evento acá.
        </p>
      ) : (
        <>
          <RatingSummary reviews={reviews} />
          <Separator />
          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                salonId={salonId}
                isHost={isHost}
                onEdit={setEditing}
              />
            ))}
          </div>
        </>
      )}

      {editing && user && (
        <ReviewFormDialog
          salonId={salonId}
          salonName={salonName}
          userId={user.id}
          existingReview={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  )
}
