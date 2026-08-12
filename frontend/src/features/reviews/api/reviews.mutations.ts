import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { ReviewPayload } from '../types'

function invalidateSalonReviews(queryClient: ReturnType<typeof useQueryClient>, salonId: string) {
  void queryClient.invalidateQueries({ queryKey: ['salon', salonId, 'reviews'] })
  void queryClient.invalidateQueries({ queryKey: ['salones'] })
  void queryClient.invalidateQueries({ queryKey: ['reviews', 'mine'] })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ReviewPayload) => {
      const { error } = await supabase.from('salon_reviews').insert({
        salon_id: payload.salonId,
        booking_id: payload.bookingId,
        user_id: payload.userId,
        rating: payload.rating,
        comment: payload.comment.trim() || null,
      })
      if (error) throw error
    },
    onSuccess: (_data, variables) => invalidateSalonReviews(queryClient, variables.salonId),
  })
}

export function useUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      rating,
      comment,
    }: {
      id: string
      salonId: string
      rating: number
      comment: string
    }) => {
      const { error } = await supabase
        .from('salon_reviews')
        .update({ rating, comment: comment.trim() || null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, variables) => invalidateSalonReviews(queryClient, variables.salonId),
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string; salonId: string }) => {
      const { error } = await supabase.from('salon_reviews').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, variables) => invalidateSalonReviews(queryClient, variables.salonId),
  })
}

export function useReplyReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reply }: { id: string; salonId: string; reply: string }) => {
      const { error } = await supabase
        .from('salon_reviews')
        .update({ host_reply: reply.trim() || null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, variables) => invalidateSalonReviews(queryClient, variables.salonId),
  })
}
