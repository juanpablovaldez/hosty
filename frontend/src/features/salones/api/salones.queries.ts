import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { Salon, SalonSearchParams } from '../types'
import type { Database } from '@/shared/lib/database.types'

type SalonRow = Database['public']['Tables']['salones']['Row']

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
    availabilityStatus: row.availability_status,
    eventTypes: row.event_types,
  }
}

export function useFeaturedSalones() {
  return useQuery({
    queryKey: ['salones', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salones')
        .select('*')
        .eq('availability_status', 'disponible')
        .eq('is_verified', true)
        .order('rating_value', { ascending: false })
        .limit(6)
      if (error) throw error
      return (data ?? []).map(rowToSalon)
    },
  })
}

export function useSearchSalones(params: SalonSearchParams) {
  return useQuery({
    queryKey: ['salones', 'search', params],
    queryFn: async () => {
      let query = supabase.from('salones').select('*')

      if (params.location) {
        query = query.ilike('location', `%${params.location}%`)
      }
      if (params.capacity) {
        query = query.gte('capacity', params.capacity)
      }
      if (params.minPrice != null) {
        query = query.gte('price_per_hour', params.minPrice)
      }
      if (params.maxPrice != null) {
        query = query.lte('price_per_hour', params.maxPrice)
      }
      if (params.availability) {
        query = query.eq('availability_status', params.availability)
      }
      if (params.eventTypes?.length) {
        query = query.overlaps('event_types', params.eventTypes)
      }
      if (params.amenities?.length) {
        query = query.overlaps('amenities', params.amenities)
      }

      const { data, error } = await query.order('rating_value', { ascending: false })
      if (error) throw error
      return (data ?? []).map(rowToSalon)
    },
  })
}

export function useSalon(id: string) {
  return useQuery({
    queryKey: ['salones', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salones')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return rowToSalon(data)
    },
    enabled: !!id,
  })
}
