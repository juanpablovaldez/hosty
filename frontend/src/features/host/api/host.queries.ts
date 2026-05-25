import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { Salon } from '@/features/salones/types'
import type { Booking } from '../types'
import type { Database } from '@/shared/lib/database.types'

type SalonRow = Database['public']['Tables']['salones']['Row']
type BookingRow = Database['public']['Tables']['bookings']['Row']

function rowToSalon(row: SalonRow): Salon {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    images: row.images,
    pricePerHour: row.price_per_hour,
    rating:
      row.rating_value != null && row.rating_count != null
        ? { value: row.rating_value, count: row.rating_count }
        : null,
    capacity: row.capacity,
    location: row.location,
    address: row.address,
    isVerified: row.is_verified,
    rentTimeHours: row.rent_time_hours,
    isFavorite: false,
    amenities: row.amenities,
    availabilityStatus: row.availability_status as Salon['availabilityStatus'],
    eventTypes: row.event_types,
  }
}

function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    salonId: row.salon_id,
    userId: row.user_id,
    eventDate: row.event_date,
    startTime: row.start_time,
    endTime: row.end_time,
    attendees: row.attendees,
    eventType: row.event_type,
    notes: row.notes,
    totalPrice: row.total_price,
    status: row.status as Booking['status'],
    createdAt: row.created_at,
  }
}

export function useHostSalones(userId: string | null) {
  return useQuery({
    queryKey: ['host', 'salones', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salones')
        .select('*')
        .eq('host_id', userId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map(rowToSalon)
    },
    enabled: !!userId,
  })
}

export function useHostBookings(salonIds: string[]) {
  return useQuery({
    queryKey: ['host', 'bookings', salonIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .in('salon_id', salonIds)
        .order('event_date', { ascending: true })
      if (error) throw error
      return (data ?? []).map(rowToBooking)
    },
    enabled: salonIds.length > 0,
  })
}
