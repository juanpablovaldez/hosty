import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { Booking, BookingStatus } from '../types'

interface BookingRow {
  id: string
  salon_id: string
  user_id: string
  event_date: string
  start_time: string
  end_time: string
  attendees: number
  event_type: string
  notes: string | null
  total_price: number
  status: string
  created_at: string
  salones: {
    name: string
    images: string[]
  } | null
}

function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    salonId: row.salon_id,
    salonName: row.salones?.name ?? 'Salón',
    salonImage: row.salones?.images?.[0] ?? '',
    userId: row.user_id,
    eventDate: row.event_date,
    startTime: row.start_time,
    endTime: row.end_time,
    attendees: row.attendees,
    eventType: row.event_type,
    notes: row.notes,
    totalPrice: row.total_price,
    status: row.status as BookingStatus,
    createdAt: row.created_at,
  }
}

export function useMyBookings(userId: string | null) {
  return useQuery({
    queryKey: ['bookings', 'mine', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, salones(name, images)')
        .eq('user_id', userId!)
        .order('event_date', { ascending: false })
      if (error) throw error
      return ((data as unknown as BookingRow[]) ?? []).map(rowToBooking)
    },
    enabled: !!userId,
  })
}
