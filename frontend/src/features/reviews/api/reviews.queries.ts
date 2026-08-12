import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { Review } from '../types'

export function useSalonReviews(salonId: string) {
  return useQuery({
    queryKey: ['salon', salonId, 'reviews'],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase.rpc('salon_reviews_list', { p_salon_id: salonId })
      if (error) throw error
      return (data ?? []).map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        rating: row.rating,
        comment: row.comment,
        hostReply: row.host_reply,
        hostRepliedAt: row.host_replied_at,
        userId: row.user_id,
        authorName: row.author_name,
      }))
    },
    enabled: !!salonId,
  })
}

export function useMyReviewedBookingIds(userId: string | null) {
  return useQuery({
    queryKey: ['reviews', 'mine', userId],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('salon_reviews')
        .select('booking_id')
        .eq('user_id', userId!)
      if (error) throw error
      return (data ?? []).map((row) => row.booking_id)
    },
    enabled: !!userId,
  })
}
