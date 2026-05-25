import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { BookingPayload } from '../types'

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: BookingPayload) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          salon_id: payload.salonId,
          user_id: payload.userId,
          event_date: payload.eventDate,
          start_time: payload.startTime,
          end_time: payload.endTime,
          attendees: payload.attendees,
          event_type: payload.eventType,
          notes: payload.notes || null,
          total_price: payload.totalPrice,
          status: 'pending',
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] })
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] })
    },
  })
}
